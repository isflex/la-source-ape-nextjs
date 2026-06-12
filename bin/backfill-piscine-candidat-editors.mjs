#!/usr/bin/env node
/**
 * Backfill PiscineCandidat.editors for enrollments created before the
 * owner/creator write-auth change.
 *
 * For each PiscineCandidat record, sets:
 *     editors = unique([ <participant owner>, <PiscineForm.owner of its piscineFormId> ])
 * which is what the deployed `allow.ownersDefinedIn('editors')` rule uses to decide
 * who may update/delete an enrollment (the participant + the planning creator).
 *
 * WHY DIRECT DYNAMODB (not the AppSync data client):
 *   The tightened model rule only lets an existing editor write a record. Records
 *   created before this change have no `editors`, so NO ONE can update them through
 *   AppSync — a chicken-and-egg. Writing straight to the DynamoDB table bypasses the
 *   app-layer auth rule and breaks the deadlock. Requires AWS creds with DynamoDB
 *   write access to the table (the same profile used for `ampx sandbox`).
 *
 * Uses the AWS CLI (already installed/configured) — no extra npm dependencies.
 *
 * Usage:
 *   node bin/backfill-piscine-candidat-editors.mjs [--profile <aws-profile>] [--apply] [--force]
 *
 * Defaults:
 *   --profile  isflex-amplify   (or $AWS_PROFILE)
 *   (dry-run)  prints planned changes; pass --apply to actually write
 *   --force    re-write editors even on records that already have a non-empty list
 *
 * The target API/table is read from apps/gateway/amplify_outputs.json (override with
 * $AMPLIFY_OUTPUTS). Always dry-run first and confirm the resolved table name.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUTS_PATH =
  process.env.AMPLIFY_OUTPUTS || resolve(__dirname, '../apps/gateway/amplify_outputs.json');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const FORCE = args.includes('--force');
const profileIdx = args.indexOf('--profile');
const PROFILE =
  profileIdx >= 0 && args[profileIdx + 1]
    ? args[profileIdx + 1]
    : process.env.AWS_PROFILE || 'isflex-amplify';

const outputs = JSON.parse(readFileSync(OUTPUTS_PATH, 'utf8'));
const URL = outputs?.data?.url;
const REGION = outputs?.data?.aws_region;
if (!URL || !REGION) {
  console.error(`Could not read data.url / data.aws_region from ${OUTPUTS_PATH}`);
  process.exit(1);
}

/** Run an AWS CLI command and parse its JSON output. */
function aws(service, command, extra = []) {
  const out = execFileSync(
    'aws',
    [service, command, '--profile', PROFILE, '--region', REGION, '--output', 'json', ...extra],
    { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 },
  );
  return out.trim() ? JSON.parse(out) : {};
}

// 1) Resolve the AppSync API id by matching the deployed GraphQL endpoint.
const apis = aws('appsync', 'list-graphql-apis').graphqlApis || [];
const api = apis.find((a) => a?.uris?.GRAPHQL === URL);
if (!api) {
  console.error(`Could not find an AppSync API whose endpoint matches ${URL}`);
  process.exit(1);
}
const apiId = api.apiId;

// 2) Discover the DynamoDB tables for this exact API (suffix == apiId).
const tableNames = aws('dynamodb', 'list-tables').TableNames || [];
function findTable(model) {
  const matches = tableNames.filter((t) => t.startsWith(`${model}-${apiId}-`));
  if (matches.length !== 1) {
    console.error(`Expected exactly one ${model} table for api ${apiId}, found:`, matches);
    process.exit(1);
  }
  return matches[0];
}
const CAND_TABLE = findTable('PiscineCandidat');
const FORM_TABLE = findTable('PiscineForm');

/** Scan an entire table (full items), following pagination. */
function scanAll(table) {
  let items = [];
  let startKey = null;
  do {
    const extra = ['--table-name', table];
    if (startKey) extra.push('--exclusive-start-key', JSON.stringify(startKey));
    const res = aws('dynamodb', 'scan', extra);
    items = items.concat(res.Items || []);
    startKey = res.LastEvaluatedKey || null;
  } while (startKey);
  return items;
}

console.log(`API:    ${apiId} (${api.name})`);
console.log(`Region: ${REGION}  Profile: ${PROFILE}`);
console.log(`Tables: candidat=${CAND_TABLE}  form=${FORM_TABLE}`);
console.log(APPLY ? '\nMODE: APPLY (writing changes)\n' : '\nMODE: DRY-RUN (no writes — pass --apply to write)\n');

// Build piscineFormId -> owner (planning creator) map.
const forms = scanAll(FORM_TABLE);
const formOwner = {};
for (const f of forms) formOwner[f?.id?.S] = f?.owner?.S;

// Walk candidats and backfill.
const cands = scanAll(CAND_TABLE);
let updated = 0;
let skippedHasEditors = 0;
let skippedNoEditor = 0;
let planned = 0;

for (const c of cands) {
  const id = c?.id?.S;
  const existing = (c?.editors?.L || []).map((x) => x.S).filter(Boolean);
  if (existing.length > 0 && !FORCE) {
    skippedHasEditors++;
    continue;
  }

  const participant = c?.owner?.S;
  const creator = formOwner[c?.piscineFormId?.S];
  const editors = [...new Set([participant, creator].filter(Boolean))];

  if (editors.length === 0) {
    console.warn(`SKIP   ${id}: no participant owner and no form owner — cannot assign editors`);
    skippedNoEditor++;
    continue;
  }

  planned++;
  console.log(
    `${APPLY ? 'UPDATE' : 'WOULD ' } ${id}: editors=${JSON.stringify(editors)} ` +
      `(participant=${participant || '-'}, creator=${creator || '-'})`,
  );

  if (APPLY) {
    aws('dynamodb', 'update-item', [
      '--table-name',
      CAND_TABLE,
      '--key',
      JSON.stringify({ id: { S: id } }),
      '--update-expression',
      'SET #ed = :e',
      '--expression-attribute-names',
      JSON.stringify({ '#ed': 'editors' }),
      '--expression-attribute-values',
      JSON.stringify({ ':e': { L: editors.map((s) => ({ S: s })) } }),
    ]);
    updated++;
  }
}

console.log('\n--- Summary ---');
console.log(`Candidats scanned:                 ${cands.length}`);
console.log(`Already had editors (skipped${FORCE ? ', overridden' : ''}): ${skippedHasEditors}`);
console.log(`No assignable editor (skipped):    ${skippedNoEditor}`);
console.log(APPLY ? `Updated:                           ${updated}` : `Would update:                      ${planned}  (re-run with --apply to write)`);
