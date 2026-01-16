# Integrate CopilotKit into Component

Analyze a React component and suggest CopilotKit hook integrations.

## Instructions

1. Read the specified component file (use `$ARGUMENTS` or prompt for path)

2. Analyze the component to identify:
   - useState hooks that could use `useReadableState`
   - Props that represent user context for `useReadableUser`
   - API data/responses that could use `useReadableApi`
   - MobX store usage that could use `useReadableStore`

3. Present findings to user with suggested code changes

4. If user approves, add the appropriate imports and hooks:
   ```typescript
   import { useReadableState, useReadableUser } from '@flexiness/copilotkit';
   ```

5. Ensure 'use client' directive is present if hooks are added

## Parameters
- `$ARGUMENTS` - Component file path (e.g., `apps/gateway/src/components/Dashboard.tsx`)

## Notes
- Only suggest integration for components that have meaningful state/data
- Preserve existing code style and formatting
- Don't add hooks to simple presentational components
