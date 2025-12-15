'use client'

import React, { use } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import type { NextPage } from 'next'
// import { PageAppProps } from '@root/types/additional'

import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'

import classNames from 'classnames'
// import { default as flexStyles } from '@flex-design-system/framework'
import { default as stylesPage } from '@src/styles/scss/pages/games.module.scss'

const stores = getStores()

const Game = observer(({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  // const slug = (await params).slug
  const { slug } = use(params)
  const [url, setUrl] = React.useState<string | null>(null);
  const router = useRouter()

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

  React.useEffect(() => {
    const {
      appContext
    } = stores.UIStore
    appContextOverlayMode(!appContext.overlayMode)
    document.querySelector('html')?.classList.add(`domOverlayMode__${process.env.NEXT_PUBLIC_BUILD_ID}`)
    switch (slug) {
      case 'terminus':
        setUrl(`https://luffah.xyz/bidules/Terminus/`)
        break
      case 'ecureuil':
        setUrl(`/slides/squirrel.html`)
        break
      default:
        setUrl(null)
        break
    }
  }, [slug])

  const handleCloseSlide = () => {
    const {
      appContext
    } = stores.UIStore
    appContextOverlayMode(!appContext.overlayMode)
    setUrl(null)
    document.querySelector('html')?.classList.remove(`domOverlayMode__${process.env.NEXT_PUBLIC_BUILD_ID}`)
    router.push('/about?slide-link=dans-quel-but&section-link=4')
  }

  const ToggleSlideBtn = () => {
    if (!url) return null
    return createPortal(
      <div className={classNames(stylesPage.slidesMenuOpen)}
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
      document.querySelector('body #gatewayLayout') as unknown as HTMLDivElement,
    )
  }

  if (!url) return null
  return (
    <>
      <ToggleSlideBtn />
      <iframe
        id="game-bash"
        title="Inline Frame Example"
        allow='screen-wake-lock'
        sandbox='allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation'
        referrerPolicy='no-referrer'
        className={stylesPage.gameIframe}
        src={url}
      />
    </>
  )
})

export default Game

// export default async function Game({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }) {
//   const slug = (await params).slug
//   return <div>My Post: {slug}</div>
// }

// export default function Game({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }) {
//   const { slug } = use(params)
//   return <div>My Post: {slug}</div>
// }
