'use client';

import { useHumanInTheLoop, type ReactHumanInTheLoop } from '@copilotkit/react-core/v2';

/**
 * Safe wrapper around useHumanInTheLoop that only calls the hook when CopilotKit is enabled.
 *
 * Unlike useFrontendTool, useHumanInTheLoop PAUSES agent execution until the user
 * responds via the `respond` callback. This is essential for interactive UI flows
 * where you need the agent to wait for user input before continuing.
 *
 * Key differences from useFrontendTool:
 * - NO handler function - the render function is the interaction point
 * - Agent PAUSES until respond() is called
 * - render receives { args, status, respond, result }
 *
 * @example
 * ```tsx
 * import { useSafeHumanInTheLoop } from '@flexiness/copilotkit';
 *
 * useSafeHumanInTheLoop({
 *   name: 'confirm_action',
 *   description: 'Ask user to confirm before proceeding',
 *   parameters: [
 *     { name: 'message', type: 'string', description: 'Message to display', required: true },
 *   ],
 *   render: ({ args, status, respond }) => {
 *     if (status === 'executing' && respond) {
 *       return (
 *         <div>
 *           <p>{args.message}</p>
 *           <button onClick={() => respond({ confirmed: true })}>Confirm</button>
 *           <button onClick={() => respond({ confirmed: false })}>Cancel</button>
 *         </div>
 *       );
 *     }
 *     return null;
 *   },
 * });
 * ```
 */
export function useSafeHumanInTheLoop<T extends Record<string, unknown> = Record<string, unknown>>(
  tool: ReactHumanInTheLoop<T>,
  deps?: ReadonlyArray<unknown>,
): void {
  const isEnabled = process.env.NEXT_PUBLIC_COPILOTKIT_ENABLED === 'true';

  if (isEnabled) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHumanInTheLoop(tool, deps);
  }
}
