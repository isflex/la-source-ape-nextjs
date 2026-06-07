/* eslint-disable no-alert */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import CagnotteModal from './cagnotte-modal'
import { LoadingBackdrop } from '@src/components/loading/LoadingBackdrop'
import classNames from 'classnames';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Container } from '@flex-design-system/react-ts/client-sync-styled-direct/container';
import { Modal } from '@flex-design-system/react-ts/client-sync-styled-direct/modal';
import { Section } from '@flex-design-system/react-ts/client-sync-styled-direct/section';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import {
  InfoBlock,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
import { IconName } from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import { Sticker } from '@flex-design-system/react-ts/client-sync-styled-direct/sticker';
import { default as flexStyles } from '@flex-design-system/framework';
import {
  formatCurrency,
  formatDeadline,
  getDeadlineDistance,
  calculateJackpotStats,
  calculateProgress,
  getJackpotStatusBadge,
  isSepaAllowed,
  type JackpotContributionData
} from '@src/lib/cagnotte-helpers';
import { DEFAULT_FEE_CONFIG, type FeeConfig } from '@src/lib/cagnotte-fees';
import JackpotContributionTable from '@src/components/cagnotte/JackpotContributionTable';
import RequestPayoutModal from '@src/components/cagnotte/RequestPayoutModal';
import StripeCheckoutButton from '@src/components/cagnotte/StripeCheckoutButton';
import AuthBanner from '@src/components/auth/AuthBanner';
import SandboxBanner from '@src/components/cagnotte/SandboxBanner';
import { debug } from '@flexiness/domain-utils';
import { useSafeAgentContext } from '@flexiness/copilotkit';

const client = generateClient<Schema>();

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
  feePayInPayer?: string | null;
  feePayoutPayer?: string | null;
  platformCommissionPercent?: number | null;
  sepaPaymentsAllowed?: boolean | null;
  isPubliclyVisible?: boolean | null;
  payoutRequested?: boolean | null;
  payoutRequestedAt?: string | null;
  payoutCompletedAt?: string | null;
  payoutStripeId?: string | null;
};

export default function CagnotteSlugPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthenticator();

  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [jackpotForm, setJackpotForm] = useState<JackpotFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributions, setContributions] = useState<JackpotContributionData[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [publicJackpots, setPublicJackpots] = useState<JackpotFormData[]>([]);
  const [publicJackpotStats, setPublicJackpotStats] = useState<Record<string, { totalAmount: number; contributorCount: number }>>({});
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);

  const isCreator = user?.userId && jackpotForm?.owner === user.userId;
  const status = jackpotForm?.status || 'DRAFT';
  const isActive = status === 'ACTIVE';
  const isClosed = status === 'CLOSED' || status === 'PAID_OUT';

  // CopilotKit v2: Expose jackpot context to AI agent
  useSafeAgentContext({
    description: 'Current jackpot/cagnotte page context and details',
    value: {
      page: slug ? `cagnotte/${slug}` : 'cagnotte',
      pageTitle: jackpotForm?.title || 'Cagnottes APE La Source',
      hasJackpot: !!jackpotForm,
      isCreator,
      status,
      isActive,
      isClosed,
      publicJackpotsCount: publicJackpots.length,
    },
  });

  useSafeAgentContext({
    description: 'Current jackpot details including contributions and progress',
    value: jackpotForm ? {
      id: jackpotForm.id,
      title: jackpotForm.title,
      slug: jackpotForm.slug,
      teacherName: jackpotForm.teacherName,
      schoolLevel: jackpotForm.schoolLevel ?? null,
      targetAmount: jackpotForm.targetAmount ?? null,
      deadline: jackpotForm.deadline,
      status: jackpotForm.status ?? null,
      contributionsCount: contributions.length,
      // Extract only serializable stats fields
      totalAmount: calculateJackpotStats(contributions).totalAmount,
      contributorCount: calculateJackpotStats(contributions).contributorCount,
    } : null,
  });

  // Check if deadline passed and auto-close
  useEffect(() => {
    const checkDeadline = async () => {
      if (jackpotForm && jackpotForm.status === 'ACTIVE') {
        const deadline = new Date(jackpotForm.deadline);
        const now = new Date();

        if (now > deadline) {
          // Auto-close jackpot
          await client.models.JackpotForm.update({
            id: jackpotForm.id,
            status: 'CLOSED'
          });
        }
      }
    };

    checkDeadline();
  }, [jackpotForm]);

  // Load jackpot form and contributions
  useEffect(() => {
    const loadJackpot = async () => {

      try {
        setLoading(true);

        if (!slug) {
          // Load public jackpots for landing page
          const { data: publicForms } = await client.models.JackpotForm.list({
            filter: {
              isPubliclyVisible: { eq: true },
              status: { eq: 'ACTIVE' }
            }
          });

          if (publicForms && publicForms.length > 0) {
            setPublicJackpots(publicForms as JackpotFormData[]);

            // Load contribution stats for each public jackpot
            for (const form of publicForms) {
              const { data: contribs } = await client.models.JackpotContribution.list({
                filter: { jackpotFormId: { eq: form.id } }
              });
              if (contribs) {
                const stats = calculateJackpotStats(contribs as JackpotContributionData[]);
                setPublicJackpotStats(prev => ({
                  ...prev,
                  [form.id]: {
                    totalAmount: stats.totalAmount,
                    contributorCount: stats.contributorCount
                  }
                }));
              }
            }
          }

          setShowModal(true)
          setLoading(false);
          return;
        }

        // Load jackpot form
        const { data: forms } = await client.models.JackpotForm.list({
          filter: { slug: { eq: slug } }
        });

        if (!forms || forms.length === 0) {
          setError('Cagnotte introuvable');
          setLoading(false);
          return;
        }

        setJackpotForm(forms[0]);

        // Load contributions with observeQuery for real-time updates
        const { unsubscribe } = client.models.JackpotContribution.observeQuery({
          filter: { jackpotFormId: { eq: forms[0].id } }
        }).subscribe({
          next: ({ items }) => {
            setContributions((items || []) as JackpotContributionData[]);
            setLoading(false);
          },
          error: (error) => {
            debug.error('Error loading contributions:', error);
            setLoading(false);
          }
        });

        return unsubscribe;
      } catch (err) {
        debug.error('Error loading jackpot:', err);
        setError('Erreur lors du chargement de la cagnotte');
        setLoading(false);
      }
    };

    loadJackpot();
  }, [slug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    const success = searchParams?.get('success');
    const sessionId = searchParams?.get('session_id');
    const canceled = searchParams?.get('canceled');

    if (canceled === 'true') {
      debug.cagnotte('Payment canceled');
    }

    if (success !== 'true' || !sessionId || !slug) return;

    let cancelled = false;
    (async () => {
      try {
        const response = await fetch('/api/cagnotte/refresh-session-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          debug.error('[Cagnotte] Refresh session non-OK:', response.status, errBody);
        } else {
          debug.cagnotte('[Cagnotte] Refresh session OK');
        }
      } catch (err) {
        debug.error('[Cagnotte] Refresh session threw:', err);
      } finally {
        if (!cancelled) {
          router.replace(`/cagnotte/${slug}/`);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, router, slug]);

  // Owner-only background reconcile: when the cagnotte owner is viewing their own page and
  // observeQuery surfaces contributions left at PENDING with a real Stripe session ID, sync
  // each one against Stripe. Each session ID is reconciled at most once per page load.
  const reconciledSessionIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isCreator) return;

    const stuck = contributions.filter(
      (c): c is JackpotContributionData & { stripeSessionId: string } =>
        c.paymentStatus === 'PENDING' &&
        typeof c.stripeSessionId === 'string' &&
        c.stripeSessionId !== '' &&
        c.stripeSessionId !== 'temp' &&
        !reconciledSessionIdsRef.current.has(c.stripeSessionId),
    );
    if (stuck.length === 0) return;

    stuck.forEach((c) => reconciledSessionIdsRef.current.add(c.stripeSessionId));

    void Promise.all(
      stuck.map((c) =>
        fetch('/api/cagnotte/refresh-session-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: c.stripeSessionId }),
        }).catch((err) => {
          debug.error('[Cagnotte] Owner reconcile error:', c.stripeSessionId, err);
        }),
      ),
    );
  }, [isCreator, contributions]);

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const handlePayoutConfirm = async (): Promise<string | null> => {
    if (!jackpotForm) return 'Cagnotte introuvable';
    try {
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();
      const idToken = session.tokens?.idToken?.toString();
      if (!accessToken || !idToken) {
        return 'Session non valide. Veuillez vous reconnecter.';
      }

      const response = await fetch('/api/cagnotte/request-payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken},${idToken}`,
        },
        body: JSON.stringify({ jackpotFormId: jackpotForm.id }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        debug.error('Error requesting payout:', response.status, data);
        return data?.error || 'Erreur lors de la demande de paiement';
      }

      alert('Demande de paiement envoyée avec succès.');

      // Optimistic local update; the payout.paid webhook will later flip status to PAID_OUT.
      setJackpotForm((prev) =>
        prev
          ? {
              ...prev,
              payoutRequested: true,
              payoutRequestedAt: new Date().toISOString(),
              payoutStripeId: data?.payoutId ?? null,
            }
          : prev,
      );
      return null;
    } catch (err) {
      debug.error('Error requesting payout:', err);
      return 'Erreur lors de la demande de paiement';
    }
  };

  if (!mounted) {
    return null;
  }

  if (showModal) {
    return (
      <>
        {createPortal(
          <div
            onClick={(e) => {
              ;(e as React.MouseEvent<HTMLDivElement, MouseEvent>).stopPropagation()
            }}
          >
            <Modal
              active={showModal}
              onClose={() => {
                toggleModal()
              }}
            >
              <br/><br/>
              <CagnotteModal toggleModal={() => toggleModal()}/>
            </Modal>
          </div>,
          document.querySelector('#root-portal') as unknown as HTMLDivElement,
        )}
    </>
  )}

  if (loading) {
    return (
      <Container>
        <Section>
          <Title level={TitleLevel.LEVEL1} className={classNames(
            flexStyles.isFullwidth,
            flexStyles.hasTextCentered,
          )}>
            Cagnottes APE La Source
          </Title>
        </Section>
        <LoadingBackdrop loadingText={'Chargement...'} />
      </Container>
    );
  }

  if (!slug) {
    return (
      <>
        <AuthBanner />
        <SandboxBanner />
        <Container>
          <Section>
            {/* Public Cagnottes List */}
            {publicJackpots.length > 0 && (
              <Box>
                <Title level={TitleLevel.LEVEL2} className={classNames(
                  flexStyles.isFullwidth,
                  flexStyles.hasTextCentered,
                )}>
                  Cagnottes publiques
                </Title>
                <Text className={classNames(flexStyles.hasTextCentered)} style={{ marginBottom: '1.5rem' }}>
                  Ces cagnottes sont ouvertes aux contributions de tous les parents.
                </Text>

                <div className={classNames(
                  flexStyles.isGridDisplayGrid,
                  flexStyles.isGridGap4,
                  flexStyles.isGridCols1,
                  flexStyles.isGridCols2Tablet,
                  flexStyles.isFullwidth,
                )}>
                  {publicJackpots.map((jackpot) => {
                    const stats = publicJackpotStats[jackpot.id] || { totalAmount: 0, contributorCount: 0 };
                    return (
                      <Box key={jackpot.id} className={classNames(flexStyles.isFlat)}>
                        <Title level={TitleLevel.LEVEL4}>{jackpot.title}</Title>
                        <Text><strong>Pour :</strong> {jackpot.teacherName}</Text>
                        <Text style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                          Échéance : {formatDeadline(new Date(jackpot.deadline))} ({getDeadlineDistance(new Date(jackpot.deadline))})
                        </Text>
                        <div style={{ marginTop: '0.5rem' }}>
                          <Text>
                            <strong>{formatCurrency(stats.totalAmount)}</strong> collecté
                            {jackpot.targetAmount && (
                              <span style={{ opacity: 0.8 }}> / {formatCurrency(jackpot.targetAmount)}</span>
                            )}
                          </Text>
                          <Text style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                            {stats.contributorCount} contributeur{stats.contributorCount !== 1 ? 's' : ''}
                          </Text>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                          <Button
                            small
                            markup={ButtonMarkup.BUTTON}
                            variant={VariantState.PRIMARY}
                            onClick={() => router.push(`/cagnotte/${jackpot.slug}/`)}
                          >
                            Voir et contribuer
                          </Button>
                        </div>
                      </Box>
                    );
                  })}
                </div>
              </Box>
            )}

            {/* Info block for private cagnottes */}
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.UI_INFO_CIRCLE}>
                <Title level={TitleLevel.LEVEL3}>Vous cherchez une cagnotte privée ?</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>Un parent organisateur devra vous communiquer l&apos;URL exacte de la cagnotte.</Text>
              </InfoBlockContent>
            </InfoBlock>

            <div className={classNames(
              flexStyles.isFlex,
              flexStyles.isAlignItemsCenter,
              flexStyles.isJustifyContentCenter,
              flexStyles.isFullwidth,
            )}>
              <Button
                markup={ButtonMarkup.BUTTON}
                variant={VariantState.PRIMARY}
                onClick={() => router.push('/cagnotte/info/')}
              >
                En savoir plus
              </Button>
            </div>
          </Section>
        </Container>
      </>
    )
  }

  if (error || !jackpotForm) {
    return (
      <>
        <AuthBanner />
        <SandboxBanner />
        <Container>
          <Section>
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.DANGER} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                <Title level={TitleLevel.LEVEL3}>Erreur</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>{error || 'Cagnotte introuvable'}</Text>
              </InfoBlockContent>
            </InfoBlock>
            <div className={classNames(
              flexStyles.isFlex,
              flexStyles.isAlignItemsCenter,
              flexStyles.isJustifyContentCenter,
              flexStyles.isFullwidth,
            )}>
              <Button
                markup={ButtonMarkup.BUTTON}
                variant={VariantState.PRIMARY}
                onClick={() => router.push('/cagnotte/creer/')}
              >
                Retour à mes cagnottes
              </Button>
            </div>
          </Section>
        </Container>
      </>
    );
  }

  const stats = calculateJackpotStats(contributions);
  const progress = calculateProgress(stats.totalAmount, jackpotForm.targetAmount);
  const statusBadge = getJackpotStatusBadge(status);

  // Build fee configuration from jackpot settings (with env defaults as fallback)
  const feeConfig: FeeConfig = {
    payInFeePayer: (jackpotForm.feePayInPayer as any) || DEFAULT_FEE_CONFIG.payInFeePayer,
    payoutFeePayer: (jackpotForm.feePayoutPayer as any) || DEFAULT_FEE_CONFIG.payoutFeePayer,
    platformCommissionPercent: jackpotForm.platformCommissionPercent ?? DEFAULT_FEE_CONFIG.platformCommissionPercent,
  };

  // Check if SEPA payments are allowed (based on env config and cutoff date)
  const sepaAllowed = Boolean(jackpotForm.sepaPaymentsAllowed) && isSepaAllowed(new Date(jackpotForm.deadline));

  return (
    <>
      <AuthBanner />
      <SandboxBanner />
      <Container>
        <Section>
          {/* Header */}
          <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
              flexStyles.isGridCols1,
              flexStyles.isAlignItemsCenter,
              flexStyles.isFullwidth,
            )}>
            <Title level={TitleLevel.LEVEL1} className={classNames(
              flexStyles.isFullwidth,
              flexStyles.hasTextCentered,
            )}>
              {jackpotForm.title}
            </Title>

            <div className={classNames(
                flexStyles.isFullwidth,
                flexStyles.hasTextCentered,
              )}>
              <Sticker variant={statusBadge.variant}>
                {statusBadge.label}
              </Sticker>
            </div>
          </div>

          {isCreator && (
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.UI_INFO_CIRCLE}>
                <Title level={TitleLevel.LEVEL3}>Mode créateur</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>Vous êtes le créateur de cette cagnotte. Vous pouvez voir tous les détails des contributions.</Text>
              </InfoBlockContent>
            </InfoBlock>
          )}

          {/* Jackpot Details */}
          <div style={{ marginTop: '2rem' }}>
            <Box>
              <Title level={TitleLevel.LEVEL2}>Détails</Title>

              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
                flexStyles.isFullwidth,
              )}>
                <div>
                  <Text><strong>Pour :</strong> {jackpotForm.teacherName}</Text>
                </div>
                <div>
                  <Text><strong>Échéance :</strong> {formatDeadline(new Date(jackpotForm.deadline))}</Text>
                  <Text style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                    ({getDeadlineDistance(new Date(jackpotForm.deadline))})
                  </Text>
                </div>
              </div>

              {jackpotForm.description && (
                <div style={{ marginTop: '1rem' }}>
                  <Text><strong>Description :</strong></Text>
                  <div dangerouslySetInnerHTML={{ __html: jackpotForm.description }} />
                </div>
              )}
            </Box>
          </div>

          {/* Progress */}
          <div style={{ marginTop: '2rem' }}>
            <Box>
              <Title level={TitleLevel.LEVEL2}>Progression</Title>

              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                flexStyles.isGridCols1, flexStyles.isGridCols3Tablet,
                flexStyles.isFullwidth,
              )} style={{ marginTop: '1rem' }}>
                <div className={classNames(flexStyles.hasTextCentered)}>
                  <Text style={{ fontSize: '0.875rem', opacity: 0.8 }}>Montant collecté</Text>
                  <Title level={TitleLevel.LEVEL3}>{formatCurrency(stats.totalAmount)}</Title>
                </div>

                {jackpotForm.targetAmount && (
                  <div className={classNames(flexStyles.hasTextCentered)}>
                    <Text style={{ fontSize: '0.875rem', opacity: 0.8 }}>Objectif</Text>
                    <Title level={TitleLevel.LEVEL3}>{formatCurrency(jackpotForm.targetAmount)}</Title>
                  </div>
                )}

                <div className={classNames(flexStyles.hasTextCentered)}>
                  <Text style={{ fontSize: '0.875rem', opacity: 0.8 }}>Contributeurs</Text>
                  <Title level={TitleLevel.LEVEL3}>{stats.contributorCount}</Title>
                </div>
              </div>

              {jackpotForm.targetAmount && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{
                    width: '100%',
                    height: '20px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(progress.percentage, 100)}%`,
                      height: '100%',
                      backgroundColor: progress.isComplete ? '#10b981' : '#3b82f6',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <Text style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    {progress.percentage.toFixed(0)}% de l&apos;objectif atteint
                  </Text>
                </div>
              )}
            </Box>
          </div>

          {/* Contribute Button */}
          {isActive && !isClosed && (
            <div style={{ marginTop: '2rem' }}>
              <Box>
                <Title level={TitleLevel.LEVEL2}>Contribuer</Title>
                <div style={{ marginTop: '1rem' }}>
                  <StripeCheckoutButton
                    jackpotFormId={jackpotForm.id}
                    jackpotTitle={jackpotForm.title}
                    teacherName={jackpotForm.teacherName}
                    feeConfig={feeConfig}
                    sepaAllowed={sepaAllowed}
                    onError={(message) => alert(message)}
                  />
                </div>
              </Box>
            </div>
          )}

          {isClosed && (
            <div style={{ marginTop: '2rem' }}>
              <InfoBlock>
                <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                  <Title level={TitleLevel.LEVEL3}>Cagnotte fermée</Title>
                </InfoBlockHeader>
                <InfoBlockContent>
                  <Text>Cette cagnotte est fermée et n&apos;accepte plus de contributions.</Text>

                  {isCreator && jackpotForm?.payoutCompletedAt && (
                    <Text style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                      Paiement effectué le{' '}
                      {new Date(jackpotForm.payoutCompletedAt).toLocaleDateString('fr-FR')}.
                    </Text>
                  )}

                  {isCreator && !jackpotForm?.payoutCompletedAt && jackpotForm?.payoutRequested && (
                    <Text style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                      Demande de paiement envoyée
                      {jackpotForm.payoutRequestedAt
                        ? ` le ${new Date(jackpotForm.payoutRequestedAt).toLocaleDateString('fr-FR')}`
                        : ''}
                      . Le paiement sera confirmé sous quelques jours.
                    </Text>
                  )}

                  {isCreator
                    && !jackpotForm?.payoutCompletedAt
                    && !jackpotForm?.payoutRequested
                    && calculateJackpotStats(contributions).totalAmount > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <Button
                        id='cagnotte-detail-request-payout-btn'
                        markup={ButtonMarkup.BUTTON}
                        variant={VariantState.SUCCESS}
                        onClick={() => setPayoutModalOpen(true)}
                      >
                        Demander paiement
                      </Button>
                    </div>
                  )}
                </InfoBlockContent>
              </InfoBlock>
            </div>
          )}

          {/* Contributions Table */}
          <div style={{ marginTop: '2rem' }}>
            <Box>
              <Title level={TitleLevel.LEVEL2}>Contributions</Title>
              <div style={{ marginTop: '1rem' }}>
                <JackpotContributionTable
                  jackpotFormId={jackpotForm.id}
                  jackpotFormStatus={status}
                  isCreatorMode={!!isCreator}
                />
              </div>
            </Box>
          </div>
        </Section>
      </Container>
      <RequestPayoutModal
        open={payoutModalOpen}
        amount={calculateJackpotStats(contributions).totalAmount}
        cagnotteTitle={jackpotForm.title}
        onClose={() => setPayoutModalOpen(false)}
        onConfirm={handlePayoutConfirm}
      />
    </>
  );
}
