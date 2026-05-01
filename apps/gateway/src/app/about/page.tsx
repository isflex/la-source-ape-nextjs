import React from 'react'
import { headers } from 'next/headers'
import { isMobile } from '@src/utils'
import About from './client-component-2'
import PostHogNodeClient from '@src/utils/posthog/initPostHogNode'

async function actionPageInfo() {
  'use server'

  const userAgent = (await headers()).get('user-agent') || ''
  const mobileCheck = isMobile(userAgent)
  // const session = await getSession(); // Fetch session data
  const posthog = PostHogNodeClient()
  await posthog.shutdown()

  return {
    mobileCheck
  }
}

export default async function Page() {
  // 'use cache'

  return <About {...(await actionPageInfo())} />
}
