/**
 * @flexiness/copilotkit/runtime
 *
 * Server-side runtime utilities for CopilotKit.
 *
 * Note: Use CopilotKit's built-in BedrockAdapter from @copilotkit/runtime
 * for LLM integration instead of custom adapters.
 */

export {
  createCopilotRouteHandlers,
  NEXTJS_RUNTIME,
  type RouteHandlerConfig,
} from './route-handler';

// Re-export useful CopilotKit runtime utilities
export {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  BedrockAdapter,
} from '@copilotkit/runtime';
