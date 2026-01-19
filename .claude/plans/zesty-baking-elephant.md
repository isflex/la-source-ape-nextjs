# Plan: Fix CopilotKit 404 API Errors

## Problem Summary

The CopilotKit integration fails with 404 errors on `/api/copilotkit/` requests:

```
POST /api/copilotkit/ 404 in 92662ms
Failed to load runtime info (/api/copilotkit/info): Runtime info request failed with status 404
Agent 'default' not found after runtime sync
```

**Root Cause:** CopilotKit creates multiple sub-routes internally:
- `GET /api/copilotkit/info` - Runtime info endpoint
- `POST /api/copilotkit/agent/:agentId/run` - Agent execution endpoint

But the current Next.js App Router setup has a **single route file** at `/api/copilotkit/route.ts` which only handles the exact path `/api/copilotkit/`. Requests to sub-paths like `/info` don't match.

## Solution: Convert to Catch-All Route

Move the route file to a **catch-all route** that handles all sub-paths:

```
BEFORE: /api/copilotkit/route.ts           → Only handles /api/copilotkit/
AFTER:  /api/copilotkit/[[...path]]/route.ts → Handles /api/copilotkit/* (all sub-paths)
```

## Files to Modify

| File | Change |
|------|--------|
| `apps/gateway/src/app/api/copilotkit/route.ts` | **MOVE** to `[[...path]]/route.ts` |

## Implementation

### Step 1: Create Catch-All Route Directory

```bash
mkdir -p apps/gateway/src/app/api/copilotkit/[[...path]]
mv apps/gateway/src/app/api/copilotkit/route.ts apps/gateway/src/app/api/copilotkit/[[...path]]/route.ts
```

### Step 2: Verify Endpoint Configuration

The project uses `trailingSlash: true` in next.config.mjs, so keep the trailing slash:

```typescript
return copilotRuntimeNextJSAppRouterEndpoint({
  runtime: copilotKit,
  serviceAdapter,
  endpoint: '/api/copilotkit/',  // Keep trailing slash (trailingSlash: true)
});
```

**Note:** The `[[...path]]` syntax is an optional catch-all route in Next.js App Router:
- `[[...path]]` matches both `/api/copilotkit/` AND `/api/copilotkit/anything/else/`
- With `trailingSlash: true`, Next.js will redirect non-trailing-slash requests to trailing-slash versions
- The `path` parameter will be `undefined` for the root and an array for sub-paths

## Verification

1. **Move route file** to catch-all location
2. **Verify endpoint** keeps trailing slash in route.ts
3. **Restart dev server**: `pnpm dev` (or it should hot-reload)
4. **Test in browser**:
   - Open http://localhost:3001
   - Open CopilotKit sidebar
   - Check browser DevTools Network tab - `/api/copilotkit/info/` should return 200
   - Send a message - should connect to agent successfully

## Expected Results After Fix

| Request | Before | After |
|---------|--------|-------|
| `GET /api/copilotkit/info/` | 404 | 200 (returns runtime info) |
| `POST /api/copilotkit/agent/ape_assistant/run/` | 404 | 200 (agent responds) |

## References

- [Next.js Catch-All Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#optional-catch-all-segments)
