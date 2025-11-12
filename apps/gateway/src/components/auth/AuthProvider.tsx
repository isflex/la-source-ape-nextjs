'use client';

import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Client-side Authentication Provider wrapper
 * This component wraps the Amplify Authenticator.Provider in a client component
 * so it can be used from server-side layouts
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
}