Important: The workflow requires TWO scripts:

  1. NEW Script (import-career-discovery-from-csv.ts) - Imports CSV data into database
  2. EXISTING Script (migrate-career-availability.ts) - Transforms availability fields

  Step-by-Step Execution

  Step 1: Test on Development First

  cd apps/gateway

  # Run import script
  tsx src/lib/import-career-discovery-from-csv.ts

  Step 2: Verify Import Results

  Check the console output for:
  - ✓ Template import: Should show 1 success
  - ✓ Response imports: Should show 31 successes
  - ✗ Any errors will be listed with IDs

  Step 3: Run Migration Script

  # Transform availability from enum to text array
  tsx src/lib/migrate-career-availability.ts

  Step 4: For Production

  # Set production mode
  export FLEX_MODE=production

  # Run import
  tsx src/lib/import-career-discovery-from-csv.ts

  # Run migration
  tsx src/lib/migrate-career-availability.ts

  🔍 How migrate-career-availability.ts Helps

  Now that you understand the full picture:

  migrate-career-availability.ts is the second step in the process:

  1. What it does: Transforms the availability field in existing CareerDiscoveryResponse records from single enum values (like "DECEMBER_8_2025") to arrays of human-readable text
  (like ["Pour la présentation des métiers du 8 décembre 2025 de 8h45 à 9h30"])
  2. When to run it: AFTER running the import script
  3. Why it's needed: The CSV data has OLD format enum values, but the new schema requires text arrays
  4. Safe to run multiple times: It's idempotent - skips already-migrated records

  Expected Results

  After running both scripts, you'll have:
  - 1 CareerDiscoveryTemplate record with 3 availability options
  - 31 CareerDiscoveryResponse records with migrated availability fields
  - All data matching the original CSV files
  - Production database populated with legacy data

  The import script is now ready for testing! Would you like me to help you test it or make any adjustments?
