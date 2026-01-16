'use client';

import { useCopilotReadable } from '@copilotkit/react-core';
import { useMemo } from 'react';
import type { UserContext, ReadableOptions } from '../types';

/**
 * useReadableUser - Expose user context to CopilotKit
 *
 * Makes user information available to the AI assistant
 * for personalized responses and context-aware actions.
 *
 * @example
 * ```tsx
 * const user = useCurrentUser();
 * useReadableUser(user, {
 *   description: 'Currently authenticated user'
 * });
 * ```
 */
export function useReadableUser(
  user: UserContext | null | undefined,
  options?: ReadableOptions
): void {
  const serializedUser = useMemo(() => {
    if (!user) return 'No user authenticated';
    try {
      // Filter out sensitive data by default
      const safeUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        preferences: user.preferences,
      };
      return JSON.stringify(safeUser, null, 2);
    } catch {
      return 'User data unavailable';
    }
  }, [user]);

  const description = options?.description ?? 'Current user context and authentication state';
  const categories = options?.categories ?? ['user', 'auth', 'context'];

  useCopilotReadable({
    description,
    value: serializedUser,
    categories,
    ...(options?.parentId && { parentId: options.parentId }),
  });
}

export default useReadableUser;
