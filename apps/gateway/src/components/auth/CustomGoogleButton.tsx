'use client';

import React, { useState } from 'react';
import { signInWithRedirect } from 'aws-amplify/auth';
import { useSearchParams } from 'next/navigation';

interface CustomGoogleButtonProps {
  mode?: string;
  btnText?: string;
}

export default function CustomGoogleButton({ mode, btnText }: CustomGoogleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  // Only show for user mode (not admin mode)
  const isUserMode = mode === 'user';
  if (!isUserMode) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      // Store OAuth source in sessionStorage to track where it came from
      sessionStorage.setItem('amplify-oauth-source', '/auth');

      // Store ALL current search params to restore after OAuth redirect
      const allParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        allParams[key] = value;
      });

      // Ensure we have a default returnUrl if none provided
      if (!allParams.returnUrl) {
        allParams.returnUrl = '/newsletter/souscrire/';
      }

      // Store all params in sessionStorage
      sessionStorage.setItem('amplify-oauth-original-params', JSON.stringify(allParams));

      console.log('[CUSTOM_GOOGLE_BUTTON] Stored OAuth source: /auth');
      console.log('[CUSTOM_GOOGLE_BUTTON] Stored all params:', allParams);

      await signInWithRedirect({
        provider: 'Google'
      });
    } catch (error) {
      console.error('Error initiating Google sign-in:', error);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '12px 16px',
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#3367d6';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#4285f4';
          }
        }}
      >
        {isLoading ? (
          'Redirection vers Google...'
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              style={{ marginRight: '8px' }}
              fill="currentColor"
            >
              <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-2.7.75 4.8 4.8 0 0 1-4.52-3.36H1.83v2.1A8.1 8.1 0 0 0 8.98 17z"/>
              <path d="M4.46 10.41a4.8 4.8 0 0 1-.25-1.41 4.8 4.8 0 0 1 .25-1.41V5.49H1.83a8.1 8.1 0 0 0 0 7.02l2.63-2.1z"/>
              <path d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.54-2.54A8.1 8.1 0 0 0 8.98 1a8.1 8.1 0 0 0-7.15 4.49l2.63 2.1A4.8 4.8 0 0 1 8.98 3.58z"/>
            </svg>
            {btnText}
          </>
        )}
      </button>
    </div>
  );
}
