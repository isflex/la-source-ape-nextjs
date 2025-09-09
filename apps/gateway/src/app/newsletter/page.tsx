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
// import { default as stylesPage } from '@src/styles/scss/pages/games.module.scss'
// import { default as stylesPage } from '@src/styles/scss/pages/newsletter.module.scss'

import Email from './presentation/email'
import { default as stylesPage } from '@src/styles/scss/pages/newsletter.module.scss'

// type NewsletterProps =
//   | { type: 'iframe'; location: string }
//   | { type: 'page'; location: React.ReactNode }
//   | null;

// const Newsletter = ({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }) => {
//   // const slug = (await params).slug
//   const { slug } = use(params)
//   const [content, setContent] = React.useState<NewsletterProps | null>(null)

// React.useEffect(() => {
//   (async () => {
//     switch (slug) {
//       case 'email':
//         try {
//           const myModule = await import(`./presentation/${slug}.js`)
//           setContent({
//             type: 'page',
//             location: myModule.default as React.ReactNode
//           })
//         } catch (error) {
//           console.error(`Failed to load ${slug} module:`, error)
//           setContent(null)
//         }
//         break
//       // case 'something-else':
//       //   setContent({
//       //     type: 'iframe',
//       //     location: '/slides/squirrel.html'
//       //   })
//       //   break
//       default:
//         setContent(null)
//         break
//     }
//   })()
// }, [slug])

//   if (!content) {
//     return <div>404: Not found</div>
//   } else if (content.type === 'iframe') {
//     return (
//       <iframe
//         id={`newsletter-iframe-${slug}`}
//         title="Inline Frame Example"
//         allow='screen-wake-lock'
//         sandbox='allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation'
//         referrerPolicy='no-referrer'
//         className={stylesPage.gameIframe}
//         src={`${content.location}`}
//       />
//     )
//   } else if (content.type === 'page') {
//     <div id={`newsletter-page-${slug}`} className='newsletter-content'>{content.location}</div>
//   }

//   // This should never be reached, but TypeScript requires it
//   return null
// }

const Newsletter = ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = use(params)
  return (
    <div id={`newsletter-page-${slug}`} className={stylesPage.newsletterContent}>
      <Email />
    </div>
  )
}

export default Newsletter
