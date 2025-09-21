// apps/gateway/src/app/layout.tsx

import React from 'react'
import dynamic from 'next/dynamic'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import Script from 'next/script'
import  { title, description, jsonLd } from '@src/seo'
// import { isServer } from '@src/utils'

import outputs from '@root/amplify_outputs.json'
// import { AMPLIFY_AUTH_CONFIG_V2 } from '@src/utils/amplify/configure'
import { Amplify, type ResourcesConfig } from 'aws-amplify'
Amplify.configure({
  // ...(AMPLIFY_AUTH_CONFIG_V2 as ResourcesConfig),
  ...outputs,
}, { ssr: true })
import ConfigureAmplifyClientSide from '@src/components/auth/ConfigureAmplifyOutputs'
import {
  EC2Client,
  // DescribeAddressesCommand, type DescribeAddressesCommandOutput,
  DescribeSpotInstanceRequestsCommand, type DescribeSpotInstanceRequestsCommandOutput,
  DescribeInstancesCommand, type DescribeInstancesCommandOutput,
} from '@aws-sdk/client-ec2'

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
import '@src/styles/globals.css'
// import '@flexiness/domain-tailwind/globals.css'

const remoteWebAppClient = process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST

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

const MainLayout = dynamic(() => import('../components/main-layout/app'))

type ResultModFeds = {
  remoteEntryWebAppClient: string | null
  flexFrameworkStyles: string | null
} | null | void

// type ResponseDescribeAddressesCommand = DescribeAddressesCommandOutput | null
type ResponseDescribeSpotInstanceRequestsCommand = DescribeSpotInstanceRequestsCommandOutput | null
type ResponseDescribeInstancesCommand = DescribeInstancesCommandOutput | null

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const _nonce = (await headers()).get('x-nonce') || '---CSP-nonce---'

  // throw new Error(`HTTP error! status: Test General error`)

  let statusEC2Active = false
  let resultModFeds: ResultModFeds = null
  // let responseEC2Addresses: ResponseDescribeAddressesCommand = null
  let responseEC2SpotRequests: ResponseDescribeSpotInstanceRequestsCommand = null
  let responseEC2Instances: ResponseDescribeInstancesCommand = null

  const fetchMFAssets = async () => {
    const responseWebAppClient = await fetch(`${remoteWebAppClient}/loadable-stats.json`, {
      method: 'GET',
      priority: 'high',
      cache: 'force-cache'
      // signal: AbortSignal.timeout(20 * 1000),
    })
    if (!responseWebAppClient.ok) {
      throw new Error(`HTTP error! status: ${responseWebAppClient.status}`)
    }
    const resultWebAppClient = await responseWebAppClient.json()

    return {
      remoteEntryWebAppClient: resultWebAppClient?.assetsByChunkName?.['flex_poker_client_modfed'][0] as string || null,
      flexFrameworkStyles: resultWebAppClient?.assetsByChunkName?.['flex-framework-styles'][0] as string || null,
    }
  }

  try {
    // process data
    const client = new EC2Client({ region: process.env.AWS_REGION })
    // const input = {
    //   PublicIps: [
    //     '15.188.148.108',
    //   ],
    //   DryRun: false, // true || false
    //   // Filters: [
    //   //   {
    //   //     Name: "STRING_VALUE",
    //   //     Values: [
    //   //       "STRING_VALUE",
    //   //     ],
    //   //   },
    //   // ],
    //   // AllocationIds: [
    //   //   'eipalloc-00054b08ec67239e2',
    //   // ],
    // }
    // const command = new DescribeAddressesCommand(input)
    const inputSpotRequests = {
      DryRun: false, // true || false
      Filters: [
        {
          Name: 'tag:Name',
          Values: [
            'flex-homepage',
          ],
        },
      ],
    }
    const commandSpotRequests = new DescribeSpotInstanceRequestsCommand(inputSpotRequests)
    responseEC2SpotRequests = await client.send(commandSpotRequests)
    if (responseEC2SpotRequests?.SpotInstanceRequests?.[0]?.InstanceId) {
      const inputInstances = {
        DryRun: false, // true || false
        InstanceIds: [
          responseEC2SpotRequests.SpotInstanceRequests[0].InstanceId,
        ],
      }
      const commandInstances = new DescribeInstancesCommand(inputInstances)
      responseEC2Instances = await client.send(commandInstances)
      // console.log(responseEC2Instances?.Reservations?.[0]?.Instances?.[0])
    }
  } catch (error) {
    // error handling.
    console.log(error)
  } finally {
    if (
      responseEC2SpotRequests?.SpotInstanceRequests?.[0]?.Status?.Code === 'fulfilled' &&
      responseEC2Instances?.Reservations?.[0]?.Instances?.[0]?.State?.Name === 'running'
    ) {
      statusEC2Active = true
      resultModFeds = await fetchMFAssets().catch((e) => {
        // handle the error as needed
        console.error('An error occurred while fetching the data from fetchMFAssets : ', e)
      })
    }
  }

  return (
    <html lang='fr' style={{
        ...inlineStyles.reset,
        // fontFamily: commissioner?.variable
      }}
      // className={commissioner.className}
    >
      <head>
        {statusEC2Active && (
          <link nonce={_nonce} rel='prefetch' as='fetch' href={`${remoteWebAppClient}/mf-manifest.json`} crossOrigin='anonymous' />
        )}
        {/* <link nonce={_nonce} rel='prefetch' as='fetch' href={`${remoteWebAppClient}/loadable-stats.json`} crossOrigin='anonymous' /> */}

        {(statusEC2Active && resultModFeds?.remoteEntryWebAppClient) && (
          <link nonce={_nonce} rel='prefetch' as='script' href={`${remoteWebAppClient}/${resultModFeds?.remoteEntryWebAppClient}`} crossOrigin='anonymous' />
        )}

        {(statusEC2Active && resultModFeds?.flexFrameworkStyles) && (
          <>
            <link nonce={_nonce} rel='prefetch' as='style' href={`${remoteWebAppClient}/${resultModFeds?.flexFrameworkStyles}`} crossOrigin='anonymous' />
            <link nonce={_nonce} rel='stylesheet' href={`${remoteWebAppClient}/${resultModFeds?.flexFrameworkStyles}`} />
          </>
        )}

        {/* Required for CSS-in-JS <style data-jss /> tags -> injected into HEAD by Material UI v4 -> CSP style-src 'unsafe-inline' */}
        {/* https://cssinjs.org/csp/?v=v10.10.0 */}
        <meta nonce={_nonce} property='csp-nonce' content={`${_nonce}`} />
        <meta name='google-site-verification' content='psZCPyPTBntXlBHex2y-Z1ts-t5P7dAfyWYVlodgZ9I' />
        <link nonce={_nonce} type='image/x-icon' rel='ico' href={`/logo/ape/favicon-128.ico`} />
        <link nonce={_nonce} rel='apple-touch-icon' sizes='192x192' href={`/logo/ape/Logo_192.png`} />
        <link nonce={_nonce} rel='apple-touch-icon' sizes='512x512' href={`/logo/ape/Logo_512.png`} />
        <link nonce={_nonce} rel='icon' type='image/png' sizes='192x192' href={`/logo/ape/Logo_192.png`} />
        <link nonce={_nonce} rel='icon' type='image/png' sizes='512x512' href={`/logo/ape/Logo_512.png`} />

        <Script
          nonce={_nonce}
          id='webpackNonce'
          strategy={'beforeInteractive'}
          dangerouslySetInnerHTML={{
            __html: `window.__webpack_nonce__='${_nonce}'`
          }}
        />

        <Script
          nonce={_nonce}
          id='jsonLd'
          type='application/ld+json'
          strategy={'beforeInteractive'}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      </head>
      <body style={{ ...inlineStyles.reset }}>
        {/* <StoreProvider> */}
          <PostHogProvider>
            <ConfigureAmplifyClientSide />
            <FlexRootView className={classNames(flexStyles.flexinessRoot, flexStyles.isClipped )} theme='light'>
              {/* <NavBarAuth isSignedIn={await isAuthenticated()} /> */}
              <MainLayout>
                {children}
              </MainLayout>
            </FlexRootView>
          </PostHogProvider>
        {/* </StoreProvider> */}
      </body>
    </html>
  )
}

export default RootLayout
