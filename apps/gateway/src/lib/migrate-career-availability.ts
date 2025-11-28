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
        // Skip if already migrated (availability is already an array)
        if (Array.isArray(response.availability)) {
          console.log(`✓ Skipping ${response.id} - already migrated`);
          alreadyMigratedCount++;
          continue;
        }

        // Map enum value to text
        const oldValue = response.availability as unknown as string;
        const newValue = ENUM_TO_TEXT_MAP[oldValue];

        if (!newValue) {
          const errorMsg = `Unknown enum value: "${oldValue}"`;
          console.error(`✗ ${response.id}: ${errorMsg}`);
          failedRecords.push({ id: response.id, error: errorMsg });
          errorCount++;
          continue;
        }

        // Update to array format
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
