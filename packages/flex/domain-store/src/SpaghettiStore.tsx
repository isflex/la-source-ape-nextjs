/* eslint-disable no-console */
import {
  action,
  // toJS,
  makeAutoObservable,
  observable,
} from 'mobx'

import { SpaghettiInterface, FlexGlobalThis } from 'flexiness'

// import { isMobile } from 'react-device-detect'
import { isServer } from './utils/index.js'
// import localForage from 'localforage'
// import { makePersistable } from 'mobx-persist-store'
// import { makePersistable, getPersistedStore } from 'mobx-persist-store'
// import { isServer } from './utils/index.js'

declare let globalThis: FlexGlobalThis
// declare type getSpaghettiStore = () => SpaghettiMobxStore
export class SpaghettiMobxStore {
  constructor(
    public spaghettiContext: SpaghettiInterface,
    public userAuth: Record<string, any> | null,
  ) {
    makeAutoObservable(this, {
      spaghettiContext: observable,
      setSpaghettiContext: action,
      userAuth: observable,
      setUserAuth: action,
      unsetUserAuth: action,
    })
  }

  setSpaghettiContext = (newSpaghettiContext: SpaghettiInterface) => {
    this.spaghettiContext = newSpaghettiContext
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUserAuth = (data: Record<string, any>) => {
    this.userAuth = data
  }

  unsetUserAuth = () => {
    this.userAuth = null
  }
}

let SpaghettiStore: SpaghettiMobxStore | undefined = globalThis.Flexiness?.domainApp?.SpaghettiStore
export function getSpaghettiStore() {
  if (!SpaghettiStore || isServer) {
    SpaghettiStore = new SpaghettiMobxStore(
      // spaghettiContext
      {
        routes: {
          ['pourquoi-ce-site']: {
            status: 'unopened'
          },
          ['dans-quel-but']: {
            status: 'unopened'
          },
          ['qu-est-ce-que-c-est']: {
            status: 'unopened'
          },
          ['comment-contribuer']: {
            status: 'unopened'
          },
        }
      },

      // userAuth
      null,
    )
    globalThis.Flexiness = {
      ...globalThis.Flexiness,
      domainApp: { ...globalThis.Flexiness?.domainApp, SpaghettiStore },
    }
  }
  return SpaghettiStore
}
