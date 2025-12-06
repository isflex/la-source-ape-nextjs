import { debug } from '@flexiness/domain-utils';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { getCurrentConfig } from '../utils/amplify/configureAmplifyWithPortDetection';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Configure Amplify
Amplify.configure(getCurrentConfig(), { ssr: true });
const client = generateClient<Schema>();

// CSV file paths - located in parent flexi directory
const TEMPLATE_CSV = path.join(process.cwd(), '../../tmp/legacy_data/CareerDiscoveryTemplate-nu5mahmh6fb5vperr4pi7emfjq-NONE.csv');
const RESPONSE_CSV = path.join(process.cwd(), '../../tmp/legacy_data/CareerDiscoveryResponse-nu5mahmh6fb5vperr4pi7emfjq-NONE.csv');

// Helper: Parse DynamoDB JSON array format
function parseDynamoDBArray(dynamoStr: string): string[] {
  try {
    const parsed = JSON.parse(dynamoStr);
    return parsed.map((item: { S: string }) => item.S);
  } catch (error) {
    debug.error('Error parsing DynamoDB array:', error);
    return [];
  }
}

async function importTemplates() {
  debug.careerDiscovery('Importing CareerDiscoveryTemplate records...');

  const csvContent = fs.readFileSync(TEMPLATE_CSV, 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true }) as Array<Record<string, string>>;

  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ id: string; error: string }> = [];

  for (const record of records) {
    try {
      // Check if already exists
      const { data: existing } = await client.models.CareerDiscoveryTemplate.get({ id: record.id });
      if (existing) {
        debug.careerDiscovery(`✓ Template ${record.id} already exists - skipping`);
        continue;
      }

      // Parse availabilityOptions from DynamoDB JSON format
      const availabilityOptions = parseDynamoDBArray(record.availabilityOptions);

      // Create template
      const { data, errors: createErrors } = await client.models.CareerDiscoveryTemplate.create({
        id: record.id,
        year: record.year,
        title: record.title,
        subtitle: record.subtitle,
        availabilityOptions,
        isActive: record.isActive === 'true'
      });

      if (createErrors || !data) {
        throw new Error(JSON.stringify(createErrors));
      }

      debug.careerDiscovery(`✓ Imported template: ${record.title}`);
      successCount++;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      debug.error(`✗ Failed to import template ${record.id}:`, errorMsg);
      errors.push({ id: record.id, error: errorMsg });
      errorCount++;
    }
  }

  return { successCount, errorCount, errors };
}

async function importResponses() {
  debug.careerDiscovery('Importing CareerDiscoveryResponse records...');

  const csvContent = fs.readFileSync(RESPONSE_CSV, 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true }) as Array<Record<string, string>>;

  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ id: string; error: string }> = [];

  for (const record of records) {
    try {
      // Check if already exists
      const { data: existing } = await client.models.CareerDiscoveryResponse.get({ id: record.id });
      if (existing) {
        debug.careerDiscovery(`✓ Response ${record.id} already exists - skipping`);
        continue;
      }

      // Import with OLD format (enum) - will be migrated later
      const { data, errors: createErrors } = await client.models.CareerDiscoveryResponse.create({
        id: record.id,
        email: record.email,
        firstName: record.firstName,
        lastName: record.lastName,
        childrenClasses: record.childrenClasses,
        phone: record.phone,
        availability: [record.availability], // Temporarily as single-item array
        organization: record.organization === 'null' ? null : record.organization,
        jobDescription: record.jobDescription,
        companySector: record.companySector,
        session: record.session,
        surveyType: record.surveyType as Schema['ESurveyType']['type'],
        templateYear: record.templateYear
      });

      if (createErrors || !data) {
        throw new Error(JSON.stringify(createErrors));
      }

      debug.careerDiscovery(`✓ Imported response: ${record.firstName} ${record.lastName}`);
      successCount++;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      debug.error(`✗ Failed to import response ${record.id}:`, errorMsg);
      errors.push({ id: record.id, error: errorMsg });
      errorCount++;
    }
  }

  return { successCount, errorCount, errors };
}

async function main() {
  debug.careerDiscovery('='.repeat(60));
  debug.careerDiscovery('Career Discovery CSV Import');
  debug.careerDiscovery('='.repeat(60));
  debug.careerDiscovery('');

  // Import templates
  const templateResults = await importTemplates();
  debug.careerDiscovery('');
  debug.careerDiscovery('Template Import Summary:');
  debug.careerDiscovery(`✓ Success: ${templateResults.successCount}`);
  debug.careerDiscovery(`✗ Errors: ${templateResults.errorCount}`);

  if (templateResults.errors.length > 0) {
    debug.careerDiscovery('Failed templates:');
    templateResults.errors.forEach(({ id, error }) => {
      debug.careerDiscovery(`  - ${id}: ${error}`);
    });
  }

  debug.careerDiscovery('');
  debug.careerDiscovery('-'.repeat(60));
  debug.careerDiscovery('');

  // Import responses
  const responseResults = await importResponses();
  debug.careerDiscovery('');
  debug.careerDiscovery('Response Import Summary:');
  debug.careerDiscovery(`✓ Success: ${responseResults.successCount}`);
  debug.careerDiscovery(`✗ Errors: ${responseResults.errorCount}`);

  if (responseResults.errors.length > 0) {
    debug.careerDiscovery('Failed responses:');
    responseResults.errors.forEach(({ id, error }) => {
      debug.careerDiscovery(`  - ${id}: ${error}`);
    });
  }

  debug.careerDiscovery('');
  debug.careerDiscovery('='.repeat(60));
  debug.careerDiscovery('Import Complete!');
  debug.careerDiscovery('Next step: Run migrate-career-availability.ts to transform availability fields');
  debug.careerDiscovery('='.repeat(60));
}

main().catch(error => {
  debug.error('Fatal error:', error);
  process.exit(1);
});
