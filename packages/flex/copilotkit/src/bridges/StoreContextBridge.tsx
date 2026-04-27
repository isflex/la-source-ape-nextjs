'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { useAgentContext } from '@copilotkit/react-core/v2';
import { reaction, toJS } from 'mobx';

/**
 * JSON-serializable value type (matches CopilotKit's JsonSerializable)
 */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Props for StoreContextBridge
 */
export interface StoreContextBridgeProps<T> {
  children: ReactNode;
  /** The MobX store to sync */
  store: T;
  /** Function to select which parts of the store to sync. Must return JSON-serializable values. */
  selector: (store: T) => Record<string, JsonValue>;
  /** Description for the agent context */
  description?: string;
}

/**
 * StoreContextBridge - Syncs MobX store state to the agent via useAgentContext
 *
 * Uses MobX reaction to detect store changes and update the agent context.
 * The agent can then access this context to understand the application state.
 *
 * @example
 * ```tsx
 * import { StoreContextBridge } from '@flexiness/copilotkit';
 *
 * function App({ children }) {
 *   const store = useStore();
 *   return (
 *     <StoreContextBridge
 *       store={store}
 *       selector={(s) => ({
 *         user: s.user,
 *         items: toJS(s.items),
 *       })}
 *     >
 *       {children}
 *     </StoreContextBridge>
 *   );
 * }
 * ```
 */
export function StoreContextBridge<T>({
  children,
  store,
  selector,
  description = 'Application state from MobX store',
}: StoreContextBridgeProps<T>): React.ReactElement {
  // Track store state for the context
  const [storeSnapshot, setStoreSnapshot] = useState<Record<string, JsonValue>>(() => {
    try {
      return toJS(selector(store)) as Record<string, JsonValue>;
    } catch {
      return {};
    }
  });

  // React to MobX store changes
  useEffect(() => {
    const disposer = reaction(
      () => {
        try {
          return selector(store);
        } catch {
          return {};
        }
      },
      (snapshot) => {
        setStoreSnapshot(toJS(snapshot) as Record<string, JsonValue>);
      },
      { fireImmediately: true }
    );

    return () => disposer();
  }, [store, selector]);

  // Expose store state to agent via v2 useAgentContext
  useAgentContext({
    description,
    value: storeSnapshot as { [key: string]: JsonValue },
  });

  return <>{children}</>;
}

export default StoreContextBridge;
