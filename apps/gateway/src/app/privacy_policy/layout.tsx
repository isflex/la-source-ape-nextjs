import React from 'react'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import  { title } from '@src/seo'
import PostHogNodeClient from '@src/utils/posthog/initPostHogNode'

const PageContent = dynamic(() => import('@src/components/footer/privacy_policy'), { ssr: true })

export const metadata: Metadata = {
  title: `Politique de Confidentialité | ${title}`,
}

export default async function Layout() {

  const posthog = PostHogNodeClient()
  await posthog.shutdown()

  return (
    <PageContent />
  )
}
