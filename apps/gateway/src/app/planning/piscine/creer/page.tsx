'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';

const client = generateClient<Schema>();

import classNames from 'classnames';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Container } from '@flex-design-system/react-ts/client-sync-styled-direct/container';
import { Section } from '@flex-design-system/react-ts/client-sync-styled-direct/section';
import {
  Table,
  TableHead,
  TableBody,
  TableTr,
  TableTh,
  TableTd
} from '@flex-design-system/react-ts/client-sync-styled-direct/table';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import {
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
import {
  Icon,
  IconName,
  IconSize,
  IconPosition,
  IconStatus,
  StatusIcon
} from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import {
  Stepper,
  StepperStep,
  StepperStepMarkup,
} from '@flex-design-system/react-ts/client-sync-styled-direct/stepper';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import PiscineForm from '@src/components/piscine/PiscineForm';
import AuthBanner from '@src/components/auth/AuthBanner';

type PiscineFormData = {
  id: string;
  title: string;
  slug: string;
  isMultiDay?: boolean | null;
  schoolLevel: Schema['ESchoolLevel']['type'];
  teacherName: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
};

export default function PiscineCreerPage() {
  const router = useRouter();
  const { user } = useAuthenticator();
  const isAdmin = !!user;


  const [showForm, setShowForm] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [forms, setForms] = useState<PiscineFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [formTimeSlots, setFormTimeSlots] = useState<Record<string, Array<{
    dayOfWeek: Schema['EDayOfWeek']['type'];
    startTime: string;
    endTime: string;
  }>>>({});

  const loadTimeSlots = async (formId: string) => {
    try {
      const { data: timeSlots } = await client.models.PiscineTimeSlot.list({
        filter: { piscineFormId: { eq: formId } }
      });

      if (timeSlots && timeSlots.length > 0) {
        const sortedTimeSlots = timeSlots
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map(ts => ({
            dayOfWeek: ts.dayOfWeek as Schema['EDayOfWeek']['type'],
            startTime: ts.startTime,
            endTime: ts.endTime
          }));

        setFormTimeSlots(prev => ({
          ...prev,
          [formId]: sortedTimeSlots
        }));
      }
    } catch (error) {
      console.error('Error loading time slots:', error);
    }
  };

  const loadForms = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        const { unsubscribe } = client.models.PiscineForm.observeQuery({
          filter: {
            owner: { eq: user?.userId || '' }
          }
        }).subscribe({
          next: async ({ items }) => {
            setForms(items || []);

            // Load time slots for each form
            if (items) {
              for (const form of items) {
                await loadTimeSlots(form.id);
              }
            }

            setLoading(false);
          },
          error: (error) => {
            setError('Error loading piscine forms');
            console.error('Error loading forms:', error);
            setLoading(false);
          }
        });

        return unsubscribe;
      }
    } catch (err) {
      setError('Error loading piscine forms');
      console.error('Error loading forms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    const initializeForms = async () => {
      await loadForms();
    };

    if (isAdmin) {
      initializeForms();
    } else {
      setLoading(false);
    }
  }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent hydration mismatch by not rendering admin-specific content until mounted
  if (!mounted) {
    return (
      <Container>
        <Section>
          <Title level={TitleLevel.LEVEL1}>
            Gestion des Plannings Piscine
          </Title>
          <Text className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>Chargement...</Text>
        </Section>
      </Container>
    );
  }

  const handleAdminToggle = async () => {
    if (isAdmin) {
      await signOut();
      setShowForm(false);
    } else {
      // Redirect to auth page for normal user login/signup
      const returnUrl = encodeURIComponent('/planning/piscine/creer/');
      router.push(`/auth/?mode=user&returnUrl=${returnUrl}`);
    }
  };

  const handleDeleteForm = async (id: string, title: string) => {
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer ce planning: "${title}" ?`);
    if (!confirmed) return;

    try {
      const response = await client.models.PiscineForm.delete({ id });

      if (response.errors) {
        alert('Erreur lors de la suppression du planning');
      } else {
        await loadForms();
      }
    } catch (err) {
      alert('Erreur lors de la suppression du planning');
      console.error('Error deleting form:', err);
    }
  };

  const handleViewOnline = (form: PiscineFormData) => {
    const url = `/planning/piscine/${form.slug}`;
    window.open(url, '_blank');
  };

  const formatTime = (time: string) => {
    return time; // Already in HH:MM format
  };

  const formatDayOfWeek = (day: Schema['EDayOfWeek']['type']) => {
    const dayMap: Record<Schema['EDayOfWeek']['type'], string> = {
      'MONDAY': 'Lundi',
      'TUESDAY': 'Mardi',
      'WEDNESDAY': 'Mercredi',
      'THURSDAY': 'Jeudi',
      'FRIDAY': 'Vendredi'
    };
    return dayMap[day] || day;
  };

  const formatShortDayOfWeek = (day: Schema['EDayOfWeek']['type']) => {
    const dayMap: Record<Schema['EDayOfWeek']['type'], string> = {
      'MONDAY': 'Lun',
      'TUESDAY': 'Mar',
      'WEDNESDAY': 'Mer',
      'THURSDAY': 'Jeu',
      'FRIDAY': 'Ven'
    };
    return dayMap[day] || day;
  };

  return (
    <>
      <AuthBanner />
      <Container>
        <Section>
          <Title level={TitleLevel.LEVEL1} className={classNames(
              flexStyles.isFullwidth,
              flexStyles.hasTextCentered,
            )}>
            Gestion des Plannings Piscine
          </Title>

          <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
            <Stepper
              centered
              className={classNames(
                flexStyles.isFullwidth,
                flexStyles.isFlex,
                flexStyles.isJustifiedCenter,
                flexStyles.isPaddingless,
                flexStyles.isTransparentOnly
              )}>
                <StepperStep
                  markup={StepperStepMarkup.DIV}
                  validated
                  highlighted
                  label='Créez un formulaire qui définit les dates du planning'
                  labelTablet='Créer votre formulaire'
                  labelMobile='Créer votre formulaire'
                  step={1}
                />
                <StepperStep
                  markup={StepperStepMarkup.DIV}
                  done
                  highlighted
                  label={`Partagez votre formulaire pour que d'autres parents puissent participer`}
                  labelTablet='Partagez votre formulaire'
                  labelMobile='Partagez votre formulaire'
                  step={2}
                />
                <StepperStep
                  markup={StepperStepMarkup.DIV}
                  active
                  current
                  label={`Gérer les participants et partager les résultats avec l'enseignant`}
                  labelTablet='Gérer les participants'
                  labelMobile='Gérer les participants'
                  step={3}
                />
            </Stepper>
          </div>

          {/* Success/Error Messages */}
          {createSuccess && (
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.SUCCESS} customIcon={IconName.UI_CHECK_CIRCLE}>
                <Title level={TitleLevel.LEVEL3}>Succès</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>{createSuccess}</Text>
              </InfoBlockContent>
            </InfoBlock>
          )}

          {createError && (
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.DANGER} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                <Title level={TitleLevel.LEVEL3}>Erreur</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>{createError}</Text>
              </InfoBlockContent>
            </InfoBlock>
          )}

          {/* Forms List */}
          <Box>
            <div style={{ overflowX: 'auto' }}>
              {loading ? (
                <Text className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>Chargement des plannings...</Text>
              ) : error ? (
                <InfoBlock>
                  <InfoBlockHeader status={InfoBlockStatus.DANGER} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                    <Title level={TitleLevel.LEVEL3}>Erreur</Title>
                  </InfoBlockHeader>
                  <InfoBlockContent>
                    <Text>{error}</Text>
                  </InfoBlockContent>
                </InfoBlock>
              ) : isAdmin ? (
                <>
                  <Title level={TitleLevel.LEVEL2}>
                    Mes plannings piscine
                  </Title>

                  {forms.length === 0 ? (
                    <Text>Aucun planning trouvé.</Text>
                  ) : (
                    <>
                      {forms.map(form => (
                        <div key={form.id} className={classNames(
                            flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                            flexStyles.isGridCols1,
                            flexStyles.isGridItemsCenter,
                            flexStyles.isFullwidth
                          )} style={{ marginTop: '1.5rem'}}>
                          <Box className={classNames(flexStyles.isFlat, flexStyles.isMarginless)}>
                            {/* <Title level={TitleLevel.LEVEL7}>{form.title}</Title> */}

                            <div className={classNames(
                                flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                                flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
                                flexStyles.isAlignItemsCenter,
                                flexStyles.isJustifyContentSpaceBetween,
                                flexStyles.isFullwidth,
                              )}>
                              <Title level={TitleLevel.LEVEL7}>{form.title}</Title>
                              <div className={classNames(
                                  flexStyles.help, flexStyles.isInfo, flexStyles.hasTextSmall,
                                  flexStyles.isFullwidth,
                                  flexStyles.isGridDisplayGrid,
                                  flexStyles.isGridPlaceItemsStart, flexStyles.isGridPlaceItemsEndTablet,
                                )}>
                                <Icon
                                  content={`Cliquez sur « Voir » pour accéder à la version participative.`}
                                  size={IconSize.SMALL}
                                  position={IconPosition.LEFT}
                                  name={IconName.UI_INFO_CIRCLE}
                                />
                              </div>
                            </div>

                          </Box>
                          <Table className={classNames(flexStyles.isFullwidth)}>
                            <TableHead>
                              <TableTr>
                                <TableTh className={flexStyles.isHiddenMobile}>
                                  <div style={{ padding: '0 0.5rem' }}>Jour(s)</div>
                                </TableTh>
                                <TableTh className={flexStyles.isHiddenMobile}>
                                  <div style={{ padding: '0 0.5rem' }}>Horaire(s)</div>
                                </TableTh>
                                <TableTh className={flexStyles.isHiddenMobile}>
                                  <div style={{ padding: '0 0.5rem' }}>Niveau</div>
                                </TableTh>
                                <TableTh className={flexStyles.isHiddenMobile}>
                                  <div style={{ padding: '0 0.5rem' }}>Enseignant</div>
                                </TableTh>
                                <TableTh className={flexStyles.isHiddenMobile}>
                                  <div style={{ padding: '0 0.5rem' }}>Actions</div>
                                </TableTh>
                              </TableTr>
                            </TableHead>
                            <TableBody>
                              <TableTr
                                className={classNames(
                                  flexStyles.isFlexMobile,
                                  flexStyles.isFlexDirectionColumn,
                                  flexStyles.isFullwidthMobile,
                                  flexStyles.isTableRowTablet,
                                  flexStyles.isColumnSpanAllTablet
                                )}>
                                  <TableTd className={classNames(
                                    flexStyles.isFlexMobile,
                                    flexStyles.isAlignItemsCenter,
                                    flexStyles.isJustifyContentSpaceBetween,
                                    flexStyles.isDataCellResponsiveHelper,
                                  )}>
                                    <div className={classNames(
                                      flexStyles.isHiddenTablet,
                                      flexStyles.isFullwidth,
                                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Jour(s)</div>
                                    <div className={classNames(
                                      flexStyles.isFlexMobile,
                                      flexStyles.isFlexDirectionColumn,
                                      flexStyles.isAlignItemsCenter,
                                      flexStyles.isJustifyContentStart,
                                      flexStyles.isFullwidth,
                                    )} style={{ padding: '0 0.5rem' }}>
                                      {formTimeSlots[form.id]?.map((ts, index) => {
                                        return (
                                          <div key={index} className={classNames(flexStyles.isFullwidth)}>
                                            {formatDayOfWeek(ts.dayOfWeek)}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </TableTd>
                                  <TableTd className={classNames(
                                    flexStyles.isFlexMobile,
                                    flexStyles.isAlignItemsCenter,
                                    flexStyles.isJustifyContentSpaceBetween,
                                    flexStyles.isDataCellResponsiveHelper,
                                  )}>
                                    <div className={classNames(
                                      flexStyles.isHiddenTablet,
                                      flexStyles.isFullwidth,
                                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Horaire(s)</div>
                                    <div className={classNames(
                                      flexStyles.isFlexMobile,
                                      flexStyles.isFlexDirectionColumn,
                                      flexStyles.isAlignItemsCenter,
                                      flexStyles.isJustifyContentStart,
                                      flexStyles.isFullwidth,
                                    )} style={{ padding: '0 0.5rem' }}>
                                      {formTimeSlots[form.id]?.map((ts, index) => {
                                        return (
                                          <div key={index} className={classNames(flexStyles.isFullwidth)}>
                                            {`${ts.startTime}-${ts.endTime}`}<span className={flexStyles.isInvisibleTablet}>{`\u00A0\u00A0(${formatShortDayOfWeek(ts.dayOfWeek)})`}</span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </TableTd>
                                  <TableTd className={classNames(
                                    flexStyles.isFlexMobile,
                                    flexStyles.isAlignItemsCenter,
                                    flexStyles.isJustifyContentSpaceBetween,
                                    flexStyles.isDataCellResponsiveHelper,
                                  )}>
                                    <div className={classNames(
                                      flexStyles.isHiddenTablet,
                                      flexStyles.isFullwidth,
                                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Niveau</div>
                                    <div className={classNames(
                                      flexStyles.isFlexMobile,
                                      flexStyles.isAlignItemsCenter,
                                      flexStyles.isJustifyContentStart,
                                      flexStyles.isFullwidth,
                                    )} style={{ padding: '0 0.5rem' }}>{form.schoolLevel}</div>
                                  </TableTd>
                                  <TableTd className={classNames(
                                    flexStyles.isFlexMobile,
                                    flexStyles.isAlignItemsCenter,
                                    flexStyles.isJustifyContentSpaceBetween,
                                    flexStyles.isDataCellResponsiveHelper,
                                        )}>
                                    <div className={classNames(
                                      flexStyles.isHiddenTablet,
                                      flexStyles.isFullwidth,
                                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Enseignant</div>
                                    <div className={classNames(
                                      flexStyles.isFlexMobile,
                                      flexStyles.isAlignItemsCenter,
                                      flexStyles.isJustifyContentStart,
                                      flexStyles.isFullwidth,
                                    )} style={{ padding: '0 0.5rem' }}>{form.teacherName}</div>
                                  </TableTd>
                                  <TableTd className={classNames(
                                    flexStyles.isGridDisplayGrid,
                                    flexStyles.isFullheight,
                                    flexStyles.isFullwidth,
                                    flexStyles.isPaddingless,
                                  )}>
                                    <div className={classNames(
                                      flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                                      // flexStyles.isGridCols1,
                                      flexStyles.isGridCols1, flexStyles.isGridCols3MobileMax, flexStyles.isGridCols1Tablet,
                                      flexStyles.isAlignItemsCenter,
                                      flexStyles.isJustifyContentCenter,
                                      flexStyles.isJustifiedCenter,
                                      flexStyles.isFullheight,
                                      flexStyles.isFullwidth,
                                    )}
                                    style={{ padding: '1rem 0 0' }}>
                                      <Button
                                        small
                                        markup={ButtonMarkup.BUTTON}
                                        variant={VariantState.SECONDARY}
                                        onClick={() => handleViewOnline(form)}
                                      >
                                        Voir
                                      </Button>
                                      <Button
                                        small
                                        markup={ButtonMarkup.BUTTON}
                                        variant={VariantState.PRIMARY}
                                        onClick={() => {
                                          setEditingFormId(form.id);
                                          setShowForm(true);
                                          setCreateSuccess(null);
                                          setCreateError(null);
                                        }}
                                      >
                                        Modifier
                                      </Button>
                                      <Button
                                        small
                                        markup={ButtonMarkup.BUTTON}
                                        variant={VariantState.DANGER}
                                        onClick={() => handleDeleteForm(form.id, form.title)}
                                      >
                                        Supprimer
                                      </Button>
                                    </div>
                                  </TableTd>
                              </TableTr>
                            </TableBody>
                          </Table>
                        </div>
                      ))}

                      <Section>
                        <InfoBlock>
                          <InfoBlockHeader status={InfoBlockStatus.SUCCESS} customIcon={IconName.UI_CHECK_CIRCLE}>
                            <Title level={TitleLevel.LEVEL3}>
                              Vous avez créé votre formulaire avec succès.
                            </Title>
                          </InfoBlockHeader>
                          <InfoBlockContent size={12}>
                            <Title level={TitleLevel.LEVEL4}>
                              {`Pour la consulter en ligne, cliquez sur « Voir ».`}<br/>
                              {`Notez et copiez l'URL de la page.`}<br/>
                              {`C'est cette URL là que vous partagerez ensuite avec d'autres parents afin qu'ils puissent s'inscrire et participer au planning.`}
                            </Title>
                          </InfoBlockContent>
                        </InfoBlock>
                      </Section>
                    </>
                  )}
                </>
              ) : (
                <Box>
                  <Title level={TitleLevel.LEVEL2}>
                    Accès réservé
                  </Title>
                  <Text>Vous devez être connecté pour créer des plannings piscine.</Text>
                </Box>
              )}
            </div>
          </Box>

          {/* Admin Controls */}
          <Box>
            <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
              flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
              flexStyles.isGridItemsCenter,
              flexStyles.isFullheight,
              flexStyles.isFullwidth,
            )}>
              <Button
                markup={ButtonMarkup.BUTTON}
                variant={isAdmin ? VariantState.SUCCESS : VariantState.TERTIARY}
                onClick={handleAdminToggle}
              >
                {isAdmin ? 'Déconnexion 🔓' : 'Connexion 🔒'}
              </Button>

              {isAdmin && (
                <Button
                  markup={ButtonMarkup.BUTTON}
                  variant={showForm ? VariantState.SECONDARY : VariantState.PRIMARY}
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Cacher le formulaire' : 'Créer un nouveau planning'}
                </Button>
              )}
            </div>
          </Box>

          {/* Piscine Form Creation/Editing */}
          {isAdmin && showForm && (
            <PiscineForm
              onSubmit={(success, message, slug) => {
                if (success) {
                  setCreateSuccess(message);
                  setShowForm(false);
                  setEditingFormId(null); // Reset editing state
                  // Reload forms to show the updated one
                  loadForms();
                  // Clear success message after 5 seconds
                  setTimeout(() => setCreateSuccess(null), 5000);
                } else {
                  setCreateError(message);
                }
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingFormId(null); // Reset editing state
                setCreateError(null);
              }}
              existingSlugs={forms.map(f => f.slug)}
              editingFormId={editingFormId || undefined}
            />
          )}
        </Section>
      </Container>
    </>
  );
}
