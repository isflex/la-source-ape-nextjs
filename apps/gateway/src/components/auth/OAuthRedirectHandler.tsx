'use client';

import { debug } from '@flexiness/domain-utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OAuthRedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    // Check if this is an OAuth redirect and if we should redirect to /auth
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthParams = urlParams.has('code') && urlParams.has('state');

    if (hasOAuthParams) {
      const oauthSource = sessionStorage.getItem('amplify-oauth-source');

      debug.auth('[OAUTH_REDIRECT_HANDLER] OAuth params detected, source:', oauthSource);

      if (oauthSource === '/auth') {
        // This OAuth came from /auth, redirect there with params
        const currentUrl = new URL(window.location.href);
        const redirectUrl = `/auth${currentUrl.search}`;

        debug.auth('[OAUTH_REDIRECT_HANDLER] Redirecting to:', redirectUrl);

        // Clean up sessionStorage
        sessionStorage.removeItem('amplify-oauth-source');

        // Redirect to /auth with OAuth parameters
        router.replace(redirectUrl);
        return;
      } else {
        debug.auth('[OAUTH_REDIRECT_HANDLER] OAuth from /web-app or unknown source, staying on /web-app');
      }
    }
  }, [router]);

  return null; // This component doesn't render anything
}
