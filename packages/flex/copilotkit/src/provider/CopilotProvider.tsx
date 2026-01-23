'use client';

import React, { ReactNode } from 'react';
// v2 components from copilotkitnext for AG-UI protocol support
import { CopilotKitProvider, CopilotSidebar, useAgent } from '@copilotkitnext/react';
import type { FlexCopilotProviderConfig } from '../types';
import { mergeConfig } from './config';

export interface FlexCopilotProviderProps {
  children: ReactNode;
  config?: Partial<FlexCopilotProviderConfig>;
  /** Agent ID to connect to */
  agentId: string;
  /** Sidebar configuration */
  sidebarConfig?: {
    defaultOpen?: boolean;
    /** Custom header component for the sidebar (React node) */
    header?: React.ReactNode;
    /** Custom labels for the sidebar - uses v2 CopilotChatLabels keys */
    labels?: {
      /** Title displayed in modal header */
      modalHeaderTitle?: string;
      /** Placeholder text for the input field */
      chatInputPlaceholder?: string;
      /** Disclaimer text at bottom */
      chatDisclaimerText?: string;
      /** Other v2 label keys */
      [key: string]: string | undefined;
    };
  };
}

/**
 * Inner component that uses hooks within the CopilotKitProvider context.
 */
function FlexCopilotContent({
  children,
  agentId,
  sidebarConfig,
}: {
  children: ReactNode;
  agentId: string;
  sidebarConfig?: FlexCopilotProviderProps['sidebarConfig'];
}): React.ReactElement {
  // v2 useAgent for enhanced functionality
  const { agent } = useAgent({ agentId });

  // Log agent availability in development
  if (process.env.FLEX_MODE === 'development' && agent) {
    console.log('[FlexCopilotProvider] Agent connected:', agentId);
  }

  return (
    <>
      {children}
      {sidebarConfig && (
        <CopilotSidebar
          agentId={agentId}
          defaultOpen={sidebarConfig.defaultOpen ?? false}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          header={sidebarConfig.header as any}
          labels={sidebarConfig.labels}
        />
      )}
    </>
  );
}

/**
 * FlexCopilotProvider - Pre-configured CopilotKit v2 wrapper
 *
 * Provides CopilotKit v2 context with AG-UI protocol support for
 * connecting to remote agents like Python Strands agents.
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
 * import { FlexCopilotProvider } from '@flexiness/copilotkit';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <FlexCopilotProvider
 *       agentId="my_assistant"
 *       sidebarConfig={{
 *         defaultOpen: false,
 *         header: 'AI Assistant',
 *         labels: { chatInputPlaceholder: 'How can I help?' },
 *       }}
 *     >
 *       {children}
 *     </FlexCopilotProvider>
 *   );
 * }
 * ```
 *
 * @see https://docs.copilotkit.ai/whats-new/v1-50#v2-interfaces
 */
export function FlexCopilotProvider({
  children,
  config: userConfig,
  agentId,
  sidebarConfig,
}: FlexCopilotProviderProps): React.ReactElement {
  const config = mergeConfig(userConfig);

  return (
    <CopilotKitProvider
      runtimeUrl={config.runtimeUrl}
      showDevConsole={config.showDevConsole}
    >
      <FlexCopilotContent agentId={agentId} sidebarConfig={sidebarConfig}>
        {children}
      </FlexCopilotContent>
    </CopilotKitProvider>
  );
}

export default FlexCopilotProvider;
