import React from 'react'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import  { title } from '@src/seo'
import PostHogNodeClient from '@src/utils/posthog/initPostHogNode'

const PageContent = dynamic(() => import('@src/components/footer/terms_of_service'), { ssr: true })

export const metadata: Metadata = {
  title: `Conditions générales d'utilisation | ${title}`,
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {

  const posthog = PostHogNodeClient()
  await posthog.shutdown()

  return (
    <PageContent />
  )
}
