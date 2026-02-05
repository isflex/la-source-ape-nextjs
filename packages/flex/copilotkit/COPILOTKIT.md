# CopilotKit Integration

Package: `@flexiness/copilotkit` at `packages/flex/copilotkit/`

## Overview

CopilotKit v2 integration package for the Flexiness monorepo. Provides React hooks, providers, and context bridges for integrating CopilotKit v2 AI capabilities with AG-UI protocol support.

## Key Features

- **Safe Hook Wrappers**: `useSafeAgentContext`, `useSafeFrontendTool` — only call hooks when CopilotKit is enabled
- **Raw v2 Hooks**: `useAgentContext`, `useFrontendTool` (re-exported from `@copilotkitnext/react`)
- **Context Bridges**: `AuthContextBridge` (Cognito user), `StoreContextBridge` (MobX state)
- **Provider**: `FlexCopilotProvider` — pre-configured CopilotKit wrapper
- **Actions**: Action creation utilities with type safety

## Architecture (v2 AG-UI Protocol)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Browser / React App                                                     │
│                                                                          │
│  CopilotKitWrapper.tsx                                                   │
│    ├─ AuthContextBridge (AWS Cognito user → agent)                      │
│    └─ StoreContextBridge (MobX state → agent)                           │
│           │                                                              │
│           ▼                                                              │
│  FlexCopilotProvider (agentId="$AGENT_ID", runtimeUrl="/api/copilotkit")│
│    └─ CopilotSidebar (chat UI)                                          │
│           │                                                              │
└───────────│──────────────────────────────────────────────────────────────┘
            │ HTTP POST (AG-UI Protocol)
            ▼
┌───────────────────────────────────────────────────────────────────────────┐
│  /api/copilotkit/[[...path]]/route.ts                                    │
│    ├─ CopilotRuntime (v2) with Hono router                               │
│    ├─ HttpAgent → proxies to Python agent                                │
│    └─ Routes: /info, /agent/{agentId}/run, /agent/{agentId}/connect      │
└───────────│───────────────────────────────────────────────────────────────┘
            │ HTTP/SSE (AG-UI Protocol)
            ▼
┌───────────────────────────────────────────────────────────────────────────┐
│  Python Strands Agent (localhost:8080)                                   │
│    ├─ StrandsAgent (name="$AGENT_ID")                                    │
│    ├─ BedrockModel (Claude 3 Haiku)                                      │
│    └─ Tools: navigate(), search(), get_credit_balance(), book_meeting()  │
└───────────────────────────────────────────────────────────────────────────┘
```

## Safe Hook Wrappers (`useSafe*` Pattern)

Application code must use `useSafe*` wrappers from `@flexiness/copilotkit` instead of raw hooks from `@copilotkitnext/react`. This ensures the app works when `NEXT_PUBLIC_COPILOTKIT_ENABLED=false`.

| Raw Hook (`@copilotkitnext/react`) | Safe Wrapper (`@flexiness/copilotkit`) | Purpose                        |
| ---------------------------------- | -------------------------------------- | ------------------------------ |
| `useAgentContext`                  | `useSafeAgentContext`                  | Expose state data to agent     |
| `useFrontendTool`                  | `useSafeFrontendTool`                  | Register agent-callable tools  |

**Convention:** For each upstream hook `useX`, create `useSafeX` in `packages/flex/copilotkit/src/hooks/`. The MCP server always recommends `useSafe*` versions.

## Environment Variables

| Variable                          | Required | Default                      | Description                         |
| --------------------------------- | -------- | ---------------------------- | ----------------------------------- |
| `NEXT_PUBLIC_COPILOTKIT_ENABLED`  | Yes      | `false`                      | Enable CopilotKit sidebar           |
| `NEXT_PUBLIC_COPILOTKIT_AGENT_ID` | Yes      | `ape_assistant`              | Agent ID (must match Python)        |
| `NEXT_PUBLIC_AGENT_URL`           | Yes      | `http://localhost:8080`      | Python agent URL                    |
| `NEXT_PUBLIC_COPILOTKIT_API_KEY`  | No       | -                            | CopilotKit Cloud API key (optional) |
| `FLEX_AI_LLM_PROVIDER`            | Yes      | `bedrock`                    | LLM provider for Python agent       |
| `FLEX_AI_LLM_MODEL`              | Yes      | `anthropic.claude-3-haiku-*` | Bedrock model ID                    |

## Integration Checklist

```markdown
- [ ] `NEXT_PUBLIC_COPILOTKIT_ENABLED=true` in `.env.development`
- [ ] `NEXT_PUBLIC_COPILOTKIT_AGENT_ID` set (same value in all 3 files)
- [ ] `NEXT_PUBLIC_AGENT_URL=http://localhost:8080`
- [ ] Python agent running: `cd agent && ./run.sh`
- [ ] Agent docs available: `curl http://localhost:8080/docs`
- [ ] API route responds: `curl http://localhost:3001/api/copilotkit/info`
- [ ] AWS credentials: `AWS_PROFILE` set with Bedrock access
```

## Troubleshooting

- **No chat sidebar**: Check `NEXT_PUBLIC_COPILOTKIT_ENABLED=true`
- **Agent not responding**: Verify Python agent running at `AGENT_URL`
- **Agent ID mismatch error**: Ensure same ID in CopilotKitWrapper.tsx, route.ts, and main.py
- **Bedrock error**: Check `AWS_PROFILE` has `bedrock:InvokeModel` permission

## Slash Commands

| Command                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `/copilotkit-integrate` | Analyze component and suggest CopilotKit hooks |
| `/copilotkit-report`    | Generate integration coverage report           |
| `/copilotkit-action`    | Create a new CopilotKit action                 |
