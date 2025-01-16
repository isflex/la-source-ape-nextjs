import React from 'react'
import dynamic from 'next/dynamic'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'
import Sticky from 'react-sticky-el'

import {
  flexStyles,
} from '@flex-design-system/react-ts/client-sync-styled-default'

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
const NavBar = dynamic(() => import('@src/components/navbar'), { ssr: true })

const stickyStyles: { [key: string]: React.CSSProperties } = {
  reset: {
    order: 1,
    width: '100%',
  }
}

const Layout = observer(({ props, children }: LayoutProps) => {

  const { appContext, navigationState, status } = stores.UIStore

  const NavigationLayout = () => {
    return (
      <div className={stylesPage.layoutHolder}>
        <LogoLaSource />
        <div className={stylesPage.stickyContainer}>
          <Sticky stickyClassName={stylesPage.stickyWrapper}
            topOffset={20}>
            <NavBar {...props} />
          </Sticky>
        </div>
      </div>
    )
  }

  return (
    <div className={classNames(
      'flex-gateway-layout',
    )}>
      <NavigationLayout />
      { children }
    </div>
  )
})

export default Layout
