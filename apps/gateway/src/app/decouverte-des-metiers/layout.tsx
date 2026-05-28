import React from 'react'
import type { Metadata } from 'next'
import { buildMetadata } from '@src/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Découverte des métiers',
  description:
    "Inscription à la découverte des métiers de l'École nouvelle La Source.",
  path: '/decouverte-des-metiers',
})

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
