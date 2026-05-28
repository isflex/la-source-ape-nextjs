import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@src/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Compte Stripe',
  description:
    "Gérez votre compte Stripe Connect pour percevoir les fonds de vos cagnottes APE La Source en toute sécurité.",
  path: '/cagnotte/compte-stripe',
  noIndex: true,
});

export default function CompteStripeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section style={{ minHeight: '100vh' }}>{children}</section>
  );
}
