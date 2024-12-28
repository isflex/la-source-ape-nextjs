/* eslint-disable no-console */

// import * as fs from 'fs'
// import { promises as fs } from 'fs'
import React, { Suspense } from 'react'
// import { headers } from 'next/headers'
// import Script from 'next/script'
// import type { NextPage } from 'next'
import type { NextPage, GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'

// import getConfig from 'next/config'
// const { serverRuntimeConfig } = getConfig()

// import { useRouter as useNextRouter } from 'next/router'

import loadable from '@loadable/component'

// import log from 'loglevel'

import { observer } from 'mobx-react-lite'
import { getStores } from '@src/stores'

import { isServer } from '@src/utils'

import {
  FlexGlobalThis,
  // AppContextInterface,
  // UserInterfaceStore,
  // FlexI18next
} from 'flexiness'

import { PageAppProps, PageStaticData, LogoProps } from '@root/types/additional'

// import { loadTranslations } from 'ni18n'
// import { ni18nConfig } from '@flexiness/languages/dist/ni18n.config'
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// const nextI18NextConfig = await import('../../../next-i18next.config.mjs')
// import type I18next from 'i18next'
// let i18n: FlexI18next

const LogoFlex = dynamic(() => import('@src/components/logo-flexiness').then(mod => mod.default), { ssr: true })
const LogoAPE = dynamic(() => import('@src/components/logo-ape-la-source').then(mod => mod.default), { ssr: true })
let MFDevPortolioApp: React.ComponentType<any> = LogoFlex

const stores = getStores()

import { init, preloadRemote, registerRemotes, loadRemote } from '@module-federation/enhanced/runtime'

const MFDevPortfolioPage: NextPage<PageAppProps> = observer((
  props
) => {
  const { status } = stores.UIStore
  const [isLoading, setLoading] = React.useState(true)

  React.useEffect(() => {
    try {
      init({
        name: `@${props.host}/onboard`,
        remotes: [
          {
            name: props.mf as string,
            entry: `${props.remote}/mf-manifest.json`,
            // entry: `${props.remote}/remoteEntry_${props.mf}_${props.gitCommitSHA}.js`,
            alias: 'App',
            type: 'global',
          },
        ],
        shared: {
          react: {
            version: '18.3.1',
            scope: 'default',
            lib: () => React,
            shareConfig: {
              singleton: true,
              requiredVersion: '18.3.1',
            },
            strategy: 'loaded-first',
          },
          mobx: {
            version: '6.13.1',
            scope: 'default',
            shareConfig: {
              singleton: true,
              requiredVersion: '6.13.1',
            },
            strategy: 'loaded-first',
          },
          'mobx-react-lite': {
            version: '4.0.7',
            scope: 'default',
            shareConfig: {
              singleton: true,
              requiredVersion: '4.0.7',
            },
            strategy: 'loaded-first',
          },
        },
      })

      // MFDevPortolioApp = React.lazy(() => loadRemote(`${props.mf}/App`).then((m) => {
      //   setLoading(false)
      //   return m.default
      // }))

      MFDevPortolioApp = loadable(async () => loadRemote(`${props.mf}/App`).then((m: any) => {
        setLoading(false)
        return m.default as React.ComponentType<any>
      }))
    } catch (error) {
      console.error(`Error loading remote module ${props.mf}:`, error);
    }
  }, [])

  return (
    <div className='flex-view-component'>
      {status !== 'done' && <LogoAPE /> }
      <div style={{ visibility: status === 'done' ? 'visible' : 'hidden' }}>
        <MFDevPortolioApp isStandalone={true} />
      </div>
    </div>
  )
})

// MFDevPortfolioPage.getInitialProps = async (ctx) => {
//   const res = await fetch('https://api.github.com/repos/vercel/next.js')
//   const json = await res.json()
//   return { stars: json.stargazers_count }
// }

// export const getStaticProps = async (context) => {
//   console.log('Page portfolio | getStaticProps | context : ',context)
//   return { props: { hello: 'portfolio' } }
// }

// export async function getStaticProps() {
//   const pageName = base
//   const demoFile = await fileExists(`${pageName}.js`, '/src/components/navigation/demo-list')
//     ? pageName : 'default'

//   // const stores = getStores()
//   // const { setDemoPage } = stores.UIStore
//   // setDemoPage(demoFile)

//   const pageStaticData: PageStaticData = {
//     pageName,
//     demoFile,
//     mf
//   }
//   return {
//     props: {
//       ...pageStaticData
//     },
//     // revalidate: 1
//   }
// }

// export async function getStaticPaths() {
//   return {
//     // /////////////////////////////////////////////////////////////////////////
//     // paths: [],
//     // fallback: true
//     // /////////////////////////////////////////////////////////////////////////
//     paths: [
//       { params: { slug: [''] } },
//       { params: { slug: ['design-system'] } },
//     ],
//     fallback: 'blocking'
//     // /////////////////////////////////////////////////////////////////////////
//   }
// }

// // ///////////////////////////////////////////////////////////////////
// //                       getServerSideProps
// // ///////////////////////////////////////////////////////////////////
// // Will generate the page on each request. Cannot be used with getStaticProps or getStaticPaths
// // ///////////////////////////////////////////////////////////////////

export const getServerSideProps: GetServerSideProps = async (
  context
) => {
  // console.log('Page Portfolio | getServerSideProps | context : ', context)
  const {
    params, // present for pages that use a dynamic route,
    req,
    res,
    query,
    preview,
    previewData,
    resolvedUrl,
    locales,
    locale,
    defaultLocale
  } = context

  // init({
  //   name: `@${process.env.FLEX_GATEWAY_NAME}/onboard`,
  //   remotes: [
  //     {
  //       name: `${process.env.FLEX_POKER_CLIENT_NAME}`,
  //       entry: `${process.env.FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST}/mf-manifest.json`,
  //       alias: 'OnboardClient',
  //     },
  //   ],
  // })

  // void preloadRemote([
  //   {
  //     nameOrAlias: `${process.env.FLEX_POKER_CLIENT_NAME}`,
  //     resourceCategory: 'all',
  //   },
  // ])

  const pageStaticData: PageStaticData = {
    pageName: `onboard`,
    host: `${process.env.FLEX_GATEWAY_NAME}`,
    mf: `${process.env.FLEX_POKER_CLIENT_NAME}`,
    remote: `${process.env.FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST}`,
    // gitCommitSHA: '',
    gitCommitSHA: '2ae9eceb',
  }

  // const headersList = await headers()
  // const _nonce = headersList.get('x-nonce') || '---CSP-nonce---'
  const _nonce = req.headers?.['x-nonce'] || '---CSP-nonce---'

  return {
    props: {
      ...pageStaticData,
      _nonce: _nonce,
    }
  }
}

export default MFDevPortfolioPage
