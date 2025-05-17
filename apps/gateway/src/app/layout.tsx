// apps/gateway/src/app/layout.tsx

import React from 'react'
import dynamic from 'next/dynamic'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import Script from 'next/script'
import  { title, description, jsonLd } from '@src/seo'

// import ConfigureAmplifyClientSide from '@src/components/auth/ConfigureAmplifyOutputs'
import AuthProvider from '@src/components/auth/AuthProvider'

// import { StoreProvider } from '@src/stores'

// import NavBarAuth from '@src/components/navbar/NavBarAuth'
// import { isAuthenticated } from '@src/utils/amplify/server/app.router'

import { PostHogProvider } from '@src/utils/posthog/providers'

import classNames from 'classnames'
import {
  View as FlexRootView,
} from '@src/components/flex-server-components'
// import {
//  } from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { inlineStyles } from '@src/styles/inlineStyles'
// import './globals.css'
// import '@flexiness/domain-tailwind/globals.css'

const remoteWebAppClient = process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST
// const remoteContentClient = process.env.NEXT_PUBLIC_FLEX_CONTENT_REMOTE_HOST

// import localFont from 'next/font/local'

// const commissioner = localFont({
//   src: [
//     {
//       path: '../../public/assets/fonts/commissioner-v1.0/static/ttfs/Commissioner-Regular.ttf',
//       style: 'normal'
//     },
//     {
//       path: '../../public/assets/fonts/commissioner-v1.0/static/ttfs/Commissioner-Bold.ttf',
//       style: 'bold'
//     },
//   ],
//   display: 'swap',
//   preload: true,
//   variable: '--flex-font-commissioner',
// })

// const commissioner = localFont({
//   src: '../../public/assets/fonts/commissioner-v1.0/variable/Commissioner_VF_1.001.ttf',
//   display: 'swap',
//   preload: true,
//   variable: '--flex-font-commissioner',
// })

// import { Commissioner } from 'next/font/google'
// const commissioner = Commissioner({
//   subsets: ['latin'],
//   display: 'swap',
// })

export const metadata: Metadata = {
  title: title,
  description: description,
}

const Layout = dynamic(() => import('../components/main-layout/app'))

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const _nonce = (await headers()).get('x-nonce') || '---CSP-nonce---'

  const fetchMFs = async () => {
    const responseWebAppClient = await fetch(`${remoteWebAppClient}/loadable-stats.json`)
    if (!responseWebAppClient.ok) {
      throw new Error(`HTTP error! status: ${responseWebAppClient.status}`)
    }
    const resultWebAppClient = await responseWebAppClient.json()

    return {
      remoteEntryWebAppClient: resultWebAppClient?.assetsByChunkName?.['flex_poker_client_modfed'][0] as string || null,
      flexFrameworkStyles: resultWebAppClient?.assetsByChunkName?.['flex-framework-styles'][0] as string || null,
    }
  }

  const resultModFeds = await fetchMFs().catch((e) => {
    // handle the error as needed
    console.error('An error occurred while fetching the data from fetchMFs : ', e)
  })

  return (
    <html lang='fr' style={{
        ...inlineStyles.reset,
        // fontFamily: commissioner?.variable
      }}
      // className={commissioner.className}
    >
      <head>
        <link nonce={_nonce} rel='prefetch' as='fetch' href={`${remoteWebAppClient}/mf-manifest.json`} crossOrigin='anonymous' />
        {/* <link nonce={_nonce} rel='prefetch' as='fetch' href={`${remoteWebAppClient}/loadable-stats.json`} crossOrigin='anonymous' /> */}

        {resultModFeds?.remoteEntryWebAppClient && (
          <link nonce={_nonce} rel='prefetch' as='script' href={`${remoteWebAppClient}/${resultModFeds.remoteEntryWebAppClient}`} crossOrigin='anonymous' />
        )}

        {resultModFeds?.flexFrameworkStyles && (
          <>
            <link nonce={_nonce} rel='prefetch' as='style' href={`${remoteWebAppClient}/${resultModFeds.flexFrameworkStyles}`} crossOrigin='anonymous' />
            <link nonce={_nonce} rel='stylesheet' href={`${remoteWebAppClient}/${resultModFeds.flexFrameworkStyles}`} />
          </>
        )}

        {/* Required for CSS-in-JS <style data-jss /> tags -> injected into HEAD by Material UI v4 -> CSP style-src 'unsafe-inline' */}
        {/* https://cssinjs.org/csp/?v=v10.10.0 */}
        <meta nonce={_nonce} property='csp-nonce' content={`${_nonce}`} />
        <link nonce={_nonce} type='image/x-icon' rel='ico' href={`/logo/la_source/favicon-128.ico`} />
        <link nonce={_nonce} rel='apple-touch-icon' sizes='192x192' href={`/logo/la_source/Icon_192.png`} />
        <link nonce={_nonce} rel='apple-touch-icon' sizes='512x512' href={`/logo/la_source/Icon_512.png`} />
        <link nonce={_nonce} rel='icon' type='image/png' sizes='192x192' href={`/logo/la_source/Icon_192.png`} />
        <link nonce={_nonce} rel='icon' type='image/png' sizes='512x512' href={`/logo/la_source/Icon_512.png`} />

        <Script
          nonce={_nonce}
          id='webpackNonce'
          strategy={'beforeInteractive'}
          dangerouslySetInnerHTML={{
            __html: `window.__webpack_nonce__="${_nonce}"`
          }}
        />

        <Script
          nonce={_nonce}
          id='jsonLd'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      </head>
      <body style={{ ...inlineStyles.reset }}>
        {/* <StoreProvider> */}
          <PostHogProvider>
            <AuthProvider>
              <FlexRootView className={classNames(flexStyles.flexinessRoot, flexStyles.isClipped )} theme='light'>
                {/* <NavBarAuth isSignedIn={await isAuthenticated()} /> */}
                <Layout>
                  {children}
                </Layout>
              </FlexRootView>
            </AuthProvider>
          </PostHogProvider>
        {/* </StoreProvider> */}
      </body>
    </html>
  )
}

export default RootLayout
