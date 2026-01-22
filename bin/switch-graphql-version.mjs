#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(__dirname, '..', 'package.json');

const version = process.argv[2];
if (!['15', '16'].includes(version)) {
  console.error('Usage: node switch-graphql-version.mjs [15|16]');
  process.exit(1);
}

const graphqlVersion = version === '15' ? '^15.10.1' : '^16.12.0';

const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
pkg.pnpm.overrides.graphql = graphqlVersion;

writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`Switched graphql to ${graphqlVersion}`);
