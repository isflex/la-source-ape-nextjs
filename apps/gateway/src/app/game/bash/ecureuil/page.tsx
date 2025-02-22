'use client'

import React, { use } from 'react'
// import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { NextPage } from 'next'

import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'

import { PageAppProps } from '@root/types/additional'

import classNames from 'classnames'
// import {
//   // flexStyles,
//   // Button,
//   // ButtonMarkup,
//   Box,
//   // Link,
//   Text,
//   Title,
//   TitleLevel,
//   // VariantState,
//   // IconName,
//   // InfoBlock,
//   // InfoBlockAction,
//   // InfoBlockContent,
//   // InfoBlockHeader,
//   // InfoBlockStatus,
// } from '@flex-design-system/react-ts/client-sync-styled-default'
// import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/games.module.scss'

const stores = getStores()

const Game: NextPage<PageAppProps> = observer(() => {
  const [urlIframe, setUrlIframe] = React.useState<string | null>(null)
  const router = useRouter()

  React.useEffect(() => {
    handleOpenSlide(`/slides/squirrel.html`)
  }, [])

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

  const handleOpenSlide = (route: string) => {
    const {
      appContext
    } = stores.UIStore
    appContextOverlayMode(!appContext.overlayMode)
    setUrlIframe(route)
    document.querySelector('html')?.classList.add(`domOverlayMode__${process.env.NEXT_PUBLIC_BUILD_ID}`)
  }

  const handleCloseSlide = () => {
    const {
      appContext
    } = stores.UIStore
    appContextOverlayMode(!appContext.overlayMode)
    setUrlIframe(null)
    document.querySelector('html')?.classList.remove(`domOverlayMode__${process.env.NEXT_PUBLIC_BUILD_ID}`)
    router.push('/about?slide-link=dans-quel-but&section-link=4')
  }

  const ToggleSlideBtn = () => {
    if (!urlIframe) return null
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
      <iframe
        id="game-bash-squirrel"
        title="Inline Frame Example"
        allow='screen-wake-lock'
        sandbox='allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation'
        referrerPolicy='no-referrer'
        className={stylesPage.gameIframe}
        src={`${urlIframe}`}
      />
    </>
  )
})

export default Game
