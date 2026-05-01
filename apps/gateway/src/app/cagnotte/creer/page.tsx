/* eslint-disable no-alert */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';
import {
  formatCurrency,
  formatDeadline,
  getDeadlineDistance,
  calculateJackpotStats,
  getJackpotStatusBadge,
  type JackpotContributionData
} from '@src/lib/cagnotte-helpers';

const client = generateClient<Schema>();

// SelectionSet for StripeConnectAccount to ensure all fields are retrieved for real-time updates
const stripeConnectAccountSelectionSet = [
  'id', 'userId', 'stripeAccountId', 'accountStatus',
  'onboardingComplete', 'chargesEnabled', 'payoutsEnabled', 'detailsSubmitted',
  'email', 'displayName', 'country', 'currency',
  'onboardingStartedAt', 'onboardingCompletedAt', 'lastOnboardingLinkCreatedAt',
  'currentlyDue', 'eventuallyDue', 'pastDue', 'disabledReason',
  'createdAt', 'updatedAt'
] as const;

import { CreerCagnotteList1, CreerCagnotteList2 } from '@src/components/cagnotte/CagnotteInfoLists'
import { LoadingBackdrop } from '@src/components/loading/LoadingBackdrop'

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
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
import {
  Icon,
  IconName,
  IconSize,
  IconPosition,
} from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import { Sticker } from '@flex-design-system/react-ts/client-sync-styled-direct/sticker';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { default as flexStyles } from '@flex-design-system/framework';
import JackpotForm from '@src/components/cagnotte/JackpotForm';
import AuthBanner from '@src/components/auth/AuthBanner';
import { debug } from '@flexiness/domain-utils';
import { useSafeAgentContext, useSafeFrontendTool } from '@flexiness/copilotkit';
import { z } from 'zod';

type JackpotFormData = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  targetAmount?: number | null;
  deadline: string;
  teacherName: string;
  schoolLevel?: Schema['ESchoolLevel']['type'] | null;
  status?: Schema['EJackpotStatus']['type'] | null;
  owner: string;
  payoutRequested?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export default function CagnotteCreerPage() {
  const router = useRouter();
  const { user } = useAuthenticator();
  const isAuthenticated = !!user;

  const [showForm, setShowForm] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [forms, setForms] = useState<JackpotFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [formStats, setFormStats] = useState<Record<string, {
    totalAmount: number;
    contributorCount: number;
  }>>({});
  const [connectAccount, setConnectAccount] = useState<Schema['StripeConnectAccount']['type'] | null>(null);
  const [connectLoading, setConnectLoading] = useState(true);
  const formRef = React.useRef<HTMLDivElement>(null);

  // CopilotKit v2: Expose page context to AI agent
  useSafeAgentContext({
    description: 'Current page context - Jackpot/Cagnotte management page for creating and managing fundraising campaigns',
    value: {
      page: 'cagnotte/creer',
      pageTitle: 'Gestion des Cagnottes',
      isAuthenticated,
      totalJackpots: forms.length,
      hasStripeAccount: !!connectAccount,
      stripeAccountStatus: connectAccount?.accountStatus || 'none',
    },
  });

  useSafeAgentContext({
    description: 'List of user jackpots/cagnottes with their statistics',
    value: forms.map(form => ({
      id: form.id,
      title: form.title,
      slug: form.slug,
      status: form.status ?? null,
      teacherName: form.teacherName,
      schoolLevel: form.schoolLevel ?? null,
      targetAmount: form.targetAmount ?? null,
      deadline: form.deadline,
      totalAmount: formStats[form.id]?.totalAmount ?? 0,
      contributorCount: formStats[form.id]?.contributorCount ?? 0,
    })),
  });

  // CopilotKit v2: Frontend tools — let the AI agent trigger actions on behalf of the user
  useSafeFrontendTool({
    name: 'publish_jackpot',
    description: 'Publish a DRAFT jackpot so participants can contribute. The jackpot must be in DRAFT status with a future deadline.',
    parameters: z.object({ jackpotId: z.string().describe('The ID of the jackpot to publish') }),
    handler: async ({ jackpotId }) => {
      const form = forms.find(f => f.id === jackpotId);
      if (!form) return { success: false, error: `Jackpot "${jackpotId}" not found` };

      const status = form.status || 'DRAFT';
      if (status !== 'DRAFT') return { success: false, error: `Jackpot is not in DRAFT status (current: ${status})` };

      const deadline = new Date(form.deadline);
      if (deadline <= new Date()) return { success: false, error: 'Cannot publish: deadline has passed' };

      try {
        const response = await client.models.JackpotForm.update({ id: form.id, status: 'ACTIVE' });
        if (response.errors) return { success: false, error: 'Error publishing jackpot' };

        setCreateSuccess('Cagnotte publiée avec succès ! Les participants peuvent maintenant contribuer.');
        setTimeout(() => setCreateSuccess(null), 5000);
        return { success: true, message: `Jackpot "${form.title}" published successfully` };
      } catch (err) {
        debug.error('Error publishing jackpot:', err);
        return { success: false, error: 'Error publishing jackpot' };
      }
    },
  }, [forms]);

  useSafeFrontendTool({
    name: 'delete_jackpot',
    description: 'Delete a jackpot by its ID. This action is irreversible.',
    parameters: z.object({ jackpotId: z.string().describe('The ID of the jackpot to delete') }),
    handler: async ({ jackpotId }) => {
      const form = forms.find(f => f.id === jackpotId);
      if (!form) return { success: false, error: `Jackpot "${jackpotId}" not found` };

      try {
        const response = await client.models.JackpotForm.delete({ id: jackpotId });
        if (response.errors) return { success: false, error: 'Error deleting jackpot' };
        return { success: true, message: `Jackpot "${form.title}" deleted successfully` };
      } catch (err) {
        debug.error('Error deleting jackpot:', err);
        return { success: false, error: 'Error deleting jackpot' };
      }
    },
  }, [forms]);

  useSafeFrontendTool({
    name: 'request_payout',
    description: 'Request a payout for a CLOSED jackpot that has contributions and no pending payout request.',
    parameters: z.object({ jackpotId: z.string().describe('The ID of the jackpot to request payout for') }),
    handler: async ({ jackpotId }) => {
      const form = forms.find(f => f.id === jackpotId);
      if (!form) return { success: false, error: `Jackpot "${jackpotId}" not found` };

      const status = form.status || 'DRAFT';
      if (status !== 'CLOSED') return { success: false, error: `Jackpot must be CLOSED to request payout (current: ${status})` };
      if (form.payoutRequested) return { success: false, error: 'Payout has already been requested for this jackpot' };

      const stats = formStats[form.id] || { totalAmount: 0, contributorCount: 0 };
      if (stats.totalAmount <= 0) return { success: false, error: 'No contributions to pay out' };

      try {
        const response = await client.models.JackpotForm.update({
          id: form.id,
          payoutRequested: true,
          payoutRequestedAt: new Date().toISOString(),
        });
        if (response.errors) return { success: false, error: 'Error requesting payout' };
        return { success: true, message: `Payout of ${formatCurrency(stats.totalAmount)} requested for "${form.title}"` };
      } catch (err) {
        debug.error('Error requesting payout:', err);
        return { success: false, error: 'Error requesting payout' };
      }
    },
  }, [forms, formStats]);

  useSafeFrontendTool({
    name: 'view_jackpot_online',
    description: 'Navigate to the public page of a jackpot by its slug.',
    parameters: z.object({ jackpotSlug: z.string().describe('The slug of the jackpot to view') }),
    handler: async ({ jackpotSlug }) => {
      router.push(`/cagnotte/${jackpotSlug}/`);
      return { success: true, message: `Navigating to /cagnotte/${jackpotSlug}/` };
    },
  }, [router]);

  useSafeFrontendTool({
    name: 'open_jackpot_form',
    description: 'Open the jackpot creation/editing form. If a jackpotId is provided, opens in edit mode for that jackpot.',
    parameters: z.object({ jackpotId: z.string().optional().describe('Optional jackpot ID to edit an existing jackpot') }),
    handler: async ({ jackpotId }) => {
      if (jackpotId) {
        const form = forms.find(f => f.id === jackpotId);
        if (!form) return { success: false, error: `Jackpot "${jackpotId}" not found` };
        setEditingFormId(jackpotId);
      } else {
        setEditingFormId(null);
      }
      setShowForm(true);
      setCreateSuccess(null);
      setCreateError(null);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return { success: true, message: jackpotId ? `Opening edit form for jackpot "${jackpotId}"` : 'Opening new jackpot form' };
    },
  }, [forms]);

  const loadContributionStats = async (formId: string) => {
    try {
      const { data: contributions } = await client.models.JackpotContribution.list({
        filter: { jackpotFormId: { eq: formId } }
      });

      if (contributions) {
        const stats = calculateJackpotStats(contributions as JackpotContributionData[]);
        setFormStats(prev => ({
          ...prev,
          [formId]: {
            totalAmount: stats.totalAmount,
            contributorCount: stats.contributorCount
          }
        }));
      }
    } catch (error) {
      debug.error('Error loading contribution stats:', error);
    }
  };

  useEffect(() => {
    setMounted(true);

    // Track unsubscribe function for cleanup
    let unsubscribeFromForms: (() => void) | undefined;

    const initializeForms = async () => {
      try {
        setLoading(true);

        if (isAuthenticated && user) {
          // Setup observeQuery subscription
          const { unsubscribe } = client.models.JackpotForm.observeQuery({
            filter: {
              owner: { eq: user.userId }
            }
          }).subscribe({
            next: async ({ items }) => {
              setForms(items || []);

              // Load contribution stats for each form
              if (items) {
                for (const form of items) {
                  await loadContributionStats(form.id);
                }
              }

              setLoading(false);
            },
            error: (error) => {
              setError('Erreur lors du chargement des cagnottes');
              debug.error('Error loading forms:', error);
              setLoading(false);
            }
          });

          // Store unsubscribe reference for cleanup
          unsubscribeFromForms = unsubscribe;
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError('Erreur lors du chargement des cagnottes');
        debug.error('Error loading forms:', err);
        setLoading(false);
      }
    };

    initializeForms();

    // Cleanup function - called when component unmounts or effect re-runs
    return () => {
      if (unsubscribeFromForms) {
        try {
          unsubscribeFromForms();
        } catch (error) {
          // Amplify subscription cleanup may fail if already closed - safe to ignore
          debug.warn('Subscription cleanup warning:', error);
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.userId]);

  // Load Stripe Connect account status
  useEffect(() => {
    if (!user) {
      setConnectLoading(false);
      return;
    }

    const { unsubscribe } = client.models.StripeConnectAccount.observeQuery({
      filter: { userId: { eq: user.userId } },
      selectionSet: stripeConnectAccountSelectionSet as any
    }).subscribe({
      next: ({ items }) => {
        setConnectAccount((items[0] as Schema['StripeConnectAccount']['type']) || null);
        setConnectLoading(false);
      },
      error: (error) => {
        debug.error('Error loading Connect account:', error);
        setConnectLoading(false);
      }
    });

    return () => {
      try {
        unsubscribe();
      } catch (error) {
        // Amplify subscription cleanup may fail if already closed - safe to ignore
        debug.warn('Subscription cleanup warning:', error);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Container>
        <Section>
          <Title level={TitleLevel.LEVEL1}>
            Gestion des Cagnottes
          </Title>
          <LoadingBackdrop loadingText={'Chargement...'} />
        </Section>
      </Container>
    );
  }

  const handleAuthToggle = async () => {
    const returnUrl = encodeURIComponent('/cagnotte/creer/');
    if (isAuthenticated) {
      await signOut({
        global: false,
        oauth: {
          redirectUrl: `/auth/?returnUrl=${returnUrl}`
        }
      });
      setShowForm(false);
    } else {
      // Redirect to auth page for normal user login/signup
      router.push(`/auth/?mode=user&returnUrl=${returnUrl}`);
    }
  };

  const handleDeleteForm = async (id: string, title: string) => {
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer cette cagnotte : "${title}" ?`);
    if (!confirmed) return;

    try {
      const response = await client.models.JackpotForm.delete({ id });

      if (response.errors) {
        alert('Erreur lors de la suppression de la cagnotte');
      }
      // Note: observeQuery will automatically update the forms list
    } catch (err) {
      alert('Erreur lors de la suppression de la cagnotte');
      debug.error('Error deleting form:', err);
    }
  };

  const handleViewOnline = (form: JackpotFormData) => {
    const url = `/cagnotte/${form.slug}`;
    window.open(url, '_blank');
  };

  const handleRequestPayout = async (form: JackpotFormData) => {
    const confirmed = window.confirm(
      `Demander le paiement de ${formatCurrency(formStats[form.id]?.totalAmount || 0)} pour "${form.title}" ?`
    );
    if (!confirmed) return;

    try {
      const response = await client.models.JackpotForm.update({
        id: form.id,
        payoutRequested: true,
        payoutRequestedAt: new Date().toISOString()
      });

      if (response.errors) {
        alert('Erreur lors de la demande de paiement');
      } else {
        alert('Demande de paiement envoyée avec succès');
        // Note: observeQuery will automatically update the forms list
      }
    } catch (err) {
      alert('Erreur lors de la demande de paiement');
      debug.error('Error requesting payout:', err);
    }
  };

  const handlePublishJackpot = async (form: JackpotFormData) => {
    // Validate deadline is in future
    const deadline = new Date(form.deadline);
    if (deadline <= new Date()) {
      alert('Impossible de publier : la date limite est dépassée');
      return;
    }

    const confirmed = window.confirm(
      `Publier la cagnotte "${form.title}" ?\n\nUne fois publiée, les participants pourront contribuer via le lien partagé.`
    );
    if (!confirmed) return;

    try {
      const response = await client.models.JackpotForm.update({
        id: form.id,
        status: 'ACTIVE'
      });

      if (response.errors) {
        alert('Erreur lors de la publication');
      } else {
        setCreateSuccess('Cagnotte publiée avec succès ! Les participants peuvent maintenant contribuer.');
        // Note: observeQuery will automatically update the forms list
        setTimeout(() => setCreateSuccess(null), 5000);
      }
    } catch (err) {
      alert('Erreur lors de la publication');
      debug.error('Error publishing jackpot:', err);
    }
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
            Gestion des Cagnottes
          </Title>

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

          {/* Stripe Connect Onboarding Gate */}
          {isAuthenticated && !connectLoading && (!connectAccount || connectAccount.accountStatus !== 'ACTIVE') && (
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                <Title level={TitleLevel.LEVEL3}>Configuration Stripe requise</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text style={{ marginBottom: '1rem' }}>
                  {!connectAccount
                    ? 'Vous devez configurer votre compte Stripe Connect pour créer des cagnottes et recevoir des contributions.'
                    : 'Votre compte Stripe Connect n\'est pas encore actif. Veuillez compléter le processus de vérification.'}
                </Text>
                <CreerCagnotteList1 />
                <CreerCagnotteList2 />
                <Button
                  markup={ButtonMarkup.BUTTON}
                  variant={VariantState.PRIMARY}
                  onClick={() => router.push('/cagnotte/compte-stripe/')}
                >
                  {!connectAccount ? 'Configurer mon compte Stripe' : 'Continuer la configuration'}
                </Button>
              </InfoBlockContent>
            </InfoBlock>
          )}

          {/* Forms List */}
          <Box>
            <div style={{ overflowX: 'auto' }}>
              {loading ? (
                <Text className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>Chargement des cagnottes...</Text>
              ) : error ? (
                <InfoBlock>
                  <InfoBlockHeader status={InfoBlockStatus.DANGER} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                    <Title level={TitleLevel.LEVEL3}>Erreur</Title>
                  </InfoBlockHeader>
                  <InfoBlockContent>
                    <Text>{error}</Text>
                  </InfoBlockContent>
                </InfoBlock>
              ) : isAuthenticated ? (
                <>
                  <Title level={TitleLevel.LEVEL2}>
                    Mes cagnottes
                  </Title>

                  {forms.length === 0 ? (
                    <Text>Aucune cagnotte trouvée.</Text>
                  ) : (
                    <>
                      {forms.map(form => {
                        const status = form.status || 'DRAFT';
                        const statusBadge = getJackpotStatusBadge(status);
                        const stats = formStats[form.id] || { totalAmount: 0, contributorCount: 0 };
                        const canRequestPayout = status === 'CLOSED' && !form.payoutRequested && stats.totalAmount > 0;

                        return (
                          <div key={form.id} className={classNames(
                              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                              flexStyles.isGridCols1,
                              flexStyles.isGridItemsCenter,
                              flexStyles.isFullwidth
                            )} style={{ marginTop: '1.5rem'}}>
                            <Box className={classNames(flexStyles.isFlat, flexStyles.isMarginless)}>
                              <div className={classNames(
                                  flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                                  flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
                                  flexStyles.isAlignItemsCenter,
                                  flexStyles.isJustifyContentSpaceBetween,
                                  flexStyles.isFullwidth,
                                )}>
                                <Title level={TitleLevel.LEVEL7}>{form.title}</Title>
                                <div className={classNames(
                                    flexStyles.help, flexStyles.isInfo,
                                    flexStyles.isFullwidth,
                                    flexStyles.isGridDisplayGrid,
                                    flexStyles.isGridPlaceItemsStart, flexStyles.isGridPlaceItemsEndTablet,
                                  )}>
                                  <Icon
                                    content={`Cliquez sur « Voir » pour accéder à la cagnotte en ligne.`}
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
                                    <div style={{ padding: '0 0.5rem' }}>Statut</div>
                                  </TableTh>
                                  <TableTh className={flexStyles.isHiddenMobile}>
                                    <div style={{ padding: '0 0.5rem' }}>Montant collecté</div>
                                  </TableTh>
                                  <TableTh className={flexStyles.isHiddenMobile}>
                                    <div style={{ padding: '0 0.5rem' }}>Contributeurs</div>
                                  </TableTh>
                                  <TableTh className={flexStyles.isHiddenMobile}>
                                    <div style={{ padding: '0 0.5rem' }}>Échéance</div>
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
                                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Statut</div>
                                    <div className={classNames(
                                      flexStyles.isFlexMobile,
                                      flexStyles.isFlexDirectionColumn,
                                      flexStyles.isAlignItemsCenter,
                                      flexStyles.isJustifyContentStart,
                                      flexStyles.isFullwidth,
                                    )} style={{ padding: '0 0.5rem' }}>
                                      <Sticker variant={statusBadge.variant}>
                                        {statusBadge.label}
                                      </Sticker>
                                      {status === 'DRAFT' && (
                                        <Text style={{ fontSize: '0.75rem', marginTop: '0.25rem', marginBottom: '0', opacity: 0.7 }}>
                                          Non publiée
                                        </Text>
                                      )}
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
                                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Montant collecté</div>
                                    <div className={classNames(
                                      flexStyles.isFlexMobile,
                                      flexStyles.isFlexDirectionColumn,
                                      flexStyles.isAlignItemsCenter,
                                      flexStyles.isJustifyContentStart,
                                      flexStyles.isFullwidth,
                                    )} style={{ padding: '0 0.5rem' }}>
                                      <strong>{formatCurrency(stats.totalAmount)}</strong>
                                      {form.targetAmount && (
                                        <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
                                          / {formatCurrency(form.targetAmount)}
                                        </span>
                                      )}
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
                                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Contributeurs</div>
                                    <div className={classNames(
                                      flexStyles.isFlexMobile,
                                      flexStyles.isFlexDirectionColumn,
                                      flexStyles.isAlignItemsCenter,
                                      flexStyles.isJustifyContentStart,
                                      flexStyles.isFullwidth,
                                    )} style={{ padding: '0 0.5rem' }}>
                                      {stats.contributorCount}
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
                                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Échéance</div>
                                    <div className={classNames(
                                      flexStyles.isFlexMobile,
                                      flexStyles.isFlexDirectionColumn,
                                      flexStyles.isAlignItemsCenter,
                                      flexStyles.isJustifyContentStart,
                                      flexStyles.isFullwidth,
                                    )} style={{ padding: '0 0.5rem' }}>
                                      <div>{formatDeadline(new Date(form.deadline))}</div>
                                      <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                                        {getDeadlineDistance(new Date(form.deadline))}
                                      </div>
                                    </div>
                                  </TableTd>

                                  <TableTd className={classNames(
                                    flexStyles.isGridDisplayGrid,
                                    flexStyles.isFullheight,
                                    flexStyles.isFullwidth,
                                    flexStyles.isPaddingless,
                                  )}>
                                    <div className={classNames(
                                      flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                                      flexStyles.isGridCols1, flexStyles.isGridCols3MobileMax, flexStyles.isGridCols1Tablet,
                                      flexStyles.isAlignItemsCenter,
                                      flexStyles.isJustifyContentCenter,
                                      flexStyles.isJustifiedCenter,
                                      flexStyles.isFullheight,
                                      flexStyles.isFullwidth,
                                    )}
                                    style={{ padding: '1rem 0 0' }}>
                                      {status === 'DRAFT' && (
                                        <Button
                                          small
                                          markup={ButtonMarkup.BUTTON}
                                          variant={VariantState.SUCCESS}
                                          onClick={() => handlePublishJackpot(form)}
                                        >
                                          ✓ Publier
                                        </Button>
                                      )}
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
                                          // Scroll to form after state update
                                          setTimeout(() => {
                                            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                          }, 100);
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
                                      {canRequestPayout && (
                                        <Button
                                          small
                                          markup={ButtonMarkup.BUTTON}
                                          variant={VariantState.SUCCESS}
                                          onClick={() => handleRequestPayout(form)}
                                        >
                                          Demander paiement
                                        </Button>
                                      )}
                                    </div>
                                  </TableTd>
                                </TableTr>
                              </TableBody>
                            </Table>
                          </div>
                        );
                      })}

                      <Section>
                        <InfoBlock>
                          <InfoBlockHeader status={InfoBlockStatus.SUCCESS} customIcon={IconName.UI_CHECK_CIRCLE}>
                            <Title level={TitleLevel.LEVEL3}>
                              Vous avez créé votre cagnotte avec succès.
                            </Title>
                          </InfoBlockHeader>
                          <InfoBlockContent size={12}>
                            <Title level={TitleLevel.LEVEL4}>
                              Pour la consulter en ligne, cliquez sur <span className={classNames(flexStyles.isNowrap)}>« Voir ».</span><br/>
                              Notez et copiez l&apos;URL de la page.<br/>
                              C&apos;est cette URL que vous partagerez avec d&apos;autres parents pour qu&apos;ils puissent contribuer.
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
                  <Text>Vous devez être connecté pour créer des cagnottes.</Text>
                </Box>
              )}
            </div>
          </Box>

          {/* Auth Controls */}
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
                variant={isAuthenticated ? VariantState.SUCCESS : VariantState.TERTIARY}
                onClick={handleAuthToggle}
              >
                {isAuthenticated ? 'Déconnexion 🔓' : 'Connexion 🔒'}
              </Button>

              {isAuthenticated && (
                <Button
                  markup={ButtonMarkup.BUTTON}
                  variant={showForm ? VariantState.SECONDARY : VariantState.PRIMARY}
                  onClick={() => {
                    // Only allow if Connect account is active
                    if (connectAccount?.accountStatus === 'ACTIVE') {
                      setShowForm(!showForm);
                    } else {
                      router.push('/cagnotte/compte-stripe/');
                    }
                  }}
                  disabled={connectLoading}
                >
                  {showForm ? 'Cacher le formulaire' : 'Créer une nouvelle cagnotte'}
                </Button>
              )}
            </div>
          </Box>

          {/* Jackpot Form Creation/Editing */}
          {isAuthenticated && showForm && connectAccount?.accountStatus === 'ACTIVE' && (
            <div ref={formRef}>
              <JackpotForm
                onSubmit={(success, message) => {
                  if (success) {
                    setCreateSuccess(message);
                    setShowForm(false);
                    setEditingFormId(null);
                    // Note: observeQuery will automatically update the forms list
                    setTimeout(() => setCreateSuccess(null), 5000);
                  } else {
                    setCreateError(message);
                  }
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditingFormId(null);
                  setCreateError(null);
                }}
                existingSlugs={forms.map(f => f.slug)}
                editingFormId={editingFormId || undefined}
                stripeAccountId={connectAccount?.stripeAccountId || undefined}
              />
            </div>
          )}
        </Section>
      </Container>
    </>
  );
}
