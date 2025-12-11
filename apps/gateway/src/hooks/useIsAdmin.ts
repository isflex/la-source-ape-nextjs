'use client';

import { useState, useEffect } from 'react';
import { debug } from '@flexiness/domain-utils';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { isAdminAuthenticated as checkAdminSession } from '@src/lib/admin-auth';

/**
 * Hook to check if current user is an admin
 * Returns true if EITHER:
 * - Admin session is active (admin-auth.ts)
 * - OR Cognito user email is admin@apelasource.org
 */
export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  // Call useAuthenticator unconditionally (required by Rules of Hooks)
  // If context not available, user will be undefined/null
  let authenticatorUser = null;
  try {
    const auth = useAuthenticator((context) => [context.user]);
    authenticatorUser = auth.user;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Context not available - this is acceptable
    // We'll rely on sessionStorage check only
    debug.warn('Authenticator context not available, using sessionStorage check only');
  }

  useEffect(() => {
    const checkAdmin = async () => {
      // Check 1: Admin session (admin-auth.ts)
      const hasAdminSession = checkAdminSession();

      if (hasAdminSession) {
        setIsAdmin(true);
        return;
      }

      // Check 2: Cognito admin email (only if user available)
      if (!authenticatorUser) {
        setIsAdmin(false);
        return;
      }

      try {
        const attributes = await fetchUserAttributes();
        const adminEmail = 'admin@apelasource.org';
        const userEmail = attributes.email;

        setIsAdmin(userEmail === adminEmail);
      } catch (error) {
        debug.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [authenticatorUser]);

  return isAdmin;
}
