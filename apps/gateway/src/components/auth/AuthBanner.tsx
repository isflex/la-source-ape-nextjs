'use client';

import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { signOut, fetchUserAttributes, type UserAttributeKey } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

import classNames from 'classnames';
import {
  // Box,
  // Button,
  // ButtonMarkup,
  // Container,
  // Section,
  // Table,
  // TableHead,
  // TableBody,
  // TableTr,
  // TableTh,
  // TableTd,
  // Title,
  // TitleLevel,
  // VariantState,
  // InfoBlock,
  // InfoBlockContent,
  // InfoBlockHeader,
  Text,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';


interface AuthBannerProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function AuthBanner({ className, style }: AuthBannerProps) {
  const { user } = useAuthenticator();
  const router = useRouter();
  const isAuthenticated = !!user;
  const [userAttributes, setUserAttributes] = useState<Partial<Record<UserAttributeKey, string>> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      // Store current URL in sessionStorage for redirect after page reload
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem('redirectAfterSignOut', currentPath);

      await signOut();
      setUserAttributes(null); // Clear attributes on sign out
      // Note: signOut() will cause a page reload, redirect will be handled in useEffect
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle redirect after sign-out page reload
  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirectAfterSignOut');
    if (redirectPath && !user) {
      sessionStorage.removeItem('redirectAfterSignOut');
      router.push(redirectPath);
    }
  }, [user, router]);

  // Fetch user attributes when user changes
  useEffect(() => {
    const loadUserAttributes = async () => {
      if (!user) {
        setUserAttributes(null);
        return;
      }

      try {
        setLoading(true);
        const attributes = await fetchUserAttributes();
        setUserAttributes(attributes);
      } catch (error) {
        console.error('Error fetching user attributes:', error);
        setUserAttributes(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserAttributes();
  }, [user]);

  // Extract user name information
  const getUserDisplayName = () => {
    if (!user) return null;

    if (loading) return (
      <Text className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>Chargement...</Text>
    );

    // Try to get first and last name from user attributes
    const firstName = userAttributes?.given_name || userAttributes?.['custom:firstName'];
    const lastName = userAttributes?.family_name || userAttributes?.['custom:lastName'];

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    // Fallback to username/email if names aren't available
    const fallbackName = user.signInDetails?.loginId || user.username;
    return fallbackName || 'Utilisateur';
  };

  const displayName = getUserDisplayName();

  return (
    <div
      className={className}
      style={{
        backgroundColor: isAuthenticated ? '#d4edda' : '#f8d7da',
        color: isAuthenticated ? '#155724' : '#721c24',
        padding: '8px 12px',
        fontSize: '12px',
        borderLeft: `4px solid ${isAuthenticated ? '#28a745' : '#dc3545'}`,
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style
      }}
    >
      <div>
        {isAuthenticated ? (
          <span>
            <strong>Hello {displayName}</strong>
            {user?.userId && (
              <span style={{ marginLeft: '8px', opacity: 0.8 }}>
                (ID: {user.userId.substring(0, 8)}...)
              </span>
            )}
          </span>
        ) : (
          <span><strong>Non authentifié</strong></span>
        )}
      </div>

      {isAuthenticated && (
        <button
          onClick={handleSignOut}
          style={{
            background: 'transparent',
            border: '1px solid currentColor',
            color: 'inherit',
            fontSize: '11px',
            padding: '2px 6px',
            borderRadius: '3px',
            cursor: 'pointer',
            marginLeft: '12px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Se déconnecter
        </button>
      )}
    </div>
  );
}
