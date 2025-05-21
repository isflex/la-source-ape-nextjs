'use server'

import React from 'react'
// import dynamic from 'next/dynamic'
import loadable from '@loadable/component'
// import getConfig from 'next/config'
// const { serverRuntimeConfig } = getConfig()
import { init, loadRemote } from '@module-federation/enhanced/runtime'
import { observer } from 'mobx-react-lite'
// import { PageStaticData } from '@root/types/additional'
// import { getStores } from '@flexiness/domain-store'

const HOST = `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_NAME}`
const MF = `${process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_NAME}`
const REMOTE = `${process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_DEPLOYED_REMOTE_HOST}`

import type {
  FlexGlobalThis
} from 'flexiness'
declare let globalThis: FlexGlobalThis

// const stores = getStores()

// const LogoAPE = dynamic(() => import('@src/components/logo-ape-la-source').then(mod => mod.default), { ssr: true })
// let FlexComponentsRemote: React.ComponentType<any> = LogoAPE

const FlexComponents: React.FC = observer(() => {
  // const { status } = stores.UIStore
  // const [isLoading, setLoading] = React.useState<boolean>(true)
  // const [isPending, startTransition] = React.useTransition()

  init({
    name: `@${HOST}/onboard`,
    remotes: [
      {
        name: MF as string,
        entry: `${REMOTE}/mf-manifest.json`,
        // entry: `${REMOTE}/node/mf-manifest.json`,
        alias: 'Styled',
        // alias: 'ModulesDefault',
        type: 'global',
        // type: 'esm',
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
      // 'react-router': {
      //   version: '7.1.1',
      //   scope: 'default',
      //   shareConfig: {
      //     singleton: true,
      //     requiredVersion: '7.1.1',
      //   },
      //   strategy: 'loaded-first',
      // },
    },
  })

  // const FlexComponentsRemote = loadable(async () => loadRemote(`${MF}/ModulesDefault`).then((m: any) => {
  //   return m.default as React.ComponentType<any>
  // }))

  // return (
  //   <FlexComponentsRemote isStandalone={false} />
  // )

  const FlexComponentsRemote = loadable.lib(async () => loadRemote(`${MF}/Styled`).then((m: any) => {
    const FlexComponents = m.ClientSyncStyled
    globalThis.Flexiness = {
      ...globalThis?.Flexiness,
      domainApp: { ...globalThis?.Flexiness?.domainApp, FlexComponents }
    }
    return FlexComponents
  }))

  return FlexComponentsRemote.preload()
})

export default FlexComponents
