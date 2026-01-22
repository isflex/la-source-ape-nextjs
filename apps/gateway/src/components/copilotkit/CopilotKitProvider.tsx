'use client';

import React, { Component, type ReactNode } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/v2/index.css';
// import { useCopilotStore } from '@src/hooks/useCopilotStore';

interface CopilotKitProviderProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

interface FallbackBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface FallbackBoundaryState {
  hasError: boolean;
}

/**
 * Fallback error boundary for CopilotKit
 * Catches any errors that CopilotKit doesn't handle internally,
 * allowing the app to degrade gracefully when the CopilotKit runtime is unavailable.
 */
class CopilotKitFallbackBoundary extends Component<FallbackBoundaryProps, FallbackBoundaryState> {
  state: FallbackBoundaryState = { hasError: false };

  static getDerivedStateFromError(): FallbackBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.warn('[CopilotKit] Error caught, degrading gracefully:', error.message);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Inner component that exposes MobX store to CopilotKit
 * Must be inside CopilotKit provider to use CopilotKit hooks
 */
// function StoreContextBridge({ children }: { children: React.ReactNode }) {
//   // Expose MobX UIStore data to CopilotKit
//   useCopilotStore();
//   return <>{children}</>;
// }

/**
 * Client-side CopilotKit Provider wrapper
 * This component wraps the CopilotKit provider in a client component
 * so it can be used from server-side layouts.
 *
 * Automatically exposes:
 * - MobX UIStore (auth, navigation, modals, app context)
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
    <CopilotKitFallbackBoundary fallback={<>{children}</>}>
      <CopilotKit
        runtimeUrl="/api/copilotkit"
        agent="ape_assistant"
        showDevConsole={process.env.NODE_ENV === 'development'}
      >
        {/* <StoreContextBridge>
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
        </StoreContextBridge> */}

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

      </CopilotKit>
    </CopilotKitFallbackBoundary>
  );
}
