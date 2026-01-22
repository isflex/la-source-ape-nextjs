'use client';

import React, { useMemo } from 'react';
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

// Agent configuration - must match the agent ID in route.ts
const AGENT_ID = 'ape_assistant';

interface CopilotKitWrapperProps {
  children: React.ReactNode;
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

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
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
  );
}
