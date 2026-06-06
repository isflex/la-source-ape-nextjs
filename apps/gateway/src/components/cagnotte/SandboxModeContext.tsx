'use client';

import React, { createContext, useContext } from 'react';

/**
 * Carries the server-computed Stripe sandbox flag (see `isStripeTestMode` in
 * `@src/lib/secrets`) down to the client cagnotte pages. The cagnotte layout
 * resolves the boolean server-side and provides it here so `SandboxBanner` can
 * render below `AuthBanner` without re-reading the secret on the client.
 */
const SandboxModeContext = createContext<boolean>(false);

export function SandboxModeProvider({
  value,
  children,
}: {
  value: boolean;
  children: React.ReactNode;
}) {
  return (
    <SandboxModeContext.Provider value={value}>
      {children}
    </SandboxModeContext.Provider>
  );
}

export function useSandboxMode(): boolean {
  return useContext(SandboxModeContext);
}
