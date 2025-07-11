import React from 'react'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import  { title } from '@src/seo'
import PostHogNodeClient from '@src/utils/posthog/initPostHogNode'

import classNames from 'classnames'
import {
  Title,
} from '@src/components/flex-server-components'
import {
  TitleLevel
 } from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'

const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })

export const metadata: Metadata = {
  title: `Accueil | ${title}`,
}

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const posthog = PostHogNodeClient()
  await posthog.shutdown()

  return (
    <div className={flexStyles.genericLayout1}>
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
          <LogoAPE />
        </div>
      </div>
      <main>
        <Title level={TitleLevel.LEVEL1} className={classNames(flexStyles.isCentered)} style={{ marginTop: '-1rem' }}>
          {`Bienvenue au site de l'APE !!`}
        </Title>
        <section>{children}</section>
      </main>
    </div>
  )
}
