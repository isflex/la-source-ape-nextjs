'use client'

import React from 'react'
import * as mobx from 'mobx'
import * as mobxReactLite from 'mobx-react-lite'
import * as framerMotion from 'framer-motion'
import {
  agUiClient,
  agUiCore,
  agUiEncoder,
  agUiProto,
  copilotkitReactCoreV2,
} from '@flexiness/copilotkit/federation'
// import dynamic from 'next/dynamic'
import loadable from '@loadable/component'
import { createInstance } from '@module-federation/enhanced/runtime'
import { observer } from 'mobx-react-lite'

const HOST = `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_NAME}`
const MF = `${process.env.NEXT_PUBLIC_POKER_CLIENT_NAME}`
const REMOTE = `${process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST}`

// import classNames from 'classnames'
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import {
  InfoBlock,
  InfoBlockContent,
  InfoBlockHeader
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block'
// import { default as flexStyles } from '@flex-design-system/framework'

const WebAppMF: React.FC<{mobileCheck: boolean}> = observer(() => {

  const FallBackWeHaveAProblem = () => {
    return (
      <InfoBlock>
        <InfoBlockHeader>
          <Title level={TitleLevel.LEVEL2}>🤯</Title>
          <Title level={TitleLevel.LEVEL3}>{`Houston, we have a problem...`}</Title>
        </InfoBlockHeader>
        <InfoBlockContent>
          <Title level={TitleLevel.LEVEL4}>{`Something went wrong and we're working on it!!`}</Title>
        </InfoBlockContent>
      </InfoBlock>
    )
  }

  const Loading = () => {
    return (
      <Text>Loading...</Text>
    )
  }

  const WebAppRemote = loadable(async () => {
    const instance = createInstance({
      name: `@${HOST}/web-app`,
      remotes: [
        {
          name: MF as string,
          entry: `${REMOTE}/mf-manifest.json`,
          alias: 'App',
          type: 'global',
        },
      ],
      shared: {
        react: {
          version: '19.2.1',
          scope: 'default',
          lib: () => React,
          shareConfig: {
            singleton: true,
            requiredVersion: '19.2.1',
          },
        },
        mobx: {
          version: '6.13.7',
          scope: 'default',
          lib: () => mobx,
          shareConfig: {
            singleton: true,
            requiredVersion: '6.13.7',
          },
        },
        'mobx-react-lite': {
          version: '4.1.0',
          scope: 'default',
          lib: () => mobxReactLite,
          shareConfig: {
            singleton: true,
            requiredVersion: '4.1.0',
          },
        },
        'framer-motion': {
          version: '12.23.12',
          scope: 'default',
          lib: () => framerMotion,
          shareConfig: {
            singleton: true,
            requiredVersion: '12.23.12',
          },
        },
        '@copilotkit/react-core/v2': {
          version: '1.56.3',
          scope: 'default',
          lib: () => copilotkitReactCoreV2,
          shareConfig: {
            singleton: true,
            requiredVersion: '^1.56.3',
          },
        },
        '@ag-ui/client': {
          version: '0.0.48',
          scope: 'default',
          lib: () => agUiClient,
          shareConfig: {
            singleton: true,
            requiredVersion: '0.0.48',
          },
        },
        '@ag-ui/core': {
          version: '0.0.48',
          scope: 'default',
          lib: () => agUiCore,
          shareConfig: {
            singleton: true,
            requiredVersion: '0.0.48',
          },
        },
        '@ag-ui/encoder': {
          version: '0.0.48',
          scope: 'default',
          lib: () => agUiEncoder,
          shareConfig: {
            singleton: true,
            requiredVersion: '0.0.48',
          },
        },
        '@ag-ui/proto': {
          version: '0.0.48',
          scope: 'default',
          lib: () => agUiProto,
          shareConfig: {
            singleton: true,
            requiredVersion: '0.0.48',
          },
        },

        // 'react-router': {
        //   version: '7.6.0',
        //   scope: 'default',
        //   shareConfig: {
        //     singleton: true,
        //     requiredVersion: '7.6.0',
        //   },
        // },
      },
      shareStrategy: 'loaded-first',
    })

    const responseRemote = await instance.loadRemote(`${MF}/App`)
      .then((m: any) => {
        // console.log(m)
        if (m?.__esModule) return m?.default as React.ComponentType<any>
        return FallBackWeHaveAProblem
      })

    return responseRemote
  })

  return (
    <React.Suspense fallback={<Loading />}>
      <WebAppRemote isStandalone={true} />
    </React.Suspense>
  )
})

export default WebAppMF
