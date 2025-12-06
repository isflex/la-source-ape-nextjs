'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import classNames from 'classnames';
import { default as flexStyles } from '@flex-design-system/framework';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
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
        console.error('Error loading account:', error);
        setError('Erreur lors du chargement du compte');
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [user]);

  const handleStartOnboarding = async () => {
    if (!user) return;

    setCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe-connect/create-account-link/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          email: user.signInDetails?.loginId || '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du lien');
      }

      // Redirect to Stripe onboarding
      window.location.href = data.url;
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
  if (!user) {
    return (
      <Box>
        <Title level={TitleLevel.LEVEL1}>Compte Stripe Connect</Title>
        <InfoBlock>
          <InfoBlockHeader status={InfoBlockStatus.WARNING}>
            <Title level={TitleLevel.LEVEL3}>Connexion requise</Title>
          </InfoBlockHeader>
          <InfoBlockContent>
            <Text>Vous devez être connecté pour accéder à cette page.</Text>
            <div style={{ marginTop: '1rem' }}>
              <Button
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
    );
  }

  if (loading) {
    return (
      <Box>
        <Title level={TitleLevel.LEVEL1}>Compte Stripe Connect</Title>
        <Text>Chargement...</Text>
      </Box>
    );
  }

  const statusBadge = getStatusBadge(connectAccount?.accountStatus || undefined);
  const isActive = connectAccount?.accountStatus === 'ACTIVE';
  const needsOnboarding = !connectAccount || connectAccount.accountStatus === 'NOT_STARTED' || connectAccount.accountStatus === 'ONBOARDING_STARTED';

  return (
    <Box>
      <div className={classNames(flexStyles.container)}>
        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <Title level={TitleLevel.LEVEL1}>Compte Stripe Connect</Title>
          <Text style={{ marginTop: '0.5rem' }}>
            Configurez votre compte Stripe pour recevoir les contributions des cagnottes.
          </Text>
        </div>

        {/* Success message */}
        {success && (
          <div style={{ marginBottom: '2rem' }}>
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.SUCCESS} customIcon={IconName.UI_CHECK}>
                <Title level={TitleLevel.LEVEL3}>Succès</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>{success}</Text>
              </InfoBlockContent>
            </InfoBlock>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{ marginBottom: '2rem' }}>
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.DANGER} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                <Title level={TitleLevel.LEVEL3}>Erreur</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>{error}</Text>
              </InfoBlockContent>
            </InfoBlock>
          </div>
        )}

        {/* Account Status */}
        <div className={classNames(flexStyles.box)} style={{ marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem' }}>
            <div className={classNames(flexStyles.isFlex, flexStyles.isFlexDirectionRow, flexStyles.isJustifyContentSpaceBetween, flexStyles.isAlignItemsCenter)} style={{ marginBottom: '1rem' }}>
              <Title level={TitleLevel.LEVEL2}>Statut du compte</Title>
              <Sticker variant={statusBadge.variant}>
                {statusBadge.label}
              </Sticker>
            </div>

            {connectAccount && (
              <div style={{ marginTop: '1rem' }}>
                <Text style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                  ID du compte: {connectAccount.stripeAccountId}
                </Text>
                {connectAccount.email && (
                  <Text style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                    Email: {connectAccount.email}
                  </Text>
                )}
              </div>
            )}

            {isActive && (
              <div style={{ marginTop: '1.5rem' }}>
                <InfoBlock>
                  <InfoBlockHeader status={InfoBlockStatus.SUCCESS} customIcon={IconName.UI_CHECK}>
                    <Title level={TitleLevel.LEVEL3}>Compte activé</Title>
                  </InfoBlockHeader>
                  <InfoBlockContent>
                    <Text>
                      Votre compte Stripe Connect est actif. Vous pouvez maintenant créer des cagnottes et recevoir des contributions.
                    </Text>
                    <div style={{ marginTop: '1rem' }}>
                      <Button
                        markup={ButtonMarkup.BUTTON}
                        variant={VariantState.PRIMARY}
                        onClick={() => router.push('/cagnotte/creer/')}
                      >
                        Créer une cagnotte
                      </Button>
                    </div>
                  </InfoBlockContent>
                </InfoBlock>
              </div>
            )}

            {needsOnboarding && (
              <div style={{ marginTop: '1.5rem' }}>
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
                    <Text style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                      Stripe vous demandera de fournir:
                    </Text>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                      <li><Text style={{ fontSize: '0.875rem' }}>Informations bancaires (IBAN)</Text></li>
                      <li><Text style={{ fontSize: '0.875rem' }}>Pièce d&apos;identité</Text></li>
                      <li><Text style={{ fontSize: '0.875rem' }}>Informations personnelles</Text></li>
                    </ul>
                    <Button
                      markup={ButtonMarkup.BUTTON}
                      variant={VariantState.PRIMARY}
                      onClick={handleStartOnboarding}
                      disabled={creating}
                    >
                      {creating ? 'Chargement...' : !connectAccount ? 'Commencer la configuration' : 'Continuer la configuration'}
                    </Button>
                  </InfoBlockContent>
                </InfoBlock>
              </div>
            )}

            {/* Requirements (if account is restricted) */}
            {connectAccount?.currentlyDue && connectAccount.currentlyDue.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
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
                      markup={ButtonMarkup.BUTTON}
                      variant={VariantState.WARNING}
                      onClick={handleStartOnboarding}
                      disabled={creating}
                    >
                      {creating ? 'Chargement...' : 'Mettre à jour les informations'}
                    </Button>
                  </InfoBlockContent>
                </InfoBlock>
              </div>
            )}
          </div>
        </div>

        {/* Navigation back to dashboard */}
        <div style={{ marginTop: '2rem' }}>
          <Button
            markup={ButtonMarkup.BUTTON}
            variant={VariantState.SECONDARY}
            onClick={() => router.push('/cagnotte/creer/')}
          >
            ← Retour au tableau de bord
          </Button>
        </div>
      </div>
    </Box>
  );
}
