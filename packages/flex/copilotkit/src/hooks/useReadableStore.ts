'use client';

import { useCopilotReadable } from '@copilotkit/react-core';
import { useState, useEffect, useCallback } from 'react';
import { reaction, toJS } from 'mobx';
import type { StoreReadableOptions } from '../types';

/**
 * useReadableStore - MobX store integration for CopilotKit
 *
 * Automatically syncs MobX store slices to CopilotKit,
 * making store data available to the AI assistant.
 * Reacts to MobX observable changes automatically.
 *
 * @example
 * ```tsx
 * const { UIStore } = useStores();
 * useReadableStore(UIStore, ['userAuth', 'amplifyAuthState', 'navigationState'], {
 *   description: 'UI and authentication state'
 * });
 * ```
 *
 * @example With custom selector
 * ```tsx
 * useReadableStore(UIStore, ['userAuth'], {
 *   description: 'Current user data',
 *   selector: (store) => ({
 *     isAuthenticated: !!store.userAuth,
 *     userId: store.userAuth?.sub,
 *   })
 * });
 * ```
 */
export function useReadableStore<T extends object>(
  store: T,
  slices: (keyof T)[],
  options: StoreReadableOptions<T> & { description: string }
): void {
  // Extract data from store slices
  const extractStoreData = useCallback(() => {
    if (options.selector) {
      // Use custom selector if provided
      return options.selector(store);
    }

    // Default: extract specified slices
    const data: Record<string, unknown> = {};
    for (const slice of slices) {
      if (slice in store) {
        // Use toJS to convert MobX observables to plain JS objects
        data[slice as string] = toJS(store[slice]);
      }
    }
    return data;
  }, [store, slices, options]);

  // State to hold the serialized value (triggers re-render on change)
  const [serializedValue, setSerializedValue] = useState<string>(() => {
    try {
      return JSON.stringify(extractStoreData(), null, 2);
    } catch {
      return 'Store data unavailable';
    }
  });

  // Set up MobX reaction to track changes to the specified slices
  useEffect(() => {
    // Create a reaction that watches the specified slices
    const dispose = reaction(
      // Data function: returns the data to track
      () => {
        const data: Record<string, unknown> = {};
        for (const slice of slices) {
          if (slice in store) {
            // Access each slice to register it as a dependency
            data[slice as string] = toJS(store[slice]);
          }
        }
        return data;
      },
      // Effect function: runs when data changes
      (newData) => {
        try {
          const processed = options.selector ? options.selector(store) : newData;
          setSerializedValue(JSON.stringify(processed, null, 2));
        } catch {
          setSerializedValue('Store data unavailable');
        }
      },
      // Options: fire immediately to set initial value
      { fireImmediately: true }
    );

    // Cleanup reaction on unmount
    return () => dispose();
  }, [store, slices, options, extractStoreData]);

  const categories = options?.categories ?? ['store', 'state', 'mobx'];

  useCopilotReadable({
    description: options.description,
    value: serializedValue,
    categories,
    ...(options?.parentId && { parentId: options.parentId }),
  });
}

export default useReadableStore;
