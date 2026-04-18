'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import type { NextPage } from 'next'

import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'

import { ServerPageInfo } from '@root/types/additional'

import classNames from 'classnames'
import { default as stylesPage } from '@src/styles/scss/pages/about.module.scss'

const stores = getStores()
const SLIDE_SRC = '/slides/about.html'

const About: NextPage<ServerPageInfo> = observer(() => {
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)

  const setOverlay = React.useCallback((on: boolean) => {
    const { appContext, setAppContext } = stores.UIStore
    setAppContext({ ...appContext, overlayMode: on })
  }, [])

  React.useEffect(() => {
    setMounted(true)
    document?.querySelector('#gatewayLayout')?.scrollTo({ top: 0, behavior: 'instant' })
    setOverlay(true)
    document.querySelector('html')?.classList.add(`domOverlayMode__${process.env.NEXT_PUBLIC_BUILD_ID}`)
    return () => {
      setOverlay(false)
      document.querySelector('html')?.classList.remove(`domOverlayMode__${process.env.NEXT_PUBLIC_BUILD_ID}`)
    }
  }, [setOverlay])

  const handleCloseSlide = () => {
    setOverlay(false)
    document.querySelector('html')?.classList.remove(`domOverlayMode__${process.env.NEXT_PUBLIC_BUILD_ID}`)
    router.push('/newsletter')
  }

  const ToggleSlideBtn = () => {
    if (!mounted) return null
    const target = document.querySelector('body #gatewayLayout') as HTMLDivElement | null
    if (!target) return null
    return createPortal(
      <div className={classNames(stylesPage.slidesMenuOpen, stylesPage.slidesVersion2)}
        onClick={(e) => {
          ;(e as React.MouseEvent<HTMLDivElement, MouseEvent>).stopPropagation()
        }}>
        <button onClick={handleCloseSlide}
          className={classNames(
            stylesPage.slidesTogglerClose
          )}>
            <span />
            <span />
        </button>
      </div>,
      target,
    )
  }

  return (
    <>
      <ToggleSlideBtn />
      <iframe
        id="marp-slide"
        title="About slide"
        className={stylesPage.marpSlide}
        src={SLIDE_SRC}
      />
    </>
  )
})

export default About
