/**
 * @flexiness/copilotkit
 *
 * CopilotKit v2 integration package for Flexiness monorepo
 *
 * Provides React hooks, providers, and context bridges for integrating
 * CopilotKit v2 AI capabilities with AG-UI protocol support.
 *
 * Features:
 * - Shared state between React and agent (bidirectional)
 * - Time travel (state history and rollback)
 * - Multi-agent execution
 * - Threads and persistence
 *
 * @example
 * ```tsx
 * // In your root layout
 * import { FlexCopilotProvider, StoreContextBridge, AuthContextBridge } from '@flexiness/copilotkit';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <FlexCopilotProvider
 *       agentId="my_assistant"
 *       sidebarConfig={{
 *         defaultOpen: false,
 *         header: 'AI Assistant',
 *       }}
 *     >
 *       <AuthContextBridge user={user}>
 *         <StoreContextBridge store={store} selector={(s) => ({ data: s.data })}>
 *           {children}
 *         </StoreContextBridge>
 *       </AuthContextBridge>
 *     </FlexCopilotProvider>
 *   );
 * }
 * ```
 *
 * @see https://docs.copilotkit.ai/whats-new/v1-50#v2-interfaces
 */

// v2 Re-exports from copilotkitnext
export { CopilotKitProvider, useAgent, useAgentContext } from '@copilotkitnext/react';
export { CopilotSidebar, CopilotPopup } from '@copilotkitnext/react';

// Types (client-safe)
export type {
  ReadableOptions,
  StoreReadableOptions,
  UserContext,
  ApiReadableOptions,
  ActionParameter,
  ActionDefinition,
  ActionRenderProps,
  FlexCopilotProviderConfig,
  MCPBridgeOptions,
  MCPToolResult,
} from './types';

// Provider (client-side) - v2 enhanced
export { FlexCopilotProvider, type FlexCopilotProviderProps } from './provider';

// Context Bridges (client-side) - v2 useAgentContext based
export {
  StoreContextBridge,
  AuthContextBridge,
  type StoreContextBridgeProps,
  type AuthContextBridgeProps,
  type AuthUserContext,
  type JsonValue,
} from './bridges';

// Hooks (client-side)
// Note: useAgentContext and useAgent are exported above from @copilotkitnext/react
// Legacy v1 hooks - DEPRECATED, kept for backwards compatibility
export {
  useReadableState,
  useReadableStore,
  useReadableUser,
  useReadableApi,
} from './hooks';

// Actions (client-safe)
export {
  createAction,
  createActions,
  param,
  ActionTemplates,
} from './actions';
