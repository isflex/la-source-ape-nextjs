import React from 'react'
import Head from 'next/head'
import Script from 'next/script'
import { observer, enableStaticRendering } from 'mobx-react-lite'
import { getStores, StoreProvider } from '@src/stores'
import { isServer } from '@src/utils'
import '@src/styles/app.css'
import
App,
{
  AppContext,
  AppProps
} from 'next/app'
import { Amplify } from 'aws-amplify'
import outputs from '@root/amplify_outputs.json'
import '@aws-amplify/ui-react/styles.css'

import {
  FlexGlobalThis,
  // AppContextInterface,
  // UserInterfaceStore,
  // FlexI18next
} from 'flexiness'

import {
  // AppPropsWithLayout,
  // NextRouteOptions,
  // LayoutProps,
  PageAppProps,
  // PageStaticData,
  // GenericProps
} from '@root/types/additional'

declare let globalThis: FlexGlobalThis
enableStaticRendering(isServer)
const stores = getStores()
Amplify.configure(outputs)

const MyApp = ({ Component, pageProps }: AppProps<PageAppProps>) => {
  return (
    <>
      <Head>
        {/* Required for CSS-in-JS <style data-jss /> tags -> injected into HEAD by Material UI v4 -> CSP style-src 'unsafe-inline' */}
        {/* https://cssinjs.org/csp/?v=v10.10.0 */}
        <meta nonce={pageProps._nonce} property='csp-nonce' content={`${pageProps._nonce}`} />
      </Head>
      {/* Required for react-helmet */}
      <Script
        nonce={pageProps._nonce}
        id='webpackNonce'
        dangerouslySetInnerHTML={{
          __html: `window.__webpack_nonce__="${pageProps._nonce}"`
        }}
      />
      <StoreProvider value={stores}>
        <Component {...pageProps}/>
      </StoreProvider>
    </>
  )
}

MyApp.getInitialProps = async (context: AppContext) => {
  // log.info('_app getInitialProps context:', context)
  const {
    Component,
    // router,
    ctx
  } = context
  const {
    req,
    res,
    pathname,
    query,
    asPath
  } = ctx

  let pageProps = {}
  if (Component.getInitialProps) {
    try {
      pageProps = await Component.getInitialProps(ctx)
    } catch (error) {
      pageProps = { error }
    }
  }

  // https://nextjs.org/docs/advanced-features/custom-app
  // calls page's `getInitialProps` and fills `appProps.pageProps`

  const appProps = await App.getInitialProps(context)
  pageProps = { ...pageProps, ...appProps }

  // https://github.com/borekb/nextjs-with-mobx
  // On server-side, this runs once and creates new stores
  // On client-side, this always reuses existing stores
  // const mobxStores = getStores();

  // // Make stores available to page's `getInitialProps`
  // context.ctx.mobxStores = mobxStores;

  const _nonce = req?.headers?.['x-nonce'] || '---CSP-nonce---'

  return {
    pageProps: {
      ...pageProps,
      host: `${process.env.FLEX_GATEWAY_NAME}`,
      mf: `${process.env.FLEX_POKER_CLIENT_NAME}`,
      remote: `${process.env.FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST}`,
      // gitCommitSHA: '',
      gitCommitSHA: '2ae9eceb',
      _nonce: _nonce,
    }
  }
}

export default observer(MyApp)
