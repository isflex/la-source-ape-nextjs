import React from 'react'
import type { Metadata } from 'next'
import { buildMetadata } from '@src/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Créer une newsletter',
  description:
    "Rédigez et publiez une newsletter APE La Source pour les parents d'élèves de l'École nouvelle La Source.",
  path: '/newsletter/creer',
})

export default function NewsletterCreerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section style={{ minHeight: '100vh' }}>{children}</section>
  )
}
