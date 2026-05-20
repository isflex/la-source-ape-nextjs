import React from 'react'
import { headers } from 'next/headers'
import { isMobile } from '@src/utils'
import { isFeatureEnabled } from '@src/lib/feature-flags'
import AboutLegacy from './client-component'
import AboutV2 from './client-component-2'
import PostHogNodeClient from '@src/utils/posthog/initPostHogNode'

async function actionPageInfo() {
  'use server'

  const userAgent = (await headers()).get('user-agent') || ''
  const mobileCheck = isMobile(userAgent)
  // const session = await getSession(); // Fetch session data
  const posthog = await PostHogNodeClient()
  await posthog?.shutdown()

  return {
    mobileCheck
  }
}

export default async function Page() {
  // 'use cache'

  const About = isFeatureEnabled('ABOUT_USES_LEGACY_V1') ? AboutLegacy : AboutV2
  return <About {...(await actionPageInfo())} />
}
