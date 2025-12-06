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
  const { user } = useAuthenticator();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      // Check 1: Admin session (admin-auth.ts)
      const hasAdminSession = checkAdminSession();

      if (hasAdminSession) {
        setIsAdmin(true);
        return;
      }

      // Check 2: Cognito admin email
      if (!user) {
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
  }, [user]);

  return isAdmin;
}
