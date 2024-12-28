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
import { observer } from 'mobx-react-lite'
import { init, preloadRemote, registerRemotes, loadRemote } from '@module-federation/enhanced/runtime'

interface DocumentProps extends DocumentInitialProps {
  _nonce: string
  remote: string
  remoteEntryAsset: string | null
  flexFrameworkStylesAsset: string | null
}

const MyDocument = (props: DocumentProps) => {
  const { _nonce, remote, remoteEntryAsset, flexFrameworkStylesAsset } = props
  return (
    <Html lang='fr'>
      <Head nonce={_nonce}>
        <link nonce={_nonce} rel='preload' as='fetch' href={`${remote}/mf-manifest.json`} />
        <link nonce={_nonce} rel='preload' as='fetch' href={`${remote}/loadable-stats.json`} />
        {remoteEntryAsset && <link nonce={_nonce} rel='preload' as='script' href={`${remote}/${remoteEntryAsset}`} /> }
        {flexFrameworkStylesAsset && <link nonce={_nonce} rel='preload' as='style' href={`${remote}/${flexFrameworkStylesAsset}`} /> }
        {flexFrameworkStylesAsset && <link nonce={_nonce} rel='stylesheet' href={`${remote}/${flexFrameworkStylesAsset}`} /> }
      </Head>
      <body>
        <Main />
        <NextScript nonce={_nonce} />
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

  const fetchOnBoardClientMF = async () => {
    const response = await fetch(`${process.env.FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST}/loadable-stats.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    // console.log(result?.assetsByChunkName)
    return {
      remoteEntryOnBoardClient: result?.assetsByChunkName?.['flex_poker_client_modfed'][0] as string || null,
      flexFrameworkStyles: result?.assetsByChunkName?.['flex-framework-styles'][0] as string || null,
    }
  }

  const resultOnBoardClientMF = await fetchOnBoardClientMF().catch((e) => {
    // handle the error as needed
    console.error('An error occurred while fetching the data from fetchOnBoardClientMF : ', e)
  })

  init({
    name: `@${process.env.FLEX_GATEWAY_NAME}/onboard`,
    remotes: [
      {
        name: process.env.FLEX_POKER_CLIENT_NAME as string,
        entry: `${process.env.FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST}/mf-manifest.json`,
        // entry: `${process.env.FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST}/remoteEntry_${process.env.FLEX_POKER_CLIENT_NAME}_${props.gitCommitSHA}.js`,
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

  const additionalProps = {
    _nonce,
    remote: process.env.FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST!,
    remoteEntryAsset: resultOnBoardClientMF?.remoteEntryOnBoardClient as string | null,
    flexFrameworkStylesAsset: resultOnBoardClientMF?.flexFrameworkStyles as string | null,
  }

  return {
    ...initialProps,
    ...additionalProps, // 👈 and this!
  }
}

export default observer(MyDocument)
