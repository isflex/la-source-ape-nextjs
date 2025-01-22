import React from 'react'
import dynamic from 'next/dynamic'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'

// import {
//   flexStyles,
// } from '@flex-design-system/react-ts/client-sync-styled-default'

import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/layout.module.scss'

import {
  LayoutProps,
} from '@root/types/additional'

import {
  FlexGlobalThis
} from 'flexiness'

declare let globalThis: FlexGlobalThis

const stores = getStores()

const LogoLaSource = dynamic(() => import('@src/components/logo-la-source'), { ssr: true })
const Header = dynamic(() => import('@src/components/sticky-header/pages'), { ssr: true })

const Layout = observer(({ props, children }: LayoutProps) => {

  const { appContext, navigationState, status } = stores.UIStore

  const NavigationLayout = () => {
    return (
      <div className={stylesPage.navLayout}>
        <LogoLaSource />
        <Header {...props} />
      </div>
    )
  }

  return (
    <div className={classNames(stylesPage.gatewayLayout)}>
      <NavigationLayout />
      { children }
    </div>
  )
})

export default Layout
