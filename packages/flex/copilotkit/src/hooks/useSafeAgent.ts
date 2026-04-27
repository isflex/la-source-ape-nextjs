'use client';

import { useAgent } from '@copilotkit/react-core/v2';

type UseAgentReturn = ReturnType<typeof useAgent>;

// No-op agent mock for when CopilotKit is disabled
const noopAgent: UseAgentReturn['agent'] = {
  subscribe: () => ({ unsubscribe: () => {} }),
  runAgent: () => Promise.resolve(),
  stop: () => {},
  // Add any other methods that might be called
} as unknown as UseAgentReturn['agent'];

const noopReturn: UseAgentReturn = {
  agent: noopAgent,
  status: 'idle' as const,
  threadId: null,
  runId: null,
  error: null,
  messages: [],
} as UseAgentReturn;

/**
 * Safe wrapper around useAgent that returns a no-op mock when CopilotKit is disabled.
 *
 * Since NEXT_PUBLIC_COPILOTKIT_ENABLED is a build-time constant, conditionally
 * calling hooks based on it is safe (the value won't change between renders).
 *
 * Use this hook in pages/components that should work independently of CopilotKit.
 * When CopilotKit is disabled, the hook returns a no-op agent.
 * When enabled, it behaves like the normal useAgent.
 *
 * @example
 * ```tsx
 * import { useSafeAgent } from '@flexiness/copilotkit';
 *
 * function MyComponent() {
 *   const { agent, status } = useSafeAgent();
 *
 *   useEffect(() => {
 *     const { unsubscribe } = agent.subscribe({
 *       onCustomEvent: ({ event }) => {
 *         console.log('Custom event:', event);
 *       },
 *     });
 *     return () => unsubscribe();
 *   }, [agent]);
 *
 *   return <div>Status: {status}</div>;
 * }
 * ```
 */
export function useSafeAgent(): UseAgentReturn {
  const isEnabled = process.env.NEXT_PUBLIC_COPILOTKIT_ENABLED === 'true';

  if (isEnabled) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAgent();
  }

  return noopReturn;
}
