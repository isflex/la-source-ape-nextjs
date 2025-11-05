import React from 'react'
import type { Metadata } from 'next'
import  { title } from '@src/seo'

export const metadata: Metadata = {
  title: `Découverte des métiers | ${title}`,
  description: 'Inscription à la découverte des métiers de l\'École nouvelle La Source',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
