import React from 'react'
import dynamic from 'next/dynamic'

import classNames from 'classnames'
// import {
// } from '@flex-design-system/react-ts/client-sync-styled-default'
// import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/layout.module.scss'

// import {
//   FlexGlobalThis
// } from 'flexiness'

// declare let globalThis: FlexGlobalThis

const LogoLaSource = dynamic(() => import('@src/components/logo-la-source'), { ssr: true })
const Header = dynamic(() => import('@src/components/sticky-header/app'), { ssr: true })

const Layout = async ({children }: { children: React.ReactNode }) => {

  const NavigationLayout = () => {
    return (
      <div className={stylesPage.navLayout}>
        <LogoLaSource />
        <Header />
      </div>
    )
  }

  return (
    <div className={classNames(stylesPage.gatewayLayout)}>
      <NavigationLayout />
      { children }
    </div>
  )
}

export default Layout
