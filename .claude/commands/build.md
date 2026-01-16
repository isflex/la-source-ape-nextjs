# Production Build

Build the application for production deployment.

## Instructions

1. Ensure environment is configured:
   - `FLEX_PROJ_ROOT` set to project root
   - `FLEX_MODE=development` (for local builds) or `production`

2. Run the build command:
   ```bash
   pnpm build
   ```

3. Wait for the build to complete (this may take several minutes)

4. Check for any build errors or warnings

5. Verify the output in:
   - `apps/gateway/.next/` - Next.js build output
   - `packages/*/dist/` - Package build outputs

## Notes

- The build runs `pnpm compile` first via Turbo dependencies
- AWS Amplify integration requires proper AWS credentials
- Build artifacts are cached by Turbo for faster subsequent builds
