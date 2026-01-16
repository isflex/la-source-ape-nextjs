'use client';

import React from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

interface CopilotKitProviderProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

/**
 * Client-side CopilotKit Provider wrapper
 * This component wraps the CopilotKit provider in a client component
 * so it can be used from server-side layouts
 */
export default function CopilotKitProvider({
  children,
  showSidebar = false
}: CopilotKitProviderProps) {
  // Check if CopilotKit is enabled via environment variable
  const isEnabled = process.env.NEXT_PUBLIC_COPILOTKIT_ENABLED === 'true';

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit/"
      showDevConsole={process.env.NODE_ENV === 'development'}
    >
      {showSidebar ? (
        <CopilotSidebar
          defaultOpen={false}
          labels={{
            title: 'Assistant APE',
            initial: 'Bonjour! Je suis votre assistant. Comment puis-je vous aider?',
          }}
          instructions="Tu es un assistant pour le site La Source APE. Tu aides les utilisateurs à naviguer sur le site, créer des newsletters, gérer des cagnottes, et comprendre les fonctionnalités disponibles. Réponds toujours en français."
        >
          {children}
        </CopilotSidebar>
      ) : (
        children
      )}
    </CopilotKit>
  );
}
