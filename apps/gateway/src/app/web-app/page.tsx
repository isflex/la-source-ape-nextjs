'use server'

import React from 'react'
import dynamic from 'next/dynamic'
import { headers } from 'next/headers'
import { isMobile } from '@src/utils'
// const WebAppMF = dynamic(async () => await import('@src/components/web-app-mf'), { ssr: true })

// import classNames from 'classnames'
import {
  // Box,
  // Button,
  // ButtonMarkup,
  // Columns,
  // ColumnsItem,
  // Container,
  // Divider,
  // Link,
  // List,
  // ListItem,
  // ListItemDescription,
  // Text,
  Title,
  TitleLevel,
  // VariantState,
  IconName,
  // IconSize,
  // IconPosition,
  // IconStatus,
  // StatusIcon,
  InfoBlock,
  // InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus,
  // Input,
  // Radio,
  // Section,
  // Select,
  // SelectOption,
  // Textarea,
  // Modal,
  // View,
} from '@flex-design-system/react-ts/client-sync-styled-default'
// import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'

async function actionPageInfo() {
  'use server'

  const userAgent = (await headers()).get('user-agent') || ''
  const mobileCheck = isMobile(userAgent)
  // const session = await getSession(); // Fetch session data

  return {
    mobileCheck
  }
}

export default async function Page() {
  // 'use cache'

  // return <WebAppMF {...(await actionPageInfo())} />
  return (
    <InfoBlock>
      <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
        <Title level={TitleLevel.LEVEL3}>{`En attente d'approbation`}</Title>
      </InfoBlockHeader>
      <InfoBlockContent>
        <Title level={TitleLevel.LEVEL4}>
          L&apos;accès à cette page nécessite l&apos;accorde de l&apos;école nouvelle la Source.
        </Title>
        <Title level={TitleLevel.LEVEL5}>
          {`Vous pouvez consultez les autres pages du site en attendant`}
        </Title>
      </InfoBlockContent>
    </InfoBlock>
  )
}
