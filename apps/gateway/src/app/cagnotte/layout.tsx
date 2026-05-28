import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@src/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Cagnottes',
  description:
    "Plateforme de cagnottes collectives APE La Source pour les cadeaux de fin d'année destinés aux enseignants de l'École nouvelle La Source.",
  path: '/cagnotte',
});

export default function CagnotteSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
