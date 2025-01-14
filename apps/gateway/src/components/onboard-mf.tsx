'use client'

import React from 'react'
// import dynamic from 'next/dynamic'
import loadable from '@loadable/component'
import { init, registerRemotes, loadRemote } from '@module-federation/enhanced/runtime'
import { observer } from 'mobx-react-lite'
import { PageAppProps } from '@root/types/additional'
// import { isServer } from '@src/utils'
// import { getStores } from '@flexiness/domain-store'

const HOST = `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_NAME}`
const MF = `${process.env.NEXT_PUBLIC_POKER_CLIENT_NAME}`
const REMOTE = `${process.env.NEXT_PUBLIC_CLIENT_DEPLOYED_REMOTE_HOST}`

// const stores = getStores()

// const LogoAPE = dynamic(() => import('@src/components/logo-ape-la-source').then(mod => mod.default), { ssr: true })
// let OnBoardRemote: React.ComponentType<any> = LogoAPE

const OnBoardMF: React.FC<PageAppProps> = observer((props) => {
  // const { status } = stores.UIStore
  // const [isLoading, setLoading] = React.useState<boolean>(true)
  // const [isPending, startTransition] = React.useTransition()

  // if (isServer) return null
  // if (window[`${MF}` as keyof Window]) return null

  const OnBoardRemote = loadable(async () => {
    init({
      name: `@${HOST}/onboard`,
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

    // registerRemotes(
    //   [
    //     {
    //       name: MF as string,
    //       entry: `${REMOTE}/mf-manifest.json`,
    //     },
    //   ],
    //   // { force: true }
    // );

    return await loadRemote(`${MF}/App`).then((m: any) => {
      return m.default as React.ComponentType<any>
    })
  })

  return (
    <OnBoardRemote isStandalone={true} />
  )
})

export default OnBoardMF
