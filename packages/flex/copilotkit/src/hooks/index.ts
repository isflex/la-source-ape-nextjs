/**
 * @flexiness/copilotkit/hooks
 *
 * React hooks for CopilotKit v2 integration
 *
 * NOTE: v1 hooks (useCopilotReadable, etc.) have been removed.
 * Use useAgentContext from '@copilotkitnext/react' or the context bridges
 * (StoreContextBridge, AuthContextBridge) instead.
 */

// Re-export v2 hooks from @copilotkitnext/react
export { useAgentContext, useAgent } from '@copilotkitnext/react';

// Safe wrapper that only calls useAgentContext when CopilotKit is enabled
export { useSafeAgentContext } from './useSafeAgentContext';

// Safe wrapper that only calls useFrontendTool when CopilotKit is enabled
export { useSafeFrontendTool } from './useSafeFrontendTool';

// Legacy v1 hooks - DEPRECATED, use context bridges or useAgentContext instead
// Keeping exports for backwards compatibility but they require v1 provider
export { useReadableState } from './useReadableState';
export { useReadableStore } from './useReadableStore';
export { useReadableUser } from './useReadableUser';
export { useReadableApi } from './useReadableApi';
