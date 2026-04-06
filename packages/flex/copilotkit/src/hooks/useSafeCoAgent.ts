'use client';

import { useCoAgent } from '@copilotkit/react-core';

// Match the exact types from @copilotkit/react-core
type UseCoAgentOptions<T> = {
  name: string;
  initialState?: T;
};

// Use ReturnType to get the exact return type from useCoAgent
type UseCoAgentReturnType<T> = ReturnType<typeof useCoAgent<T>>;

// No-op return for when CopilotKit is disabled
const createNoopReturn = <T>(name: string, initialState?: T): UseCoAgentReturnType<T> =>
  ({
    name,
    state: initialState,
    setState: () => {},
    run: () => Promise.resolve(),
    start: () => Promise.resolve(),
    stop: () => {},
    status: 'idle',
    running: false,
    threadId: undefined,
    nodeName: undefined,
  }) as UseCoAgentReturnType<T>;

/**
 * Safe wrapper around useCoAgent that returns a no-op mock when CopilotKit is disabled.
 *
 * Since NEXT_PUBLIC_COPILOTKIT_ENABLED is a build-time constant, conditionally
 * calling hooks based on it is safe (the value won't change between renders).
 *
 * Use this hook to share state between the frontend and your agent.
 * The agent can read the state from input_data.state in its context builder.
 *
 * @example
 * ```tsx
 * import { useSafeCoAgent } from '@flexiness/copilotkit';
 *
 * interface AgentState {
 *   eventCreationStage: number;
 *   eventData: { name?: string; };
 * }
 *
 * function MyComponent() {
 *   const { state, setState } = useSafeCoAgent<AgentState>({
 *     name: 'onboard_assistant',
 *     initialState: { eventCreationStage: 0, eventData: {} },
 *   });
 *
 *   const nextStage = () => {
 *     setState({ ...state, eventCreationStage: (state?.eventCreationStage ?? 0) + 1 });
 *   };
 *
 *   return <button onClick={nextStage}>Next Stage</button>;
 * }
 * ```
 */
export function useSafeCoAgent<T extends object>(
  options: UseCoAgentOptions<T>,
): UseCoAgentReturnType<T> {
  const isEnabled = process.env.NEXT_PUBLIC_COPILOTKIT_ENABLED === 'true';

  if (isEnabled) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCoAgent<T>(options);
  }

  return createNoopReturn(options.name, options.initialState);
}
