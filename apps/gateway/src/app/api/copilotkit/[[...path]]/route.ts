/**
 * CopilotKit v2 API Route with Python Strands Agent
 *
 * This route uses the AG-UI protocol via Hono for real-time agent communication.
 * The v2 runtime provides enhanced features including:
 * - Shared state between React and agent
 * - Time travel (state history and rollback)
 * - Multi-agent execution
 * - Threads and persistence
 *
 * Routes handled:
 * - GET  /api/copilotkit/info                      - Runtime info and registered agents
 * - POST /api/copilotkit                           - JSON-RPC router (routes by 'method' field)
 *   - method: "info"                               - Returns agent info
 *   - method: "agent/connect"                      - Routes to /agent/{agentId}/connect
 *   - method: "agent/run"                          - Routes to /agent/{agentId}/run
 * - POST /api/copilotkit/agent/{agentId}/run       - Run agent (streaming)
 * - POST /api/copilotkit/agent/{agentId}/connect   - Connect to agent (SSE)
 * - POST /api/copilotkit/agent/{agentId}/stop/{id} - Stop agent thread
 * - POST /api/copilotkit/transcribe                - Audio transcription
 *
 * @see https://docs.copilotkit.ai/whats-new/v1-50#v2-interfaces
 */
import {
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotEndpoint,
} from '@copilotkit/runtime/v2';
import { HttpAgent } from '@ag-ui/client';
import { handle } from 'hono/vercel';

// Next.js runtime configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Agent configuration
const AGENT_URL = process.env.STRANDS_AGENT_URL || 'http://localhost:8000';
const AGENT_ID = 'ape_assistant';

console.log(`[CopilotKit v2] Agent "${AGENT_ID}" → ${AGENT_URL}`);

// Create the HttpAgent instance (shared between aliases)
const strandsAgent = new HttpAgent({ url: AGENT_URL });

// Create v2 runtime with HttpAgent proxying to Python Strands agent
// Include both the named agent and 'default' alias for compatibility
const copilotRuntime = new CopilotRuntime({
  agents: {
    [AGENT_ID]: strandsAgent,
    // 'default' alias for clients that don't specify an agent
    default: strandsAgent,
  },
  runner: new InMemoryAgentRunner(),
});

// Create Hono app with CopilotKit endpoints
const app = createCopilotEndpoint({
  runtime: copilotRuntime,
  basePath: '/api/copilotkit',
});

// Add debug middleware to log all requests at Hono level
app.use('*', async (c, next) => {
  console.log('[CopilotKit Hono] Request:', {
    method: c.req.method,
    path: c.req.path,
    url: c.req.url,
  });
  await next();
  console.log('[CopilotKit Hono] Response status:', c.res.status);
});

// Handle root POST - CopilotKit v2 client uses JSON-RPC style routing
// The 'method' field in the body determines which endpoint to call
app.post('/', async (c) => {
  console.log('[CopilotKit] Root POST received');
  try {
    const body = await c.req.json();
    const { method, params, body: requestBody } = body;
    console.log('[CopilotKit] Root POST method:', method, 'params:', JSON.stringify(params));

    // Route based on the method field (JSON-RPC style)
    if (method === 'info') {
      // Return agent info
      return c.json({
        version: '1.51.2',
        agents: {
          [AGENT_ID]: {
            name: AGENT_ID,
            description: 'APE Assistant powered by Strands Agent',
          },
          default: {
            name: 'default',
            description: 'Default agent (alias for ' + AGENT_ID + ')',
          },
        },
        defaultAgent: AGENT_ID,
        audioFileTranscriptionEnabled: false,
      });
    }

    if (method === 'agent/connect' || method === 'agent/run') {
      // Extract agentId from params, default to AGENT_ID
      const agentId = params?.agentId || AGENT_ID;
      const action = method.split('/')[1]; // 'connect' or 'run'

      // Map 'default' agent to actual agent ID
      const resolvedAgentId = agentId === 'default' ? AGENT_ID : agentId;

      console.log(`[CopilotKit] Routing to agent/${resolvedAgentId}/${action}`);

      // Forward the request to the correct agent endpoint
      // We need to make an internal fetch to the agent endpoint
      const agentUrl = new URL(`/api/copilotkit/agent/${resolvedAgentId}/${action}`, c.req.url);

      const response = await fetch(agentUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody || {}),
      });

      // Stream the response back
      if (response.body) {
        return new Response(response.body, {
          status: response.status,
          headers: {
            'Content-Type': response.headers.get('Content-Type') || 'application/json',
          },
        });
      }

      return c.json(await response.json(), response.status as 200);
    }

    // Fallback: return info for unknown methods
    console.log('[CopilotKit] Unknown method:', method);
    return c.json({
      version: '1.51.2',
      agents: {
        [AGENT_ID]: { name: AGENT_ID, description: 'APE Assistant' },
        default: { name: 'default', description: 'Default agent' },
      },
      defaultAgent: AGENT_ID,
      audioFileTranscriptionEnabled: false,
    });
  } catch (error) {
    console.error('[CopilotKit] Root POST error:', error);
    return c.json({ error: 'Invalid request body' }, 400);
  }
});

// Export handlers using Hono's Vercel adapter with debug logging
const honoHandler = handle(app);

export const GET = async (
  req: Request,
  ctx: { params: Promise<{ path?: string[] }> }
) => {
  const params = await ctx.params;
  console.log('[CopilotKit] GET request:', {
    path: params.path,
    url: req.url,
    pathname: new URL(req.url).pathname,
  });
  return honoHandler(req);
};

export const POST = async (
  req: Request,
  ctx: { params: Promise<{ path?: string[] }> }
) => {
  const params = await ctx.params;
  console.log('[CopilotKit] POST request:', {
    path: params.path,
    url: req.url,
    pathname: new URL(req.url).pathname,
  });
  return honoHandler(req);
};
