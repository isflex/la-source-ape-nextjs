// import * as path from 'path'

// import os from 'node:os'
// import fs, { writeFileSync } from 'node:fs'
// import { v4 as uuidv4 } from 'uuid'

// import { fileURLToPath } from 'url'
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

import React from 'react'
import dynamic from 'next/dynamic'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import  { title } from '@src/seo'
import PostHogNodeClient from '@src/utils/posthog/initPostHogNode'

// import { isMobile } from 'react-device-detect'
import { isMobile } from '@src/utils'

import classNames from 'classnames'
// import {
//   Title,
//   Text,
// } from '@src/components/flex-server-components'
// import {
//   TitleLevel
//  } from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
// import { default as stylesPage } from '@src/styles/scss/pages/about.module.scss'

const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })
const WebAppMF = dynamic(async () => await import('@src/components/web-app-mf'), { ssr: true })

export const metadata: Metadata = {
  title: `${title} | Web App`,
}

export default async function WebAppLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const userAgent = (await headers()).get('user-agent') || ''
  const mobileCheck = isMobile(userAgent)
  const posthog = PostHogNodeClient()
  await posthog.shutdown()

  return (
    <div className={classNames(
      flexStyles.genericLayout1,
      flexStyles.isPlain,
      mobileCheck && `mobileMode__${process.env.NEXT_PUBLIC_BUILD_ID}`
    )}>
      <div style={{
        height: 'auto',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          width: '100%',
        }}>
          <LogoAPE isLoader={true} />
        </div>

        <main className={classNames(
          // flexStyles.fullPage,
          // flexStyles.hasSpaceBetweenContent
        )}>
          <WebAppMF mobileCheck={mobileCheck} />
        </main>
      </div>
    </div>
  )
}
