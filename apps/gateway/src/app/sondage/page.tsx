'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import {
  Box,
  Button,
  ButtonMarkup,
  Card,
  CardContent,
  Container,
  Section,
  Text,
  Title,
  TitleLevel,
  VariantState,
  Link,
  View,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';

export default function SondageLanding() {
  const router = useRouter();

  const surveys = [
    {
      id: 'web-app',
      title: `Sondage concernant l'accès à l'application « ${process.env.NEXT_PUBLIC_APP_TITLE} »`,
      description: `Sondage destiné aux parents concernant l'utilisation de l'application ${process.env.NEXT_PUBLIC_APP_TITLE}.`,
      route: '/sondage/web-app',
      status: 'Actif'
    },
    {
      id: 'erasmus',
      title: 'Sondage sur la mobilité Erasmus',
      description: 'Sondage destiné aux familles concernant la mobilité Erasmus des élèves.',
      route: '/sondage/erasmus',
      status: 'Actif'
    },
    {
      id: 'decouverte-metiers',
      title: 'Découverte des métiers (2025-2026)',
      description: 'Formulaire d\'inscription pour les présentations des métiers destiné aux parents souhaitant présenter leur métier aux élèves.',
      route: '/decouverte-des-metiers',
      status: 'Nouveau'
    }
  ];

  return (
    <View>
      <Box className={classNames(flexStyles.hasTextTeriary)}>
        <div style={{ maxWidth: '920px' }}>
          <Section>
            <Title level={TitleLevel.LEVEL3} className={flexStyles.hasTextTeriary}>
              Sélectionnez le sondage auquel vous souhaitez participer :
            </Title>
          </Section>

          <Section>
            <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
              flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
            )}>
              {surveys.map((survey) => (
                <Card key={survey.id}
                  className={classNames(
                    flexStyles.isBordered,
                    flexStyles.isFullwidth,
                    flexStyles.isFullheight,
                    flexStyles.isGridDisplayGrid,
                    flexStyles.isGridCols1,
                  )}>
                  <CardContent>
                    <div className={classNames(
                      flexStyles.isGridDisplayGrid,
                      flexStyles.isGridItemsStart,
                    )} style={{ minHeight: '100px' }}>
                      <Title level={TitleLevel.LEVEL7} className={classNames('card-title')}
                        style={{ lineHeight: 'inherit', marginBottom: '1rem' }}>
                        {survey.title}
                      </Title>
                      {survey.status === 'Nouveau' && (
                        <span style={{
                          background: '#e8f5e8',
                          color: '#2d5016',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          maxWidth: 'fit-content',
                        }}>
                          {survey.status}
                        </span>
                      )}
                    </div>
                    <p className={classNames(
                      'card-text',
                    )}
                      title={survey.description}
                      style={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxHeight: '125px',
                        minHeight: '100px',
                        // @ts-expect-error - We need better css fall-back intelligence in typescript
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '5',
                        lineClamp: '5',
                      }}>
                        {survey.description}
                    </p>
                    <Button
                      id={survey.id}
                      onClick={() => router.push(survey.route)}
                      variant={VariantState.PRIMARY}
                      markup={ButtonMarkup.BUTTON}
                    >
                      Participer à ce sondage
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
          {/*
          <Section>
            <Text style={{ fontStyle: 'italic', color: '#666' }}>
              Les sondages sont anonymes et vos données sont protégées selon les normes de sécurité en vigueur.
            </Text>
          </Section>
          */}
        </div>
      </Box>
    </View>
  );
}
