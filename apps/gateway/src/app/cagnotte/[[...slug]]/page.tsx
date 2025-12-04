'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import classNames from 'classnames';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Container } from '@flex-design-system/react-ts/client-sync-styled-direct/container';
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
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
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
import StripeCheckoutButton from '@src/components/cagnotte/StripeCheckoutButton';
import AuthBanner from '@src/components/auth/AuthBanner';

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

  const isCreator = user?.userId && jackpotForm?.owner === user.userId;
  const status = jackpotForm?.status || 'DRAFT';
  const isActive = status === 'ACTIVE';
  const isClosed = status === 'CLOSED' || status === 'PAID_OUT';

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
      if (!slug) return;

      try {
        setLoading(true);

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
            console.error('Error loading contributions:', error);
            setLoading(false);
          }
        });

        return unsubscribe;
      } catch (err) {
        console.error('Error loading jackpot:', err);
        setError('Erreur lors du chargement de la cagnotte');
        setLoading(false);
      }
    };

    loadJackpot();
  }, [slug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // Check for success/cancel from Stripe redirect
    const success = searchParams?.get('success');
    const canceled = searchParams?.get('canceled');

    if (success === 'true') {
      // Show success message (could use InfoBlock)
      console.log('Payment successful!');
    }

    if (canceled === 'true') {
      // Show canceled message
      console.log('Payment canceled');
    }
  }, [searchParams]);

  if (!mounted) {
    return (
      <Container>
        <Section>
          <Text className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>Chargement...</Text>
        </Section>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Section>
          <Text className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>Chargement de la cagnotte...</Text>
        </Section>
      </Container>
    );
  }

  if (error || !jackpotForm) {
    return (
      <>
        <AuthBanner />
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
            <div style={{ marginTop: '1rem' }}>
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
                  isCreatorMode={!!isCreator}
                />
              </div>
            </Box>
          </div>
        </Section>
      </Container>
    </>
  );
}
