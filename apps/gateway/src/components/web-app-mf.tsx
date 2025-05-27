'use client'

import React from 'react'
// import dynamic from 'next/dynamic'
import loadable from '@loadable/component'
import { init, loadRemote } from '@module-federation/enhanced/runtime'
import { observer } from 'mobx-react-lite'

const HOST = `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_NAME}`
const MF = `${process.env.NEXT_PUBLIC_POKER_CLIENT_NAME}`
const REMOTE = `${process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST}`

const WebAppMF: React.FC<{mobileCheck: boolean}> = observer((props) => {

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
          version: '6.13.1',
          scope: 'default',
          shareConfig: {
            singleton: true,
            requiredVersion: '6.13.1',
          },
        },
        'mobx-react-lite': {
          version: '4.0.7',
          scope: 'default',
          shareConfig: {
            singleton: true,
            requiredVersion: '4.0.7',
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

    return await loadRemote(`${MF}/App`).then((m: any) => {
      return m.default as React.ComponentType<any>
    })
  })

  return (
    <WebAppRemote isStandalone={true} />
  )
})

export default WebAppMF
