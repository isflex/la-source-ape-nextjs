'use client';

import React, { useMemo, ReactNode } from 'react';
import { useAgentContext } from '@copilotkit/react-core/v2';

/**
 * User context for the agent
 */
export interface AuthUserContext {
  id: string;
  email?: string | null;
  username?: string;
  authStatus?: string;
  [key: string]: unknown;
}

/**
 * Props for AuthContextBridge
 */
export interface AuthContextBridgeProps {
  children: ReactNode;
  /** The authenticated user (null if not authenticated) */
  user: AuthUserContext | null;
  /** Description for the agent context */
  description?: string;
}

/**
 * AuthContextBridge - Exposes authenticated user to the agent via useAgentContext
 *
 * Provides user information to the agent so it can personalize responses.
 *
 * @example
 * ```tsx
 * import { AuthContextBridge } from '@flexiness/copilotkit';
 * import { useAuth } from 'your-auth-provider';
 *
 * function App({ children }) {
 *   const { user } = useAuth();
 *   return (
 *     <AuthContextBridge user={user}>
 *       {children}
 *     </AuthContextBridge>
 *   );
 * }
 * ```
 */
export function AuthContextBridge({
  children,
  user,
  description = 'Current authenticated user',
}: AuthContextBridgeProps): React.ReactNode {
  // Memoize user context to avoid unnecessary re-renders
  // Ensure all values are JSON-serializable (no undefined)
  const userContext = useMemo(() => {
    if (user) {
      return {
        id: user.id,
        email: user.email ?? null,
        username: user.username ?? null,
        authStatus: user.authStatus ?? null,
      };
    }
    return null;
  }, [user]);

  // Expose user context to agent via v2 useAgentContext
  useAgentContext({
    description,
    value: userContext as Record<string, string | null> | null,
  });

  return children;
}

export default AuthContextBridge;
