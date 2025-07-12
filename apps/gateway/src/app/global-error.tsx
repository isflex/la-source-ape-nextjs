// src/app/global-error.tsx

'use client' // Error boundaries must be Client Components

import React from 'react'
import dynamic from 'next/dynamic'
import posthog from 'posthog-js'
import classNames from 'classnames'
import {
  View as FlexRootView,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/layout.module.scss'
import { inlineStyles } from '@src/styles/inlineStyles'
import '@src/styles/globals.css'

const LogoLaSource = dynamic(() => import('@src/components/logo-la-source'), { ssr: true })
const Header = dynamic(() => import('@src/components/sticky-header/app'), { ssr: true })
const FallBackEC2InstanceUnavailable = dynamic(() => import('@src/components/error/EC2InstanceUnavailable'), { ssr: true })

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isMobile: boolean = false

  React.useEffect(() => {
    // Log the error to an error reporting service
    // console.error(error)
    posthog.captureException(error)
  }, [error])

  const NavigationLayout = () => {
    return (
      <div className={classNames(stylesPage.navLayout)}>
        <LogoLaSource className={stylesPage.navLogo} />
        <Header mobileCheck={isMobile} />
      </div>
    )
  }

  return (
    // global-error must include html and body tags
    <html lang='fr' style={{
      ...inlineStyles.reset,
    }}
  >
    <head>
      <meta name='google-site-verification' content='psZCPyPTBntXlBHex2y-Z1ts-t5P7dAfyWYVlodgZ9I' />
      <link type='image/x-icon' rel='ico' href={`/logo/la_source/favicon-128.ico`} />
      <link rel='apple-touch-icon' sizes='192x192' href={`/logo/la_source/Icon_192.png`} />
      <link rel='apple-touch-icon' sizes='512x512' href={`/logo/la_source/Icon_512.png`} />
      <link rel='icon' type='image/png' sizes='192x192' href={`/logo/la_source/Icon_192.png`} />
      <link rel='icon' type='image/png' sizes='512x512' href={`/logo/la_source/Icon_512.png`} />

    </head>
      <body style={{ ...inlineStyles.reset }}>
        <FlexRootView className={classNames(flexStyles.flexinessRoot, flexStyles.isClipped )} theme='light'>
          <div id='gatewayLayout' className={classNames(stylesPage.gatewayLayout)}>
            <NavigationLayout />
            <FallBackEC2InstanceUnavailable reset={() => reset()} mobileCheck={isMobile} />
          </div>
        </FlexRootView>
      </body>
    </html>
  )
}
