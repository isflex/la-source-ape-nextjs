'use client'

import React from 'react'
// import dynamic from 'next/dynamic'
import loadable from '@loadable/component'
import { init, loadRemote } from '@module-federation/enhanced/runtime'
import { observer } from 'mobx-react-lite'

const HOST = `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_NAME}`
const MF = `${process.env.NEXT_PUBLIC_POKER_CLIENT_NAME}`
const REMOTE = `${process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST}`

// import classNames from 'classnames'
import {
  // flexStyles,
  // Button,
  // ButtonMarkup,
  // Box,
  // Link,
  Text,
  Title,
  TitleLevel,
  // VariantState,
  // IconName,
  InfoBlock,
  // InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  // InfoBlockStatus,
} from '@flex-design-system/react-ts/client-sync-styled-default'
// import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'

const WebAppMF: React.FC<{mobileCheck: boolean}> = observer((props) => {

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
    init({
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
          version: '19.1.0',
          scope: 'default',
          lib: () => React,
          shareConfig: {
            singleton: true,
            requiredVersion: '19.1.0',
          },
        },
        mobx: {
          version: '6.13.7',
          scope: 'default',
          shareConfig: {
            singleton: true,
            requiredVersion: '6.13.7',
          },
        },
        'mobx-react-lite': {
          version: '4.1.0',
          scope: 'default',
          shareConfig: {
            singleton: true,
            requiredVersion: '4.1.0',
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
        'framer-motion': {
          version: '12.23.12',
          scope: 'default',
          shareConfig: {
            singleton: true,
            requiredVersion: '12.23.12',
          },
        },
      },
      shareStrategy: 'loaded-first',
    })

    const responseRemote = await loadRemote(`${MF}/App`)
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
