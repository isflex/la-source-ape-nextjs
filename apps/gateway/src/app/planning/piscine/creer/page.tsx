'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';

const client = generateClient<Schema>();

import classNames from 'classnames';
import {
  Box,
  Button,
  ButtonMarkup,
  Container,
  Section,
  Table,
  TableHead,
  TableBody,
  TableTr,
  TableTh,
  TableTd,
  Title,
  TitleLevel,
  VariantState,
  InfoBlock,
  InfoBlockContent,
  InfoBlockHeader,
  Text,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import PiscineForm from '@src/components/piscine/PiscineForm';
import AuthBanner from '@src/components/auth/AuthBanner';

type PiscineFormData = {
  id: string;
  title: string;
  slug: string;
  dayOfWeek: Schema['EDayOfWeek']['type'];
  startTime: string;
  endTime: string;
  schoolLevel: Schema['ESchoolLevel']['type'];
  teacherName: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
};

export default function PiscineCreerPage() {
  const { user } = useAuthenticator();
  const isAdmin = !!user;


  const [showForm, setShowForm] = useState(false);
  const [forms, setForms] = useState<PiscineFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const loadForms = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        const { unsubscribe } = client.models.PiscineForm.observeQuery({
          filter: {
            owner: { eq: user?.userId || '' }
          }
        }).subscribe({
          next: ({ items }) => {
            setForms(items || []);
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
      window.location.href = `/auth/?mode=user&returnUrl=${returnUrl}`;
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

  return (
    <>
      <AuthBanner />
      <Container>
        <Section>
          <Title level={TitleLevel.LEVEL1}>
            Gestion des Plannings Piscine
          </Title>

          {/* Success/Error Messages */}
          {createSuccess && (
            <InfoBlock>
              <InfoBlockHeader>
                <Title level={TitleLevel.LEVEL3}>Succès</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>{createSuccess}</Text>
              </InfoBlockContent>
            </InfoBlock>
          )}

          {createError && (
            <InfoBlock>
              <InfoBlockHeader>
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
                  <InfoBlockHeader>
                    <Title level={TitleLevel.LEVEL3}>Erreur</Title>
                  </InfoBlockHeader>
                  <InfoBlockContent>
                    <Text>{error}</Text>
                  </InfoBlockContent>
                </InfoBlock>
              ) : isAdmin ? (
                <>
                  <Title level={TitleLevel.LEVEL2} className={flexStyles.isMarginBottom3}>
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
                        )}>
                          <Box className={classNames(flexStyles.isFlat, flexStyles.isMarginless)}>
                            <Title level={TitleLevel.LEVEL7}>{form.title}</Title>
                          </Box>
                          <Table className={classNames(flexStyles.isFullwidth)}>
                            <TableHead>
                              <TableTr>
                                <TableTh className={flexStyles.isHiddenMobile}>
                                  <div style={{ padding: '0 0.5rem' }}>Jour</div>
                                </TableTh>
                                <TableTh className={flexStyles.isHiddenMobile}>
                                  <div style={{ padding: '0 0.5rem' }}>Horaires</div>
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
                                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Jour</div>
                                    <div className={classNames(
                                      flexStyles.isFlexMobile,
                                      flexStyles.isAlignItemsCenter,
                                      flexStyles.isJustifyContentStart,
                                      flexStyles.isFullwidth,
                                    )} style={{ padding: '0 0.5rem' }}>{formatDayOfWeek(form.dayOfWeek)}</div>
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
                                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Horaires</div>
                                    <div className={classNames(
                                      flexStyles.isFlexMobile,
                                      flexStyles.isAlignItemsCenter,
                                      flexStyles.isJustifyContentStart,
                                      flexStyles.isFullwidth,
                                    )} style={{ padding: '0 0.5rem' }}>{formatTime(form.startTime)} - {formatTime(form.endTime)}</div>
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
                                    flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                                    flexStyles.isGridCols2, flexStyles.isGridCols1Tablet,
                                    flexStyles.isAlignItemsCenter,
                                    flexStyles.isJustifyContentCenter,
                                    flexStyles.isJustifiedCenter,
                                    flexStyles.isFullheight,
                                    flexStyles.isFullwidth,
                                  )}>
                                    <div style={{ maxWidth: '200px' }}>
                                      <Button
                                        markup={ButtonMarkup.BUTTON}
                                        variant={VariantState.SECONDARY}
                                        onClick={() => handleViewOnline(form)}
                                        className={flexStyles.isMarginRight2}
                                      >
                                        Voir en ligne
                                      </Button>
                                    </div>
                                    <div style={{ maxWidth: '200px' }}>
                                      <Button
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
                    </>
                  )}
                </>
              ) : (
                <Box>
                  <Title level={TitleLevel.LEVEL2} className={flexStyles.isMarginBottom3}>
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
                  className={flexStyles.isMarginLeft2}
                >
                  {showForm ? 'Cacher le formulaire' : 'Créer un nouveau planning'}
                </Button>
              )}
            </div>
          </Box>

          {/* Piscine Form Creation */}
          {isAdmin && showForm && (
            <PiscineForm
              onSubmit={(success, message, slug) => {
                if (success) {
                  setCreateSuccess(message);
                  setShowForm(false);
                  // Reload forms to show the new one
                  loadForms();
                  // Clear success message after 5 seconds
                  setTimeout(() => setCreateSuccess(null), 5000);
                } else {
                  setCreateError(message);
                }
              }}
              onCancel={() => {
                setShowForm(false);
                setCreateError(null);
              }}
              existingSlugs={forms.map(f => f.slug)}
            />
          )}
        </Section>
      </Container>
    </>
  );
}
