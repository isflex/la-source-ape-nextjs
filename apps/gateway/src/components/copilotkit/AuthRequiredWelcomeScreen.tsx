'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Custom CopilotKit welcomeScreen pieces.
 *
 * The wrapper (CopilotKitWrapper) decides which to use based on authStatus:
 *  - Unauthenticated → AuthRequiredWelcomeScreen (full-screen replacement,
 *    sign-in CTA only). The Next proxy + AgentCore's customJWTAuthorizer
 *    reject unauthenticated agent calls, so the input would 401 — surface
 *    the CTA up-front instead.
 *  - Authenticated → CopilotKit's default sidebar welcome layout, with the
 *    welcomeMessage subslot replaced by AuthenticatedWelcomeMessage. This
 *    keeps the panel's centering / spacing / cpk styling intact and only
 *    swaps the title+body text.
 *
 * SSR-safe: returnTo is built from usePathname/useSearchParams, not the
 * window object — FlexCopilotProvider mounts during SSR.
 */

export function AuthRequiredWelcomeScreen() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentPath = `${pathname}${search ? `?${search}` : ''}`;
  const href = `/auth?returnTo=${encodeURIComponent(currentPath)}`;

  return (
    <div
      data-testid="copilot-auth-required"
      className="cpk:text-foreground"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
        Connectez-vous pour utiliser l'assistant
      </h3>
      <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.85, maxWidth: '28ch' }}>
        Vous devez être connecté pour discuter avec l'assistant IA.
      </p>
      <Link
        href={href}
        style={{
          display: 'inline-block',
          padding: '0.6rem 1.25rem',
          borderRadius: '999px',
          background: 'var(--copilot-primary, #1f6feb)',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
        }}
      >
        Se connecter
      </Link>
    </div>
  );
}

/**
 * welcomeMessage subslot for the authenticated state. Rendered inside
 * CopilotKit's default CopilotSidebarView.WelcomeScreen, so the surrounding
 * layout (flex centering, padding, input + suggestions) is provided by
 * CopilotKit. Uses cpk: classes so the text picks up the panel's foreground
 * design token — plain inline-styled text is invisible in this scope.
 */
export function AuthenticatedWelcomeMessage({ className }: { className?: string }) {
  const containerClass = ['cpk:text-foreground', 'cpk:text-center', className].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      <h1 className="cpk:text-xl cpk:sm:text-2xl cpk:font-medium">
        Comment puis-je vous aider aujourd'hui ?
      </h1>
      <p className="cpk:mt-2 cpk:text-sm cpk:opacity-80 cpk:max-w-prose cpk:mx-auto">
        Posez-moi des questions sur votre compte, naviguez dans l'application, ou demandez un résumé.
      </p>
    </div>
  );
}
