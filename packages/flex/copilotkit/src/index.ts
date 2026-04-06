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
export { CopilotKitProvider, useAgent, useAgentContext, useFrontendTool } from '@copilotkitnext/react';
export { CopilotSidebar, CopilotPopup } from '@copilotkitnext/react';

// Human-in-the-Loop hook from @copilotkitnext/react
// Use for flows where agent should PAUSE until user responds
export { useHumanInTheLoop, type ReactHumanInTheLoop } from '@copilotkitnext/react';

// Suggestions hook from @copilotkitnext/react
// Use for registering static or dynamic chat suggestions
export { useConfigureSuggestions } from '@copilotkitnext/react';

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
  FlexCopilotSidebarConfig,
  MCPBridgeOptions,
  MCPToolResult,
} from './types/index.js';

// Provider (client-side) - v2 enhanced
export { FlexCopilotProvider, type FlexCopilotProviderProps } from './provider/index.js';

// Context Bridges (client-side) - v2 useAgentContext based
export {
  StoreContextBridge,
  AuthContextBridge,
  type StoreContextBridgeProps,
  type AuthContextBridgeProps,
  type AuthUserContext,
  type JsonValue,
} from './bridges/index.js';

// Hooks (client-side)
// Note: useAgentContext and useAgent are exported above from @copilotkitnext/react
// Safe wrappers that only call hooks when CopilotKit is enabled
export { useSafeAgentContext, useSafeAgent, useSafeFrontendTool, useSafeHumanInTheLoop, useSafeConfigureSuggestions } from './hooks/index.js';
// Legacy v1 hooks - DEPRECATED, kept for backwards compatibility
export {
  useReadableState,
  useReadableStore,
  useReadableUser,
  useReadableApi,
} from './hooks/index.js';

// Actions (client-safe)
export {
  createAction,
  createActions,
  param,
  ActionTemplates,
} from './actions/index.js';
