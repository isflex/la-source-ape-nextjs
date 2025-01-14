import React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'

import {
  LayoutProps,
} from '@root/types/additional'

import {
  FlexGlobalThis
} from 'flexiness'

declare let globalThis: FlexGlobalThis

const stores = getStores()

const Layout = observer(({ props, children }: LayoutProps) => {

  const { appContext, navigationState, status } = stores.UIStore

  const navigationLayout = () => {
    switch (true) {
      default:
        return (
          <>
            <div>hello header</div>
          </>
        )
    }
  }

  return (
    <div className={classNames(
      'flex-gateway-layout',
    )}>
      { navigationLayout() }
      { children }
    </div>
  )
})

export default Layout
