import React from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import AuthPage from './page'
import { LoadingBackdrop } from '@src/components/loading/LoadingBackdrop'
import { buildMetadata } from '@src/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Connexion',
  description: "Connectez-vous à votre espace APE La Source.",
  path: '/auth',
  noIndex: true,
})

export default async function AuthLayout() {
  const _nonce = (await headers()).get('x-nonce')

  if (!_nonce) return (
    <section style={{ minHeight: '100vh' }}>
      <LoadingBackdrop loadingText={'Chargement...'} />
    </section>
  )

  return (
    <section style={{ minHeight: '100vh' }}><AuthPage nonce={_nonce} /></section>
  );
}
