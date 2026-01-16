# Lint and Fix

Run ESLint across the monorepo and fix issues automatically.

## Instructions

1. Run `pnpm lint` to identify all linting issues

2. Wait for the lint process to complete fully (do not timeout)

3. Analyze the output and categorize issues by:
   - Auto-fixable issues
   - Manual fixes required
   - Warnings vs Errors

4. For auto-fixable issues, apply fixes using the ESLint --fix flag or edit files directly

5. For manual fixes, provide clear guidance on how to resolve each issue

## Notes

- This project uses ESLint flat config (eslint.config.mjs)
- TypeScript files use @typescript-eslint rules
- Always preserve the existing code style
