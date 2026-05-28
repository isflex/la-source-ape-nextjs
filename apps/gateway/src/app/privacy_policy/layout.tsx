import React from 'react'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { buildMetadata } from '@src/seo'
import PostHogNodeClient from '@src/utils/posthog/initPostHogNode'

const PageContent = dynamic(() => import('@src/components/footer/privacy_policy'), { ssr: true })

export const metadata: Metadata = buildMetadata({
  title: 'Politique de Confidentialité',
  description:
    "Politique de confidentialité et traitement des données personnelles sur le site APE La Source.",
  path: '/privacy_policy',
})

export default async function Layout() {

  const posthog = await PostHogNodeClient()
  await posthog?.shutdown()

  return (
    <PageContent />
  )
}
