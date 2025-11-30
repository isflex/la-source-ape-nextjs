import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { getCurrentConfig } from '../utils/amplify/configureAmplifyWithPortDetection';

// Configure Amplify for server-side script
Amplify.configure(getCurrentConfig(), { ssr: true });

const client = generateClient<Schema>();

// Mapping from old enum values to actual option text
const ENUM_TO_TEXT_MAP: Record<string, string> = {
  'DECEMBER_8_2025': 'Pour la présentation des métiers du 8 décembre 2025 de 8h45 à 9h30',
  'FEBRUARY_9_2026_WOMEN_PRIORITY': 'Pour la présentation des métiers du 9 février 2026 avec priorité aux femmes faisant un métier "dit d\'homme"',
  'LATER_PRESENTATION': 'Pour une présentation des métiers ultérieure'
};

async function migrateCareerAvailability() {
  console.log('Starting Career Discovery availability migration...');
  console.log('');

  try {
    // Fetch all responses
    console.log('Fetching all CareerDiscoveryResponse records...');
    const { data: responses, errors } = await client.models.CareerDiscoveryResponse.list({});

    if (errors) {
      console.error('Error fetching responses:', errors);
      return;
    }

    if (!responses || responses.length === 0) {
      console.log('No responses found to migrate');
      return;
    }

    console.log(`Found ${responses.length} responses`);
    console.log('');

    let successCount = 0;
    let alreadyMigratedCount = 0;
    let errorCount = 0;
    const failedRecords: Array<{ id: string; error: string }> = [];

    for (const response of responses) {
      try {
        // Check if availability is an array and contains text (not enum)
        if (Array.isArray(response.availability)) {
          const firstValue = response.availability[0];

          // If array contains text (not enum keys), it's already migrated
          if (firstValue && !ENUM_TO_TEXT_MAP[firstValue]) {
            console.log(`✓ Skipping ${response.id} - already migrated`);
            alreadyMigratedCount++;
            continue;
          }

          // Array contains enum values - need to migrate
          const migratedValues = response.availability
            .map(enumValue => {
              if (!enumValue) {
                console.warn(`⚠ Null or undefined enum value in array`);
                return null;
              }
              const textValue = ENUM_TO_TEXT_MAP[enumValue];
              if (!textValue) {
                console.warn(`⚠ Unknown enum value in array: "${enumValue}"`);
                return null;
              }
              return textValue;
            })
            .filter((v): v is string => v !== null);

          if (migratedValues.length === 0) {
            const errorMsg = `No valid enum values found in array: ${JSON.stringify(response.availability)}`;
            console.error(`✗ ${response.id}: ${errorMsg}`);
            failedRecords.push({ id: response.id, error: errorMsg });
            errorCount++;
            continue;
          }

          // Update with migrated text values
          const updateResult = await client.models.CareerDiscoveryResponse.update({
            id: response.id,
            availability: migratedValues
          });

          if (updateResult.errors) {
            const errorMsg = JSON.stringify(updateResult.errors);
            console.error(`✗ Failed to migrate ${response.id}:`, errorMsg);
            failedRecords.push({ id: response.id, error: errorMsg });
            errorCount++;
            continue;
          }

          console.log(`✓ Migrated ${response.id}`);
          console.log(`  ${JSON.stringify(response.availability)} → ${JSON.stringify(migratedValues)}`);
          successCount++;
          continue;
        }

        // Old format: single enum value (not array)
        const oldValue = response.availability as unknown as string;
        const newValue = ENUM_TO_TEXT_MAP[oldValue];

        if (!newValue) {
          const errorMsg = `Unknown enum value: "${oldValue}"`;
          console.error(`✗ ${response.id}: ${errorMsg}`);
          failedRecords.push({ id: response.id, error: errorMsg });
          errorCount++;
          continue;
        }

        // Update to array format with text value
        const updateResult = await client.models.CareerDiscoveryResponse.update({
          id: response.id,
          availability: [newValue]  // Single value as array
        });

        if (updateResult.errors) {
          const errorMsg = JSON.stringify(updateResult.errors);
          console.error(`✗ Failed to migrate ${response.id}:`, errorMsg);
          failedRecords.push({ id: response.id, error: errorMsg });
          errorCount++;
          continue;
        }

        console.log(`✓ Migrated ${response.id}`);
        console.log(`  "${oldValue}" → ["${newValue}"]`);
        successCount++;

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`✗ Failed to migrate ${response.id}:`, errorMsg);
        failedRecords.push({ id: response.id, error: errorMsg });
        errorCount++;
      }
    }

    // Summary
    console.log('');
    console.log('='.repeat(60));
    console.log('Migration Summary');
    console.log('='.repeat(60));
    console.log(`Total records processed: ${responses.length}`);
    console.log(`✓ Successfully migrated: ${successCount}`);
    console.log(`✓ Already migrated: ${alreadyMigratedCount}`);
    console.log(`✗ Errors: ${errorCount}`);
    console.log('');

    if (failedRecords.length > 0) {
      console.log('Failed Records:');
      failedRecords.forEach(({ id, error }) => {
        console.log(`  - ${id}: ${error}`);
      });
      console.log('');
    }

    if (errorCount === 0) {
      console.log('✅ Migration completed successfully!');
    } else {
      console.log('⚠️  Migration completed with errors. Please review the failed records above.');
    }

  } catch (error) {
    console.error('Fatal error during migration:', error);
    throw error;
  }
}

// Run migration
migrateCareerAvailability().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
