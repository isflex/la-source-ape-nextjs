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
    console.error('Error parsing DynamoDB array:', error);
    return [];
  }
}

async function importTemplates() {
  console.log('Importing CareerDiscoveryTemplate records...');

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
        console.log(`✓ Template ${record.id} already exists - skipping`);
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

      console.log(`✓ Imported template: ${record.title}`);
      successCount++;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`✗ Failed to import template ${record.id}:`, errorMsg);
      errors.push({ id: record.id, error: errorMsg });
      errorCount++;
    }
  }

  return { successCount, errorCount, errors };
}

async function importResponses() {
  console.log('Importing CareerDiscoveryResponse records...');

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
        console.log(`✓ Response ${record.id} already exists - skipping`);
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

      console.log(`✓ Imported response: ${record.firstName} ${record.lastName}`);
      successCount++;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`✗ Failed to import response ${record.id}:`, errorMsg);
      errors.push({ id: record.id, error: errorMsg });
      errorCount++;
    }
  }

  return { successCount, errorCount, errors };
}

async function main() {
  console.log('='.repeat(60));
  console.log('Career Discovery CSV Import');
  console.log('='.repeat(60));
  console.log('');

  // Import templates
  const templateResults = await importTemplates();
  console.log('');
  console.log('Template Import Summary:');
  console.log(`✓ Success: ${templateResults.successCount}`);
  console.log(`✗ Errors: ${templateResults.errorCount}`);

  if (templateResults.errors.length > 0) {
    console.log('Failed templates:');
    templateResults.errors.forEach(({ id, error }) => {
      console.log(`  - ${id}: ${error}`);
    });
  }

  console.log('');
  console.log('-'.repeat(60));
  console.log('');

  // Import responses
  const responseResults = await importResponses();
  console.log('');
  console.log('Response Import Summary:');
  console.log(`✓ Success: ${responseResults.successCount}`);
  console.log(`✗ Errors: ${responseResults.errorCount}`);

  if (responseResults.errors.length > 0) {
    console.log('Failed responses:');
    responseResults.errors.forEach(({ id, error }) => {
      console.log(`  - ${id}: ${error}`);
    });
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('Import Complete!');
  console.log('Next step: Run migrate-career-availability.ts to transform availability fields');
  console.log('='.repeat(60));
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
