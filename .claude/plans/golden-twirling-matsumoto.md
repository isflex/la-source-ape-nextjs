# CopilotKit Integration Plan for Gateway/Flexi Monorepo

## Current Status

**Completed:**
- [x] @flexiness/copilotkit package created with hooks and provider
- [x] @flexiness/copilotkit-mcp-server package created with component analyzer
- [x] Gateway API route configured at `/api/copilotkit/`
- [x] TypeScript compilation errors fixed
- [x] CopilotKit integration replicated to ai/gateway/v1 repo

**Immediate Task: Migrate la-source-ape MCP Config**
Migrate la-source-ape/gateway/flexi from non-standard `.claude/settings.json` with inline `mcpServers` to the correct pattern using `.mcp.json`.

### Migration Steps:
1. Create `/home/ischerer/workspaces/flex/la-source-ape/gateway/flexi/.mcp.json` with MCP server definitions
2. Remove `mcpServers` from `.claude/settings.json`
3. Remove non-standard fields (`contextLength`, `autoSave`, `codeStyle`) from settings.json

---

## Executive Summary

Integrate CopilotKit into the gateway/flexi monorepo with a dedicated package, MCP agent for automated integration, and Claude Code orchestration capabilities. This plan leverages patterns from the existing websocket-app implementation while adapting for Next.js 15 + Amplify Gen2.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DEVELOPMENT TIME                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Claude Code (Orchestrator)                                                 │
│        │                                                                     │
│        ├──MCP──► CopilotKit Integration Agent (MCP Server)                  │
│        │              │                                                      │
│        │              ├─► Analyze new components for useCopilotReadable     │
│        │              ├─► Inject CopilotKit patterns automatically          │
│        │              ├─► Validate CopilotKit integration                   │
│        │              └─► Report integration status                         │
│        │                                                                     │
│        ├──MCP──► Filesystem Server (existing)                               │
│        └──Hook─► Post-file-change triggers                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            RUNTIME (End User)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Browser (Gateway App)                                                      │
│        │                                                                     │
│        └──► CopilotKit Chat Panel                                           │
│                  │                                                           │
│                  ▼                                                           │
│        ┌─────────────────────────────────────────┐                          │
│        │  @flexiness/copilotkit Package          │                          │
│        │  ├─ CopilotProvider (configured)        │                          │
│        │  ├─ useCopilotReadable wrappers         │                          │
│        │  ├─ useCopilotAction definitions        │                          │
│        │  └─ Runtime adapter (Bedrock/Cloud)     │                          │
│        └─────────────────────────────────────────┘                          │
│                  │                                                           │
│                  ▼                                                           │
│        Next.js API Route (/api/copilotkit)                                  │
│                  │                                                           │
│                  ├──► AWS Bedrock (LLM)                                     │
│                  └──► MCP Bridge (Tools) ──► AWS Cognito                    │
│                                          ──► AppSync GraphQL                │
│                                          ──► LangGraph Agents               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Create @flexiness/copilotkit Package

### Location
`/packages/flex/copilotkit/`

### Package Structure
```
packages/flex/copilotkit/
├── src/
│   ├── index.ts                    # Main exports
│   ├── provider/
│   │   ├── CopilotProvider.tsx     # Pre-configured CopilotKit wrapper
│   │   └── config.ts               # Runtime configuration
│   ├── hooks/
│   │   ├── useReadableState.ts     # Wrapper for useCopilotReadable
│   │   ├── useReadableStore.ts     # MobX store integration
│   │   ├── useReadableApi.ts       # API response integration
│   │   ├── useReadableUser.ts      # User context integration
│   │   └── index.ts
│   ├── actions/
│   │   ├── types.ts                # Action type definitions
│   │   ├── createAction.ts         # Action factory
│   │   └── index.ts
│   ├── mcp/
│   │   ├── bridge-client.ts        # MCP Bridge connection
│   │   └── tools.ts                # Tool definitions for MCP
│   └── types/
│       └── index.ts                # TypeScript types
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── tsup.config.ts
```

**Note:** No custom runtime adapters needed - use CopilotKit's built-in `BedrockAdapter` from `@copilotkit/runtime`.

### Key Dependencies
```json
{
  "dependencies": {
    "@copilotkit/react-core": "^1.x",
    "@copilotkit/react-ui": "^1.x",
    "@copilotkit/runtime": "^1.x",
    "@langchain/aws": "^0.1.x",
    "@langchain/langgraph": "^0.2.x"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "next": "^15.0.0",
    "@flexiness/domain-store": "workspace:*"
  }
}
```

### Core Abstractions

#### 1. CopilotProvider (Pre-configured)
```typescript
// Wraps CopilotKit with project-specific defaults
export function FlexCopilotProvider({ children, config }: Props) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" {...config}>
      <CopilotSidebar defaultOpen={false}>
        {children}
      </CopilotSidebar>
    </CopilotKit>
  );
}
```

#### 2. useReadableState (Auto-integration hook)
```typescript
// Simplifies useCopilotReadable with automatic description generation
export function useReadableState<T>(
  key: string,
  value: T,
  options?: ReadableOptions
) {
  useCopilotReadable({
    description: options?.description ?? `Current ${key} state`,
    value: JSON.stringify(value),
    categories: options?.categories ?? ['state'],
  });
}
```

#### 3. useReadableStore (MobX Integration)
```typescript
// Auto-sync MobX store slices to CopilotKit
export function useReadableStore(
  store: object,
  slices: string[],
  description: string
) {
  const storeData = useMemo(() =>
    slices.reduce((acc, slice) => ({
      ...acc,
      [slice]: store[slice]
    }), {}),
    [store, ...slices.map(s => store[s])]
  );

  useCopilotReadable({
    description,
    value: storeData,
    categories: ['store', 'state'],
  });
}
```

---

## Phase 2: CopilotKit Integration MCP Server

### Purpose
A dedicated MCP server that Claude Code uses to automatically integrate CopilotKit patterns into new code.

### Lifecycle: On-Demand
- Server starts when Claude Code invokes a tool
- Stops after idle timeout (configurable, default 5 minutes)
- No persistent resource consumption

### Integration Mode: Suggest Only
- MCP agent analyzes components and suggests useCopilotReadable placements
- Claude Code presents options to user for approval
- User reviews and confirms before any code changes
- Maintains human-in-the-loop for all code modifications

### Location
`/packages/flex/copilotkit-mcp-server/`

### MCP Server Tools

| Tool | Description |
|------|-------------|
| `analyze_component` | Analyze React component for CopilotKit integration opportunities |
| `inject_readable` | Add useCopilotReadable hooks to component |
| `inject_action` | Add useCopilotAction definitions |
| `validate_integration` | Check if component properly integrates CopilotKit |
| `get_integration_report` | Generate report of CopilotKit coverage |
| `suggest_actions` | Suggest CopilotKit actions for component functionality |

### Tool: `analyze_component`
```typescript
{
  name: 'analyze_component',
  description: 'Analyze a React component file to identify state, props, and API data that should be exposed via useCopilotReadable',
  inputSchema: {
    type: 'object',
    properties: {
      filePath: { type: 'string', description: 'Path to the component file' },
      analysisDepth: {
        type: 'string',
        enum: ['shallow', 'deep'],
        description: 'shallow: only this file, deep: include imports'
      }
    },
    required: ['filePath']
  }
}
```

### Tool: `inject_readable`
```typescript
{
  name: 'inject_readable',
  description: 'Inject useCopilotReadable hooks into a component for identified state/data',
  inputSchema: {
    type: 'object',
    properties: {
      filePath: { type: 'string' },
      readables: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            valueExpression: { type: 'string' },
            categories: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      dryRun: { type: 'boolean', default: true }
    },
    required: ['filePath', 'readables']
  }
}
```

### Implementation Pattern
```typescript
// MCP Server entry point
export class CopilotKitIntegrationServer {
  private analyzer: ComponentAnalyzer;
  private injector: CodeInjector;

  async handleTool(name: string, args: unknown) {
    switch (name) {
      case 'analyze_component':
        return this.analyzeComponent(args);
      case 'inject_readable':
        return this.injectReadable(args);
      // ... other tools
    }
  }

  private async analyzeComponent({ filePath, analysisDepth }) {
    const ast = await this.parseFile(filePath);
    const analysis = {
      componentName: this.extractComponentName(ast),
      stateVariables: this.findStateUsage(ast),
      props: this.extractProps(ast),
      apiCalls: this.findApiCalls(ast),
      existingReadables: this.findExistingReadables(ast),
      recommendations: this.generateRecommendations(ast)
    };
    return analysis;
  }
}
```

---

## Phase 3: Claude Code Configuration

### 3.1 MCP Servers Configuration (`.claude/settings.json`)

```json
{
  "enableAllProjectMcpServers": true,
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${FLEX_PROJ_ROOT}"]
    },
    "copilotkit-integration": {
      "command": "node",
      "args": ["${FLEX_PROJ_ROOT}/packages/flex/copilotkit-mcp-server/dist/index.js"],
      "env": {
        "FLEX_PROJ_ROOT": "${FLEX_PROJ_ROOT}",
        "FLEX_MODE": "${FLEX_MODE}"
      }
    },
    "mcp-bridge": {
      "command": "node",
      "args": ["${FLEX_PROJ_ROOT}/packages/flex/mcp-bridge/dist/index.js"],
      "env": {
        "FLEX_MCP_BRIDGE_PORT": "3000"
      }
    }
  }
}
```

### 3.2 Claude Hooks (`.claude/hooks/`)

#### Post-File-Edit Hook (`post-edit.sh`)
```bash
#!/bin/bash
# Triggered after Claude Code edits a file

FILE_PATH="$1"
FILE_EXT="${FILE_PATH##*.}"

# Only process React component files
if [[ "$FILE_EXT" == "tsx" || "$FILE_EXT" == "jsx" ]]; then
  # Check if file is in apps/gateway/src
  if [[ "$FILE_PATH" == *"apps/gateway/src"* ]]; then
    # Signal to Claude Code to run CopilotKit analysis
    echo "COPILOTKIT_ANALYZE:$FILE_PATH"
  fi
fi
```

#### Pre-Commit Hook (`pre-commit.sh`)
```bash
#!/bin/bash
# Validate CopilotKit integration before commit

# Get list of staged .tsx files
STAGED_TSX=$(git diff --cached --name-only --diff-filter=ACM | grep '\.tsx$')

if [ -n "$STAGED_TSX" ]; then
  echo "Checking CopilotKit integration coverage..."
  # Trigger MCP tool call for validation
  echo "COPILOTKIT_VALIDATE:$STAGED_TSX"
fi
```

### 3.3 Claude Commands (`.claude/commands/`)

#### `/copilotkit-integrate.md`
```markdown
# Integrate CopilotKit into Component

Analyze the specified component and integrate CopilotKit hooks.

## Instructions

1. Use the `copilotkit-integration` MCP server's `analyze_component` tool
2. Review the analysis results with the user
3. If approved, use `inject_readable` tool to add hooks
4. Validate the integration with `validate_integration`
5. Update the component's test file if needed

## Parameters
- `$ARGS` - Component file path or "current" for active file
```

#### `/copilotkit-report.md`
```markdown
# CopilotKit Integration Report

Generate a report of CopilotKit integration coverage across the project.

## Instructions

1. Use `get_integration_report` tool from copilotkit-integration MCP server
2. Summarize findings:
   - Components with full integration
   - Components missing useCopilotReadable
   - Components missing useCopilotAction
   - Recommended priority for integration
3. Present actionable recommendations
```

---

## Phase 4: Gateway App Integration

### 4.1 Next.js API Route (`apps/gateway/src/app/api/copilotkit/route.ts`)

**Uses CopilotKit's built-in BedrockAdapter** (already implemented):

```typescript
import { CopilotRuntime, copilotRuntimeNextJSAppRouterEndpoint, BedrockAdapter } from '@copilotkit/runtime';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const copilotKit = new CopilotRuntime();

const serviceAdapter = new BedrockAdapter({
  model: process.env.FLEX_AI_LLM_MODEL || 'anthropic.claude-3-haiku-20240307-v1:0',
  region: process.env.AWS_REGION || 'eu-west-3',
});

const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
  runtime: copilotKit,
  serviceAdapter,
  endpoint: '/api/copilotkit/',
});

export async function GET(req: Request) {
  return handleRequest(req);
}

export async function POST(req: Request) {
  return handleRequest(req);
}
```

### 4.2 Root Layout Integration (`apps/gateway/src/app/layout.tsx`)

```typescript
import { FlexCopilotProvider } from '@flexiness/copilotkit';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FlexCopilotProvider>
          {children}
        </FlexCopilotProvider>
      </body>
    </html>
  );
}
```

### 4.3 Component Integration Pattern

```typescript
// Example: Before (without CopilotKit)
function UserDashboard({ user }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  return <Dashboard events={events} />;
}

// After (with CopilotKit via @flexiness/copilotkit)
import { useReadableState, useReadableUser } from '@flexiness/copilotkit';

function UserDashboard({ user }) {
  const [events, setEvents] = useState([]);

  // Auto-integrated by MCP agent
  useReadableUser(user); // User context
  useReadableState('dashboardEvents', events, {
    description: 'List of upcoming events for the current user',
    categories: ['events', 'dashboard'],
  });

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  return <Dashboard events={events} />;
}
```

---

## Phase 5: LLM Provider Strategy

### Decision: Use CopilotKit's Built-in Adapters

**Primary Provider**: AWS Bedrock via `@copilotkit/runtime`

CopilotKit provides built-in adapters for major LLM providers:
- `BedrockAdapter` - AWS Bedrock (Claude, Titan, etc.)
- `OpenAIAdapter` - OpenAI GPT models
- `AnthropicAdapter` - Anthropic Claude direct
- `GroqAdapter` - Groq inference
- `LangChainAdapter` - Custom LangChain models

**No custom adapter needed** - use CopilotKit's `BedrockAdapter` directly.

### Configuration
```bash
# Environment variables
FLEX_AI_LLM_MODEL=anthropic.claude-3-haiku-20240307-v1:0
AWS_REGION=eu-west-3
# AWS credentials via IAM role or environment
```

### Switching Providers
To switch from Bedrock to another provider, change the import in the API route:
```typescript
// Bedrock (current)
import { BedrockAdapter } from '@copilotkit/runtime';
const adapter = new BedrockAdapter({ model, region });

// OpenAI (alternative)
import { OpenAIAdapter } from '@copilotkit/runtime';
const adapter = new OpenAIAdapter({ openai });

// Anthropic Direct (alternative)
import { AnthropicAdapter } from '@copilotkit/runtime';
const adapter = new AnthropicAdapter({ anthropic });
```

---

## Phase 6: MCP Bridge Adaptation

### Decision: Shared Package

Create `@flexiness/mcp-bridge` as a shared package usable by both gateway/flexi and websocket-app projects.

### Key Files to Port from websocket-app
Source: `/home/ischerer/workspaces/flex/websocket-app/ape-la-source/apps/la-source/ape/ai/mcp-bridge/src/`

| Source File | Purpose |
|-------------|---------|
| `mcp-handler.ts` | Tool orchestrator (30+ tools) |
| `auth-manager.ts` | AWS Cognito JWT verification |
| `session-manager.ts` | Session lifecycle management |
| `http-transport.ts` | HTTP/SSE transport layer |
| `graphql-client.ts` | AWS AppSync integration |
| `resilient-mcp-client.ts` | Retry logic for external MCP |

### New Location
`/packages/flex/mcp-bridge/` (shared package)

### Integration with CopilotKit MCP Server
```
Claude Code
    │
    ├──► copilotkit-integration (dev-time integration)
    │
    └──► mcp-bridge (runtime tools)
            │
            ├──► auth_login / auth_logout
            ├──► graphql_* (AppSync operations)
            └──► copilot_query (delegate to CopilotKit)
```

---

## Implementation Order

### Step 0: Cleanup Custom Adapter (IMMEDIATE)
Remove unused custom BedrockAdapter from @flexiness/copilotkit:

**Files to DELETE:**
- `packages/flex/copilotkit/src/runtime/bedrock-adapter.ts`
- `packages/flex/copilotkit/src/runtime/adapter-factory.ts`

**Files to MODIFY:**
- `packages/flex/copilotkit/src/runtime/index.ts` - Remove adapter exports
- `packages/flex/copilotkit/src/index.ts` - Remove runtime exports if empty
- `packages/flex/copilotkit/src/types/index.ts` - Remove unused adapter types (LLMAdapter, AdapterConfig, BedrockConfig, etc.)
- `packages/flex/copilotkit/package.json` - Remove `@langchain/aws` dependency if no longer needed

### Step 1: Create @flexiness/copilotkit package ✅ DONE
- [x] Package structure and configuration
- [x] Core hooks (useReadableState, useReadableStore, useReadableUser)
- [x] CopilotProvider wrapper
- [x] ~~Runtime adapter for AWS Bedrock~~ (using CopilotKit's built-in)

### Step 2: Create copilotkit-mcp-server ✅ DONE
- [x] MCP server scaffold
- [x] Component analyzer (AST parsing)
- [ ] Code injector (safe code modification)
- [ ] Integration validator
- [ ] Report generator

### Step 3: Configure Claude Code
- [x] Update .claude/settings.json with MCP servers
- [ ] Create Claude hooks for post-edit analysis
- [ ] Create slash commands for manual integration
- [ ] Update permissions in settings.local.json

### Step 4: Integrate into Gateway App ✅ DONE
- [x] Add CopilotKit API route
- [ ] Wrap root layout with provider
- [ ] Add environment variables
- [ ] Test basic chat functionality

### Step 5: Port MCP Bridge
- [ ] Extract reusable components from websocket-app
- [ ] Adapt for Next.js 15 / Amplify Gen2
- [ ] Connect to existing AWS services

### Step 6: Documentation & Testing
- [ ] Update CLAUDE.md
- [ ] Create integration guide
- [ ] Add component examples
- [ ] Integration tests

---

## Files to Create/Modify

### Immediate Cleanup (Step 0)

| File | Action | Description |
|------|--------|-------------|
| `packages/flex/copilotkit/src/runtime/bedrock-adapter.ts` | DELETE | Custom adapter not needed |
| `packages/flex/copilotkit/src/runtime/adapter-factory.ts` | DELETE | Factory not needed |
| `packages/flex/copilotkit/src/runtime/index.ts` | MODIFY | Remove adapter exports |
| `packages/flex/copilotkit/src/types/index.ts` | MODIFY | Remove adapter types |
| `packages/flex/copilotkit/package.json` | MODIFY | Remove @langchain/aws dep |

### Previously Completed

| File | Action | Status |
|------|--------|--------|
| `packages/flex/copilotkit/` | CREATE | ✅ Done |
| `packages/flex/copilotkit-mcp-server/` | CREATE | ✅ Done |
| `apps/gateway/src/app/api/copilotkit/route.ts` | CREATE | ✅ Done |
| `.claude/settings.json` | MODIFY | ✅ Done |

### Remaining Work

| File | Action | Description |
|------|--------|-------------|
| `packages/flex/mcp-bridge/` | CREATE | Ported MCP bridge for runtime |
| `apps/gateway/src/app/layout.tsx` | MODIFY | Add CopilotProvider |
| `.claude/hooks/post-edit.sh` | CREATE | Auto-analysis hook |
| `.claude/commands/copilotkit-*.md` | CREATE | Slash commands |
| `CLAUDE.md` | MODIFY | Document CopilotKit integration |

---

## Environment Variables (New)

```bash
# CopilotKit Configuration
FLEX_AI_LLM_PROVIDER=bedrock
FLEX_AI_LLM_MODEL=anthropic.claude-3-haiku-20240307-v1:0
FLEX_AI_COPILOTKIT_ENABLED=true

# MCP Bridge
FLEX_MCP_BRIDGE_PORT=3000
FLEX_MCP_BRIDGE_HOST=http://localhost:3000

# Development Integration
FLEX_COPILOTKIT_AUTO_INTEGRATE=true
FLEX_COPILOTKIT_DRY_RUN=true
```

---

## Success Criteria

1. **Package Created**: `@flexiness/copilotkit` compiles and exports all hooks
2. **MCP Server Running**: Claude Code can invoke CopilotKit integration tools
3. **Auto-Integration**: New components automatically get useCopilotReadable suggestions
4. **Chat Functional**: End users can interact with CopilotKit chatbot in gateway app
5. **Bridge Connected**: MCP Bridge tools accessible from CopilotKit runtime
6. **Coverage Report**: Can generate integration coverage report via slash command
