'use client';

import React from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { useCopilotStore } from '@src/hooks/useCopilotStore';

interface CopilotKitInnerProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

/**
 * Inner component that exposes MobX store to CopilotKit
 * Must be inside CopilotKit provider to use CopilotKit hooks
 */
function StoreContextBridge({ children }: { children: React.ReactNode }) {
  // Expose MobX UIStore data to CopilotKit
  useCopilotStore();
  return <>{children}</>;
}

/**
 * Inner CopilotKit component - only loaded when NEXT_PUBLIC_COPILOTKIT_ENABLED=true
 * This separation prevents graphql version conflicts when CopilotKit is disabled
 */
export default function CopilotKitInner({
  children,
  showSidebar = false
}: CopilotKitInnerProps) {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit/"
      showDevConsole={process.env.NODE_ENV === 'development'}
    >
      <StoreContextBridge>
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
      </StoreContextBridge>
    </CopilotKit>
  );
}
