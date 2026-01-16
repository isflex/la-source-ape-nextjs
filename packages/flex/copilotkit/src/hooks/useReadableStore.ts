'use client';

import { useCopilotReadable } from '@copilotkit/react-core';
import { useMemo } from 'react';
import type { StoreReadableOptions } from '../types';

/**
 * useReadableStore - MobX store integration for CopilotKit
 *
 * Automatically syncs MobX store slices to CopilotKit,
 * making store data available to the AI assistant.
 *
 * @example
 * ```tsx
 * const { userStore } = useStores();
 * useReadableStore(userStore, ['currentUser', 'isAuthenticated'], {
 *   description: 'User authentication state'
 * });
 * ```
 */
export function useReadableStore<T extends object>(
  store: T,
  slices: (keyof T)[],
  options: StoreReadableOptions & { description: string }
): void {
  const storeData = useMemo(() => {
    const data: Partial<T> = {};
    for (const slice of slices) {
      if (slice in store) {
        data[slice] = store[slice];
      }
    }
    return data;
  }, [store, slices]);

  const serializedValue = useMemo(() => {
    try {
      return JSON.stringify(storeData, null, 2);
    } catch {
      return String(storeData);
    }
  }, [storeData]);

  const categories = options?.categories ?? ['store', 'state'];

  useCopilotReadable({
    description: options.description,
    value: serializedValue,
    categories,
    ...(options?.parentId && { parentId: options.parentId }),
  });
}

export default useReadableStore;
