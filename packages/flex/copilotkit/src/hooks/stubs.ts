/**
 * Stub implementations for CopilotKit hooks
 * Used when CopilotKit is disabled to avoid graphql version conflicts
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

// No-op hook that does nothing
 
export const useCopilotReadable: AnyFunction = (_options: unknown) => {
  // No-op when CopilotKit is disabled
};

 
export const useCopilotAction: AnyFunction = (_options: unknown) => {
  // No-op when CopilotKit is disabled
};

 
export const useCopilotChat: AnyFunction = (_options?: unknown) => {
  // Return minimal interface when CopilotKit is disabled
  return {
    visibleMessages: [],
    appendMessage: () => {},
    setMessages: () => {},
    deleteMessage: () => {},
    reloadMessages: () => {},
    stopGeneration: () => {},
    isLoading: false,
  };
};

 
export const useCopilotChatSuggestions: AnyFunction = (_options?: unknown) => {
  // No-op when CopilotKit is disabled
};
