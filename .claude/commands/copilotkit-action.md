# Create CopilotKit Action

Create a new CopilotKit action for AI-triggered functionality.

## Instructions

1. Ask user for action details:
   - Action name (snake_case)
   - Description
   - Parameters needed
   - What the action should do

2. Create the action using `@flexiness/copilotkit` utilities:
   ```typescript
   import { createAction, param } from '@flexiness/copilotkit/actions';

   export const myAction = createAction({
     name: 'action_name',
     description: 'What this action does',
     parameters: [
       param('paramName', 'string', { required: true, description: 'Param description' }),
     ],
     handler: async ({ paramName }) => {
       // Implementation
       return { success: true };
     },
   });
   ```

3. Add action to the CopilotKit runtime configuration in:
   `apps/gateway/src/app/api/copilotkit/route.ts`

## Parameters
- `$ARGUMENTS` - Optional: Action name to create

## Notes
- Actions should be focused and do one thing well
- Use ActionTemplates for common patterns (CRUD, navigation, search)
- Consider MCP Bridge integration for backend operations
