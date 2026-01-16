/**
 * Next.js Route Handler Utilities for CopilotKit
 *
 * Provides helpers for setting up CopilotKit API routes in Next.js App Router.
 */

import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  type CopilotServiceAdapter,
} from '@copilotkit/runtime';
import type { ActionDefinition } from '../types';

export interface RouteHandlerConfig {
  /** Custom service adapter (required for custom LLM providers) */
  serviceAdapter?: CopilotServiceAdapter;
  /** Actions to register with the runtime */
  actions?: ActionDefinition[];
  /** System instructions for the AI */
  instructions?: string;
  /** API endpoint path */
  endpoint?: string;
}

/**
 * Create CopilotKit route handlers for Next.js App Router
 *
 * @example
 * ```typescript
 * // app/api/copilotkit/route.ts
 * import { createCopilotRouteHandlers } from '@flexiness/copilotkit/runtime';
 * import { BedrockAdapter } from '@flexiness/copilotkit/runtime';
 *
 * const adapter = new BedrockAdapter({
 *   model: 'anthropic.claude-3-haiku-20240307-v1:0',
 *   region: 'us-east-1',
 * });
 *
 * export const { GET, POST } = createCopilotRouteHandlers({
 *   serviceAdapter: adapter,
 *   instructions: 'You are a helpful assistant.',
 *   actions: [],
 * });
 *
 * export const runtime = 'nodejs';
 * ```
 */
export function createCopilotRouteHandlers(config: RouteHandlerConfig = {}) {
  const {
    serviceAdapter,
    actions = [],
    endpoint = '/api/copilotkit',
  } = config;

  // Create runtime with actions (cast to any for CopilotKit compatibility)
   
  const copilotRuntime = new CopilotRuntime({
    actions: actions.length > 0
      ? () => actions.map((action) => ({
          name: action.name,
          description: action.description,
          parameters: action.parameters.map((param) => ({
            name: param.name,
            type: param.type as 'string' | 'number' | 'boolean' | 'object',
            description: param.description ?? '',
            required: param.required ?? false,
          })),
          handler: action.handler,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })) as any
      : undefined,
  });

  // Create and return the route handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlerConfig: any = {
    runtime: copilotRuntime,
    endpoint,
  };

  // Only add serviceAdapter if provided
  if (serviceAdapter) {
    handlerConfig.serviceAdapter = serviceAdapter;
  }

  return copilotRuntimeNextJSAppRouterEndpoint(handlerConfig);
}

/**
 * Export runtime constant for Next.js
 * Use this in your route.ts file
 */
export const NEXTJS_RUNTIME = 'nodejs';
