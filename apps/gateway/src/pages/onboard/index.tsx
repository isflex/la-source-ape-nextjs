/* eslint-disable no-console */

import * as path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import fs from 'node:fs'

import React from 'react'
// import Script from 'next/script'
// import type { NextPage } from 'next'
import type { NextPage, GetServerSideProps } from 'next'
import { PageAppProps, PageStaticData, ModFedData } from '@root/types/additional'
import dynamic from 'next/dynamic'

// import getConfig from 'next/config'
// const { serverRuntimeConfig } = getConfig()

// import { useRouter as useNextRouter } from 'next/router'

// import log from 'loglevel'

// import { getCurrentUser } from 'aws-amplify/auth/server'
// import { runWithAmplifyServerContext } from '@src/utils/amplify-server-util'

import { observer } from 'mobx-react-lite'
import { getStores } from '@src/stores'

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
import { Text, Title, View, flexStyles } from '@flex-design-system/react-ts/client-sync-styled-default'

const stores = getStores()

const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })
// const LogoFlex = dynamic(() => import('@src/components/logo-flexiness').then(mod => mod.default), { ssr: true })

const OnBoardMF = dynamic(async () => await import('@src/components/onboard-mf'), { ssr: true })
// const OnBoardMF = React.lazy(async () => await import('@src/components/onboard-mf'))

const MFOnBoardPage: NextPage<PageAppProps> = observer((
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
  //         <OnBoardMF { ...props } />
  //       </div>
  //     </Suspense>
  //   </div>
  // )

  return (
    <div className='flex-view-component'>
      {status !== 'done' && (
        <Loader />
      )}
      <div style={{ visibility: status === 'done' ? 'visible' : 'hidden', margin: '1rem' }}>
        <OnBoardMF { ...props } />
      </div>
    </div>
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
    pageName: `onboard`,
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

  // https://github.com/vercel/next.js/discussions/21061
  const activeRoutes = fs
    .readdirSync('src/pages', { withFileTypes: true })
    // .readdirSync(path.resolve(__dirname, '../../pages'), { withFileTypes: true })
    // .readdirSync(`${process.env.FLEX_PROJ_ROOT}/apps/gateway/src/pages`, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((folder) => folder.name)
    .filter(
      (folder) =>
        !folder.startsWith('_') && folder !== 'api' && folder !== pageStaticData.pageName,
    )

  return {
    props: {
      ...pageStaticData,
      ...modFedData,
      _nonce: _nonce,
      activeRoutes: activeRoutes
      // user: currentUser,
    }
  }
}

export default MFOnBoardPage
