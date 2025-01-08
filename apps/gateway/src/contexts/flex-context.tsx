import React, { useState, createContext } from 'react'

interface FlexComponentsProviderProps {
  children: React.ReactNode
}

export const FlexComponentsContext = createContext({ flexComponents: {}, setFlexComponents: (flexComponents: any) => { } })

export const FlexComponentsProvider = ({ children }: FlexComponentsProviderProps) => {

  const [flexComponents, setFlexComponents] = useState({})

  return (
    <FlexComponentsContext.Provider value={{ flexComponents, setFlexComponents }}>
      {children}
    </FlexComponentsContext.Provider>
  )
}

interface LoginProviderProps {
  children: React.ReactNode
}

export const LoginContext = createContext({ loggedIn: false, setLoggedIn: (loggedIn: boolean) => { } })

export const LoginProvider = ({ children }: LoginProviderProps) => {

  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </LoginContext.Provider>
  )
}
