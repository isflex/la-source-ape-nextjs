/**
 * @flexiness/copilotkit/server
 *
 * Server-only re-exports for CopilotKit v2 API routes.
 * Centralizes the runtime, AG-UI client, and Hono adapter so that
 * Next.js apps depend on a single workspace package.
 *
 * Do not import from a client component — pulls in @copilotkit/runtime
 * and Hono, both Node-only.
 */
export { CopilotRuntime, InMemoryAgentRunner, createCopilotEndpoint } from '@copilotkit/runtime/v2';
export { HttpAgent, type RunAgentInput } from '@ag-ui/client';
export { handle } from 'hono/vercel';
