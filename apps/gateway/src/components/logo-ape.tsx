'use client'

import React from 'react'
import { observer } from 'mobx-react-lite'
import LogoSvg from '@root/public/logo/ape/ape_la_source_logo_1.svg'
import { LogoProps } from '@root/types/additional'
import { getStores } from '@flexiness/domain-store'
import { motion } from 'framer-motion'
import classNames from 'classnames'
import {
  // Title,
  // TitleLevel,
  Text,
 } from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/logo.module.scss'
import { default as stylesLayout } from '@src/styles/scss/pages/layout.module.scss'

const stores = getStores()

const Logo: React.FC<LogoProps> = React.forwardRef<HTMLElement, LogoProps>((props, ref) => {
  if (props.isNavLogo === true) {
    return (
      <div className={classNames(
        stylesLayout.navLogoApe,
        stylesLayout.navLogo,
        props.className,
      )}>
        <LogoSvg id='ape_la_source_logo_1' />
      </div>
    )
  }
  const { navigationState, status } = stores.UIStore
  const { spaghettiContext } = stores.SpaghettiStore
  if (props.isLoader === true) {
    if (status !== 'done') {
      return (
        <div style={{
          height: 'auto',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <motion.div initial={{ x: '-35vw', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeInOut' }}>
            <div style={{
              height: '70vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <div style={{ zoom: '0.6', padding: '0 0 3rem' }}>
                <LogoSvg id='ape_la_source_logo_1' />
              </div>
              <Text className={flexStyles.hasTextSuccess}>... Loading</Text>
            </div>
          </motion.div>
        </div>
      )
    }
  } else {
    return (
      <div className={classNames(
        `flex-gateway-logo ${navigationState}`,
        stylesPage.logoDefault,
        stylesPage.logoApe,
        spaghettiContext.routes['qu-est-ce-que-c-est'].status === 'read' && stylesPage.liftOff,
        props.className,
      )}
      ref={ref as React.RefObject<HTMLDivElement | null>}>
        <motion.div initial={{ x: '-35vw', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeInOut' }}>
          <LogoSvg id='ape_la_source_logo_1' />
        </motion.div>
      </div>
    )}
})

Logo.displayName = 'LogoAPE'

export default observer(Logo)
