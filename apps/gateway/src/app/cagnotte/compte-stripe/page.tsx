'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import classNames from 'classnames';
import { debug } from '@flexiness/domain-utils';
import { LoadingBackdrop } from '@src/components/loading/LoadingBackdrop'
import { SuccessCelebration } from '@src/components/animations/index'
import { CreerCagnotteListSteps } from '@src/components/cagnotte/CagnotteInfoLists'
import SandboxBanner from '@src/components/cagnotte/SandboxBanner'

import { default as flexStyles } from '@flex-design-system/framework';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Container } from '@flex-design-system/react-ts/client-sync-styled-direct/container';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Sticker } from '@flex-design-system/react-ts/client-sync-styled-direct/sticker';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import {
  InfoBlock,
  InfoBlockHeader,
  InfoBlockContent,
  InfoBlockStatus
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
import { IconName } from '@flex-design-system/react-ts/client-sync-styled-direct/icon';

const client = generateClient<Schema>();

type ConnectAccountData = Schema['StripeConnectAccount']['type'];

// SelectionSet for StripeConnectAccount to ensure all fields are retrieved for real-time updates
const stripeConnectAccountSelectionSet = [
  'id', 'userId', 'stripeAccountId', 'accountStatus',
  'onboardingComplete', 'chargesEnabled', 'payoutsEnabled', 'detailsSubmitted',
  'email', 'displayName', 'country', 'currency',
  'onboardingStartedAt', 'onboardingCompletedAt', 'lastOnboardingLinkCreatedAt',
  'currentlyDue', 'eventuallyDue', 'pastDue', 'disabledReason',
  'createdAt', 'updatedAt'
] as const;

// Helper to categorize Stripe requirements into onboarding steps
type OnboardingStep = {
  step: 1 | 2;
  label: string;
  description: string;
  requirements: string[];
};

function categorizeRequirements(currentlyDue: (string | null)[] | null | undefined): {
  step1Pending: boolean;
  step2Pending: boolean;
  steps: OnboardingStep[];
} {
  if (!currentlyDue || currentlyDue.length === 0) {
    return { step1Pending: false, step2Pending: false, steps: [] };
  }

  // Filter out null values
  const requirements = currentlyDue.filter((req): req is string => req !== null);

  if (requirements.length === 0) {
    return { step1Pending: false, step2Pending: false, steps: [] };
  }

  // Step 2: Identity verification (document upload)
  const verificationPatterns = ['verification.document', 'verification.additional_document'];

  const step1Requirements: string[] = [];
  const step2Requirements: string[] = [];

  requirements.forEach(req => {
    const isVerification = verificationPatterns.some(pattern => req.includes(pattern));
    if (isVerification) {
      step2Requirements.push(req);
    } else {
      step1Requirements.push(req);
    }
  });

  const steps: OnboardingStep[] = [];

  if (step1Requirements.length > 0) {
    steps.push({
      step: 1,
      label: 'Étape 1 : Coordonnées personnelles',
      description: 'Renseignez vos informations personnelles (nom, adresse, date de naissance)',
      requirements: step1Requirements
    });
  }

  if (step2Requirements.length > 0) {
    steps.push({
      step: 2,
      label: 'Étape 2 : Vérification d\'identité',
      description: 'Validez votre identité avec une pièce d\'identité officielle',
      requirements: step2Requirements
    });
  }

  return {
    step1Pending: step1Requirements.length > 0,
    step2Pending: step2Requirements.length > 0,
    steps
  };
}

export default function StripeAccountPage() {
  const { user } = useAuthenticator();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [connectAccount, setConnectAccount] = useState<ConnectAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle return from Stripe onboarding
  useEffect(() => {
    if (searchParams.get('success') !== 'true') return;

    let cancelled = false;

    (async () => {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- react to Stripe redirect URL param on mount
      setSuccess('Étape complétée. Vérification en cours...');

      try {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken?.toString();
        const idToken = session.tokens?.idToken?.toString();

        if (!accessToken || !idToken) {
          debug.warn('[StripeConnect] No tokens available for refresh; relying on polling fallback');
          return;
        }

        const response = await fetch('/api/stripe-connect/refresh-account-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken},${idToken}`,
          },
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          debug.error('[StripeConnect] Refresh endpoint failed:', response.status, errBody);
          return;
        }

        const data = await response.json();
        debug.log('[StripeConnect] Refresh endpoint synced:', data);
      } catch (err) {
        debug.error('[StripeConnect] Refresh call threw:', err);
      } finally {
        if (!cancelled) {
          router.replace('/cagnotte/compte-stripe/');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, router]);

  // Polling fallback for real-time subscription reliability.
  // Activates when success message is shown (user just returned from onboarding) OR when the
  // user lands in ONBOARDING_COMPLETE (Stripe still verifying — even on a later visit/reload).
  // Each tick calls the refresh-account-status endpoint (which talks to Stripe directly
  // and writes to the DB), then re-reads the DB. The webhook alone is unreliable in prod —
  // this loop is what reliably advances ONBOARDING_COMPLETE → ACTIVE without manual reload.
  useEffect(() => {
    const shouldPoll = !!user && (success !== null || connectAccount?.accountStatus === 'ONBOARDING_COMPLETE');
    if (!shouldPoll) return;

    debug.log('[StripeConnect] Starting polling fallback');

    const pollInterval = setInterval(async () => {
      try {
        // Force a Stripe → DB sync before reading.
        try {
          const session = await fetchAuthSession();
          const accessToken = session.tokens?.accessToken?.toString();
          const idToken = session.tokens?.idToken?.toString();
          if (accessToken && idToken) {
            const refreshResp = await fetch('/api/stripe-connect/refresh-account-status', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken},${idToken}`,
              },
            });
            if (!refreshResp.ok) {
              const errBody = await refreshResp.json().catch(() => ({}));
              debug.warn('[StripeConnect] Poll refresh non-OK:', refreshResp.status, errBody);
            }
          }
        } catch (refreshErr) {
          debug.warn('[StripeConnect] Poll refresh threw:', refreshErr);
        }

        const { data: accounts } = await client.models.StripeConnectAccount.list({
          filter: { userId: { eq: user.userId } },
          selectionSet: stripeConnectAccountSelectionSet as any
        });

        if (accounts && accounts.length > 0) {
          const account = accounts[0];
          debug.log('[StripeConnect] Poll result:', { status: account.accountStatus });

          // Update state if status changed
          if (account.accountStatus !== connectAccount?.accountStatus) {
            setConnectAccount(account as ConnectAccountData);
          }

          // Stop polling if account is fully active or verified
          if (account.accountStatus === 'ACTIVE') {
            debug.log('[StripeConnect] Stopping polling - status updated');
            clearInterval(pollInterval);
            setSuccess(null); // Clear success message once verified
          }
        }
      } catch (err) {
        debug.error('[StripeConnect] Poll error:', err);
      }
    }, 5000); // Poll every 5 seconds (≈24 Stripe retrieve calls per 2-min window)

    // Stop polling after 2 minutes maximum
    const timeout = setTimeout(() => {
      debug.log('[StripeConnect] Polling timeout reached');
      clearInterval(pollInterval);
    }, 120000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, user?.userId, connectAccount?.accountStatus]);

  // Load account status with observeQuery for real-time updates
  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- early-exit loading when unauthenticated
      setLoading(false);
      return;
    }

    const { unsubscribe } = client.models.StripeConnectAccount.observeQuery({
      filter: { userId: { eq: user.userId } },
      selectionSet: stripeConnectAccountSelectionSet as any
    }).subscribe({
      next: ({ items, isSynced }) => {
        debug.log('[StripeConnect] observeQuery update:', {
          itemCount: items.length,
          isSynced,
          status: items[0]?.accountStatus
        });
        setConnectAccount((items[0] as ConnectAccountData) || null);
        setLoading(false);
      },
      error: (error) => {
        debug.error('[StripeConnect] observeQuery error:', error);
        setError('Erreur lors du chargement du compte');
        setLoading(false);
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

  const handleStartOnboarding = async () => {
    if (!user) return;

    setCreating(true);
    setError(null);

    try {
      // Fetch user attributes to get the real email (not OAuth username)
      const attributes = await fetchUserAttributes();
      const userEmail = attributes.email;
      const firstName = attributes.given_name;
      const lastName = attributes.family_name;

      if (!userEmail) {
        throw new Error('Impossible de récupérer votre email. Veuillez vous reconnecter.');
      }

      debug.log('Creating account link for:', { userId: user.userId, email: userEmail, firstName, lastName });

      // Check Stripe mode: 'local' (default) or 'backend'
      const stripeMode = process.env.NEXT_PUBLIC_STRIPE_MODE || 'local';

      if (stripeMode === 'backend') {
        // BACKEND MODE: Call backend API (for shared/joint Stripe accounts)
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken?.toString();
        const idToken = session.tokens?.idToken?.toString();

        if (!accessToken || !idToken) {
          throw new Error('Session non valide. Veuillez vous reconnecter.');
        }

        const backendUrl = process.env.NEXT_PUBLIC_POKER_BACK_HOST || 'http://localhost:8080';
        const baseUrl = window.location.origin;

        const response = await fetch(`${backendUrl}/api/stripe/create-account-link`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken},${idToken}`,
          },
          body: JSON.stringify({
            userId: user.userId,
            email: userEmail,
            firstName,
            lastName,
            baseUrl,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          debug.error('Account link creation failed (backend mode):', data);
          throw new Error(data.error || 'Erreur lors de la création du lien');
        }

        // Redirect to Stripe onboarding (external URL)
        window.location.href = data.url;

      } else {
        // LOCAL MODE: Call Next.js API route (default, for own Stripe account)
        const baseUrl = window.location.origin;

        const response = await fetch('/api/stripe-connect/create-account-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.userId,
            email: userEmail,
            firstName,
            lastName,
            baseUrl,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          debug.error('Account link creation failed:', data);
          throw new Error(data.error || 'Erreur lors de la création du lien');
        }

        // Redirect to Stripe onboarding (external URL)
        window.location.href = data.url;
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setCreating(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return { variant: VariantState.SUCCESS, label: 'Actif' };
      case 'ONBOARDING_COMPLETE':
        return { variant: VariantState.INFO, label: 'En attente de vérification' };
      case 'ONBOARDING_STARTED':
        return { variant: VariantState.INFO, label: 'Intégration en cours' };
      case 'RESTRICTED':
        return { variant: VariantState.WARNING, label: 'Restreint' };
      case 'DISABLED':
        return { variant: VariantState.DANGER, label: 'Désactivé' };
      case 'NOT_STARTED':
      default:
        return { variant: VariantState.SECONDARY, label: 'Non configuré' };
    }
  };

  // Require authentication
  if (!user && !loading) {
    return (
      <div style={{ marginTop: '2rem' }}>
        <Container className={classNames(flexStyles.isPaddinglessMobile)}>
          <Title level={TitleLevel.LEVEL1} className={classNames(flexStyles.hasTextCentered)}>
            Compte Stripe Connect
          </Title>
          <Box>
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.WARNING}>
                <Title level={TitleLevel.LEVEL3}>Connexion requise</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>Vous devez être connecté pour accéder à cette page.</Text>
                <div style={{ marginTop: '1rem' }}>
                  <Button
                    id='cagnotte-stripe-account-connect-btn'
                    markup={ButtonMarkup.BUTTON}
                    variant={VariantState.PRIMARY}
                    onClick={() => router.push('/auth/?mode=user')}
                  >
                    Se connecter
                  </Button>
                </div>
              </InfoBlockContent>
            </InfoBlock>
          </Box>
        </Container>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ marginTop: '2rem' }}>
        <Container className={classNames(flexStyles.isPaddinglessMobile)}>
          <Title level={TitleLevel.LEVEL1} className={classNames(flexStyles.hasTextCentered)}>
            Compte Stripe Connect
          </Title>
          <LoadingBackdrop loadingText={'Chargement...'} />
        </Container>
      </div>
    );
  }

  const statusBadge = getStatusBadge(connectAccount?.accountStatus || undefined);
  const isActive = connectAccount?.accountStatus === 'ACTIVE';
  const isStillProcessing = connectAccount?.accountStatus === 'ONBOARDING_COMPLETE' || connectAccount?.accountStatus === 'RESTRICTED'
  const needsOnboarding = !connectAccount || connectAccount.accountStatus === 'NOT_STARTED' || connectAccount.accountStatus === 'ONBOARDING_STARTED';
  const { step1Pending, step2Pending, steps } = categorizeRequirements(connectAccount?.currentlyDue);
  const hasRequirements = !!connectAccount?.currentlyDue && connectAccount.currentlyDue.length > 0;
  // ONBOARDING_COMPLETE with no outstanding requirements = Stripe accepted the submission and is
  // running internal verification. Don't fall through to a blank box.
  const isVerificationPending = connectAccount?.accountStatus === 'ONBOARDING_COMPLETE' && !hasRequirements;

  return (
    <div className={classNames(
      flexStyles.isFlex, flexStyles.isFlexDirectionColumn, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentCenter
      )} style={{ position: 'relative', padding: '0 1rem' }}>

      <SandboxBanner />

      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Title level={TitleLevel.LEVEL1} className={classNames(flexStyles.hasTextCentered)}>
          Compte Stripe Connect
        </Title>
        <Text style={{ marginTop: '0.5rem' }} className={classNames(flexStyles.hasTextCentered, flexStyles.isStrong )}>
          Configurez votre compte Stripe pour recevoir les contributions des cagnottes.
        </Text>

        {/* Two-step process information banner */}
        {success && isStillProcessing && (
          <div className={flexStyles.hasTextSmall}>
            <Text style={{ marginBottom: '0.75rem' }} className={classNames(flexStyles.hasTextCentered, flexStyles.isItalic, flexStyles.hasTextFlexPurple)}>
              Il se peut que vous soyez amené à configurer votre compte en deux temps :
            </Text>
            <ol style={{ marginLeft: '1.5rem', marginBottom: '0' }}>
              <li style={{ marginBottom: '0.25rem' }}>
                <Text>
                  <strong>Coordonnées personnelles et bancaires</strong> — Renseignez vos informations (nom, adresse, date de naissance, IBAN)
                </Text>
              </li>
              <li>
                <Text>
                  <strong>Vérification d&apos;identité</strong> — Validez vos coordonnées avec une pièce d&apos;identité officielle
                </Text>
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* Success message */}
      {(success && isActive) && (
        <>
        <div className={flexStyles.isHiddenMobile} style={{ position: 'absolute', left: '0', top: '0', width: '100%' }}>
          <Container>
            <SuccessCelebration />
          </Container>
        </div>
        <div style={{ marginBottom: '2rem',  width: '100%', position: 'relative'  }}>
          <div className={flexStyles.isHiddenTablet} style={{ position: 'absolute', left: '-25%', top: '25px', width: '150%' }}>
            <Container>
              <SuccessCelebration />
            </Container>
          </div>
          <Container className={classNames(flexStyles.isPaddinglessMobile)}>
            <div className={classNames(
                flexStyles.box, flexStyles.isFlat,
              )} style={{ marginBottom: '2rem', backgroundColor: 'transparent' }}>
              <InfoBlock>
                <InfoBlockHeader status={InfoBlockStatus.SUCCESS} customIcon={IconName.UI_CHECK_CIRCLE}>
                  <Title level={TitleLevel.LEVEL3}>Succès</Title>
                </InfoBlockHeader>
                <InfoBlockContent>
                  <Text>{success}</Text>
                </InfoBlockContent>
              </InfoBlock>
            </div>
          </Container>
        </div>
        </>
      )}

      {/* Error message */}
      {error && (
        <div style={{ marginBottom: '2rem' }}>
          <Container className={classNames(flexStyles.isPaddinglessMobile)}>
            <Box>
              <InfoBlock>
                <InfoBlockHeader status={InfoBlockStatus.DANGER} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                  <Title level={TitleLevel.LEVEL3}>Erreur</Title>
                </InfoBlockHeader>
                <InfoBlockContent>
                  <Text>{error}</Text>
                </InfoBlockContent>
              </InfoBlock>
            </Box>
          </Container>
        </div>
      )}

      {/* Account Status */}
      <Container className={classNames(flexStyles.isPaddinglessMobile)}>
        <div className={classNames(
            flexStyles.box, flexStyles.isFlat, flexStyles.isFlatSecondary, flexStyles.hasBackgroundGreyLight
          )} style={{ marginBottom: '2rem' }}>

          <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
              flexStyles.isGridCols1,
              flexStyles.isGridItemsCenter,
              flexStyles.isFullwidth
            )} style={{ marginBottom: '1rem' }}>

            <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                flexStyles.isFullwidth
              )} style={{ gridTemplateColumns: 'auto max-content', alignItems: 'end' }}>
              <Title level={TitleLevel.LEVEL2} className={flexStyles.isMarginless}>Statut du compte</Title>
              <Sticker variant={statusBadge.variant}>
                {statusBadge.label}
              </Sticker>
            </div>

            {connectAccount && (
              <div style={{ marginTop: '1rem' }}>
                <Text className={classNames(flexStyles.hasTextSmall)}>
                  <strong>ID du compte : </strong>{connectAccount.stripeAccountId}
                </Text>
                {connectAccount.email && (
                  <Text className={classNames(flexStyles.hasTextSmall)}>
                    <strong>Email : </strong>{connectAccount.email}
                  </Text>
                )}
              </div>
            )}
          </div>

          {isActive && (
            <div>
              <Box>
                <InfoBlock>
                  <InfoBlockHeader status={InfoBlockStatus.SUCCESS} customIcon={IconName.UI_CHECK_CIRCLE}>
                    <Title level={TitleLevel.LEVEL3}>Compte activé</Title>
                  </InfoBlockHeader>
                  <InfoBlockContent>
                    <Text>
                      Votre compte Stripe Connect est actif. Vous pouvez maintenant créer des cagnottes et recevoir des contributions.
                    </Text>
                    <div style={{ marginTop: '1rem' }}>
                      <Button
                        id='cagnotte-stripe-account-onboarding-complete-create-pot'
                        markup={ButtonMarkup.BUTTON}
                        variant={VariantState.PRIMARY}
                        onClick={() => router.push('/cagnotte/creer/')}
                      >
                        Créer une cagnotte
                      </Button>
                    </div>
                  </InfoBlockContent>
                </InfoBlock>
              </Box>
            </div>
          )}

          {isVerificationPending && (
            <div>
              <Box>
                <InfoBlock>
                  <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.UI_INFO_CIRCLE}>
                    <Title level={TitleLevel.LEVEL3}>Vos informations sont en cours de vérification</Title>
                  </InfoBlockHeader>
                  <InfoBlockContent>
                    <Text style={{ marginBottom: '1rem' }}>
                      Merci ! Vos informations ont bien été envoyées à Stripe. La vérification finale est en cours. Cela peut prendre quelques minutes. Vous pourrez créer des cagnottes dès l&apos;activation de votre compte.
                    </Text>
                    <CreerCagnotteListSteps
                      currentlyDue={connectAccount?.currentlyDue}
                      eventuallyDue={connectAccount?.eventuallyDue}
                      hasStartedOnboarding
                      detailsSubmitted={connectAccount?.detailsSubmitted || false}
                    />
                  </InfoBlockContent>
                </InfoBlock>
              </Box>
            </div>
          )}

          {needsOnboarding && (
            <div>
              <Box>
                <InfoBlock>
                  <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.UI_INFO_CIRCLE}>
                    <Title level={TitleLevel.LEVEL3}>Configuration requise</Title>
                  </InfoBlockHeader>
                  <InfoBlockContent>
                    <Text style={{ marginBottom: '1rem' }}>
                      Vous devez configurer votre compte Stripe Connect pour créer des cagnottes.
                    </Text>
                    <CreerCagnotteListSteps
                      currentlyDue={connectAccount?.currentlyDue}
                      eventuallyDue={connectAccount?.eventuallyDue}
                      hasStartedOnboarding={!!connectAccount && connectAccount.accountStatus !== 'NOT_STARTED'}
                      detailsSubmitted={connectAccount?.detailsSubmitted || false}
                    />
                    <br/>
                    <Button
                      id='cagnotte-stripe-account-onboarding-start'
                      markup={ButtonMarkup.BUTTON}
                      variant={VariantState.PRIMARY}
                      onClick={handleStartOnboarding}
                      disabled={creating}
                    >
                      {creating ? 'Chargement...' : !connectAccount ? 'Commencer la configuration' : 'Continuer la configuration'}
                    </Button>
                  </InfoBlockContent>
                </InfoBlock>
              </Box>
            </div>
          )}

          {/* Step-based requirements display */}
          {hasRequirements && steps.length > 0 && (
            <div>
              <Box>
                <InfoBlock>
                  <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                    <Title level={TitleLevel.LEVEL3}>
                      {/* {steps.length === 1 ? steps[0].label : 'Étapes requises'} */}
                      Votre intégration Stripe n&apos;est pas terminée. Veuillez continuer le processus.
                    </Title>
                  </InfoBlockHeader>
                  <InfoBlockContent>
                    {/* {steps.map((stepInfo, stepIdx) => (
                      <div key={stepIdx} style={{ marginBottom: stepIdx < steps.length - 1 ? '1rem' : '0' }}>
                        {steps.length > 1 && (
                          <Text style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            {stepInfo.label}
                          </Text>
                        )}
                        <Text style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          {stepInfo.description}
                        </Text>
                        <ul style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                          {[...new Set(stepInfo.requirements.map(getRequirementLabel))].map((label, idx) => (
                            <li key={idx}>
                              <Text style={{ fontSize: '0.875rem' }}>{label}</Text>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))} */}
                    <CreerCagnotteListSteps
                      currentlyDue={connectAccount?.currentlyDue}
                      eventuallyDue={connectAccount?.eventuallyDue}
                      hasStartedOnboarding={!!connectAccount && connectAccount.accountStatus !== 'NOT_STARTED'}
                      detailsSubmitted={connectAccount?.detailsSubmitted || false}
                    />
                    <br/>
                    <div style={{ marginTop: '1rem' }}>
                      <Button
                        id='cagnotte-stripe-account-onboarding-continue'
                        markup={ButtonMarkup.BUTTON}
                        variant={VariantState.WARNING}
                        onClick={handleStartOnboarding}
                        disabled={creating}
                      >
                        {creating ? 'Chargement...' : step2Pending && !step1Pending
                          ? 'Vérifier mon identité'
                          : 'Compléter mes informations'}
                      </Button>
                    </div>
                  </InfoBlockContent>
                </InfoBlock>
              </Box>
            </div>
          )}

        </div>
      </Container>

      {/* Navigation back to dashboard */}
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Button
          id='cagnotte-stripe-account-back-btn'
          markup={ButtonMarkup.BUTTON}
          variant={VariantState.SECONDARY}
          onClick={() => router.push('/cagnotte/creer/')}
        >
          ← Retour au tableau de bord
        </Button>
      </div>
    </div>

  );
}
