// apps/gateway/src/app/layout.tsx

import React from 'react'
import dynamic from 'next/dynamic'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import Script from 'next/script'

// import ConfigureAmplifyClientSide from '@src/components/auth/ConfigureAmplifyOutputs'
import AuthProvider from '@src/components/auth/AuthProvider'

// import { StoreProvider } from '@src/stores'

// import NavBarAuth from '@src/components/navbar/NavBarAuth'
// import { isAuthenticated } from '@src/utils/amplify/server/app.router'

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

const remoteOnBoardClient = process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST
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
// })
// const commissioner = localFont({
//   src: '../../public/assets/fonts/commissioner-v1.0/variable/Commissioner_VF_1.001.ttf',
//   display: 'swap',
//   preload: true,
// })

// import { Commissioner } from 'next/font/google'
// const commissioner = Commissioner({
//   subsets: ['latin'],
//   display: 'swap',
// })

export const metadata: Metadata = {
  title: 'APE | La Source',
  description: "Le site de l'association des parents d'élèves de l'école nouvelle la Source",
}

const Layout = dynamic(() => import('../components/main-layout/app'))

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const _nonce = (await headers()).get('x-nonce') || '---CSP-nonce---'

  const fetchMFs = async () => {
    const responseOnBoardClient = await fetch(`${remoteOnBoardClient}/loadable-stats.json`)
    if (!responseOnBoardClient.ok) {
      throw new Error(`HTTP error! status: ${responseOnBoardClient.status}`)
    }
    const resultOnBoardClient = await responseOnBoardClient.json()

    return {
      remoteEntryOnBoardClient: resultOnBoardClient?.assetsByChunkName?.['flex_poker_client_modfed'][0] as string || null,
      flexFrameworkStyles: resultOnBoardClient?.assetsByChunkName?.['flex-framework-styles'][0] as string || null,
    }
  }

  const resultModFeds = await fetchMFs().catch((e) => {
    // handle the error as needed
    console.error('An error occurred while fetching the data from fetchMFs : ', e)
  })

  // console.log(_nonce)
  // const _nonceQuoted = `'${_nonce}'`
  // const _nonceJson = JSON.stringify({
  //   'nonce': _nonce
  // })
  // __webpack_require__.nc = _nonce
  // __webpack_nonce__ = _nonce

  return (
    <html lang='fr' style={{ ...inlineStyles.reset }}>
      <head>
        {/* <script type='text/javascript' nonce={_nonce}>
          {`globalThis.__webpack_require__.nc=${JSON.parse(_nonceJson).nonce}`}
        </script> */}

        <link nonce={_nonce} rel='preload' as='fetch' href={`${remoteOnBoardClient}/mf-manifest.json`} crossOrigin='anonymous' />
        <link nonce={_nonce} rel='preload' as='fetch' href={`${remoteOnBoardClient}/loadable-stats.json`} crossOrigin='anonymous' />
        {/*
        <link nonce={_nonce} rel='preload' as='fetch' href={`${remoteFlexComponents}/node/mf-manifest.json`} crossOrigin='anonymous' />
        <link nonce={_nonce} rel='preload' as='fetch' href={`${remoteFlexComponents}/node/loadable-stats.json`} crossOrigin='anonymous' />
        */}
        {resultModFeds?.remoteEntryOnBoardClient && (
          <link nonce={_nonce} rel='preload' as='script' href={`${remoteOnBoardClient}/${resultModFeds.remoteEntryOnBoardClient}`} crossOrigin='anonymous' />
        )}
        {/*
        {remoteFlexComponentsEntryAsset && (
          <link nonce={_nonce} rel='preload' as='script' href={`${remoteFlexComponents}/${remoteFlexComponentsEntryAsset}`} crossOrigin='anonymous' />
        )}
        */}
        {resultModFeds?.flexFrameworkStyles && (
          <>
            <link nonce={_nonce} rel='preload' as='style' href={`${remoteOnBoardClient}/${resultModFeds.flexFrameworkStyles}`} crossOrigin='anonymous' />
            <link nonce={_nonce} rel='stylesheet' href={`${remoteOnBoardClient}/${resultModFeds.flexFrameworkStyles}`} />
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
      </head>
      <body style={{ ...inlineStyles.reset }}>
        {/* <StoreProvider> */}
          <AuthProvider>
            <FlexRootView className={classNames(flexStyles.flexinessRoot, flexStyles.isClipped )} theme='light'>
              {/* <NavBarAuth isSignedIn={await isAuthenticated()} /> */}
              <Layout>
                {children}
              </Layout>
            </FlexRootView>
          </AuthProvider>
        {/* </StoreProvider> */}
      </body>
    </html>
  )
}

export default RootLayout
