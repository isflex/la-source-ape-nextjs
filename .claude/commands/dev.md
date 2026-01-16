# Start Development Server

Start the development environment for the gateway application.

## Instructions

1. Ensure environment variables are set:
   - `FLEX_PROJ_ROOT` - Project root path
   - `FLEX_MODE=development`

2. Run `pnpm compile` first if packages haven't been compiled

3. Start the development server with `pnpm dev`

4. The gateway app runs on port 3001

5. Monitor the output for any startup errors

## Tips

- If you see module resolution errors, run `pnpm compile` first
- Hot reload is enabled for the Next.js app
- Check terminal output for Turbo task orchestration details
