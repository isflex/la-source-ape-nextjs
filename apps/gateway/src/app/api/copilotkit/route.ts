// CopilotKit API route - must be dynamically imported to avoid static analysis issues
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lazy-load handler to prevent build-time GraphQL schema issues
let handlerPromise: Promise<{ handleRequest: (req: Request) => Response | Promise<Response> }> | null = null;

async function getHandler() {
  if (!handlerPromise) {
    handlerPromise = (async () => {
      const { CopilotRuntime, copilotRuntimeNextJSAppRouterEndpoint, BedrockAdapter } = await import('@copilotkit/runtime');

      // Create the CopilotKit runtime
      const copilotKit = new CopilotRuntime();

      // Configure the Bedrock adapter for AWS Claude models
      const serviceAdapter = new BedrockAdapter({
        model: process.env.FLEX_AI_LLM_MODEL || 'anthropic.claude-3-haiku-20240307-v1:0',
        region: process.env.AWS_REGION || 'eu-west-3',
      });

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

// Export the Next.js App Router handlers
export async function GET(req: Request) {
  const { handleRequest } = await getHandler();
  return handleRequest(req);
}

export async function POST(req: Request) {
  const { handleRequest } = await getHandler();
  return handleRequest(req);
}
