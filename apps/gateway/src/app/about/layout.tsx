// import React from 'react'
// import dynamic from 'next/dynamic'
// import { headers } from 'next/headers'
// import type { Metadata } from 'next'
// import  { title } from '@src/seo'
// import PostHogNodeClient from '@src/utils/posthog/initPostHogNode'

// // import { isMobile } from 'react-device-detect'
// import { isMobile } from '@src/utils'

// import classNames from 'classnames'
// // import {
// //   Title,
// //   Text,
// // } from '@src/components/flex-server-components'
// // import { TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title'
// import { default as flexStyles } from '@flex-design-system/framework'
// import { default as stylesGeneric } from '@src/styles/scss/flex/generic.module.scss'
// import { default as stylesPage } from '@src/styles/scss/pages/about.module.scss'

// const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })

// import Spaghetti from '@src/components/graphics/spaghetti'
// import TitleContent from '@src/app/about/title-content'
// import About from './client-component'

// export const metadata: Metadata = {
//   title: `À propos | ${title}`,
// }

// export default async function AboutLayout() {

//   const userAgent = (await headers()).get('user-agent') || ''
//   const mobileCheck = isMobile(userAgent)
//   const posthog = PostHogNodeClient()
//   await posthog.shutdown()

//   return (
//     <div className={classNames(
//         stylesGeneric.genericLayout1,
//         stylesPage.aboutApp,
//         mobileCheck && `mobileMode__${process.env.NEXT_PUBLIC_BUILD_ID}`
//       )}>
//       <div className={stylesPage.graphicsHolder}>
//         <div style={{
//           width: '100%',
//         }}>
//           <Spaghetti mobileCheck={mobileCheck} />
//           <LogoAPE />
//         </div>
//       </div>

//       <main className={classNames(stylesGeneric.fullPage, stylesGeneric.hasSpaceBetweenContent)}>
//         <div className={classNames(stylesPage.titleHolder)}>
//           <TitleContent mobileCheck={mobileCheck} />
//         </div>
//         <section className={classNames(
//           stylesPage.sectionAbout, flexStyles.isFullwidth,
//           !mobileCheck && `showSpagehetti__${process.env.NEXT_PUBLIC_BUILD_ID}`
//         )}>
//           <About mobileCheck={mobileCheck} />
//           {/* {children} */}
//         </section>
//       </main>
//     </div>
//   )
// }

import React from 'react'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { buildMetadata } from '@src/seo'
import { isMobile } from '@src/utils'
import PostHogNodeClient from '@src/utils/posthog/initPostHogNode'

export const metadata: Metadata = buildMetadata({
  title: 'À propos',
  description:
    "L'Association des parents d'élèves de l'École nouvelle La Source — missions, équipe et site conçu par l'agence web Flexiness.",
  path: '/about',
})

import classNames from 'classnames'
// import {
//   Title,
//   Text,
// } from '@src/components/flex-server-components'
// import { TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title'
import { default as flexStyles } from '@flex-design-system/framework'
import { default as stylesGeneric } from '@src/styles/scss/flex/generic.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/about.module.scss'

export default async function AboutLayout({ children }: { children: React.ReactNode }) {

  const userAgent = (await headers()).get('user-agent') || ''
  const mobileCheck = isMobile(userAgent)
  const posthog = await PostHogNodeClient()
  await posthog?.shutdown()

  return (
    <div className={classNames(
        stylesGeneric.genericLayout1,
        stylesPage.aboutApp,
        mobileCheck && `mobileMode__${process.env.NEXT_PUBLIC_BUILD_ID}`
      )}>
      <main className={classNames(stylesGeneric.fullPage, stylesGeneric.hasSpaceBetweenContent)}>\
        <section className={classNames(
          stylesPage.sectionAbout, flexStyles.isFullwidth,
          !mobileCheck && `showSpagehetti__${process.env.NEXT_PUBLIC_BUILD_ID}`
        )}>
          {children}
        </section>
      </main>
    </div>
  )
}
