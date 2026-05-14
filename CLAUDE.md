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

- `pnpm compile:tsc:project:references` - TypeScript project references compilation
- `pnpm compile:tsc:project:references:watch` - Watch mode for TypeScript compilation

## Architecture

### Monorepo Structure

- `/apps/gateway/` - Main NextJS application (port 3001). Uses forward slash in routes !
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
- ampx commands must be run from app/gateway (amplify root folder)
- Bash(pnpm compile) for monorepo wide compilation
- pnpm lint -> runs pnpm compile (monorepo tsc), pnpm next:tsc (gateway nextjs specific tsc) and pnpm next lint
- For configuring tasks in turbo.json, it is best to omit defining persistent flag when combining independant tasks that are all long running... Until turbo finds a better solution.
- the nextjs project uses trailing slash
- To update Browserslist data (caniuse-lite) : pnpm exec update-browserslist-db latest
- 'use server' directive has import from @flex-design-system/react-ts/server-async-styled-default-module-components and 'use client' directive has import from @flex-design-system/react-ts/client-sync-styled-default
- In nextjs do not rely on window object for routing, use internal useRouter() API

## Zod and GraphQL Version Compatibility

AWS Amplify CLI has specific version requirements that differ from local development:

| Phase | Zod | GraphQL | Reason |
|-------|-----|---------|--------|
| Amplify Backend Build | 3.x | 15.x | Amplify CLI compatibility |
| Frontend Build / Local Dev | 4.x | 16.x | CopilotKit + modern features |

### Version Switching Scripts

- `bin/switch-zod-version.mjs [3|4]` - Switch Zod version
- `bin/switch-graphql-version.mjs [15|16]` - Switch GraphQL version
- `bin/ampx-sandbox.sh` - Auto-switches versions for sandbox deployment

### Usage

**Local sandbox deployment:**
```bash
pnpm ampx:sandbox --once --profile isflex-amplify --identifier ape-la-source
```
This script automatically:
1. Switches to Zod 3.x and GraphQL 15.x
2. Runs amplify sandbox
3. Restores Zod 4.x and GraphQL 16.x

**CI/CD (amplify.yml):**
- Backend phase: Uses Zod 3.x + GraphQL 15.x
- Frontend phase: Restores Zod 4.x + GraphQL 16.x

## VS Code Integration

This project is optimized for VS Code with a comprehensive workspace configuration.

### Workspace File

Open the project using `flexi-gateway.code-workspace` for the full configured experience:

- Pre-configured settings, tasks, and launch configurations
- Recommended extensions
- Portable paths using VS Code variables

### VS Code Tasks (Ctrl+Shift+P → "Tasks: Run Task")

| Task            | Description                 |
| --------------- | --------------------------- |
| Compile         | TypeScript compilation      |
| Compile (Watch) | Watch mode compilation      |
| Dev Server      | Start development server    |
| Lint            | Run ESLint                  |
| Build           | Production build            |
| Claude AI       | Launch Claude Code CLI      |
| Compile + Dev   | Sequential compile then dev |
| Amplify Sandbox | Deploy to Amplify sandbox   |

### Debug Configurations (F5)

- **Next.js: debug server-side** - Debug Node.js server
- **Next.js: debug client-side** - Debug in Chrome
- **Next.js: debug full stack** - Both combined
- **Debug Current TS File** - Debug active TypeScript file

### Claude Code Integration

Custom slash commands available in `.claude/commands/`:

- `/compile` - Compile with error analysis
- `/lint-fix` - Lint and auto-fix issues
- `/dev` - Start development environment
- `/build` - Production build with verification
- `/amplify` - Deploy to Amplify sandbox
- `/status` - Project health check

### Configuration Files

| File                           | Purpose                                        |
| ------------------------------ | ---------------------------------------------- |
| `flexi-gateway.code-workspace` | Main workspace config (single source of truth) |
| `.vscode/settings.json`        | Minimal overrides only                         |
| `.vscode/extensions.json`      | Recommended extensions                         |
| `.vscode/launch.json`          | Debug configurations (fallback)                |
| `.claude/settings.json`        | Claude Code settings + MCP servers             |
| `.claude/settings.local.json`  | Machine-specific permissions                   |
| `.claude/commands/*.md`        | Custom slash commands                          |

## CopilotKit Integration

See [packages/flex/copilotkit/COPILOTKIT.md](packages/flex/copilotkit/COPILOTKIT.md) for full documentation.

**Key points:**
- Package: `@flexiness/copilotkit` at `packages/flex/copilotkit/`
- v2 AG-UI protocol, connecting to a Python Strands Agent
- Use `useSafe*` wrappers (`useSafeAgentContext`, `useSafeFrontendTool`) so the app works when CopilotKit is disabled
- Context bridges (`AuthContextBridge`, `StoreContextBridge`) for user and store state
- Enable with `NEXT_PUBLIC_COPILOTKIT_ENABLED=true`

## CopilotKit MCP Server (Dev-Time Integration)

See [packages/flex/copilotkit-mcp-server/COPILOTKIT-MCP-SERVER.md](packages/flex/copilotkit-mcp-server/COPILOTKIT-MCP-SERVER.md) for full documentation.

**Key points:**
- Package: `@flexiness/copilotkit-mcp-server` at `packages/flex/copilotkit-mcp-server/`
- 5 MCP tools: `analyze_component`, `inject_readable`, `validate_integration`, `get_integration_report`, `suggest_actions`
- Always recommends `useSafe*` wrappers from `@flexiness/copilotkit`

## Strands Agent Deployment

Key Configuration:
- Port: 8080 (consistent for local and AgentCore)
- AG-UI Protocol: Fully compatible with CopilotKit
- AgentCore: Set FLEX_AGENT_PATH=/invocations when deploying

### Running Locally

```bash
cd agent
uv sync                  # Install dependencies
./run.sh                 # Uses dotenvx to load env/public/.env.development
```

### AgentCore Deployment

#### Using starter toolkit (no Docker needed)

```bash
pip install bedrock-agentcore-starter-toolkit
agentcore configure --entrypoint main.py
agentcore launch --env FLEX_AGENT_PORT=8080 --env FLEX_AGENT_PATH=/invocations
```

#### Using Docker + deploy_agent.py

```bash
docker buildx build --platform linux/arm64 -t ape-agent:latest .
python deploy_agent.py
```
