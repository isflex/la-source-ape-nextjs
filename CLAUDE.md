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
pnpm ampx:sandbox
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

This project includes `@flexiness/copilotkit` package for AI-powered user interactions.

### Package Location

`/packages/flex/copilotkit/`

### Key Features

- **React Hooks**: `useReadableState`, `useReadableStore`, `useReadableUser`, `useReadableApi`
- **Provider**: `FlexCopilotProvider` - Pre-configured CopilotKit wrapper
- **Runtime**: AWS Bedrock adapter with LLM adapter factory pattern
- **Actions**: Action creation utilities with type safety

### Usage in Components

```typescript
// Import hooks
import { useReadableState, useReadableUser } from '@flexiness/copilotkit';

function Dashboard({ user }) {
  const [events, setEvents] = useState([]);

  // Expose state to AI assistant
  useReadableUser(user);
  useReadableState('dashboardEvents', events, {
    description: 'List of upcoming events',
    categories: ['events', 'dashboard']
  });

  return <DashboardView events={events} />;
}
```

### CopilotKit Slash Commands

| Command                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `/copilotkit-integrate` | Analyze component and suggest CopilotKit hooks |
| `/copilotkit-report`    | Generate integration coverage report           |
| `/copilotkit-action`    | Create a new CopilotKit action                 |

### API Route Setup

Create `apps/gateway/src/app/api/copilotkit/route.ts`:

```typescript
import { createCopilotRouteHandlers, NEXTJS_RUNTIME } from "@flexiness/copilotkit/runtime";

export const { GET, POST } = createCopilotRouteHandlers({
  instructions: "You are a helpful assistant.",
});

export const runtime = NEXTJS_RUNTIME;
```

### Environment Variables

```bash
# LLM Provider (bedrock | copilotkit-cloud | openai)
FLEX_AI_LLM_PROVIDER=bedrock
FLEX_AI_LLM_MODEL=anthropic.claude-3-haiku-20240307-v1:0

# MCP Bridge (for tool execution)
FLEX_MCP_BRIDGE_HOST=http://localhost
FLEX_MCP_BRIDGE_PORT=3000

# Feature flags
FLEX_AI_COPILOTKIT_ENABLED=true
```

### Architecture

```
User (Browser)
    │
    └──► CopilotKit Chat UI
              │
              ▼
    FlexCopilotProvider
              │
              ▼
    /api/copilotkit (Next.js API Route)
              │
              ├──► AWS Bedrock (LLM)
              └──► MCP Bridge (Tools)
```

## CopilotKit MCP Server (Dev-Time Integration)

The project includes `@flexiness/copilotkit-mcp-server` - an MCP server for automated CopilotKit integration.

### Package Location

`/packages/flex/copilotkit-mcp-server/`

### Purpose

This MCP server allows Claude Code to automatically analyze React components and suggest CopilotKit integration patterns during development.

### MCP Tools Available

| Tool                     | Description                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| `analyze_component`      | Analyze a React component for CopilotKit integration opportunities |
| `inject_readable`        | Add useCopilotReadable hooks to a component (dry-run by default)   |
| `validate_integration`   | Check if a component properly integrates CopilotKit                |
| `get_integration_report` | Generate a coverage report for a directory                         |
| `suggest_actions`        | Suggest CopilotKit actions for a component                         |

### Configuration

The MCP server is configured in `.claude/settings.json`:

```json
{
  "mcpServers": {
    "copilotkit-integration": {
      "command": "node",
      "args": ["./packages/flex/copilotkit-mcp-server/dist/cli.js"]
    }
  }
}
```

### Usage Examples

**Analyze a component:**

```
Use the copilotkit-integration MCP server to analyze
apps/gateway/src/components/Dashboard.tsx
```

**Generate integration report:**

```
Use the copilotkit-integration MCP server to generate
an integration report for apps/gateway/src/components/
```

### Component Analyzer Features

The analyzer detects:

- `useState` hooks with AI-relevant state (data, lists, user info)
- Props that represent user context
- API calls (fetch, axios, etc.)
- Existing CopilotKit hooks

It generates recommendations for:

- `useReadableState` - for component state
- `useReadableUser` - for user context props
- `useReadableApi` - for API response data
- `useCopilotAction` - for actionable functions
