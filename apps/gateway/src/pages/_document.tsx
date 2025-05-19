import React from 'react'
import
Document,
{
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document'
import Script from 'next/script'
import { observer } from 'mobx-react-lite'
import { inlineStyles } from '@src/styles/inlineStyles'
// import { init, preloadRemote, registerRemotes, loadRemote } from '@module-federation/enhanced/runtime'

interface DocumentProps extends DocumentInitialProps {
  _nonce: string
  remoteWebAppClient: string
  remoteWebAppClientEntryAsset: string | null
  flexFrameworkStylesAsset: string | null
  // remoteFlexComponents: string
  // remoteFlexComponentsEntryAsset: string | null
}

const MyDocument = (props: DocumentProps) => {
  const {
    _nonce,
    remoteWebAppClient,
    remoteWebAppClientEntryAsset,
    flexFrameworkStylesAsset,
    // remoteFlexComponents,
    // remoteFlexComponentsEntryAsset
  } = props
  return (
    <Html lang='fr' style={{ ...inlineStyles.reset }}>
      <Head nonce={_nonce}>
        <link nonce={_nonce} rel='preload' as='fetch' href={`${remoteWebAppClient}/mf-manifest.json`} crossOrigin='anonymous' />
        <link nonce={_nonce} rel='preload' as='fetch' href={`${remoteWebAppClient}/loadable-stats.json`} crossOrigin='anonymous' />
        {/*
        <link nonce={_nonce} rel='preload' as='fetch' href={`${remoteFlexComponents}/node/mf-manifest.json`} crossOrigin='anonymous' />
        <link nonce={_nonce} rel='preload' as='fetch' href={`${remoteFlexComponents}/node/loadable-stats.json`} crossOrigin='anonymous' />
        */}
        {remoteWebAppClientEntryAsset && (
          <link nonce={_nonce} rel='preload' as='script' href={`${remoteWebAppClient}/${remoteWebAppClientEntryAsset}`} crossOrigin='anonymous' />
        )}
        {/*
        {remoteFlexComponentsEntryAsset && (
          <link nonce={_nonce} rel='preload' as='script' href={`${remoteFlexComponents}/${remoteFlexComponentsEntryAsset}`} crossOrigin='anonymous' />
        )}
        */}
        {flexFrameworkStylesAsset && (
          <>
            <link nonce={_nonce} rel='preload' as='style' href={`${remoteWebAppClient}/${flexFrameworkStylesAsset}`} crossOrigin='anonymous' />
            <link nonce={_nonce} rel='stylesheet' href={`${remoteWebAppClient}/${flexFrameworkStylesAsset}`} />
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
      </Head>
      <body style={{ ...inlineStyles.reset }}>
        <Main />
        <NextScript nonce={_nonce} />
        <Script
          nonce={_nonce}
          id='webpackNonce'
          strategy={'beforeInteractive'}
          dangerouslySetInnerHTML={{
            __html: `window.__webpack_nonce__="${_nonce}"`
          }}
        />
      </body>
    </Html>
  );
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (
  ctx: DocumentContext
): Promise<DocumentProps> => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage

  // Run the React rendering logic synchronously
  ctx.renderPage = () =>
    originalRenderPage({
      // Useful for wrapping the whole react tree
      enhanceApp: (App) => App,
      // Useful for wrapping in a per-page basis
      enhanceComponent: (Component) => Component,
    })

  // Run the parent `getInitialProps`, it now includes the custom `renderPage`
  const initialProps = await Document.getInitialProps(ctx)

  const {
    req,
    res,
    pathname,
    query,
    asPath
  } = ctx

  const _nonce = (req?.headers?.['x-nonce'] || '---CSP-nonce---') as string

  const fetchMFs = async () => {
    const responseWebAppClient = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST}/loadable-stats.json`)
    if (!responseWebAppClient.ok) {
      throw new Error(`HTTP error! status: ${responseWebAppClient.status}`)
    }
    const resultWebAppClient = await responseWebAppClient.json()
    // console.log(resultWebAppClient?.assetsByChunkName)

    // const responseFlexComponents = await fetch(`${process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_DEPLOYED_REMOTE_HOST}/loadable-stats.json`)
    // if (!responseFlexComponents.ok) {
    //   throw new Error(`HTTP error! status: ${responseFlexComponents.status}`)
    // }
    // const resultFlexComponents = await responseFlexComponents.json()
    // console.log(resultFlexComponents?.assetsByChunkName)

    // init({
    //   name: `@${process.env.NEXT_PUBLIC_FLEX_GATEWAY_NAME}/web-app`,
    //   remotes: [
    //     {
    //       name: process.env.NEXT_PUBLIC_POKER_CLIENT_NAME as string,
    //       entry: `${process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST}/mf-manifest.json`,
    //       // entry: `${process.env.FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST}/remoteEntry_${process.env.FLEX_POKER_CLIENT_NAME}_${props.gitCommitSHA}.js`,
    //       alias: 'App',
    //       type: 'global',
    //     },
    //     // {
    //     //   name: process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_NAME as string,
    //     //   entry: `${process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_DEPLOYED_REMOTE_HOST}/mf-manifest.json`,
    //     //   // entry: `${process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_DEPLOYED_REMOTE_HOST}/node/mf-manifest.json`,
    //     //   // entry: `${process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_DEPLOYED_REMOTE_HOST}/remoteEntry_${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}_${props.gitCommitSHA}.js`,
    //     //   alias: 'Styled',
    //     //   // alias: 'ModulesDefault',
    //     //   type: 'global',
    //     //   // type: 'esm',
    //     // },
    //   ],
    //   shared: {
    //     react: {
    //       version: '19.1.0',
    //       scope: 'default',
    //       lib: () => React,
    //       shareConfig: {
    //         singleton: true,
    //         requiredVersion: '19.1.0',
    //       },
    //       strategy: 'loaded-first',
    //     },
    //     mobx: {
    //       version: '6.13.1',
    //       scope: 'default',
    //       shareConfig: {
    //         singleton: true,
    //         requiredVersion: '6.13.1',
    //       },
    //       strategy: 'loaded-first',
    //     },
    //     'mobx-react-lite': {
    //       version: '4.0.7',
    //       scope: 'default',
    //       shareConfig: {
    //         singleton: true,
    //         requiredVersion: '4.0.7',
    //       },
    //       strategy: 'loaded-first',
    //     }
    //   },
    // })

    // registerRemotes([
    //   {
    //     name: process.env.NEXT_PUBLIC_POKER_CLIENT_NAME as string,
    //     entry: `${process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST}/mf-manifest.json`,
    //   },
    // ]);

    return {
      remoteEntryWebAppClient: resultWebAppClient?.assetsByChunkName?.['flex_poker_client_modfed'][0] as string || null,
      flexFrameworkStyles: resultWebAppClient?.assetsByChunkName?.['flex-framework-styles'][0] as string || null,
      // remoteEntryFlexComponents: resultFlexComponents?.assetsByChunkName?.['flex_design_system_react_ts_modfed'][0] as string || null,
    }
  }

  const resultModFeds = await fetchMFs().catch((e) => {
    // handle the error as needed
    console.error('An error occurred while fetching the data from fetchMFs : ', e)
  })

  const additionalProps = {
    _nonce,
    remoteWebAppClient: process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST!,
    remoteWebAppClientEntryAsset: resultModFeds?.remoteEntryWebAppClient as string | null,
    flexFrameworkStylesAsset: resultModFeds?.flexFrameworkStyles as string | null,
    // remoteFlexComponents: process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_DEPLOYED_REMOTE_HOST!,
    // remoteFlexComponentsEntryAsset: resultModFeds?.remoteEntryFlexComponents as string | null,
  }

  return {
    ...initialProps,
    ...additionalProps, // 👈 and this!
  }
}

export default observer(MyDocument)
