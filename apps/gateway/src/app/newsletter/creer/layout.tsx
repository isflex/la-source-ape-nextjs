// Newsletter creation layout - server-side

import React from 'react'

/**
 * Newsletter creation layout
 * Simple server-side layout for newsletter creation
 */
export default function NewsletterCreerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section style={{ minHeight: '80vh' }}>{children}</section>
  )
}
