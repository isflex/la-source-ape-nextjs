'use client'

import React from 'react'
import { RootStore } from '@src/stores/root-store'

export const StoreContext = React.createContext(RootStore)

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <StoreContext.Provider value={RootStore}>{children}</StoreContext.Provider>
}
export function useStores() {
  return React.useContext(StoreContext)
}
