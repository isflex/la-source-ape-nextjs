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
import { ErrorBoundary } from 'react-error-boundary'
import regexEscape from 'regex-escape'

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
const FallBackEC2InstanceUnavailable = dynamic(() => import('@src/components/error/EC2InstanceUnavailable'), { ssr: true })

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_TITLE}`,
}

export default async function WebAppLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const userAgent = (await headers()).get('user-agent') || ''
  const currentHost = (await headers()).get('x-host') || ''
  // const currentRequestUrl = (await headers()).get('x-url') || ''
  // const currentOrigin = (await headers()).get('x-origin') || ''
  // console.debug(currentHost)
  // console.debug(currentRequestUrl)
  // console.debug(currentOrigin)
  // console.debug(regexEscape(process.env.NEXT_PUBLIC_FLEX_FUTUR_PROOF_2_BASE_DOMAIN!))
  // console.debug((new RegExp(`${regexEscape(process.env.NEXT_PUBLIC_FLEX_FUTUR_PROOF_2_BASE_DOMAIN!)}`, 'g')).test(currentHost))

  const mobileCheck = isMobile(userAgent)
  const posthog = PostHogNodeClient()
  await posthog.shutdown()

  if (process.env.NEXT_PUBLIC_FLEX_ACTIVATE_APE_SOURCE_CO === 'false' &&
    (new RegExp(`${regexEscape(process.env.NEXT_PUBLIC_FLEX_FUTUR_PROOF_2_BASE_DOMAIN!)}`, 'g')).test(currentHost)
  ) {
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
            height: '20vh',
            paddingTop: '10vh',
            width: '100%',
            background: 'linear-gradient(180deg, rgb(117 81 194), rgb(255 255 255))',
          }}>
            <LogoAPE />
          </div>
          {children}
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary fallback={<FallBackEC2InstanceUnavailable mobileCheck={mobileCheck} />}>
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
            background: 'linear-gradient(180deg, rgb(117 81 194), rgb(255 255 255))',
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
    </ErrorBoundary>
  )
}
