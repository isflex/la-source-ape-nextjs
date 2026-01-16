# Project Status

Get a comprehensive status of the project state.

## Instructions

Check and report on the following:

1. **Git Status**
   - Current branch
   - Uncommitted changes
   - Recent commits

2. **Dependencies**
   - Run `pnpm install` if needed
   - Check for outdated packages

3. **Compilation**
   - Check if dist folders exist and are recent
   - Report any stale builds

4. **Environment**
   - Verify FLEX_PROJ_ROOT is set
   - Verify FLEX_MODE is set
   - Check Node.js version

5. **Health Checks**
   - Can TypeScript resolve all imports?
   - Are all workspace packages linked?

## Output Format

Provide a concise status summary with any action items highlighted.
