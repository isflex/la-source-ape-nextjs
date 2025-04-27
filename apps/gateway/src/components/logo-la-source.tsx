'use client'

import React from 'react'
import LogoSvg from '@root/public/logo/la_source/LaSource.svg'
import { LogoProps } from '@root/types/additional'
import { getStores } from '@flexiness/domain-store'
import classNames from 'classnames'
import { default as stylesLayout } from '@src/styles/scss/pages/layout.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/logo.module.scss'

const stores = getStores()

const Logo: React.FC<LogoProps> = () => {
  const { navigationState } = stores.UIStore
  return (
    <div className={classNames(
      `flex-gateway-logo ${navigationState}`,
      stylesPage.logoDefault,
      stylesPage.logoLaSource,
      stylesLayout.navLogo,
    )}>
      <LogoSvg id='LaSource_white' />
    </div>
  )
}

export default Logo
