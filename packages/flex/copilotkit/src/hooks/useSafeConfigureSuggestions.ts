'use client';

import { useConfigureSuggestions } from '@copilotkitnext/react';

/**
 * Safe wrapper around useConfigureSuggestions that only calls the hook when CopilotKit is enabled.
 *
 * Since NEXT_PUBLIC_COPILOTKIT_ENABLED is a build-time constant, conditionally
 * calling hooks based on it is safe (the value won't change between renders).
 *
 * Use this hook to register static or dynamic chat suggestions.
 * When CopilotKit is disabled, the hook does nothing. When enabled, it behaves
 * like the normal useConfigureSuggestions.
 *
 * @example
 * ```tsx
 * import { useSafeConfigureSuggestions } from '@flexiness/copilotkit';
 *
 * useSafeConfigureSuggestions({
 *   suggestions: [
 *     { title: 'Create event', message: 'I want to create an event' },
 *     { title: 'Find events', message: 'Show me matching events' },
 *   ],
 *   available: 'always',
 * });
 * ```
 */
export function useSafeConfigureSuggestions(
  ...args: Parameters<typeof useConfigureSuggestions>
): void {
  const isEnabled = process.env.NEXT_PUBLIC_COPILOTKIT_ENABLED === 'true';

  if (isEnabled) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useConfigureSuggestions(...args);
  }
}
