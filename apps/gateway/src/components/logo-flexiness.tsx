'use client'

import React from 'react'
import { observer } from 'mobx-react-lite'
import LogoSvg from '@root/public/logo/filled/rectangle/logo_flexiness_2.svg'
import { LogoProps } from '@root/types/additional'
import { getStores } from '@flexiness/domain-store'
import classNames from 'classnames'
import { default as stylesPage } from '@src/styles/scss/pages/logo.module.scss'

const stores = getStores()

const Logo: React.FC<LogoProps> = React.forwardRef<HTMLElement, LogoProps>((props, ref) => {
  const { navigationState } = stores.UIStore
  return (
    <div className={classNames(
        `flex-gateway-logo ${navigationState}`,
        stylesPage.logoDefault,
        stylesPage.logoFlexiness,
        props.className,
      )}
      ref={ref as React.RefObject<HTMLDivElement | null>}>
      <LogoSvg id='logo_flexiness_2' />
    </div>
  )
})

Logo.displayName = 'LogoFlexiness'

export default observer(Logo)
