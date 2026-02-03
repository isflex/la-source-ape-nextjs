// src/app/global-error.tsx

'use client' // Error boundaries must be Client Components

import React from 'react'
import dynamic from 'next/dynamic'
import posthog from 'posthog-js'
import classNames from 'classnames'
import { View as FlexRootView } from '@flex-design-system/react-ts/client-sync-styled-direct/view'
import { Button } from '@flex-design-system/react-ts/client-sync-styled-direct/button'
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title'
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects'
import {
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block'
import { default as flexStyles } from '@flex-design-system/framework'
import { default as stylesLayout } from '@src/styles/scss/pages/layout.module.scss'
import { inlineStyles } from '@src/styles/inlineStyles'
import { logClientError } from '@src/app/actions/log-error'
import '@src/styles/globals.css'

const LogoLaSource = dynamic(() => import('@src/components/logo-la-source'), { ssr: true })
const Header = dynamic(() => import('@src/components/sticky-header/app'), { ssr: true })

const NavigationLayout = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <div className={classNames(stylesLayout.navLayout)}>
      <LogoLaSource className={stylesLayout.navLogo} />
      <Header mobileCheck={isMobile} />
    </div>
  )
}

const GenericErrorFallback = ({ reset }: { reset: () => void }) => {
  return (
    <section className={classNames(flexStyles.isFullwidth)}>
      <InfoBlock>
        <InfoBlockHeader>
          <Title level={TitleLevel.LEVEL3}>
            {`Une erreur s'est produite`}
          </Title>
        </InfoBlockHeader>
        <InfoBlockContent>
          <Title level={TitleLevel.LEVEL4}>
            {`Nous sommes désolés, une erreur inattendue est survenue.`}
            <br />
            {`Veuillez réessayer.`}
          </Title>
        </InfoBlockContent>
        <InfoBlockAction>
          <div className={classNames(flexStyles.isFullwidth, flexStyles.isFlex, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentCenter)}>
            <Button small variant={VariantState.FLEX_PINK} onClick={reset}>
              Réessayer
            </Button>
          </div>
        </InfoBlockAction>
      </InfoBlock>
    </section>
  )
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isMobile: boolean = false

  React.useEffect(() => {
    // Log the error to PostHog (client-side)
    posthog.captureException(error)

    // Also log via server action for CloudWatch
    logClientError({
      errorName: error.name,
      errorMessage: error.message,
      errorDigest: error.digest,
      route: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    })
  }, [error])

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
          <div id='gatewayLayout' className={classNames(stylesLayout.gatewayLayout)}>
            <NavigationLayout isMobile={isMobile} />
            <GenericErrorFallback reset={reset} />
          </div>
        </FlexRootView>
      </body>
    </html>
  )
}
