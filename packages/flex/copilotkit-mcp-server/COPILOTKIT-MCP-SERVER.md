# CopilotKit MCP Server (Dev-Time Integration)

Package: `@flexiness/copilotkit-mcp-server` at `packages/flex/copilotkit-mcp-server/`

## Overview

MCP server for automated CopilotKit v2 integration. Provides tools for Claude Code to analyze React components and recommend v2 patterns.

## MCP Tools Available

| Tool                     | Description                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| `analyze_component`      | Analyze a React component for v2 integration opportunities and detect deprecated v1 hooks         |
| `inject_readable`        | Inject v2 patterns (useSafeAgentContext, context bridges) into a component (dry-run by default)    |
| `validate_integration`   | Validate v2 compliance, detect deprecated v1 hooks, generate migration instructions               |
| `get_integration_report` | Generate v2 integration coverage report for a directory                                           |
| `suggest_actions`        | Suggest useSafeFrontendTool patterns based on component functionality                             |

## Build Commands

```bash
# TypeScript check
pnpm --filter @flexiness/copilotkit-mcp-server tsc --noEmit

# Build with tsup
pnpm --filter @flexiness/copilotkit-mcp-server compile:tsup
```

## Convention

The MCP server always recommends `useSafe*` wrappers from `@flexiness/copilotkit` instead of raw hooks from `@copilotkitnext/react`. This ensures the app works when `NEXT_PUBLIC_COPILOTKIT_ENABLED=false`.
