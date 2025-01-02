import React from 'react'
import Head from 'next/head'
import Script from 'next/script'
// import {BrowserRouter as Router } from 'react-router'
import { observer, enableStaticRendering } from 'mobx-react-lite'
import { getStores, StoreProvider } from '@src/stores'
import { isServer } from '@src/utils'
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
        <Component {...pageProps} />
      </StoreProvider>
    </>
  )
}

// https://colinhacks.com/essays/building-a-spa-with-nextjs
// const MyApp = ({ Component, pageProps }: AppProps<PageAppProps>) => {
//   const [render, setRender] = React.useState(false)
//   React.useEffect(() => setRender(true), [])
//   return render ? (
//     <>
//       <Head>
//         {/* Required for CSS-in-JS <style data-jss /> tags -> injected into HEAD by Material UI v4 -> CSP style-src 'unsafe-inline' */}
//         {/* https://cssinjs.org/csp/?v=v10.10.0 */}
//         <meta nonce={pageProps._nonce} property='csp-nonce' content={`${pageProps._nonce}`} />
//       </Head>
//       {/* Required for react-helmet */}
//       <Script
//         nonce={pageProps._nonce}
//         id='webpackNonce'
//         dangerouslySetInnerHTML={{
//           __html: `window.__webpack_nonce__="${pageProps._nonce}"`
//         }}
//       />
//       <StoreProvider value={stores}>
//         <Router>
//           <Component {...pageProps} />
//         </Router>
//       </StoreProvider>
//     </>
//   ) : null
// }

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

  const _nonce = req?.headers?.['x-nonce'] || '---CSP-nonce---'

  return {
    pageProps: {
      ...pageProps,
      _nonce: _nonce,
    }
  }
}

export default observer(MyApp)
