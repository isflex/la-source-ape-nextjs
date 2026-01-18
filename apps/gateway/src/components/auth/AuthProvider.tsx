'use client';

import React from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useReadableUser,  type UserContext } from '@flexiness/copilotkit';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Inner component that exposes user context to CopilotKit
 * Must be inside Authenticator.Provider to use useAuthenticator
 */
function AuthContextBridge({ children }: { children: React.ReactNode }) {
  const { user, authStatus } = useAuthenticator((context) => [context.user, context.authStatus]);

  // Map Amplify user to CopilotKit UserContext
  const userContext: UserContext | null = user && authStatus === 'authenticated'
    ? {
        id: user.userId,
        email: user.signInDetails?.loginId,
        name: user.username,
        authStatus,
      }
    : null;

  useReadableUser(userContext, {
    description: 'Current authenticated user from AWS Cognito',
    categories: ['user', 'auth', 'cognito'],
  });

  return <>{children}</>;
}

/**
 * Client-side Authentication Provider wrapper
 * This component wraps the Amplify Authenticator.Provider in a client component
 * so it can be used from server-side layouts
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <Authenticator.Provider>
      <AuthContextBridge>
        {children}
      </AuthContextBridge>
    </Authenticator.Provider>
  );
}
