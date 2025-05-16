/* eslint-disable no-console */

import React from 'react'
import Head from 'next/head'
// import Script from 'next/script'
// import type { NextPage } from 'next'
import type { NextPage, GetServerSideProps } from 'next'
import { PageAppProps, PageStaticData, ModFedData } from '@root/types/additional'
import dynamic from 'next/dynamic'

import  { title } from '@src/seo'

// import getConfig from 'next/config'
// const { serverRuntimeConfig } = getConfig()

// import { useRouter as useNextRouter } from 'next/router'

// import log from 'loglevel'

// import { getCurrentUser } from 'aws-amplify/auth/server'
// import { runWithAmplifyServerContext } from '@src/utils/amplify/pages-router'

import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'

// import { isServer } from '@src/utils'

// import {
//   FlexGlobalThis,
//   // AppContextInterface,
//   // UserInterfaceStore,
//   // FlexI18next
// } from 'flexiness'

// import { loadTranslations } from 'ni18n'
// import { ni18nConfig } from '@flexiness/languages/dist/ni18n.config'
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// const nextI18NextConfig = await import('../../../next-i18next.config.mjs')
// import type I18next from 'i18next'
// let i18n: FlexI18next

// import classNames from 'classnames'
import {
  Text,
  // Title,
  // View,
  // flexStyles,
} from '@flex-design-system/react-ts/client-sync-styled-default'
// import { default as flexStyles } from '@flex-design-system/framework'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'

const stores = getStores()

const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })
// const LogoFlex = dynamic(() => import('@src/components/logo-flexiness').then(mod => mod.default), { ssr: true })

const WebAppMF = dynamic(async () => await import('@src/components/web-app-mf'), { ssr: true })
// const WebAppMF = React.lazy(async () => await import('@src/components/web-app-mf'))

const MFWebAppPage: NextPage<PageAppProps> = observer((
  props
) => {

  const { status } = stores.UIStore

  const Loader = () => {
    return (
      <div style={{
        background: 'linear-gradient(180deg, rgb(117, 81, 194), rgb(255, 255, 255))',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
        <div style={{
          height: '65vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            width: '100%',
          }}>
            <LogoAPE />
          </div>
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem'
          }}>
            <Text className={flexStyles.hasTextSuccess}>... Loading</Text>
          </div>
        </div>
      </div>
    )
  }

  // return (
  //   <div className='flex-view-component'>
  //     {status !== 'done' && <LogoAPE /> }
  //     <Suspense fallback={<div>Loading</div>}>
  //       <div style={{ visibility: status === 'done' ? 'visible' : 'hidden' }}>
  //         <WebAppMF { ...props } />
  //       </div>
  //     </Suspense>
  //   </div>
  // )

  return (
    <>
      <Head>
        <title>{`${title} | Web App`}</title>
      </Head>
      <div className='flex-view-component'>
        {status !== 'done' && (
          <Loader />
        )}
        <div style={{ visibility: status === 'done' ? 'visible' : 'hidden', margin: '1rem' }}>
          <WebAppMF { ...props } />
        </div>
      </div>
      </>
  )
})

// // ///////////////////////////////////////////////////////////////////
// //                       getServerSideProps
// // ///////////////////////////////////////////////////////////////////
// // Will generate the page on each request. Cannot be used with getStaticProps or getStaticPaths
// // ///////////////////////////////////////////////////////////////////

export const getServerSideProps: GetServerSideProps = async (
  context
) => {
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

  const pageStaticData: PageStaticData = {
    pageName: `web-app`,
    adjustFooterPosition: false,
  }

  const modFedData: ModFedData = {
    gitCommitSHA: '',
  }

  // User needs to be authenticated to call this API
  // Requires : Manage Auth session with the Next.js Middleware
  // https://docs.amplify.aws/nextjs/build-a-backend/server-side-rendering/#with-nextjs-pages-router

  // const currentUser = await runWithAmplifyServerContext({
  //   nextServerContext: { request: req, response: res },
  //   operation: (contextSpec) => getCurrentUser(contextSpec)
  // })

  const _nonce = req.headers?.['x-nonce'] || '---CSP-nonce---'

  return {
    props: {
      ...pageStaticData,
      ...modFedData,
      _nonce: _nonce,
      // user: currentUser,
    }
  }
}

export default MFWebAppPage
