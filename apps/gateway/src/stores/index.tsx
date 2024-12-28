import React from 'react'
import { isServer } from '@src/utils'
import { getUIStore, UserInterfaceStore } from '@flexiness/domain-store'

interface ClientSideStores {
  UIStore: UserInterfaceStore
}

let clientSideStores: ClientSideStores

// https://github.com/vercel/next.js/tree/master/examples/with-mobx
// https://www.themikelewis.com/post/nextjs-with-mobx
// https://github.com/borekb/nextjs-with-mobx

export function getStores() {
  if (isServer) {
    return {
      UIStore: getUIStore(),
    }
  }
  if (!clientSideStores) {
    clientSideStores = {
      UIStore: getUIStore(),
    }
  }

  return clientSideStores
}

const defaultValue = null
const StoreContext = React.createContext(defaultValue)

export const StoreProvider = (props: any) => {
  return <StoreContext.Provider value={props.value}>{props.children}</StoreContext.Provider>
}

export function useMobxStores() {
  return React.useContext(StoreContext)
}
