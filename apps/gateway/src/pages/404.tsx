import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import classNames from 'classnames'
import {
  // Button,
  // ButtonMarkup,
  // Link,
  // Text,
  // TextLevel,
  Title,
  // TitleLevel,
  // VariantState,
  // IconName,
  // InfoBlock,
  // InfoBlockAction,
  // InfoBlockContent,
  // InfoBlockHeader,
  // InfoBlockStatus,
  // Modal,
  // flexStyles
} from '@flex-design-system/react-ts/client-sync-styled-default'
// import { default as flexStyles } from '@flex-design-system/framework'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/todo.module.scss'

const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <div className={classNames(flexStyles.genericLayout1, stylesPage.todoApp)}>
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
        <main className={stylesPage.hasCenteredContent}>
          <Title>404 - Page Not Found</Title>
        </main>
      </div>
    </>
  )
}
