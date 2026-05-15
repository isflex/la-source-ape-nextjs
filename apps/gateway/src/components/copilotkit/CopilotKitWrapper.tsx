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
  useAgent,
  useCopilotChatConfiguration,
  type AuthUserContext,
} from '@flexiness/copilotkit';
import { toJS } from 'mobx';
import { RootStore } from '@src/stores/root-store';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { UserInterfaceStore } from '@flexiness/domain-store';
import { debug } from '@flexiness/domain-utils';
import {
  AuthRequiredWelcomeScreen,
  AuthenticatedWelcomeMessage,
} from './AuthRequiredWelcomeScreen';

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
    debug.errorBoundary('[CopilotKitErrorBoundary] CopilotKit failed to initialize:', error);
    debug.warn('[CopilotKitErrorBoundary] Falling back to rendering without CopilotKit');
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
 * sessionStorage envelope. Tagging with userId lets us drop a stored
 * thread that belongs to a different identity (or to no current session
 * at all) so a stale value from a prior dev session — or from a
 * different Cognito user signing in later in the same tab — can't make
 * CopilotKit treat us as a returning conversation.
 */
type StoredThread = { threadId: string; userId: string };

function readStoredThread(): StoredThread | null {
  if (typeof sessionStorage === 'undefined') return null;
  const raw = sessionStorage.getItem(THREAD_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      typeof (parsed as { threadId?: unknown }).threadId === 'string' &&
      typeof (parsed as { userId?: unknown }).userId === 'string'
    ) {
      return parsed as StoredThread;
    }
  } catch {
    // legacy plain-string format / corrupt JSON — fall through, caller treats as stale
  }
  return null;
}

/**
 * Restore (but never generate) a stable threadId from sessionStorage,
 * gated on the current Cognito identity.
 *
 * Generation is deferred to CopilotKit itself: when no threadId is passed,
 * its CopilotChatConfigurationProvider auto-generates one and keeps
 * `hasExplicitThreadId=false`, which is the condition that lets the
 * welcome-screen branch fire for fresh sessions. We capture that
 * auto-generated id and persist it after the user's first message, so a
 * later same-tab reload can resume by passing it back as an explicit
 * threadId (which triggers connect/resume).
 *
 * `currentUserId` is the source of truth for "whose thread is this" —
 * stored values that don't match (or any legacy plain-UUID format) are
 * cleared. Sign-out (currentUserId → null) also clears, so a different
 * user signing in next can't inherit the prior conversation.
 *
 * `isReady` distinguishes "still loading" (server / first client render)
 * from "loaded but empty" (fresh session) so the SSR/hydration gate stays
 * correct without coupling to whether a value was found.
 */
function useStableThreadId(currentUserId: string | null): {
  threadId: string | null;
  isReady: boolean;
} {
  const [state, setState] = useState<{ threadId: string | null; isReady: boolean }>({
    threadId: null,
    isReady: false,
  });
  useEffect(() => {
    const stored = readStoredThread();
    if (!currentUserId) {
      // Signed out / not yet signed in: drop any leftover.
      if (stored || sessionStorage.getItem(THREAD_STORAGE_KEY)) {
        sessionStorage.removeItem(THREAD_STORAGE_KEY);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ threadId: null, isReady: true });
      return;
    }
    if (stored && stored.userId === currentUserId) {
      setState({ threadId: stored.threadId, isReady: true });
      return;
    }
    // Wrong-user / malformed / legacy format → clear and start fresh.
    if (sessionStorage.getItem(THREAD_STORAGE_KEY)) {
      sessionStorage.removeItem(THREAD_STORAGE_KEY);
    }
    setState({ threadId: null, isReady: true });
  }, [currentUserId]);
  return state;
}

/**
 * Headless component placed inside FlexCopilotProvider that captures
 * CopilotKit's resolved threadId (auto-generated for fresh sessions) and
 * persists it to sessionStorage on the first user message — stamped with
 * the current Cognito userId so useStableThreadId can verify ownership
 * on a later reload. Subsequent same-tab reloads pick it up and pass it
 * back as an explicit threadId so the v2 runtime resumes the conversation.
 */
function ThreadIdPersistence({
  agentId,
  userId,
}: {
  agentId: string;
  userId: string | null;
}) {
  const config = useCopilotChatConfiguration();
  const { agent } = useAgent({ agentId });

  useEffect(() => {
    if (!config?.threadId || !agent || !userId) return;
    const subscription = agent.subscribe({
      onMessagesChanged: ({ messages }) => {
        if (messages.length > 0) {
          const envelope: StoredThread = { threadId: config.threadId, userId };
          sessionStorage.setItem(THREAD_STORAGE_KEY, JSON.stringify(envelope));
        }
      },
    });
    return () => subscription.unsubscribe();
  }, [agent, config?.threadId, userId]);

  return null;
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
  const { user, authStatus } = useAuthenticator((ctx) => [ctx.user, ctx.authStatus]);
  const currentUserId =
    authStatus === 'authenticated' ? user?.userId ?? null : null;
  const { threadId: storedThreadId, isReady } = useStableThreadId(currentUserId);
  const [disabledByError, setDisabledByError] = useState(false);

  const handleChildError = useCallback(() => {
    debug.error('[CopilotKitWrapper] Disabling CopilotKit due to child/window error');
    setDisabledByError(true);
  }, []);

  // Listen for window-level errors (async, event handlers) that React boundaries miss
  useWindowErrorDetection(handleChildError, isEnabled && !disabledByError);

  // Authenticated users get CopilotKit's default sidebar welcome layout
  // with our title/body swapped into the welcomeMessage subslot — the
  // default's `cpk:` classes own visibility/centering. Unauthenticated
  // users get the full-screen sign-in CTA in place of the default. Memo
  // keeps object identity stable so MemoizedSlotWrapper doesn't churn.
  const welcomeScreenSlot = useMemo(
    () =>
      authStatus === 'authenticated'
        ? { welcomeMessage: AuthenticatedWelcomeMessage }
        : AuthRequiredWelcomeScreen,
    [authStatus],
  );

  debug.copilotKit(`[CopilotKitWrapper] isEnabled: ${isEnabled}, disabledByError: ${disabledByError}, isReady: ${isReady}, authStatus: ${authStatus}`);

  // When CopilotKit is disabled or has been killed by a runtime error,
  // render children with no provider. When enabled, the provider is
  // mounted from SSR onward so that pages calling useSafe* hooks (which
  // gate on the same NEXT_PUBLIC_COPILOTKIT_ENABLED build-time flag)
  // always find a CopilotKitProvider in the tree.
  if (!isEnabled || disabledByError) {
    return children;
  }

  // SSR and the first client render both compute sidebarThreadId=undefined
  // and providerKey='fresh', so hydration agrees regardless of what is in
  // sessionStorage. After useStableThreadId's useEffect flips isReady, a
  // stored thread for the current authenticated user changes providerKey
  // and triggers a one-shot remount of the provider with an explicit
  // threadId — that's the resume path the v2 runtime already supports
  // through ThreadIdPersistence. When no stored thread exists,
  // providerKey stays 'fresh' and no remount happens.
  const sidebarThreadId =
    isReady && authStatus === 'authenticated' && storedThreadId
      ? storedThreadId
      : undefined;
  const providerKey = sidebarThreadId ? `thread-${sidebarThreadId}` : 'fresh';

  // Wrap CopilotKit in error boundary to prevent crashes when CopilotKit fails
  // If CopilotKit fails, children render without it
  // ChildrenErrorBoundary inside the provider catches child errors and
  // signals us to unmount the provider (stopping SDK polling)
  return (
    <CopilotKitErrorBoundary fallback={children}>
      <FlexCopilotProvider
        key={providerKey}
        agentId={AGENT_ID}
        sidebarConfig={{
          threadId: sidebarThreadId,
          defaultOpen: false,
          header: 'Assistant APE',
          labels: {
            modalHeaderTitle: 'Assistant APE',
            chatInputPlaceholder: 'Comment puis-je vous aider?',
          },
          welcomeScreen: welcomeScreenSlot,
        }}
      >
        <ThreadIdPersistence agentId={AGENT_ID} userId={currentUserId} />
        <CopilotKitContent>
          <ChildrenErrorBoundary onError={handleChildError}>
            {children}
          </ChildrenErrorBoundary>
        </CopilotKitContent>
      </FlexCopilotProvider>
    </CopilotKitErrorBoundary>
  );
}
