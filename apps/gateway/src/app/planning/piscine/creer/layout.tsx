import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@src/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Créer un planning piscine',
  description:
    "Organisez le planning des accompagnateurs pour les séances de piscine de l'École nouvelle La Source.",
  path: '/planning/piscine/creer',
});

export default function PiscineCreerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section style={{ minHeight: '100vh' }}>{children}</section>
  );
}
