# Integrate CopilotKit into Component

Analyze a React component and suggest CopilotKit v2 hook integrations.

## Instructions

1. Read the specified component file (use `$ARGUMENTS` or prompt for path)

2. Analyze the component to identify opportunities for v2 integration:

   **Primary (v2 AG-UI Protocol):**
   - State/data that should be exposed to the agent → `useSafeAgentContext`
   - Actions the agent should be able to trigger → `useSafeFrontendTool`

   **Context Bridges (for wrapper components):**
   - Auth/user context → `AuthContextBridge`
   - MobX store state → `StoreContextBridge`

3. Present findings to user with suggested code changes

4. If user approves, add the appropriate imports and hooks:

   ```typescript
   'use client'

   import { useSafeAgentContext, useSafeFrontendTool } from '@flexiness/copilotkit';
   import { z } from 'zod';

   function MyComponent() {
     const [items, setItems] = useState([]);

     // Expose data to agent
     useSafeAgentContext({
       description: 'List of items the user is viewing',
       value: items,
     });

     // Register action the agent can call
     useSafeFrontendTool({
       name: 'add_item',
       description: 'Add a new item to the list',
       parameters: z.object({
         name: z.string().describe('Item name'),
       }),
       handler: async ({ name }) => {
         setItems(prev => [...prev, { name }]);
         return { success: true };
       },
     });

     return <div>...</div>;
   }
   ```

5. Ensure 'use client' directive is present if hooks are added

## v2 Hook Reference

| Hook | Purpose | Example Use Case |
|------|---------|------------------|
| `useSafeAgentContext` | Expose state/data to agent | User's credit balance, current page data |
| `useSafeFrontendTool` | Register agent-callable action | Purchase credits, navigate, submit form |

## Legacy Hooks (Deprecated)

These v1 hooks are kept for backwards compatibility but should be migrated to v2:

| Legacy Hook | v2 Replacement |
|-------------|----------------|
| `useReadableState` | `useSafeAgentContext` |
| `useReadableUser` | `AuthContextBridge` |
| `useReadableStore` | `StoreContextBridge` |
| `useReadableApi` | `useSafeAgentContext` |

## Parameters
- `$ARGUMENTS` - Component file path (e.g., `apps/gateway/src/components/Dashboard.tsx`)

## Notes
- Always use `useSafe*` wrappers so app works when `NEXT_PUBLIC_COPILOTKIT_ENABLED=false`
- Only suggest integration for components that have meaningful state/data
- Preserve existing code style and formatting
- Don't add hooks to simple presentational components
- Use Zod schemas for frontend tool parameters
