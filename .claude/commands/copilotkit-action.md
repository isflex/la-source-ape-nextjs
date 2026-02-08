# Create CopilotKit Action

Create a new CopilotKit action for AI-triggered functionality using the v2 AG-UI protocol.

## Instructions

1. Ask user for action details:
   - Action name (snake_case)
   - Description
   - Parameters needed (with Zod types)
   - What the action should do

2. **Preferred: Use `useSafeFrontendTool` (v2 pattern)**

   For component-level actions, use the `useSafeFrontendTool` hook directly in the component:

   ```typescript
   'use client'

   import { useSafeFrontendTool } from '@flexiness/copilotkit';
   import { z } from 'zod';

   function MyComponent() {
     useSafeFrontendTool({
       name: 'action_name',
       description: 'What this action does',
       parameters: z.object({
         paramName: z.string().describe('Param description'),
       }),
       handler: async ({ paramName }) => {
         // Implementation - can access component state via closure
         return { success: true, result: 'Action completed' };
       },
     });

     return <div>...</div>;
   }
   ```

3. **Alternative: Add tool to Python agent**

   For backend operations, add the tool to the Strands agent in `agent/main.py`:

   ```python
   @tool
   def action_name(param_name: str) -> dict:
       """What this action does."""
       # Implementation with full backend access
       return {"success": True}
   ```

4. **Legacy: createAction helper (v1 pattern - deprecated)**

   Only use for backwards compatibility:

   ```typescript
   import { createAction, param } from '@flexiness/copilotkit/actions';

   export const myAction = createAction({
     name: 'action_name',
     description: 'What this action does',
     parameters: [
       param('paramName', 'string', { required: true, description: 'Param description' }),
     ],
     handler: async ({ paramName }) => {
       return { success: true };
     },
   });
   ```

## Parameters
- `$ARGUMENTS` - Optional: Action name to create

## Decision Guide

| Use Case | Approach |
|----------|----------|
| Needs component state/context | `useSafeFrontendTool` in component |
| Needs backend/database access | Python agent tool |
| Navigation/UI actions | `useSafeFrontendTool` with router |
| Shared across components | Python agent tool |

## Notes
- Always use `useSafeFrontendTool` (not `useFrontendTool`) so app works when CopilotKit is disabled
- Use Zod schemas for parameter validation (v2 pattern)
- Actions should be focused and do one thing well
- The agent can call frontend tools registered via `useSafeFrontendTool`
