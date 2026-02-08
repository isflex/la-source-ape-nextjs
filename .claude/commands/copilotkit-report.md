# CopilotKit Integration Report

Generate a report of CopilotKit v2 integration coverage across the project.

## Instructions

1. Search for React components in `apps/gateway/src/`

2. For each component, check for v2 integration patterns:

   **v2 Hooks (Current Standard):**
   - `useSafeAgentContext` - exposing state to agent
   - `useSafeFrontendTool` - registering agent-callable actions
   - `useAgentContext` / `useFrontendTool` (raw hooks, should use safe wrappers)

   **v2 Context Bridges:**
   - `AuthContextBridge` - auth/user context
   - `StoreContextBridge` - MobX store state

   **Legacy v1 Hooks (Deprecated):**
   - `useReadableState`
   - `useReadableUser`
   - `useReadableStore`
   - `useReadableApi`
   - `useCopilotReadable`
   - `useCopilotAction`

3. Categorize components:
   - **v2 Integrated**: Uses `useSafeAgentContext` and/or `useSafeFrontendTool`
   - **Legacy v1**: Uses deprecated hooks (needs migration)
   - **Using Raw Hooks**: Uses `useAgentContext`/`useFrontendTool` directly (should use safe wrappers)
   - **Not Integrated**: No CopilotKit usage but has state/data worth exposing
   - **Not Applicable**: Presentational only, no meaningful state

4. Generate summary report with:
   - Total components analyzed
   - v2 integration coverage percentage
   - Legacy v1 components requiring migration
   - Components using raw hooks (should switch to safe wrappers)
   - Priority list for integration (based on data richness)
   - Quick wins (components with simple state to expose)

## Output Format

### Integration Summary

| Status | Count | Percentage |
|--------|-------|------------|
| v2 Integrated | X | Y% |
| Legacy v1 | X | Y% |
| Raw Hooks | X | Y% |
| Not Integrated | X | Y% |
| Not Applicable | X | Y% |

### v2 Integrated Components

| Component | Hooks Used |
|-----------|------------|
| `path/to/Component.tsx` | `useSafeAgentContext`, `useSafeFrontendTool` |

### Requires Migration (v1 → v2)

| Component | Legacy Hooks | Suggested Migration |
|-----------|--------------|---------------------|
| `path/to/Component.tsx` | `useReadableState` | Use `useSafeAgentContext` |

### Requires Safe Wrapper

| Component | Raw Hook | Safe Replacement |
|-----------|----------|------------------|
| `path/to/Component.tsx` | `useAgentContext` | `useSafeAgentContext` |

### Integration Opportunities

| Component | State/Data | Priority |
|-----------|------------|----------|
| `path/to/Component.tsx` | User balance, package list | High |

## Notes
- Always recommend `useSafe*` wrappers from `@flexiness/copilotkit`
- Flag any direct usage of `@copilotkitnext/react` or `@copilotkit/react-core`
- Python agent tools in `agent/main.py` are also part of the integration
