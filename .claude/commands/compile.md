# Compile Project

Run the TypeScript compilation for the monorepo.

## Instructions

1. Set the required environment variables:
   - `FLEX_PROJ_ROOT` to the project root
   - `FLEX_MODE` to development

2. Run `pnpm compile` and wait for completion

3. Report any TypeScript errors found, grouped by package

4. If errors exist, suggest fixes for the most critical ones first

## Context

This is a pnpm/Turborepo monorepo. The compile task runs TypeScript compilation across all packages using project references.
