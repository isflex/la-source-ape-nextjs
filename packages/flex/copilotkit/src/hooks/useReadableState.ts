'use client';

import { useCopilotReadable } from '@copilotkit/react-core';
import { useMemo } from 'react';
import type { ReadableOptions } from '../types';

/**
 * useReadableState - Simplified wrapper for useCopilotReadable
 *
 * Automatically exposes React state to the CopilotKit AI assistant
 * with sensible defaults for description and categories.
 *
 * @example
 * ```tsx
 * const [events, setEvents] = useState([]);
 * useReadableState('events', events, {
 *   description: 'List of upcoming events',
 *   categories: ['events', 'dashboard']
 * });
 * ```
 */
export function useReadableState<T>(
  key: string,
  value: T,
  options?: ReadableOptions
): void {
  const serializedValue = useMemo(() => {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }, [value]);

  const description = options?.description ?? `Current ${key} state`;
  const categories = options?.categories ?? ['state'];

  useCopilotReadable({
    description,
    value: serializedValue,
    categories,
    ...(options?.parentId && { parentId: options.parentId }),
  });
}

export default useReadableState;
