'use client';

import { useAgent } from '@copilotkit/react-core/v2';
import type { Message } from '@ag-ui/core';
import { v4 as uuidv4 } from 'uuid';

// Minimal message input for appendMessage
interface AppendMessageInput {
  id?: string;
  role: 'user';
  content: string;
}

// Return type for useSafeCopilotChat
interface UseSafeCopilotChatReturn {
  /**
   * Add a message to the chat and trigger the agent to respond.
   * This is the primary way to programmatically send messages.
   */
  appendMessage: (message: AppendMessageInput) => Promise<void>;
  /**
   * Whether the agent is currently processing a request.
   */
  isLoading: boolean;
}

// No-op return for when CopilotKit is disabled
const createNoopReturn = (): UseSafeCopilotChatReturn => ({
  appendMessage: async () => {},
  isLoading: false,
});

/**
 * Safe wrapper around useAgent that provides a simple appendMessage interface.
 *
 * Use this hook to programmatically send messages to the agent.
 * Unlike runAgent from useCoAgent (which is broken), this actually works.
 *
 * @example
 * ```tsx
 * import { useSafeCopilotChat } from '@flexiness/copilotkit';
 *
 * function MyComponent() {
 *   const { appendMessage } = useSafeCopilotChat();
 *
 *   const sendMessage = async () => {
 *     await appendMessage({
 *       role: 'user',
 *       content: 'Continue the task'
 *     });
 *   };
 *
 *   return <button onClick={sendMessage}>Continue</button>;
 * }
 * ```
 */
export function useSafeCopilotChat(agentId?: string): UseSafeCopilotChatReturn {
  const isEnabled = process.env.NEXT_PUBLIC_COPILOTKIT_ENABLED === 'true';

  if (isEnabled) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { agent } = useAgent({ agentId });

    const appendMessage = async (input: AppendMessageInput): Promise<void> => {
      const message: Message = {
        id: input.id || uuidv4(),
        role: 'user',
        content: input.content,
      };

      // Add message to agent's message history
      agent.addMessage(message);

      // Run the agent to process the new message
      await agent.runAgent();
    };

    return {
      appendMessage,
      isLoading: agent.isRunning,
    };
  }

  return createNoopReturn();
}
