'use client' // Error boundaries must be Client Components

import React from 'react'
import dynamic from 'next/dynamic'
import classNames from 'classnames'
import { Button } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Box, BoxContent } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Divider } from '@flex-design-system/react-ts/client-sync-styled-direct/divider';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import {
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
import { Section } from '@flex-design-system/react-ts/client-sync-styled-direct/section';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import '@src/styles/globals.css'

const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })

interface ErrorBoundaryProps {
  reset?: () => void
  mobileCheck?: boolean
}

const FallBackEC2InstanceUnavailable: React.FC<ErrorBoundaryProps> = (props) => {
  const { reset, mobileCheck } = props
  const _reset = reset || (() => window.location.reload())
  const isMobile = mobileCheck || false
  return (
    <div className={classNames(
      flexStyles.genericLayout1,
      isMobile && `mobileMode__${process.env.NEXT_PUBLIC_BUILD_ID}`
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
          <LogoAPE />
        </div>
        <main className={classNames(flexStyles.fullPage, flexStyles.hasSpaceBetweenContent)}>
          <section className={classNames(
            flexStyles.isFullwidth
          )}>
            <InfoBlock>
              <InfoBlockHeader>
                <Title level={TitleLevel.LEVEL3}>
                  🥴
                  <br/>
                  {`Le serveur est temporairement hors ligne`}
                  <br/>
                  {`Réessayez dans un petit moment !!`}
                </Title>
                <br/>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Title level={TitleLevel.LEVEL4}>
                  {`Cette page utilise une instance Spot Amazon EC2`}<br/>
                  {`pour faire fonctionner le server`}<br/>
                  {`« ${process.env.NEXT_PUBLIC_APP_TITLE} »`}
                </Title>
                <Section className={classNames(flexStyles.isTransparentOnly)}>
                  <Title level={TitleLevel.LEVEL6}>
                    {`
                      Les instances Spot AWS représentent une capacité excédentaire dans l'infrastucture cloud AWS. En tant que fournisseur de cloud, AWS doit disposer d'une capacité de réserve pour répondre à toute augmentation de la demande.
                    `}
                  </Title>
                  <Title level={TitleLevel.LEVEL6}>
                    {`
                      Pour compenser la perte d'infrastructures inutilisées pendant les périodes de faible demande, AWS propose cette capacité excédentaire à un prix très attractif.
                    `}
                  </Title>
                </Section>
                <Box className={classNames(flexStyles.isFlat, flexStyles.isFlatFlexPurple)}>
                  <Title level={TitleLevel.LEVEL5}>
                    {`
                      Bien que les instances Spot permettent des économies substantielles, elles comportent un risque de perturbation en cas de demande trop élevée.
                      Dès que la capacité sera suffisante, notre instance redémarrera et le ${process.env.NEXT_PUBLIC_APP_TITLE} sera à nouveau disponible.
                    `}
                  </Title>
                </Box>
                <Title level={TitleLevel.LEVEL4}>
                  {`Vous pouvez consultez les autres pages du site en attendant`}
                </Title>
                {_reset !== undefined && (
                  <Title level={TitleLevel.LEVEL4}>
                    {`ou`}
                    <br/>
                  </Title>
                )}
              </InfoBlockContent>
              <InfoBlockAction>
                <div className={classNames(flexStyles.isFullwidth, flexStyles.isFlex, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentCenter)}>
                  {_reset !== undefined && (
                    <Button small variant={VariantState.FLEX_PINK} onClick={_reset}>Recharger la page</Button>
                  )}
                </div>
              </InfoBlockAction>
            </InfoBlock>
          </section>
        </main>
      </div>
    </div>
  )
}

export default FallBackEC2InstanceUnavailable
