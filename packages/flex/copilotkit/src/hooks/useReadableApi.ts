'use client';

import { useCopilotReadable } from '@copilotkit/react-core';
import { useMemo } from 'react';
import type { ApiReadableOptions } from '../types';

/**
 * useReadableApi - Expose API response data to CopilotKit
 *
 * Makes fetched data from APIs available to the AI assistant.
 * Useful for making backend data accessible for context-aware responses.
 *
 * @example
 * ```tsx
 * const { data: events } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
 * useReadableApi('events', events, {
 *   description: 'Events fetched from backend API',
 *   endpoint: '/api/events'
 * });
 * ```
 */
export function useReadableApi<T>(
  key: string,
  data: T | null | undefined,
  options?: ApiReadableOptions
): void {
  const serializedData = useMemo(() => {
    if (data === null || data === undefined) {
      return `No data available for ${key}`;
    }
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }, [data, key]);

  const description = options?.description ?? `API response data: ${key}`;
  const categories = options?.categories ?? ['api', 'data'];

  // Add endpoint info to description if provided
  const fullDescription = options?.endpoint
    ? `${description} (from ${options.method ?? 'GET'} ${options.endpoint})`
    : description;

  useCopilotReadable({
    description: fullDescription,
    value: serializedData,
    categories,
    ...(options?.parentId && { parentId: options.parentId }),
  });
}

export default useReadableApi;
