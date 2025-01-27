'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'
import Sticky from 'react-sticky-el'

import {
  PageAppProps,
} from '@root/types/additional'

// import classNames from 'classnames'
// import {
//   Text,
// } from '@flex-design-system/react-ts/client-sync-styled-default'
// import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/sticky.module.scss'

const stores = getStores()

const NavBarPages = dynamic(() => import('@src/components/navbar/pages'), { ssr: true })

const StickyHeader: React.FC<PageAppProps> = observer((props) => {
  return (
    <div className={stylesPage.stickyContainer}>
      <Sticky stickyClassName={stylesPage.stickyWrapper} topOffset={20}>
        <NavBarPages {...props} />
      </Sticky>
    </div>
  )
})

export default StickyHeader
