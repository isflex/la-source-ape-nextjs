import React from 'react'
import { configure } from 'mobx'
configure({ isolateGlobalState: false })
import { getUIStore, UserInterfaceStore } from './UIStore.js'
// export { getServerStore, ServerStoreMobxStore } from './ServerStore.js'
import { isServer } from './utils/index.js'

interface ClientSideStores {
  UIStore: UserInterfaceStore
}

let clientSideStores: ClientSideStores

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
  stores?: ClientSideStores
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

function useMobxStores() {
  return React.useContext(StoreContext)
}

export { getStores, StoreProvider }
