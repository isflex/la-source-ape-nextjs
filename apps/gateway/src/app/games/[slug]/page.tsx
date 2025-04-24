'use client'

import React, { use } from 'react'
// import Link from 'next/link'
// import type { NextPage } from 'next'
// import { PageAppProps } from '@root/types/additional'

// import classNames from 'classnames'
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

const Game = ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  // const slug = (await params).slug
  const { slug } = use(params)
  let url = React.useRef<string | null>(null);
  React.useEffect(() => {
    switch (slug) {
      case 'terminus':
        url.current = `https://luffah.xyz/bidules/Terminus/`
        break
      case 'ecureuil':
        url.current = `/slides/squirrel.html`
        break
      default:
        url.current = null
        break
    }
  }, [slug])

  if (!url.current) return null
  return (
    <iframe
      id="game-bash-terminus"
      title="Inline Frame Example"
      allow='screen-wake-lock'
      sandbox='allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation'
      referrerPolicy='no-referrer'
      className={stylesPage.gameIframe}
      src={`${url.current}`}
    />
  )
}

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
