import React from 'react'
import dynamic from 'next/dynamic'

import { headers } from 'next/headers'
// import { isMobile } from 'react-device-detect'
import { isMobile } from '@src/utils'

import classNames from 'classnames'
import { default as stylesLayout } from '@src/styles/scss/pages/layout.module.scss'

// import {
//   FlexGlobalThis
// } from 'flexiness'

// declare let globalThis: FlexGlobalThis

// const LogoLaSource = dynamic(() => import('@src/components/logo-la-source'), { ssr: true })
const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })
const Header = dynamic(() => import('@src/components/sticky-header/app'), { ssr: true })
const Footer = dynamic(() => import('@src/components/footer/app'), { ssr: true })

const NavigationLayout = ({mobileCheck} : { mobileCheck: boolean }) => {
  return (
    <div className={classNames(stylesLayout.navLayout, mobileCheck && stylesLayout.forceMobile)}>
      {/* <LogoLaSource className={stylesLayout.navLogo} /> */}
      <LogoAPE isNavLogo={true} className={classNames(stylesLayout.navLogo, stylesLayout.navLogoApe)} />
      <Header mobileCheck={mobileCheck} />
    </div>
  )
}

const MainLayout = async ({children }: { children: React.ReactNode }) => {
  const userAgent = (await headers()).get('user-agent') || ''
  const mobileCheck = isMobile(userAgent)

  return (
    <div id='gatewayLayout' className={classNames(stylesLayout.gatewayLayout)}>
      <NavigationLayout mobileCheck={mobileCheck} />
      { children }
      <Footer />
    </div>
  )
}

export default MainLayout
