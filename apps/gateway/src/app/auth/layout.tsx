import React from 'react';
import { headers } from 'next/headers';
import AuthPage from './page'
import { LoadingBackdrop } from '@src/components/loading/LoadingBackdrop'

export default async function AuthLayout() {
  const _nonce = (await headers()).get('x-nonce')

  if (!_nonce) return (
    <section style={{ minHeight: '100vh' }}>
      <LoadingBackdrop />
    </section>
  )

  return (
    <section style={{ minHeight: '100vh' }}><AuthPage nonce={_nonce} /></section>
  );
}
