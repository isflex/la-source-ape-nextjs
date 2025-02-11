'use client'

import React from 'react'
import LogoSvg from '@root/public/logo/filled/rectangle/logo_flexiness_2.svg'
import { LogoProps } from '@root/types/additional'
import { getStores } from '@flexiness/domain-store'
import classNames from 'classnames'
import { default as stylesPage } from '@src/styles/scss/pages/logo.module.scss'

const stores = getStores()

const Logo: React.FC<LogoProps> = () => {
  const { navigationState } = stores.UIStore
  return (
    <div className={classNames(
        `flex-gateway-logo ${navigationState}`,
        stylesPage.logoDefault,
        stylesPage.logoFlexiness
      )}>
      <LogoSvg id='logo_flexiness_2' />
    </div>
  )
}

export default Logo
