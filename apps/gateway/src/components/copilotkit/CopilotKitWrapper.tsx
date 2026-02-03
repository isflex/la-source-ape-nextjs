'use client';

import React, { useMemo, Component, type ErrorInfo } from 'react';
import {
  FlexCopilotProvider,
  StoreContextBridge,
  AuthContextBridge,
  CopilotKitProvider, // Fallback provider for error recovery
  type AuthUserContext,
} from '@flexiness/copilotkit';
import { toJS } from 'mobx';
import { RootStore } from '@src/stores/root-store';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { UserInterfaceStore } from '@flexiness/domain-store';
import { debug } from '@flexiness/domain-utils';

// Agent configuration - centralized via environment variable
// Must match: route.ts AGENT_ID, Python agent name
const AGENT_ID = process.env.NEXT_PUBLIC_COPILOTKIT_AGENT_ID || 'ape_assistant';

interface CopilotKitWrapperProps {
  children: React.ReactNode;
}

interface CopilotKitErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface CopilotKitErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary that catches CopilotKit initialization errors
 * and gracefully falls back to rendering children without CopilotKit
 */
class CopilotKitErrorBoundary extends Component<CopilotKitErrorBoundaryProps, CopilotKitErrorBoundaryState> {
  constructor(props: CopilotKitErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): CopilotKitErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const isCopilotKitError = error.message?.includes('CopilotKit') || error.message?.includes('useCopilotKit');

    debug.error('[CopilotKitErrorBoundary] Caught error:', {
      name: error.name,
      message: error.message,
      isCopilotKitError,
      componentStack: errorInfo.componentStack,
    });

    // Log to console for production debugging
    console.error('[CopilotKitErrorBoundary] CopilotKit failed to initialize:', error);
    console.warn('[CopilotKitErrorBoundary] Falling back to rendering without CopilotKit');
  }

  render() {
    if (this.state.hasError) {
      // Render children with a minimal CopilotKitProvider to prevent hook errors
      // This provider won't have working agent functionality but will prevent crashes
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/**
 * Fallback provider that wraps children with minimal CopilotKitProvider
 * to prevent useAgentContext and other hooks from throwing errors.
 * The agent won't work, but the app will render correctly.
 */
function CopilotKitFallbackProvider({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKitProvider
      runtimeUrl="/api/copilotkit" // Won't be called
      showDevConsole={false}
    >
      {children}
    </CopilotKitProvider>
  );
}

/**
 * Store selector for StoreContextBridge
 * Extracts relevant state from UIStore for the agent
 * All values must be JSON-serializable (no undefined)
 */
const storeSelector = (store: { UIStore: UserInterfaceStore }) => ({
  auth: {
    isAuthenticated: store.UIStore.amplifyAuthState ?? false,
    userId: store.UIStore.userSub ?? null,
    hasUserData: !!store.UIStore.userAuth,
  },
  ui: {
    navigationState: toJS(store.UIStore.navigationState) ?? null,
    isLoading: store.UIStore.initLoading ?? false,
    hasError: store.UIStore.errorStatus ?? false,
  },
  app: {
    theme: store.UIStore.appContext?.theme?.palette?.mode ?? 'light',
    language: store.UIStore.appContext?.language ?? 'fr',
  },
});

/**
 * Inner component that sets up context bridges within the provider
 */
function CopilotKitContent({ children }: { children: React.ReactNode }) {
  const { user, authStatus } = useAuthenticator((ctx) => [ctx.user, ctx.authStatus]);

  // Map Amplify user to AuthUserContext
  const userContext: AuthUserContext | null = useMemo(() => {
    if (user && authStatus === 'authenticated') {
      return {
        id: user.userId,
        email: user.signInDetails?.loginId || null,
        username: user.username,
        authStatus,
      };
    }
    return null;
  }, [user, authStatus]);

  return (
    <AuthContextBridge
      user={userContext}
      description="Current authenticated user from AWS Cognito"
    >
      <StoreContextBridge
        store={RootStore}
        selector={storeSelector}
        description="Application state from MobX store"
      >
        {children}
      </StoreContextBridge>
    </AuthContextBridge>
  );
}

/**
 * CopilotKit wrapper component using v2 AG-UI protocol
 *
 * Uses @flexiness/copilotkit for:
 * - FlexCopilotProvider: v2 runtime with AG-UI protocol
 * - StoreContextBridge: syncs MobX state to agent
 * - AuthContextBridge: exposes authenticated user to agent
 *
 * @see https://docs.copilotkit.ai/whats-new/v1-50#v2-interfaces
 */
export default function CopilotKitWrapper({ children }: CopilotKitWrapperProps) {
  const isEnabled = process.env.NEXT_PUBLIC_COPILOTKIT_ENABLED === 'true';
  console.log(`[CopilotKitWrapper] isEnabled: ${isEnabled}`);

  if (!isEnabled) {
    return <>{children}</>;
  }

  // Wrap CopilotKit in error boundary to prevent crashes when CopilotKit fails
  // If CopilotKit fails, children will render with a fallback provider
  // that prevents useAgentContext from throwing errors
  return (
    <CopilotKitErrorBoundary
      fallback={<CopilotKitFallbackProvider>{children}</CopilotKitFallbackProvider>}
    >
      <FlexCopilotProvider
        agentId={AGENT_ID}
        sidebarConfig={{
          defaultOpen: false,
          header: 'Assistant APE',
          labels: {
            modalHeaderTitle: 'Assistant APE',
            chatInputPlaceholder: 'Comment puis-je vous aider?',
          },
        }}
      >
        <CopilotKitContent>{children}</CopilotKitContent>
      </FlexCopilotProvider>
    </CopilotKitErrorBoundary>
  );
}
