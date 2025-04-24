import * as path from 'path'
// import os from 'node:os'
// import fs, { writeFileSync } from 'node:fs'
// import { v4 as uuidv4 } from 'uuid'

import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// import detect from 'detect-port'
// import { isServer } from '@src/utils'

import { headers } from 'next/headers'
// import { isMobile } from 'react-device-detect'
import { isMobile } from '@src/utils'

import React from 'react'
import dynamic from 'next/dynamic'

import classNames from 'classnames'
// import {
//   Title,
//   Text,
// } from '@src/components/flex-server-components'
// import {
//   TitleLevel
//  } from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/about.module.scss'

const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })

import Spaghetti from '@src/components/graphics/spaghetti'
import TitleContent from '@src/app/about/title-content'
import About from './client-component'

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const userAgent = (await headers()).get('user-agent') || ''
  const mobileCheck = isMobile(userAgent)

  return (
    <div className={classNames(
        flexStyles.genericLayout1,
        stylesPage.aboutApp,
        mobileCheck && `mobileMode__${process.env.NEXT_PUBLIC_BUILD_ID}`
      )}>
      <div style={{
        height: 'auto',
        padding: '2rem 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          width: '100%',
        }}>
          <Spaghetti mobileCheck={mobileCheck} />
          <LogoAPE />
        </div>
      </div>

      <main className={classNames(flexStyles.fullPage, flexStyles.hasSpaceBetweenContent)}>
        <div className={classNames(stylesPage.titleHolder)}>
          <TitleContent mobileCheck={mobileCheck} />
        </div>
        <section className={classNames(
          stylesPage.sectionAbout, flexStyles.isFullwidth,
          !mobileCheck && `showSpagehetti__${process.env.NEXT_PUBLIC_BUILD_ID}`
        )}>
          <About mobileCheck={mobileCheck} />
          {/* {children} */}
        </section>
      </main>
    </div>
  )
}
