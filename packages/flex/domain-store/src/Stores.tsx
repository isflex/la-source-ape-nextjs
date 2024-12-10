import React from 'react'
import { configure } from 'mobx'
configure({ isolateGlobalState: false })
import { getUIStore, UserInterfaceStore } from './UIStore.js'
// export { getServerStore, ServerStoreMobxStore } from './ServerStore.js'
import { isServer } from './utils/index.js'

interface Stores {
  UIStore: UserInterfaceStore
}

let clientSideStores: Stores

function getStores() {
  if (isServer) {
    return {
      // ServerStore: getServerStore(),
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

interface StoreContextType {
  stores?: Stores
}

interface StoreProviderProps {
  children: React.ReactNode
  value?: StoreContextType
}

const StoreContext = React.createContext<StoreContextType | null>(null)

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <StoreContext.Provider value={{ stores: getStores() }}>{children}</StoreContext.Provider>
}

export { getStores, StoreProvider }
