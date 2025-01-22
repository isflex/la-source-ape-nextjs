'use client'

import React from 'react'
import LogoSvg from '@root/public/logo/ape/ape_la_source_logo_1.svg'
import { LogoProps } from '@root/types/additional'
import { getStores } from '@flexiness/domain-store'
import { motion } from 'framer-motion'

const stores = getStores()

const Logo: React.FC<LogoProps> = () => {
  const { navigationState } = stores.UIStore
  return (
    <div
      className={`flex-gateway-logo ${navigationState}`}
      // className={`flex-gateway-logo`}
      style={{
        zoom: '0.6', padding: '1rem 4rem',
        // width: '100%',
        margin: '0 auto', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <motion.div initial={{ x: '-35vw', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeInOut' }}>
        <LogoSvg id='ape_la_source_logo_1' />
      </motion.div>
    </div>
  )
}

export default Logo
