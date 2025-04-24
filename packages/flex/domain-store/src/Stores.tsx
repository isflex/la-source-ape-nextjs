'use client'

import React from 'react'
import { configure } from 'mobx'
configure({ isolateGlobalState: false })
import { getUIStore, UserInterfaceStore } from './UIStore.js'
import { getSpaghettiStore, SpaghettiMobxStore } from './SpaghettiStore.js'
// export { getServerStore, ServerStoreMobxStore } from './ServerStore.js'
import { isServer } from './utils/index.js'

interface MobxStores {
  UIStore: UserInterfaceStore
  SpaghettiStore: SpaghettiMobxStore
}

let clientSideStores: MobxStores

function getStores() {
  if (isServer) {
    return {
      // ServerStore: getServerStore(),
      UIStore: getUIStore(),
      SpaghettiStore: getSpaghettiStore(),
    }
  }
  if (!clientSideStores) {
    clientSideStores = {
      UIStore: getUIStore(),
      SpaghettiStore: getSpaghettiStore(),
    }
  }

  return clientSideStores
}

interface StoreContextType {
  stores: MobxStores
}

interface StoreProviderProps {
  children: React.ReactNode
  value?: StoreContextType
}

const StoreContext = React.createContext<StoreContextType | null>(null)

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <StoreContext.Provider value={{ stores: getStores() }}>{children}</StoreContext.Provider>
}

// const defaultValue = null
// const StoreContext = React.createContext(defaultValue)

// const StoreProvider = (props: any) => {
//   return <StoreContext.Provider value={props.value}>{props.children}</StoreContext.Provider>
// }

function useStores() {
  return React.useContext(StoreContext)
}

export { getStores, StoreProvider, useStores }
