'use client';

import React, { ReactNode } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import type { FlexCopilotProviderConfig } from '../types';
import { mergeConfig } from './config';

// Import CopilotKit styles
import '@copilotkit/react-ui/styles.css';

export interface FlexCopilotProviderProps {
  children: ReactNode;
  config?: Partial<FlexCopilotProviderConfig>;
  /** System instructions for the AI assistant */
  instructions?: string;
  /** Whether to show the sidebar UI */
  showSidebar?: boolean;
  /** Custom className for the sidebar */
  sidebarClassName?: string;
}

/**
 * FlexCopilotProvider - Pre-configured CopilotKit wrapper
 *
 * Provides CopilotKit context to the application with sensible defaults
 * and optional sidebar UI.
 *
 * @example
 * ```tsx
 * // In your root layout
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <FlexCopilotProvider
 *           instructions="You are a helpful assistant for the La Source APE application."
 *           showSidebar={true}
 *         >
 *           {children}
 *         </FlexCopilotProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function FlexCopilotProvider({
  children,
  config: userConfig,
  instructions, // eslint-disable-line @typescript-eslint/no-unused-vars
  showSidebar = true,
  sidebarClassName,
}: FlexCopilotProviderProps): React.ReactElement {
  const config = mergeConfig(userConfig);

  const content = showSidebar ? (
    <CopilotSidebar
      defaultOpen={config.defaultOpen}
      clickOutsideToClose={config.clickOutsideToClose}
      className={sidebarClassName}
      labels={{
        title: config.chatLabel || 'AI Assistant',
        initial: 'How can I help you today?',
      }}
    >
      {children}
    </CopilotSidebar>
  ) : (
    children
  );

  return (
    <CopilotKit
      runtimeUrl={config.runtimeUrl}
      publicApiKey={config.publicApiKey}
      showDevConsole={config.showDevConsole}
    >
      {content}
    </CopilotKit>
  );
}

export default FlexCopilotProvider;
