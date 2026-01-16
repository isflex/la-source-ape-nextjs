/**
 * @flexiness/copilotkit
 *
 * CopilotKit integration package for Flexiness monorepo
 *
 * Provides React hooks and providers for integrating CopilotKit
 * AI capabilities into applications.
 *
 * Note: For LLM adapters, use CopilotKit's built-in adapters from
 * @copilotkit/runtime (e.g., BedrockAdapter, OpenAIAdapter).
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

// Types
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

// Provider
export { FlexCopilotProvider, type FlexCopilotProviderProps } from './provider';

// Hooks
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

// Actions
export {
  createAction,
  createActions,
  param,
  ActionTemplates,
} from './actions';

// Runtime (server-side)
export {
  BedrockAdapter,
  createCopilotRouteHandlers,
  NEXTJS_RUNTIME,
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  type RouteHandlerConfig,
} from './runtime';

// MCP
export {
  MCPBridgeClient,
  createMCPBridgeClientFromEnv,
  createMCPBridgeActions,
} from './mcp';
