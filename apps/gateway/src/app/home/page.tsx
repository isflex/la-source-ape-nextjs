// apps/gateway/src/app/page.tsx

'use client'

import React from 'react'
import Link from 'next/link'
import type { NextPage } from 'next'
import { PageAppProps } from '@root/types/additional'

import classNames from 'classnames'
import {
  // flexStyles,
  // Button,
  // ButtonMarkup,
  Box,
  // Link,
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

const Home: NextPage<PageAppProps> = () => {
  return (
    <InfoBlock>
      <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.UI_INFO_CIRCLE}>
        <Title level={TitleLevel.LEVEL3}>{`Contenu de la page à venir`}</Title>
      </InfoBlockHeader>
      <InfoBlockContent>
        <Title level={TitleLevel.LEVEL4}>{`... avec l'aide des élèves de la source en forme d'atelier pratique`}<br/>🤞</Title>
      </InfoBlockContent>
      <InfoBlockAction>
        <div className={classNames(flexStyles.isFullwidth, flexStyles.isFlex, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentSpaceEvenly)}>
          <Link href='/qui-sommes-nous' target='_blank' className={flexStyles.link}>Qui somme nous ?</Link>
          <Link href='/helloasso' target='_blank' className={flexStyles.link}>L&apos;APE sur helloasso</Link>
        </div>
      </InfoBlockAction>
    </InfoBlock>
  )
}

export default Home
