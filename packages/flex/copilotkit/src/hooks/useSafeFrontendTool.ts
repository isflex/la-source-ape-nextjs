'use client';

import { useFrontendTool, type ReactFrontendTool } from '@copilotkitnext/react';

/**
 * Safe wrapper around useFrontendTool that only calls the hook when CopilotKit is enabled.
 *
 * Since NEXT_PUBLIC_COPILOTKIT_ENABLED is a build-time constant, conditionally
 * calling hooks based on it is safe (the value won't change between renders).
 *
 * Use this hook in pages/components that should work independently of CopilotKit.
 * When CopilotKit is disabled, the hook does nothing. When enabled, it behaves
 * like the normal useFrontendTool.
 *
 * @example
 * ```tsx
 * import { useSafeFrontendTool } from '@flexiness/copilotkit';
 * import { z } from 'zod';
 *
 * useSafeFrontendTool({
 *   name: 'my_action',
 *   description: 'Does something',
 *   parameters: z.object({ query: z.string() }),
 *   handler: async ({ query }) => { ... },
 * });
 * ```
 */
export function useSafeFrontendTool<T extends Record<string, unknown> = Record<string, unknown>>(
  tool: ReactFrontendTool<T>,
  deps?: ReadonlyArray<unknown>,
): void {
  const isEnabled = process.env.NEXT_PUBLIC_COPILOTKIT_ENABLED === 'true';

  if (isEnabled) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFrontendTool(tool, deps);
  }
}
