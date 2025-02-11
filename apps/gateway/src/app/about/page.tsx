// apps/gateway/src/app/page.tsx

'use client'

import React from 'react'
// import Link from 'next/link'
import type { NextPage } from 'next'
// import { isMobile } from 'react-device-detect'
// import { isServer } from '@src/utils'

import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'

import { PageAppProps } from '@root/types/additional'
// import type {
//   FlexGlobalThis
// } from 'flexiness'
// declare let globalThis: FlexGlobalThis

import classNames from 'classnames'
import {
  // flexStyles,
  // Button,
  // ButtonMarkup,
  Box,
  Link as FlexLink,
  Text,
  Title,
  TitleLevel,
  // VariantState,
  IconName,
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/about.module.scss'

const stores = getStores()

// const slideBaseUrl = process.env.NEXT_PUBLIC_FLEX_MODE === 'production'
//   ? `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_DEPLOYED_REMOTE_HOSTNAME}`
//   : `${process.env.NEXT_PUBLIC_FLEX_PROTOCOL}localhost`
// const slideUrl = `${slideBaseUrl}:8080`

const About: NextPage<PageAppProps> = observer(() => {
  const [showSlide, setShowSlide] = React.useState<string | null>(null)

  const appContextOverlyaMode = (bool: boolean) => {
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

  const handleOpenSlide = (route: string) => {
    const {
      appContext
    } = stores.UIStore
    appContextOverlyaMode(!appContext.overlayMode)
    setShowSlide(route)
    document.querySelector('html')?.classList.add(`domOverlayMode__${process.env.NEXT_PUBLIC_BUILD_ID}`)
  }

  const handleCloseSlide = () => {
    const {
      appContext
    } = stores.UIStore
    appContextOverlyaMode(!appContext.overlayMode)
    setShowSlide(null)
    document.querySelector('html')?.classList.remove(`domOverlayMode__${process.env.NEXT_PUBLIC_BUILD_ID}`)
  }

  const PageContent = () => {
    if (showSlide) return null
    return (
      <div className={stylesPage.aboutLinkGrid}>
        <div>
          <FlexLink onClick={() => handleOpenSlide('pourquoi-ce-site')} className={flexStyles.link}>
            {`Pourquoi ce site ?`}
          </FlexLink>
        </div>
        <div>
          <FlexLink onClick={() => handleOpenSlide('dans-quel-but')} className={flexStyles.link}>
            {`Dans quel but ?`}
            </FlexLink>
        </div>
        <div>
          <FlexLink onClick={() => handleOpenSlide('pourquoi-ce-site')} className={flexStyles.link}>
            {`Qu'est-ce que c'est ?`}
          </FlexLink>
        </div>
        <div>
          <FlexLink onClick={() => handleOpenSlide('pourquoi-ce-site')} className={flexStyles.link}>
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
          referrerPolicy='no-referrer'
          className={stylesPage.marpSlide}
          // src={`${slideUrl}/${showSlide}.md`}
          src={`/slides/${showSlide}.html`}
        />
      }
    </>
  )
})

export default About
