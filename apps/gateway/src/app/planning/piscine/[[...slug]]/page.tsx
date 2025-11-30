'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

import classNames from 'classnames';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
// import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Container } from '@flex-design-system/react-ts/client-sync-styled-direct/container';
import { Section } from '@flex-design-system/react-ts/client-sync-styled-direct/section';
import { Sticker } from '@flex-design-system/react-ts/client-sync-styled-direct/sticker';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import {
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
import {
  IconName,
  IconSize,
  IconPosition,
  IconStatus,
  StatusIcon
} from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import PiscineCandidatTable from '@src/components/piscine/PiscineCandidatTable';
import { formatDayOfWeek, formatSchoolLevel } from '@src/lib/piscine-helpers';
import { Divider } from '@flex-design-system/react-ts/client-sync-styled-direct/divider';
import AuthBanner from '@src/components/auth/AuthBanner';

type TimeSlotData = {
  id: string;
  dayOfWeek: Schema['EDayOfWeek']['type'];
  startTime: string;
  endTime: string;
  order: number | null;
};

interface PiscineSlugPageProps {
  params: Promise<{
    slug: string[]
  }>
}

type PiscineFormData = {
  id: string;
  title: string;
  slug: string;
  isMultiDay?: boolean | null;
  schoolLevel: Schema['ESchoolLevel']['type'];
  teacherName: string;
  owner: string;
};

export default function PiscineSlugPage({ params }: PiscineSlugPageProps) {
  const router = useRouter();
  const { user } = useAuthenticator();
  const [piscineForm, setPiscineForm] = useState<PiscineFormData | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Check if current user is the creator of this form
  const isCreator = user?.userId && piscineForm?.owner === user.userId;

  useEffect(() => {
    let formSubscription: { unsubscribe: () => void } | null = null;
    let timeSlotSubscription: { unsubscribe: () => void } | null = null;

    const setupSubscriptions = async () => {
      try {
        const resolvedParams = await params;

        if (!resolvedParams.slug || resolvedParams.slug.length === 0) {
          setError('URL invalide');
          setIsLoading(false);
          return;
        }

        const slug = resolvedParams.slug[0]; // Take the first slug segment

        // Subscribe to piscine form changes with observeQuery
        formSubscription = client.models.PiscineForm.observeQuery({
          filter: { slug: { eq: slug } }
        }).subscribe({
          next: ({ items }) => {
            if (!items || items.length === 0) {
              setError('Planning non trouvé');
              setIsLoading(false);
              return;
            }

            const form = items[0];
            setPiscineForm(form);

            // Subscribe to time slots if multi-day mode and we have a form ID
            if (form.isMultiDay && form.id) {
              // Unsubscribe from previous time slot subscription if it exists
              if (timeSlotSubscription) {
                timeSlotSubscription.unsubscribe();
              }

              // Subscribe to time slot changes
              timeSlotSubscription = client.models.PiscineTimeSlot.observeQuery({
                filter: { piscineFormId: { eq: form.id } }
              }).subscribe({
                next: ({ items: timeSlotsData }) => {
                  if (timeSlotsData) {
                    const sortedTimeSlots = [...timeSlotsData].sort((a, b) => (a.order || 0) - (b.order || 0));
                    setTimeSlots(sortedTimeSlots);
                  }
                  setIsLoading(false);
                },
                error: (error) => {
                  console.error('Error observing time slots:', error);
                  setError('Erreur lors du chargement des créneaux');
                  setIsLoading(false);
                }
              });
            } else {
              setIsLoading(false);
            }
          },
          error: (error) => {
            console.error('Error observing piscine form:', error);
            setError('Erreur lors du chargement');
            setIsLoading(false);
          }
        });

      } catch (error) {
        console.error('Error setting up subscriptions:', error);
        setError('Erreur lors du chargement');
        setIsLoading(false);
      }
    };

    setupSubscriptions();

    // Cleanup subscriptions on unmount
    return () => {
      if (formSubscription) {
        formSubscription.unsubscribe();
      }
      if (timeSlotSubscription) {
        timeSlotSubscription.unsubscribe();
      }
    };
  }, [params]);

  const handleMessage = (text: string, isError: boolean) => {
    setMessage({ text, isError });
    // Clear message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAuthRequired = () => {
    // Use pathname + search to avoid port issues with OAuth redirects
    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
    router.push(`/auth/?mode=user&returnUrl=${returnUrl}`);
  };

  if (isLoading) {
    return (
      <Container>
        <Section>
          <Title level={TitleLevel.LEVEL2} className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>
            Chargement...
          </Title>
        </Section>
      </Container>
    );
  }

  if (error || !piscineForm) {
    return (
      <Container>
        <Box className={classNames(flexStyles.hasTextTeriary)}>
          <Section>
            <Title level={TitleLevel.LEVEL2} className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>
              {error || 'Planning non trouvé'}
            </Title>
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              Le planning demandé n&apos;existe pas ou n&apos;est plus disponible.
            </p>
          </Section>
        </Box>
      </Container>
    );
  }

  return (
    <>
      {user && <AuthBanner />}
      <Container>
        <Section>
          {/* Success/Error Messages */}
          {message && (
            <InfoBlock>
              <InfoBlockHeader
                status={message.isError ? InfoBlockStatus.DANGER : InfoBlockStatus.SUCCESS}
                customIcon={message.isError ? IconName.UI_EXCLAMATION_CIRCLE : IconName.UI_CHECK_CIRCLE}>
                <Title level={TitleLevel.LEVEL3}>
                  {message.isError ? 'Erreur' : 'Succès'}
                </Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>{message.text}</Text>
              </InfoBlockContent>
            </InfoBlock>
          )}

          {/* Header */}
          <div>
            <Title level={TitleLevel.LEVEL1}>
              {piscineForm.title}
            </Title>

            {piscineForm.isMultiDay ? (
              /* Multi-day display */
              <div className={classNames(
                  flexStyles.isGrid, flexStyles.isGridGap2, flexStyles.isGridGap4Tablet,
                  flexStyles.isGridCols12,
                  flexStyles.isGridItemsCenter,
                  flexStyles.isFlexTablet,
                  flexStyles.isJustifyContentSpaceBetween,
                )}>

                <div className={classNames(
                    flexStyles.isGrid, flexStyles.isGridGap2,
                    flexStyles.isGridColSpanFull,
                    flexStyles.isGridCols1,
                    flexStyles.isFlexTablet,
                    flexStyles.isJustifyContentSpaceBetween,
                  )}>
                  <div className={classNames(
                      flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                      flexStyles.isGridColSpanFull,
                      flexStyles.isGridCols12,
                      flexStyles.isGridItemsCenter,
                    )}>

                      <div className={classNames(
                          flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                          flexStyles.isGridColSpanFull, flexStyles.isGridColSpan4Tablet,
                        )}>
                        <Text>
                          <strong>{`Les créneaux\u00A0:`}</strong>
                        </Text>
                      </div>

                      <div className={classNames(
                        flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                        flexStyles.isGridColSpanFull, flexStyles.isGridColSpan8Tablet,
                        flexStyles.isGridItemsCenter,
                        flexStyles.isGridJustifyCenter, flexStyles.isGridJustifyStartTablet,
                      )} style= {{ minWidth: '150px'}}>
                        {timeSlots.map((timeSlot) => (
                          <Sticker key={timeSlot.id} stretched variant={VariantState.SECONDARY}>
                            <Text className={classNames(flexStyles.isPaddingless, flexStyles.isMarginless)}>
                              <span style={{ margin: '0.5rem 0.75rem', whiteSpace: 'nowrap' }}>
                                {formatDayOfWeek(timeSlot.dayOfWeek)}{' '}:{' '}
                                {timeSlot.startTime} - {timeSlot.endTime}
                              </span>
                            </Text>
                          </Sticker>
                        ))}
                      </div>
                  </div>
                </div>

                <div className={classNames(
                    flexStyles.isGrid, flexStyles.isGridGap2,
                    flexStyles.isGridColSpanFull,
                    flexStyles.isGridCols1,
                    flexStyles.isFlexTablet,
                    flexStyles.isJustifyContentSpaceBetween,
                  )}>
                  <div className={classNames(
                      flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                      flexStyles.isGridColSpanFull,
                      flexStyles.isGridCols12,
                      flexStyles.isGridItemsCenter,
                    )}>

                    <div className={classNames(
                        flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                        flexStyles.isGridColSpanFull, flexStyles.isGridColSpan4Tablet,
                      )}>
                      <Text><strong>{`Niveau\u00A0:`}</strong></Text>
                    </div>
                    <div className={classNames(
                        flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                        flexStyles.isGridColSpanFull, flexStyles.isGridColSpan8Tablet,
                        flexStyles.isGridItemsCenter,
                        flexStyles.isGridJustifyCenter, flexStyles.isGridJustifyStartTablet,
                      )} style= {{ minWidth: '150px'}}>
                      <Sticker stretched variant={VariantState.SECONDARY}>
                        <Text className={classNames(flexStyles.isPaddingless, flexStyles.isMarginless)}>
                          <span style={{ margin: '0.5rem 0.75rem', whiteSpace: 'nowrap' }}>
                            {formatSchoolLevel(piscineForm.schoolLevel)}
                          </span>
                        </Text>
                      </Sticker>
                    </div>

                  </div>
                </div>

                <div className={classNames(
                    flexStyles.isGrid, flexStyles.isGridGap2,
                    flexStyles.isGridColSpanFull,
                    flexStyles.isGridCols1,
                    flexStyles.isFlexTablet,
                    flexStyles.isJustifyContentSpaceBetween,
                  )}>
                  <div className={classNames(
                      flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                      flexStyles.isGridColSpanFull,
                      flexStyles.isGridCols12,
                      flexStyles.isGridItemsCenter,
                    )}>

                    <div className={classNames(
                        flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                        flexStyles.isGridColSpanFull, flexStyles.isGridColSpan4Tablet,
                      )}>
                      <Text><strong>{`Enseignant\u00A0:`}</strong></Text>
                    </div>
                    <div className={classNames(
                        flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                        flexStyles.isGridColSpanFull, flexStyles.isGridColSpan8Tablet,
                        flexStyles.isGridItemsCenter,
                        flexStyles.isGridJustifyCenter, flexStyles.isGridJustifyStartTablet,
                      )} style= {{ minWidth: '150px'}}>
                      <Sticker stretched variant={VariantState.SECONDARY}>
                        <Text className={classNames(flexStyles.isPaddingless, flexStyles.isMarginless)}>
                          <span style={{ margin: '0.5rem 0.75rem', whiteSpace: 'nowrap' }}>
                            {piscineForm.teacherName}
                          </span>
                        </Text>
                      </Sticker>
                    </div>

                  </div>
                </div>

              </div>
            ) : (
              /* Single-day display */
              timeSlots.length > 0 ? (
                <div className={classNames(
                  flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                  flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
                )}>
                  <div>
                    <Text><strong>Jour:</strong> {formatDayOfWeek(timeSlots[0].dayOfWeek)}</Text>
                    <Text><strong>Horaires:</strong> {timeSlots[0].startTime} - {timeSlots[0].endTime}</Text>
                  </div>
                  <div>
                    <Text><strong>Niveau:</strong> {formatSchoolLevel(piscineForm.schoolLevel)}</Text>
                    <Text><strong>Enseignant:</strong> {piscineForm.teacherName}</Text>
                  </div>
                </div>
              ) : null
            )}
          </div>

          {/* Creator Badge */}
          {isCreator && (
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.UI_INFO_CIRCLE}>
                <Title level={TitleLevel.LEVEL3}>Mode Créateur</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>Vous êtes le créateur de ce planning.
                  Vous pouvez modifier et supprimer les inscriptions.
                  Vous pouvez aussi glisser les participiants d&apos;un créneau horaire à un autre avec l&apos;icône ☰
                </Text>
              </InfoBlockContent>
            </InfoBlock>
          )}

          {/* Candidat Table */}
          <PiscineCandidatTable
            piscineFormId={piscineForm.id}
            isCreatorMode={!!isCreator}
            isAuthenticated={!!user}
            onMessage={handleMessage}
            onAuthRequired={handleAuthRequired}
            piscineFormData={{
              title: piscineForm.title,
              schoolLevel: formatSchoolLevel(piscineForm.schoolLevel),
              teacherName: piscineForm.teacherName
            }}
          />
        </Section>
      </Container>
    </>
  );
}
