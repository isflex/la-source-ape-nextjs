/**
 * CopilotKit API Route with Strands Agent Integration
 *
 * This route integrates AWS Strands Agents with CopilotKit using the AG-UI protocol.
 * The agent mode is configurable via STRANDS_AGENT_MODE environment variable:
 * - local: In-process TypeScript agent (default, for dev)
 * - lambda: Python agent on AWS Lambda
 * - remote: Agent on EC2 or separate server
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Agent ID for the APE assistant
const AGENT_ID = 'ape_assistant';

// Lazy-load handler to prevent build-time issues
let handlerPromise: Promise<{ handleRequest: (req: Request) => Response | Promise<Response> }> | null = null;

async function getHandler() {
  if (!handlerPromise) {
    handlerPromise = (async () => {
      const { CopilotRuntime, copilotRuntimeNextJSAppRouterEndpoint, ExperimentalEmptyAdapter } =
        await import('@copilotkit/runtime');
      const { getStrandsAgent, getAgentMode } = await import('@src/lib/agents');

      // Get agent based on configured mode (local/lambda/remote)
      const strandsAgent = await getStrandsAgent();

      console.log(`[CopilotKit] Initialized with Strands Agent in ${getAgentMode()} mode`);

      // Create CopilotKit runtime with registered agent
      const copilotKit = new CopilotRuntime({
        agents: {
          [AGENT_ID]: strandsAgent,
        },
      });

      // Use ExperimentalEmptyAdapter since the agent handles LLM calls internally
      const serviceAdapter = new ExperimentalEmptyAdapter();

      // Create the endpoint handler
      return copilotRuntimeNextJSAppRouterEndpoint({
        runtime: copilotKit,
        serviceAdapter,
        endpoint: '/api/copilotkit/',
      });
    })();
  }
  return handlerPromise;
}

/**
 * Handle GET requests - with workaround for CopilotKit middleware bug
 *
 * CopilotKit runtime has a bug where it tries to access body.forwardedProps
 * for GET requests, but GET requests have no body. This workaround handles
 * the /info endpoint directly.
 *
 * @see https://github.com/CopilotKit/CopilotKit/issues/XXX (bug report pending)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Handle /info endpoint directly to work around CopilotKit middleware bug
  // The bug: readBody() returns undefined for GET, then body.forwardedProps crashes
  if (pathname.endsWith('/info') || pathname.endsWith('/info/')) {
    return Response.json({
      agents: {
        [AGENT_ID]: {
          id: AGENT_ID,
          name: 'APE Assistant',
          description: 'La Source APE Assistant - helps users navigate the site and manage content',
        },
      },
    });
  }

  // For other GET requests, pass through to CopilotKit handler
  const { handleRequest } = await getHandler();
  return handleRequest(req);
}

export async function POST(req: Request) {
  const { handleRequest } = await getHandler();
  return handleRequest(req);
}
