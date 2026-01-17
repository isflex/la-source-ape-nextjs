'use client';

import { useStores } from '@src/stores';
import { useReadableStore } from '@flexiness/copilotkit';
import type { UserInterfaceStore } from '@flexiness/domain-store';

// Type helper for store selector - works around TSup bundling dropping generics
type StoreSelector<T> = (store: T) => unknown;

/**
 * useCopilotStore - Expose MobX UIStore to CopilotKit AI assistant
 *
 * This hook integrates the application's MobX store with CopilotKit,
 * allowing the AI assistant to understand the current UI state,
 * authentication status, and navigation context.
 *
 * @example
 * ```tsx
 * // In a layout or page component
 * function MyPage() {
 *   useCopilotStore();
 *   return <div>...</div>;
 * }
 * ```
 */
export function useCopilotStore(): void {
  const { UIStore } = useStores();

  // Expose authentication and user state
  useReadableStore(
    UIStore,
    ['userAuth', 'userSub', 'amplifyAuthState', 'triggerAuthentication'],
    {
      description: 'User authentication state from MobX store',
      categories: ['store', 'auth', 'user'],
      selector: ((store: UserInterfaceStore) => ({
        isAuthenticated: store.amplifyAuthState,
        userId: store.userSub,
        hasUserData: !!store.userAuth,
        authTriggered: store.triggerAuthentication,
      })) as StoreSelector<unknown>,
    }
  );

  // Expose UI state (modals, loading, navigation)
  useReadableStore(
    UIStore,
    [
      'navigationState',
      'initLoading',
      'errorStatus',
      'modalCreateOnBoardEventOpen',
      'modalSignUserAgreementOpen',
    ],
    {
      description: 'UI state including navigation, loading, and modal states',
      categories: ['store', 'ui', 'navigation'],
      selector: ((store: UserInterfaceStore) => ({
        navigationState: store.navigationState,
        isLoading: store.initLoading,
        hasError: store.errorStatus,
        openModals: {
          createEvent: store.modalCreateOnBoardEventOpen,
          userAgreement: store.modalSignUserAgreementOpen,
        },
      })) as StoreSelector<unknown>,
    }
  );

  // Expose app context (theme, language, debug mode)
  useReadableStore(UIStore, ['appContext'], {
    description: 'Application context including theme and language settings',
    categories: ['store', 'app', 'settings'],
    selector: ((store: UserInterfaceStore) => ({
      theme: store.appContext?.theme?.palette?.mode || 'light',
      language: store.appContext?.language || 'fr',
      debugMode: store.appContext?.debug || false,
    })) as StoreSelector<unknown>,
  });
}

export default useCopilotStore;
