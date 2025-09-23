import type { Metadata } from 'next'
import  { title } from '@src/seo'

export const metadata: Metadata = {
  title: `Sondage Erasmus | ${title}`,
  description: 'Sondage sur la mobilité Erasmus destiné aux familles de l\'École nouvelle La Source',
}

export default function ErasmusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
