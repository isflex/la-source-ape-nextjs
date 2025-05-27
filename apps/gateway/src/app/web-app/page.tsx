'use server'

import React from 'react'
import dynamic from 'next/dynamic'
import { headers } from 'next/headers'
import { isMobile } from '@src/utils'
const WebAppMF = dynamic(async () => await import('@src/components/web-app-mf'), { ssr: true })

async function actionPageInfo() {
  'use server'

  const userAgent = (await headers()).get('user-agent') || ''
  const mobileCheck = isMobile(userAgent)
  // const session = await getSession(); // Fetch session data

  return {
    mobileCheck
  }
}

export default async function Page() {
  // 'use cache'

  return <WebAppMF {...(await actionPageInfo())} />
}
