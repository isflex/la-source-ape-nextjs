'use client'

import React from 'react'
// import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { NextPage } from 'next'
// import { isMobile } from 'react-device-detect'
// import { isServer } from '@src/utils'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'

import { ServerPageInfo } from '@root/types/additional'
import type {
  // FlexGlobalThis,
  SpaghettiInterface,
} from 'flexiness'
// declare let globalThis: FlexGlobalThis

import classNames from 'classnames'
import {
  // flexStyles,
  // Button,
  // ButtonMarkup,
  // Box,
  Link as FlexLink,
  // Text,
  // Title,
  // TitleLevel,
  // VariantState,
  // IconName,
  // InfoBlock,
  // InfoBlockAction,
  // InfoBlockContent,
  // InfoBlockHeader,
  // InfoBlockStatus,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/about.module.scss'

const stores = getStores()

// const slideBaseUrl = process.env.NEXT_PUBLIC_FLEX_MODE === 'production'
//   ? `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_DEPLOYED_REMOTE_HOSTNAME}`
//   : `${process.env.NEXT_PUBLIC_FLEX_PROTOCOL}localhost`
// const slideUrl = `${slideBaseUrl}:8080`

const About: NextPage<ServerPageInfo> = observer(({ mobileCheck }) => {
  const [showSlide, setShowSlide] = React.useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const slideLink = searchParams?.get('slide-link')
  const sectionLink = searchParams?.get('section-link')

  React.useEffect(() => {
    spagehettiRouteAllUnopened()
  }, [])

  React.useEffect(() => {
    if (slideLink && sectionLink) {
      const {
        appContext
      } = stores.UIStore
      appContextOverlayMode(!appContext.overlayMode)
      setShowSlide(`/slides/${slideLink}.html#${sectionLink}`)
      document.querySelector('html')?.classList.add(`domOverlayMode__${process.env.NEXT_PUBLIC_BUILD_ID}`)
    }
  }, [slideLink, sectionLink])

  const onMessageReceivedFromContentFrame = React.useCallback((e: MessageEvent<any>) => {
    const { data, origin } = e
    const postMessageRegex = new RegExp(/go2route/g)
    if (
      (
        origin === `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_HOST}` ||
        origin === `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_DEPLOYED_REMOTE_HOSTNAME}`
      ) &&
      postMessageRegex.test(data)
    ) {
      // let route: string | null = null
      switch (data) {
        case 'go2routeTerminus':
          // route = `https://luffah.xyz/bidules/Terminus/`
          router.push('/game/bash/terminus')
          // router.push('/games/terminus')
          break
        case 'go2routeSquirrel':
          // route = `/slides/squirrel.html`
          router.push('/game/bash/ecureuil')
          // router.push('/games/ecureuil')
          break
        default:
          break
      }
    }
  }, [router])

  React.useEffect(() => {
    window.addEventListener('message', e => onMessageReceivedFromContentFrame(e), false)
    return () => {
      window.removeEventListener('message', e => onMessageReceivedFromContentFrame(e), false)
    }
  }, [onMessageReceivedFromContentFrame])

  const appContextOverlayMode = (bool: boolean) => {
    const {
      appContext,
      setAppContext
    } = stores.UIStore
    setAppContext(
      {
        ...appContext,
        overlayMode: bool
      }
    )
  }

  const spagehettiRouteViewing = (route: string) => {
    const {
      spaghettiContext,
      setSpaghettiContext
    } = stores.SpaghettiStore
    Object.entries(spaghettiContext.routes).forEach(([key, value]) => {
      if (key === route) {
        setSpaghettiContext(
          {
            ...spaghettiContext,
            ...{
              routes: {
                ...spaghettiContext.routes,
                [key]: {
                  status: 'viewing'
                }
              }
            },
          }
        )
      }
    })
  }

  const spagehettiRouteRead = () => {
    const {
      spaghettiContext,
      setSpaghettiContext
    } = stores.SpaghettiStore
    Object.entries(spaghettiContext.routes).forEach(([key, value]) => {
      if (value.status === 'viewing') {
        setSpaghettiContext(
          {
            ...spaghettiContext,
            ...{
              routes: {
                ...spaghettiContext.routes,
                [key]: {
                  status: 'read'
                }
              }
            },
          }
        )
      }
    })
  }

  const spagehettiRouteAllUnopened = () => {
    const {
      spaghettiContext,
      setSpaghettiContext
    } = stores.SpaghettiStore
    Object.entries(spaghettiContext.routes).forEach(([key, value]) => {
      runInAction(() => {
        spaghettiContext.routes[key as keyof SpaghettiInterface['routes']].status = 'unopened'
      });
    })
    setSpaghettiContext(
      {
        ...spaghettiContext,
      }
    )
  }

  const handleOpenSlide = (route: string) => {
    const {
      appContext
    } = stores.UIStore
    document?.querySelector('#gatewayLayout')?.scrollTo({ top: 0, behavior: 'instant' })
    appContextOverlayMode(!appContext.overlayMode)
    spagehettiRouteViewing(route)
    setShowSlide(`/slides/${route}.html`)
    document.querySelector('html')?.classList.add(`domOverlayMode__${process.env.NEXT_PUBLIC_BUILD_ID}`)
  }

  const handleCloseSlide = () => {
    const {
      appContext
    } = stores.UIStore
    document?.querySelector('#gatewayLayout')?.scrollTo({ top: 0, behavior: 'instant' })
    appContextOverlayMode(!appContext.overlayMode)
    spagehettiRouteRead()
    setShowSlide(null)
    document.querySelector('html')?.classList.remove(`domOverlayMode__${process.env.NEXT_PUBLIC_BUILD_ID}`)
    router.replace('/about')
  }

  const PageContent = () => {
    if (showSlide) return null
    return (
      <div className={stylesPage.aboutLinkGrid}>
        <div style={{ color: mobileCheck ? '#c8007b' : '#39A256'}}>
          <FlexLink onClick={() => handleOpenSlide('pourquoi-ce-site')} className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}>
            {`Pourquoi ce site ?`}
          </FlexLink>
        </div>
        <div style={{ color: mobileCheck ? '#c8007b' : '#324BF7'}}>
          <FlexLink onClick={() => handleOpenSlide('dans-quel-but')} className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}>
            {`Dans quel but ?`}
            </FlexLink>
        </div>
        <div style={{ color: mobileCheck ? '#c8007b' : '#FFFF00'}}>
          <FlexLink onClick={() => handleOpenSlide('qu-est-ce-que-c-est')} className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}>
            {`Qu'est-ce que c'est ?`}
          </FlexLink>
        </div>
        <div style={{ color: mobileCheck ? '#c8007b' : '#FF0000'}}>
          <FlexLink onClick={() => handleOpenSlide('comment-contribuer')} className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}>
            {`Comment contribuer ?`}
          </FlexLink>
        </div>
      </div>
     )
  }

  const ToggleSlideBtn = () => {
    if (!showSlide) return null
    return (
      <div className={classNames(stylesPage.slidesMenuOpen)}>
        <button onClick={handleCloseSlide}
          className={classNames(
            stylesPage.slidesTogglerClose
          )}>
            <span />
            <span />
        </button>
      </div>
    )
  }

  return (
    <>
      <ToggleSlideBtn />
      <div className={stylesPage.aboutContainer}>
        <PageContent />
      </div>
      {showSlide &&
        <iframe
          id="marp-slide"
          title="Inline Frame Example"
          allow='screen-wake-lock'
          sandbox='allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation'
          referrerPolicy='no-referrer-when-downgrade'
          className={stylesPage.marpSlide}
          src={`${showSlide}`}
        />
      }
    </>
  )
})

export default About
