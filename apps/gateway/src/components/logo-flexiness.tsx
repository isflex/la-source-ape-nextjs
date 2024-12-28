'use client'

import React from 'react'
import LogoSvg from '@root/public/logo/filled/rectangle/logo_flexiness_2.svg'
import { LogoProps } from '@root/types/additional'
import { getStores } from '@flexiness/domain-store'

const stores = getStores()

const Logo: React.FC<LogoProps> = () => {
  const { navigationState } = stores.UIStore
  return (
    <div
      className={`flex-gateway-logo ${navigationState}`}
      // className={`flex-gateway-logo`}
      style={{ margin: '0 auto', width: '25vw', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
    >
      <LogoSvg id='flexiness_logo_1' />
    </div>
  )
}

export default Logo
