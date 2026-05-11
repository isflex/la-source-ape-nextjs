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
import { AsyncLocalStorage } from "node:async_hooks";

import {
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotEndpoint,
  HttpAgent,
  type RunAgentInput,
  handle,
} from "@flexiness/copilotkit/server";
import { NextResponse, type NextRequest } from "next/server";
import { fetchAuthSession } from "aws-amplify/auth/server";

import { debug } from "@flexiness/domain-utils";

import { runWithAmplifyServerContext } from "@src/utils/amplify/server/app.router";

// Next.js runtime configuration
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Agent configuration - centralized via environment variable
const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL || "http://localhost:8080/invocations";
const AGENT_ID = process.env.NEXT_PUBLIC_COPILOTKIT_AGENT_ID || "ape_assistant";

debug.copilotKit(`[v2] Agent "${AGENT_ID}" → ${AGENT_URL}`);

// Per-request Cognito access token, read inside HttpAgent.requestInit().
// HttpAgent is constructed once at module scope; ALS gives us a safe way to
// scope request-specific values without mutating the shared instance.
const authTokenStore = new AsyncLocalStorage<string | undefined>();

class AuthForwardingHttpAgent extends HttpAgent {
  protected requestInit(input: RunAgentInput): RequestInit {
    const base = super.requestInit(input);
    const token = authTokenStore.getStore();
    if (!token) return base;
    return {
      ...base,
      headers: {
        ...(base.headers as Record<string, string> | undefined),
        Authorization: `Bearer ${token}`,
      },
    };
  }
}

// Create the HttpAgent instance (shared between aliases)
const strandsAgent = new AuthForwardingHttpAgent({ url: AGENT_URL });

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
  basePath: "/api/copilotkit",
});

// Add debug middleware to log all requests at Hono level
app.use("*", async (c, next) => {
  debug.copilotKit("[Hono] Request:", {
    method: c.req.method,
    path: c.req.path,
    url: c.req.url,
  });
  await next();
  debug.copilotKit("[Hono] Response status:", c.res.status);
});

// Handle root POST - CopilotKit v2 client uses JSON-RPC style routing
// The 'method' field in the body determines which endpoint to call
app.post("/", async (c) => {
  debug.copilotKit("Root POST received");
  try {
    const body = await c.req.json();
    const { method, params, body: requestBody } = body;
    debug.copilotKit("Root POST method:", method, "params:", JSON.stringify(params));

    // Route based on the method field (JSON-RPC style)
    if (method === "info") {
      // Return agent info
      return c.json({
        version: "1.51.2",
        agents: {
          [AGENT_ID]: {
            name: AGENT_ID,
            description: "APE Assistant powered by Strands Agent",
          },
          default: {
            name: "default",
            description: `Default agent (alias for ${  AGENT_ID  })`,
          },
        },
        defaultAgent: AGENT_ID,
        audioFileTranscriptionEnabled: false,
      });
    }

    if (method === "agent/connect" || method === "agent/run") {
      // Extract agentId from params, default to AGENT_ID
      const agentId = params?.agentId || AGENT_ID;
      const action = method.split("/")[1]; // 'connect' or 'run'

      // Map 'default' agent to actual agent ID
      const resolvedAgentId = agentId === "default" ? AGENT_ID : agentId;

      debug.copilotKit(`Routing to agent/${resolvedAgentId}/${action}`);

      // Forward the request to the correct agent endpoint
      // We need to make an internal fetch to the agent endpoint
      const agentUrl = new URL(`/api/copilotkit/agent/${resolvedAgentId}/${action}`, c.req.url);

      // The inner fetch re-enters this Next route in a fresh request scope
      // (no cookies) so we forward the caller's bearer token so the nested
      // getCognitoAccessToken() call still yields the right ALS value.
      const innerHeaders: Record<string, string> = { "Content-Type": "application/json" };
      const forwardedToken = authTokenStore.getStore();
      if (forwardedToken) innerHeaders.Authorization = `Bearer ${forwardedToken}`;

      const response = await fetch(agentUrl.toString(), {
        method: "POST",
        headers: innerHeaders,
        body: JSON.stringify(requestBody || {}),
      });

      // Stream the response back
      if (response.body) {
        return new Response(response.body, {
          status: response.status,
          headers: {
            "Content-Type": response.headers.get("Content-Type") || "application/json",
          },
        });
      }

      return c.json(await response.json(), response.status as 200);
    }

    // Fallback: return info for unknown methods
    debug.copilotKit("Unknown method:", method);
    return c.json({
      version: "1.51.2",
      agents: {
        [AGENT_ID]: { name: AGENT_ID, description: "APE Assistant" },
        default: { name: "default", description: "Default agent" },
      },
      defaultAgent: AGENT_ID,
      audioFileTranscriptionEnabled: false,
    });
  } catch (error) {
    debug.error("Root POST error:", error);
    return c.json({ error: "Invalid request body" }, 400);
  }
});

// Export handlers using Hono's Vercel adapter with debug logging
const honoHandler = handle(app);

async function getCognitoAccessToken(req: NextRequest): Promise<string | undefined> {
  // Fast path: if the caller already carries a bearer token (internal re-entry
  // from the root JSON-RPC handler), reuse it instead of re-reading cookies.
  const authHeader = req.headers.get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice("bearer ".length).trim();
  }

  const response = new NextResponse();
  try {
    return await runWithAmplifyServerContext({
      nextServerContext: { request: req, response },
      operation: async (contextSpec) => {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens?.accessToken?.toString();
      },
    });
  } catch (error) {
    debug.copilotKit("Failed to read Cognito session:", error);
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Request throttle — prevents CopilotKit SDK polling from flooding the logs
// when the frontend is stuck in an error state (e.g. compile / runtime error).
// Requests to the same path within MIN_INTERVAL_MS receive a cached response.
// ---------------------------------------------------------------------------
const MIN_INTERVAL_MS = 5_000; // minimum interval between identical requests
const MAX_CACHE_AGE_MS = 30_000; // evict stale entries after 30 s

interface CachedResponse {
  body: string;
  status: number;
  contentType: string;
  timestamp: number;
}

const responseCache = new Map<string, CachedResponse>();

function getCacheKey(method: string, pathname: string): string {
  return `${method}:${pathname}`;
}

/** Return a cached Response if the same (method, path) was served recently. */
function getThrottledResponse(method: string, pathname: string): Response | null {
  const key = getCacheKey(method, pathname);
  const cached = responseCache.get(key);
  if (!cached) return null;

  const age = Date.now() - cached.timestamp;

  // Evict stale entries
  if (age > MAX_CACHE_AGE_MS) {
    responseCache.delete(key);
    return null;
  }

  // Within throttle window → return cached response
  if (age < MIN_INTERVAL_MS) {
    debug.copilotKit(`[Throttle] Returning cached response for ${method} ${pathname} (age: ${age}ms)`);
    return new Response(cached.body, {
      status: cached.status,
      headers: { "Content-Type": cached.contentType },
    });
  }

  return null;
}

/** Store a cloned response in the cache. */
async function cacheResponse(method: string, pathname: string, response: Response): Promise<Response> {
  const key = getCacheKey(method, pathname);
  const body = await response.text();
  responseCache.set(key, {
    body,
    status: response.status,
    contentType: response.headers.get("Content-Type") || "application/json",
    timestamp: Date.now(),
  });
  // Return a new Response since the original body was consumed
  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" },
  });
}

export const GET = async (req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) => {
  const params = await ctx.params;
  const {pathname} = new URL(req.url);

  // Check throttle cache first
  const throttled = getThrottledResponse("GET", pathname);
  if (throttled) return throttled;

  debug.copilotKit("GET request:", {
    path: params.path,
    url: req.url,
    pathname,
  });

  const token = await getCognitoAccessToken(req);
  const response = await authTokenStore.run(token, () => honoHandler(req));
  return cacheResponse("GET", pathname, response);
};

export const POST = async (req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) => {
  const params = await ctx.params;
  const {pathname} = new URL(req.url);

  // Only throttle non-streaming POST requests (e.g. /info via POST)
  // Don't throttle agent/run or agent/connect as those are intentional user actions
  const isPollingRequest = !pathname.includes("/agent/");
  if (isPollingRequest) {
    const throttled = getThrottledResponse("POST", pathname);
    if (throttled) return throttled;
  }

  debug.copilotKit("POST request:", {
    path: params.path,
    url: req.url,
    pathname,
    hasAuth: req.headers.has("authorization") || req.headers.has("cookie"),
  });

  const token = await getCognitoAccessToken(req);
  const response = await authTokenStore.run(token, () => honoHandler(req));

  if (isPollingRequest) {
    return cacheResponse("POST", pathname, response);
  }
  return response;
};
