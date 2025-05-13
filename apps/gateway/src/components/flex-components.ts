import React from 'react'
// import { isServer } from '@src/utils/isServer.js'
import loadable, { LoadableLibrary } from '@loadable/component'
import { init, loadRemote } from '@module-federation/enhanced/runtime'

const HOST = `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_NAME}`
const MF = `${process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_NAME}`
const REMOTE = `${process.env.NEXT_PUBLIC_DESIGN_SYS_REACT_TS_DEPLOYED_REMOTE_HOST}`

async function getFlexComponents() {

  init({
    name: `@${HOST}/web-app`,
    remotes: [
      {
        name: MF as string,
        entry: `${REMOTE}/mf-manifest.json`,
        alias: 'Styled',
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

  return loadable.lib(async () => loadRemote(`${MF}/Styled`).then((m: any) => {
    return m.ClientSyncStyled as LoadableLibrary<React.ReactNode[]>
  }))
}

export { getFlexComponents }
