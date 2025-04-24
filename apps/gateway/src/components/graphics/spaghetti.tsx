'use client'

import React from 'react'
import { observer } from 'mobx-react-lite'
import SpaghettiHolderMobile from '@src/components/graphics/spaghetti-holder-mobile'
import SpaghettiHolderDesktop from '@src/components/graphics/spaghetti-holder-desktop'
import LiftOff from '@src/components/graphics/lift-off'
import { getStores } from '@flexiness/domain-store'
// import classNames from 'classnames'

const stores = getStores()

const Spaghetti = observer(({ mobileCheck } : { mobileCheck: boolean }) => {
  const { appContext } = stores.UIStore
  if (appContext.overlayMode === true) return null
  return (
    <>
      {!mobileCheck && (
        <>
          <LiftOff />
          <SpaghettiHolderMobile />
        </>
      )}
      {/* <SpaghettiHolderMobile /> */}
      <SpaghettiHolderDesktop />
    </>
  )
})

export default Spaghetti
