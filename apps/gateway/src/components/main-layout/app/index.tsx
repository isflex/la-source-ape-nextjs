import React from 'react'
import dynamic from 'next/dynamic'

import { headers } from 'next/headers'
// import { isMobile } from 'react-device-detect'
import { isMobile } from '@src/utils'

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

  const userAgent = (await headers()).get('user-agent') || ''
  const mobileCheck = isMobile(userAgent)

  const NavigationLayout = () => {
    return (
      <div className={classNames(stylesPage.navLayout, mobileCheck && stylesPage.forceMobile)}>
        <LogoLaSource />
        <Header mobileCheck={mobileCheck} />
      </div>
    )
  }

  return (
    <div id='gatewayLayout' className={classNames(stylesPage.gatewayLayout)}>
      <NavigationLayout />
      { children }
    </div>
  )
}

export default Layout
