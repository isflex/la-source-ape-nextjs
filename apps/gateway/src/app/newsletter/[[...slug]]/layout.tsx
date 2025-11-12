import { ReactNode } from 'react'
import { notFound, redirect } from 'next/navigation'

interface NewsletterCatchAllLayoutProps {
  children: ReactNode
  params: {
    slug?: string[]
  }
}

export default function NewsletterCatchAllLayout({
  children,
  params
}: NewsletterCatchAllLayoutProps) {
  const slugArray = params.slug
  const slugBase = slugArray?.[0]

  // Redirect routes that should be handled by dedicated pages
  if (!slugArray || slugArray.length === 0) {
    // Root /newsletter/ should redirect to souscrire
    redirect('/newsletter/souscrire/')
  }

  if (slugBase === 'creer' || slugBase === 'souscrire') {
    // These routes should be handled by dedicated pages
    // If we reach here, it means the dedicated routes don't exist
    redirect(`/newsletter/${slugBase}/`)
  }

  // For all other routes, render the dynamic content
  return (
    <section style={{ minHeight: '80vh' }}>{children}</section>
  )
}
