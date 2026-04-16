'use client';

// @a2ui/web_core (via @copilotkit/a2ui-renderer) registers custom elements globally.
// During HMR, modules re-execute and `customElements.define()` is called again for
// elements that are already registered, flooding the console with warnings.
// This patch makes duplicate registrations a silent no-op in dev only.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const origDefine = customElements.define.bind(customElements);
  customElements.define = function (name: string, ...args: Parameters<typeof origDefine> extends [string, ...infer R] ? R : never) {
    if (customElements.get(name)) return;
    origDefine(name, ...args);
  } as typeof customElements.define;
}

import React, { useCallback, useEffect, useMemo, useRef, useState, Component, type ErrorInfo } from 'react';
import {
  FlexCopilotProvider,
  StoreContextBridge,
  AuthContextBridge,
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
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/**
 * Inner error boundary that wraps children INSIDE the CopilotKit provider.
 * When children throw (e.g. a component missing an import), this boundary:
 * 1. Renders the children fallback immediately
 * 2. Signals the parent to unmount the entire CopilotKit provider tree,
 *    which stops all SDK polling (GET /info, etc.)
 */
interface ChildrenErrorBoundaryProps {
  children: React.ReactNode;
  onError: () => void;
}

interface ChildrenErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ChildrenErrorBoundary extends Component<ChildrenErrorBoundaryProps, ChildrenErrorBoundaryState> {
  constructor(props: ChildrenErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ChildrenErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    debug.error('[ChildrenErrorBoundary] Child component error — disabling CopilotKit polling:', {
      name: error.name,
      message: error.message,
      componentStack: errorInfo.componentStack,
    });
    // Signal parent to unmount the CopilotKit provider
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      // Re-throw to let Next.js error overlay handle display.
      // The parent CopilotKitWrapper will re-render without the provider
      // once onError fires, so this tree is short-lived.
      throw this.state.error;
    }
    return this.props.children;
  }
}

/**
 * Detect unhandled window errors (covers async errors, event handlers, etc.)
 * that React error boundaries don't catch. In dev mode these often indicate
 * a broken page where CopilotKit polling should stop.
 */
function useWindowErrorDetection(onError: () => void, enabled: boolean) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handler = (event: ErrorEvent) => {
      if (firedRef.current) return;
      firedRef.current = true;
      debug.error('[CopilotKitWrapper] Window error detected — disabling CopilotKit:', event.message);
      onError();
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      if (firedRef.current) return;
      firedRef.current = true;
      debug.error('[CopilotKitWrapper] Unhandled rejection detected — disabling CopilotKit:', event.reason);
      onError();
    };

    window.addEventListener('error', handler);
    window.addEventListener('unhandledrejection', rejectionHandler);
    return () => {
      window.removeEventListener('error', handler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, [onError, enabled]);
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

const THREAD_STORAGE_KEY = 'copilotkit_thread_id';

/**
 * Generate or restore a stable threadId from sessionStorage.
 * Survives same-tab navigations (e.g. Google auth redirect) but
 * resets on new tab / browser close (sessionStorage is tab-scoped).
 */
function useStableThreadId(): string {
  const [threadId] = useState(() => {
    if (typeof window === 'undefined') return '';
    const stored = sessionStorage.getItem(THREAD_STORAGE_KEY);
    if (stored) return stored;
    const newId = crypto.randomUUID();
    sessionStorage.setItem(THREAD_STORAGE_KEY, newId);
    return newId;
  });
  return threadId;
}

/**
 * CopilotKit wrapper component using v2 AG-UI protocol
 *
 * Uses @flexiness/copilotkit for:
 * - FlexCopilotProvider: v2 runtime with AG-UI protocol
 * - StoreContextBridge: syncs MobX state to agent
 * - AuthContextBridge: exposes authenticated user to agent
 *
 * When NEXT_PUBLIC_COPILOTKIT_ENABLED is false or CopilotKit fails to initialize,
 * children are rendered without CopilotKit. Pages should use useSafeAgentContext
 * from @flexiness/copilotkit to conditionally call useAgentContext.
 *
 * @see https://docs.copilotkit.ai/whats-new/v1-50#v2-interfaces
 */
export default function CopilotKitWrapper({ children }: CopilotKitWrapperProps) {
  const isEnabled = process.env.NEXT_PUBLIC_COPILOTKIT_ENABLED === 'true';
  const threadId = useStableThreadId();
  const [disabledByError, setDisabledByError] = useState(false);

  const handleChildError = useCallback(() => {
    debug.error('[CopilotKitWrapper] Disabling CopilotKit due to child/window error');
    setDisabledByError(true);
  }, []);

  // Listen for window-level errors (async, event handlers) that React boundaries miss
  useWindowErrorDetection(handleChildError, isEnabled && !disabledByError);

  console.log(`[CopilotKitWrapper] isEnabled: ${isEnabled}, disabledByError: ${disabledByError}`);

  if (!isEnabled || disabledByError) {
    // CopilotKit disabled or killed by error - render children without CopilotKit
    // Pages using useSafeAgentContext will no-op based on the same env var
    return <>{children}</>;
  }

  // Wrap CopilotKit in error boundary to prevent crashes when CopilotKit fails
  // If CopilotKit fails, children render without it
  // ChildrenErrorBoundary inside the provider catches child errors and
  // signals us to unmount the provider (stopping SDK polling)
  return (
    <CopilotKitErrorBoundary fallback={<>{children}</>}>
      <FlexCopilotProvider
        agentId={AGENT_ID}
        sidebarConfig={{
          threadId,
          defaultOpen: false,
          header: 'Assistant APE',
          labels: {
            modalHeaderTitle: 'Assistant APE',
            chatInputPlaceholder: 'Comment puis-je vous aider?',
          },
        }}
      >
        <CopilotKitContent>
          <ChildrenErrorBoundary onError={handleChildError}>
            {children}
          </ChildrenErrorBoundary>
        </CopilotKitContent>
      </FlexCopilotProvider>
    </CopilotKitErrorBoundary>
  );
}
