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
// import Script from 'next/script'
import { observer } from 'mobx-react-lite'
import { init, preloadRemote, registerRemotes, loadRemote } from '@module-federation/enhanced/runtime'

interface DocumentProps extends DocumentInitialProps {
  _nonce: string
  remoteOnBoardClient: string
  remoteOnBoardClientEntryAsset: string | null
  flexFrameworkStylesAsset: string | null
  remoteFlexComponents: string
  remoteFlexComponentsEntryAsset: string | null
}

const styles: { [key: string]: React.CSSProperties } = {
  reset: {
    margin: 0,
    padding: 0,
    maxWidth: '100vw',
    overflowX: 'hidden',
    boxSizing: 'border-box'
  }
};

const MyDocument = (props: DocumentProps) => {
  const {
    _nonce,
    remoteOnBoardClient,
    remoteOnBoardClientEntryAsset,
    flexFrameworkStylesAsset,
    remoteFlexComponents,
    remoteFlexComponentsEntryAsset
  } = props
  return (
    <Html lang='fr' style={styles.reset}>
      <Head nonce={_nonce}>
        <link nonce={_nonce} rel='preload' as='fetch' href={`${remoteOnBoardClient}/mf-manifest.json`} crossOrigin='anonymous' />
        <link nonce={_nonce} rel='preload' as='fetch' href={`${remoteOnBoardClient}/loadable-stats.json`} crossOrigin='anonymous' />
        <link nonce={_nonce} rel='preload' as='fetch' href={`${remoteFlexComponents}/node/mf-manifest.json`} crossOrigin='anonymous' />
        <link nonce={_nonce} rel='preload' as='fetch' href={`${remoteFlexComponents}/node/loadable-stats.json`} crossOrigin='anonymous' />
        {remoteOnBoardClientEntryAsset && (
          <link nonce={_nonce} rel='preload' as='script' href={`${remoteOnBoardClient}/${remoteOnBoardClientEntryAsset}`} crossOrigin='anonymous' />
        )}
        {remoteFlexComponentsEntryAsset && (
          <link nonce={_nonce} rel='preload' as='script' href={`${remoteFlexComponents}/${remoteFlexComponentsEntryAsset}`} crossOrigin='anonymous' />
        )}
        {flexFrameworkStylesAsset && (
          <>
            <link nonce={_nonce} rel='preload' as='style' href={`${remoteOnBoardClient}/${flexFrameworkStylesAsset}`} crossOrigin='anonymous' />
            <link nonce={_nonce} rel='stylesheet' href={`${remoteOnBoardClient}/${flexFrameworkStylesAsset}`} />
          </>
        )}
      </Head>
      <body style={styles.reset}>
        <Main />
        <NextScript nonce={_nonce} />
        {/* {remoteOnBoardClientEntryAsset && (
          <Script nonce={_nonce} src={`${remoteOnBoardClient}/${remoteOnBoardClientEntryAsset}`} strategy='beforeInteractive'></Script>
        )} */}
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
    const responseOnBoardClient = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST}/loadable-stats.json`)
    if (!responseOnBoardClient.ok) {
      throw new Error(`HTTP error! status: ${responseOnBoardClient.status}`)
    }
    const resultOnBoardClient = await responseOnBoardClient.json()
    // console.log(resultOnBoardClient?.assetsByChunkName)

    const responseFlexComponents = await fetch(`${process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_DEPLOYED_REMOTE_HOST}/loadable-stats.json`)
    if (!responseFlexComponents.ok) {
      throw new Error(`HTTP error! status: ${responseFlexComponents.status}`)
    }
    const resultFlexComponents = await responseFlexComponents.json()
    // console.log(resultFlexComponents?.assetsByChunkName)

    init({
      name: `@${process.env.NEXT_PUBLIC_FLEX_GATEWAY_NAME}/onboard`,
      remotes: [
        {
          name: process.env.NEXT_PUBLIC_POKER_CLIENT_NAME as string,
          entry: `${process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST}/mf-manifest.json`,
          // entry: `${process.env.FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST}/remoteEntry_${process.env.FLEX_POKER_CLIENT_NAME}_${props.gitCommitSHA}.js`,
          alias: 'App',
          type: 'global',
        },
        {
          name: process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_NAME as string,
          entry: `${process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_DEPLOYED_REMOTE_HOST}/mf-manifest.json`,
          // entry: `${process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_DEPLOYED_REMOTE_HOST}/remoteEntry_${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}_${props.gitCommitSHA}.js`,
          alias: 'Styled',
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
        }
      },
    })

    return {
      remoteEntryOnBoardClient: resultOnBoardClient?.assetsByChunkName?.['flex_poker_client_modfed'][0] as string || null,
      flexFrameworkStyles: resultOnBoardClient?.assetsByChunkName?.['flex-framework-styles'][0] as string || null,
      remoteEntryFlexComponents: resultFlexComponents?.assetsByChunkName?.['flex_design_system_react_ts_modfed'][0] as string || null,
    }
  }

  const resultModFeds = await fetchMFs().catch((e) => {
    // handle the error as needed
    console.error('An error occurred while fetching the data from fetchMFs : ', e)
  })

  const additionalProps = {
    _nonce,
    remoteOnBoardClient: process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST!,
    remoteOnBoardClientEntryAsset: resultModFeds?.remoteEntryOnBoardClient as string | null,
    flexFrameworkStylesAsset: resultModFeds?.flexFrameworkStyles as string | null,
    remoteFlexComponents: process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_DEPLOYED_REMOTE_HOST!,
    remoteFlexComponentsEntryAsset: resultModFeds?.remoteEntryFlexComponents as string | null,
  }

  return {
    ...initialProps,
    ...additionalProps, // 👈 and this!
  }
}

export default observer(MyDocument)
