import React from 'react'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { buildMetadata } from '@src/seo'
import PostHogNodeClient from '@src/utils/posthog/initPostHogNode'

import classNames from 'classnames'
import {
  Title,
} from '@src/components/flex-server-components'
import { TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title'
import { default as flexStyles } from '@flex-design-system/framework'
import { default as stylesGeneric } from '@src/styles/scss/flex/generic.module.scss'

const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })

export const metadata: Metadata = buildMetadata({
  title: 'Accueil',
  description:
    "Bienvenue sur le site de l'Association des parents d'élèves de l'École nouvelle La Source.",
  path: '/home',
})

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const posthog = await PostHogNodeClient()
  await posthog?.shutdown()

  return (
    <div className={stylesGeneric.genericLayout1}>
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
