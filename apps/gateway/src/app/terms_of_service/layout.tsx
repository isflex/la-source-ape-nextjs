import React from 'react'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { buildMetadata } from '@src/seo'
import PostHogNodeClient from '@src/utils/posthog/initPostHogNode'

const PageContent = dynamic(() => import('@src/components/footer/terms_of_service'), { ssr: true })

export const metadata: Metadata = buildMetadata({
  title: "Conditions générales d'utilisation",
  description:
    "Conditions générales d'utilisation du site APE La Source.",
  path: '/terms_of_service',
})

export default async function Layout() {

  const posthog = await PostHogNodeClient()
  await posthog?.shutdown()

  return (
    <PageContent />
  )
}
