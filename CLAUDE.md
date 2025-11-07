# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for "La Source | APE", a NextJS application with AWS Amplify Gen 2 integration. It uses Turborepo for monorepo management and includes a custom design system called "Flexiness Design First".

## Environment Setup

Before working with this codebase, you must set these environment variables:
```bash
export FLEX_PROJ_ROOT=$(pwd)
export FLEX_MODE=development
```

## Package Manager

This project uses **pnpm** as the package manager. All commands should use pnpm, not npm or yarn.

## Common Commands

### Development
- `pnpm dev` - Start development server (runs gateway app on port 3001)
- `pnpm compile && pnpm dev` - Full development setup (compile packages then start dev)
- `pnpm compile:watch` - Watch mode for package compilation

### Building
- `pnpm build` - Build the entire monorepo for production
- `pnpm compile` - Compile all packages (required before building)

### Testing & Quality
- `pnpm lint` - Run ESLint across all packages
- `pnpm test` - Currently returns placeholder message

### Compilation
- `pnpm compile:clean:sh` - Clean compile all packages
- `pnpm compile:tsc:project:references` - TypeScript project references compilation
- `pnpm compile:tsc:project:references:watch` - Watch mode for TypeScript compilation

## Architecture

### Monorepo Structure
- `/apps/gateway/` - Main NextJS application (port 3001)
- `/apps/express-app/` - Express.js application
- `/packages/flex/` - Internal packages:
  - `design-system-framework/` - Core CSS/SCSS design system
  - `design-system-react-ts/` - React TypeScript components
  - `domain-store/` - MobX state management
  - `domain-utils/` - Shared utilities
  - `config/` - Configuration packages (ESLint, TypeScript, Webpack)
  - `types/` - TypeScript type definitions

### Tech Stack
- **NextJS 15** with App Router
- **React 19** with Server Components
- **TypeScript** with project references
- **Turborepo** for monorepo orchestration
- **AWS Amplify Gen 2** for backend services
- **MobX** for state management
- **Custom Design System** (Flexiness)
- **pnpm workspaces** for dependency management

### Build System
- Uses **Turbo** for task orchestration
- **dotenvx** for environment variable management
- Custom shell scripts in `/bin/` directory for complex operations
- **TypeScript project references** for efficient compilation
- **Webpack/Rspack** for bundling

### Key Dependencies
- Framer Motion for animations
- PostHog for analytics
- AWS SDK for cloud services
- React Router for routing
- Zod for validation

## Development Workflow

1. **First-time setup**: `pnpm install` → Set environment variables → `pnpm build`
2. **Daily development**: `pnpm compile && pnpm dev`
3. **Before committing**: `pnpm lint` (no tests currently configured)
4. **Package changes**: Run `pnpm compile` after modifying any package

## Package Dependencies

Packages have interdependencies managed through workspace references. Always compile packages (`pnpm compile`) before building or running the main application.

## AWS Amplify Integration

The gateway app includes AWS Amplify Gen 2 setup for backend services. Developers need AWS CLI configured and appropriate AWS credentials.
- To deploy in dev mode, we are going to use amplify sandbox : 
cd apps/gateway && pnpm ampx sandbox --once