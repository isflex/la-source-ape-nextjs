import { CopilotRuntime, copilotRuntimeNextJSAppRouterEndpoint, BedrockAdapter } from '@copilotkit/runtime';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Create the CopilotKit runtime
const copilotKit = new CopilotRuntime();

// Configure the Bedrock adapter for AWS Claude models
const serviceAdapter = new BedrockAdapter({
  model: process.env.FLEX_AI_LLM_MODEL || 'anthropic.claude-3-haiku-20240307-v1:0',
  region: process.env.AWS_REGION || 'eu-west-3',
});

// Create the endpoint handler
const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
  runtime: copilotKit,
  serviceAdapter,
  endpoint: '/api/copilotkit/',
});

// Export the Next.js App Router handlers
export async function GET(req: Request) {
  return handleRequest(req);
}

export async function POST(req: Request) {
  return handleRequest(req);
}
