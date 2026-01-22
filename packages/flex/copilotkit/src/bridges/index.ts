/**
 * @flexiness/copilotkit/bridges
 *
 * Context bridges for syncing application state with CopilotKit v2 agents.
 * These bridges use useAgentContext to expose state to agents.
 */

export { StoreContextBridge, type StoreContextBridgeProps } from './StoreContextBridge';
export { AuthContextBridge, type AuthContextBridgeProps, type AuthUserContext } from './AuthContextBridge';

// Re-export JsonValue type for selector typing
export type { JsonValue } from './StoreContextBridge';
