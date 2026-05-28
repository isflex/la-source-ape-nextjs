import type { Metadata } from 'next'
import { buildMetadata } from '@src/seo'

export const metadata: Metadata = buildMetadata({
  title: `Sondage ${process.env.NEXT_PUBLIC_APP_TITLE}`,
  description: `Sondage destiné aux parents concernant l'utilisation de l'application ${process.env.NEXT_PUBLIC_APP_TITLE}.`,
  path: '/sondage/web-app',
})

export default function SondageWebAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section style={{ minHeight: '100vh' }}>{children}</section>
  )
}
