import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Sondage concernant l'accès à l'application ${process.env.NEXT_PUBLIC_APP_TITLE}`,
  description: `Sondage destiné aux parents concernant l'utilisation de l'application ${process.env.NEXT_PUBLIC_APP_TITLE}.`,
}

export default function ErasmusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section style={{ minHeight: '100vh' }}>{children}</section>
  )
}
