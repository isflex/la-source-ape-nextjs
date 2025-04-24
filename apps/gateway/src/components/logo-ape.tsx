'use client'

import React from 'react'
import { observer } from 'mobx-react-lite'
import LogoSvg from '@root/public/logo/ape/ape_la_source_logo_1.svg'
import { LogoProps } from '@root/types/additional'
import { getStores } from '@flexiness/domain-store'
import * as motion from 'motion/react-client'
import classNames from 'classnames'
import { default as stylesPage } from '@src/styles/scss/pages/logo.module.scss'

const stores = getStores()

const Logo: React.FC<LogoProps> = observer(() => {
  const { navigationState } = stores.UIStore
  const { spaghettiContext } = stores.SpaghettiStore
  return (
    <div className={classNames(
      `flex-gateway-logo ${navigationState}`,
      stylesPage.logoDefault,
      stylesPage.logoApe,
      spaghettiContext.routes['qu-est-ce-que-c-est'].status === 'read' && stylesPage.liftOff,
    )}>
      <motion.div initial={{ x: '-35vw', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeInOut' }}>
        <LogoSvg id='ape_la_source_logo_1' />
      </motion.div>
    </div>
  )
})

export default Logo
