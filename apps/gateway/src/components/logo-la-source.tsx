'use client'

import React from 'react'
import LogoSvg from '@root/public/logo/la_source/LaSource.svg'
import { LogoProps } from '@root/types/additional'
import { getStores } from '@flexiness/domain-store'

const stores = getStores()

const Logo: React.FC<LogoProps> = () => {
  const { navigationState } = stores.UIStore
  return (
    <div
      className={`flex-gateway-logo ${navigationState}`}
      style={{
        order: '2',
        zoom: '0.4', padding: '1rem 4rem',
        // width: '100%',
        margin: '0 auto', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <LogoSvg id='LaSource_white' />
    </div>
  )
}

export default Logo
