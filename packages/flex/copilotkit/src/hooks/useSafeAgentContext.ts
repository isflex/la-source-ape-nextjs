'use client';

import { useAgentContext } from '@copilotkitnext/react';

type AgentContextParams = Parameters<typeof useAgentContext>[0];

/**
 * Safe wrapper around useAgentContext that only calls the hook when CopilotKit is enabled.
 *
 * Since NEXT_PUBLIC_COPILOTKIT_ENABLED is a build-time constant, conditionally
 * calling hooks based on it is safe (the value won't change between renders).
 *
 * Use this hook in pages/components that should work independently of CopilotKit.
 * When CopilotKit is disabled, the hook does nothing. When enabled, it behaves
 * like the normal useAgentContext.
 *
 * @example
 * ```tsx
 * import { useSafeAgentContext } from '@flexiness/copilotkit';
 *
 * useSafeAgentContext({
 *   description: 'Page context',
 *   value: { page: 'my-page', data: someData }
 * });
 * ```
 */
export function useSafeAgentContext(params: AgentContextParams): void {
  const isEnabled = process.env.NEXT_PUBLIC_COPILOTKIT_ENABLED === 'true';

  if (isEnabled) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAgentContext(params);
  }
}
