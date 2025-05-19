import React from 'react'
// import Head from 'next/head'
// import Script from 'next/script'
import dynamic from 'next/dynamic'
// import {BrowserRouter as Router } from 'react-router'
import { observer, enableStaticRendering } from 'mobx-react-lite'
import { StoreProvider } from '@flexiness/domain-store'
// import  { description, jsonLd } from '@src/seo'
import { isServer } from '@src/utils'
import
// App,
{
  // AppContext,
  AppProps
} from 'next/app'

// import ConfigureAmplifyClientSide from '@src/components/auth/ConfigureAmplifyOutputs'
import AuthProvider from '@src/components/auth/AuthProvider'

// import { PostHogProvider } from '@src/utils/posthog/providers'

import classNames from 'classnames'
import {
  View as FlexRootView,
 } from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
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
  LayoutProps,
  PageAppProps,
  // PageStaticData,
  // GenericProps
} from '@root/types/additional'

declare let globalThis: FlexGlobalThis
enableStaticRendering(isServer)

// const LogoFlex = dynamic(() => import('@src/components/logo-flexiness'), { ssr: true })
// const FlexComponents = dynamic(async () => await import('@src/components/flex-components-mf'), { ssr: true })

const Layout: React.ComponentType<LayoutProps> = dynamic(() => import('../components/main-layout/pages'))

const MyApp = ({ Component, pageProps }: AppProps<PageAppProps>) => {
  return (
    <>
      {/*
      <Head>
        <meta name='description' content={description} />
      </Head>
      <Script
        nonce={pageProps._nonce}
        id='jsonLd'
        type='application/ld+json'
        strategy={'afterInteractive'}
        dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
        }}
      />
      */}
      {/* <ConfigureAmplifyClientSide /> */}
      {/* <PostHogProvider> */}
        <AuthProvider>
          <StoreProvider>
            <FlexRootView className={classNames(flexStyles.flexinessRoot, flexStyles.isClipped)} theme='light'>
              <Layout props={pageProps }>
                <Component {...pageProps}/>
              </Layout>
            </FlexRootView>
          </StoreProvider>
        </AuthProvider>
      {/* </PostHogProvider> */}
    </>
  )
}

// https://colinhacks.com/essays/building-a-spa-with-nextjs
// const MyApp = ({ Component, pageProps }: AppProps<PageAppProps>) => {
//   const [fullyRendered, setFullyRendered] = React.useState(false)
//   React.useEffect(() => {
//     setFullyRendered(true)
//   }, [Boolean(globalThis?.Flexiness?.domainApp?.FlexComponents !== null)])
//   const Loader = () => {
//     return (
//       <div style={{
//         // background: 'linear-gradient(180deg, rgb(117, 81, 194), rgb(255, 255, 255))',
//         height: '100vh',
//         width: '100vw',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//       }}>
//         <div style={{
//           height: '65vh',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//           <div style={{
//             width: '100%',
//           }}>
//             <LogoFlex />
//           </div>
//         </div>
//       </div>
//     )
//   }
//   return (
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
//       {fullyRendered ? (
//         <StoreProvider value={stores}>
//           <Router>
//             <Component {...pageProps} />
//           </Router>
//         </StoreProvider>
//         ) : (<>
//           <Loader />
//           <FlexComponents />
//         </>
//       )}
//     </>
//   )
// }

// MyApp.getInitialProps = async (context: AppContext) => {
//   // log.info('_app getInitialProps context:', context)
//   const {
//     Component,
//     // router,
//     ctx
//   } = context
//   const {
//     req,
//     res,
//     pathname,
//     query,
//     asPath
//   } = ctx

//   let pageProps = {}
//   if (Component.getInitialProps) {
//     try {
//       pageProps = await Component.getInitialProps(ctx)
//     } catch (error) {
//       pageProps = { error }
//     }
//   }

//   // https://nextjs.org/docs/advanced-features/custom-app
//   // calls page's `getInitialProps` and fills `appProps.pageProps`

//   const appProps = await App.getInitialProps(context)
//   pageProps = { ...pageProps, ...appProps }

//   const _nonce = req?.headers?.['x-nonce'] || '---CSP-nonce---'

//   return {
//     pageProps: {
//       ...pageProps,
//       _nonce: _nonce,
//     }
//   }
// }

export default observer(MyApp)
