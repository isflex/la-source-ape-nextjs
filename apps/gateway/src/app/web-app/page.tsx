import React from 'react'
// import dynamic from 'next/dynamic'
// import { headers } from 'next/headers'
// import { isMobile } from '@src/utils'
// const WebAppMF = dynamic(async () => await import('@src/components/web-app-mf'), { ssr: true })

// import classNames from 'classnames'
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { IconName } from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import {
  InfoBlock,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
// import { default as flexStyles } from '@flex-design-system/framework'

// async function actionPageInfo() {
//   'use server'
//   const userAgent = (await headers()).get('user-agent') || ''
//   const mobileCheck = isMobile(userAgent)
//   return { mobileCheck }
// }

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
