/**
 * @flexiness/copilotkit
 *
 * CopilotKit integration package for Flexiness monorepo
 *
 * Provides React hooks and providers for integrating CopilotKit
 * AI capabilities into applications.
 *
 * IMPORTANT: This main entry point is CLIENT-SAFE and can be used in
 * React client components. For server-side runtime exports (BedrockAdapter,
 * CopilotRuntime, etc.), use the `/runtime` subpath instead:
 *
 * ```tsx
 * // Server-side API route
 * import { createCopilotRouteHandlers } from '@flexiness/copilotkit/runtime';
 * ```
 *
 * @example
 * ```tsx
 * // In your root layout
 * import { FlexCopilotProvider } from '@flexiness/copilotkit';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <FlexCopilotProvider>
 *       {children}
 *     </FlexCopilotProvider>
 *   );
 * }
 *
 * // In a component
 * import { useReadableState, useReadableUser } from '@flexiness/copilotkit';
 *
 * function Dashboard({ user }) {
 *   const [data, setData] = useState([]);
 *   useReadableUser(user);
 *   useReadableState('dashboardData', data);
 *   return <DashboardView data={data} />;
 * }
 * ```
 */

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

// Provider (client-side)
export { FlexCopilotProvider, type FlexCopilotProviderProps } from './provider';

// Hooks (client-side)
export {
  useReadableState,
  useReadableStore,
  useReadableUser,
  useReadableApi,
  // Re-exported from CopilotKit
  useCopilotReadable,
  useCopilotAction,
  useCopilotChat,
  useCopilotChatSuggestions,
} from './hooks';

// Actions (client-safe)
export {
  createAction,
  createActions,
  param,
  ActionTemplates,
} from './actions';

// NOTE: Runtime and MCP exports are NOT included in the main entry point
// to keep this bundle client-safe. Use subpath imports instead:
//
// Server-side runtime:
//   import { createCopilotRouteHandlers, BedrockAdapter } from '@flexiness/copilotkit/runtime';
//
// MCP (server-side):
//   import { MCPBridgeClient } from '@flexiness/copilotkit/mcp';
