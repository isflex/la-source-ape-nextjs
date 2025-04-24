'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Sticky from 'react-sticky-el'

// import classNames from 'classnames'
// import {
//   // flexStyles,
//   Text,
// } from '@flex-design-system/react-ts/client-sync-styled-default'
// import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/sticky.module.scss'

const NavBarApp = dynamic(() => import('@src/components/navbar/app'), { ssr: true })

const StickyHeader = ({mobileCheck} : {mobileCheck: boolean}) => {
  return (
    <div className={stylesPage.stickyContainer}>
      <Sticky stickyClassName={stylesPage.stickyWrapper} topOffset={20}>
        <NavBarApp mobileCheck={mobileCheck} />
      </Sticky>
    </div>
  )
}

export default StickyHeader
