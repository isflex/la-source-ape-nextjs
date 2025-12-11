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
import { CreerCagnotteList3 } from '@src/components/cagnotte/CagnotteInfoLists'

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

export default function StripeAccountPage() {
  const { user } = useAuthenticator();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [connectAccount, setConnectAccount] = useState<ConnectAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check for success message from return URL
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccess('Intégration Stripe terminée avec succès ! Veuillez patienter pendant la vérification...');
      // Remove query param
      router.replace('/cagnotte/compte-stripe/');
    }
  }, [searchParams, router]);

  // Load account status with observeQuery for real-time updates
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { unsubscribe } = client.models.StripeConnectAccount.observeQuery({
      filter: { userId: { eq: user.userId } }
    }).subscribe({
      next: ({ items }) => {
        setConnectAccount(items[0] || null);
        setLoading(false);
      },
      error: (error) => {
        debug.error('Error loading account:', error);
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
  }, [user?.userId]);

  const handleStartOnboarding = async () => {
    if (!user) return;

    setCreating(true);
    setError(null);

    try {
      // Fetch user attributes to get the real email (not OAuth username)
      const attributes = await fetchUserAttributes();
      const userEmail = attributes.email;

      if (!userEmail) {
        throw new Error('Impossible de récupérer votre email. Veuillez vous reconnecter.');
      }

      debug.log('Creating account link for:', { userId: user.userId, email: userEmail });

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
        return { variant: VariantState.WARNING, label: 'Intégration en cours' };
      case 'RESTRICTED':
        return { variant: VariantState.DANGER, label: 'Restreint' };
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
        <Container>
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
        <Container>
          <Title level={TitleLevel.LEVEL1} className={classNames(flexStyles.hasTextCentered)}>
            Compte Stripe Connect
          </Title>
          <LoadingBackdrop />
        </Container>
      </div>
    );
  }

  const statusBadge = getStatusBadge(connectAccount?.accountStatus || undefined);
  const isActive = connectAccount?.accountStatus === 'ACTIVE';
  const needsOnboarding = !connectAccount || connectAccount.accountStatus === 'NOT_STARTED' || connectAccount.accountStatus === 'ONBOARDING_STARTED';

  return (
    <div className={classNames(
      flexStyles.isFlex, flexStyles.isFlexDirectionColumn, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentCenter
      )} style={{ position: 'relative', padding: '0 1rem' }}>

      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Title level={TitleLevel.LEVEL1} className={classNames(flexStyles.hasTextCentered)}>
          Compte Stripe Connect
        </Title>
        <Text style={{ marginTop: '0.5rem' }}>
          Configurez votre compte Stripe pour recevoir les contributions des cagnottes.
        </Text>
      </div>

      {/* Success message */}
      {success && (
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
          <Container>
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
          <Container>
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
        <Container>
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

            {needsOnboarding && (
              <div>
                <Box>
                  <InfoBlock>
                    <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.UI_INFO_CIRCLE}>
                      <Title level={TitleLevel.LEVEL3}>Configuration requise</Title>
                    </InfoBlockHeader>
                    <InfoBlockContent>
                      <Text style={{ marginBottom: '1rem' }}>
                        {!connectAccount
                          ? 'Vous devez configurer votre compte Stripe Connect pour créer des cagnottes.'
                          : 'Votre intégration Stripe n\'est pas terminée. Veuillez continuer le processus.'}
                      </Text>
                      <CreerCagnotteList3 />
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

            {/* Requirements (if account is restricted) */}
            {connectAccount?.currentlyDue && connectAccount.currentlyDue.length > 0 && (
              <div>
                <Box>
                  <InfoBlock>
                    <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                      <Title level={TitleLevel.LEVEL3}>Informations requises</Title>
                    </InfoBlockHeader>
                    <InfoBlockContent>
                      <Text style={{ marginBottom: '0.5rem' }}>
                        Stripe a besoin d&apos;informations supplémentaires:
                      </Text>
                      <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                        {connectAccount.currentlyDue.map((req, idx) => (
                          <li key={idx}><Text style={{ fontSize: '0.875rem' }}>{req}</Text></li>
                        ))}
                      </ul>
                      <Button
                        id='cagnotte-stripe-account-onboarding-continue'
                        markup={ButtonMarkup.BUTTON}
                        variant={VariantState.WARNING}
                        onClick={handleStartOnboarding}
                        disabled={creating}
                      >
                        {creating ? 'Chargement...' : 'Mettre à jour les informations'}
                      </Button>
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
