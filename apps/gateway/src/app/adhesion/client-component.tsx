'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';

import classNames from 'classnames';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Section } from '@flex-design-system/react-ts/client-sync-styled-direct/section';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import {
  InfoBlock,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus,
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
import { IconName } from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import { View } from '@flex-design-system/react-ts/client-sync-styled-direct/view';
import { default as flexStyles } from '@flex-design-system/framework';

const HELLOASSO_WEBSITE_URLS: Record<string, string> = {
  sandbox: 'https://www.helloasso-sandbox.com',
  production: 'https://www.helloasso.com',
};

interface SubscriberCheckResponse {
  isSubscribed: boolean;
  order: { id: number; date: string; payer: { firstName: string; lastName: string } } | null;
}

type PageState = 'loading' | 'unauthenticated' | 'checking' | 'already-subscribed' | 'ready' | 'error';

export default function AdhesionContent() {
  const { user } = useAuthenticator();
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [subscriberInfo, setSubscriberInfo] = useState<SubscriberCheckResponse['order']>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPageState('unauthenticated');
      return;
    }

    let cancelled = false;

    async function checkSubscription() {
      try {
        setPageState('checking');
        const attributes = await fetchUserAttributes();
        const email = attributes.email;

        if (!email) {
          setErrorMessage("Impossible de récupérer votre adresse email.");
          setPageState('error');
          return;
        }
        if (cancelled) return;

        setUserEmail(email);

        const res = await fetch(`/api/helloasso/check-subscriber?email=${encodeURIComponent(email)}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: SubscriberCheckResponse = await res.json();
        if (cancelled) return;

        if (data.isSubscribed) {
          setSubscriberInfo(data.order);
          setPageState('already-subscribed');
        } else {
          setPageState('ready');
        }
      } catch (err) {
        if (cancelled) return;
        console.error('[adhesion] Subscription check failed:', err);
        setErrorMessage("Erreur lors de la vérification de votre adhésion. Veuillez réessayer.");
        setPageState('error');
      }
    }

    checkSubscription();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const helloassoEnv = process.env.NEXT_PUBLIC_FLEX_HELLOASSO_ENV || 'sandbox';
  const helloassoOrgSlug = process.env.NEXT_PUBLIC_FLEX_HELLOASSO_ORGANIZATION_SLUG || '';
  const helloassoFormSlug = process.env.NEXT_PUBLIC_FLEX_HELLOASSO_FORM_SLUG || 'test-subscribe';
  const websiteBase = HELLOASSO_WEBSITE_URLS[helloassoEnv] || HELLOASSO_WEBSITE_URLS.sandbox;

  const formDirectUrl = `${websiteBase}/associations/${helloassoOrgSlug}/adhesions/${helloassoFormSlug}`;

  if (pageState === 'unauthenticated') {
    return (
      <View>
        <div style={{ maxWidth: '920px', margin: '2rem auto' }}>
          <Box>
            <Section>
              <InfoBlock>
                <InfoBlockHeader status={InfoBlockStatus.WARNING}>
                  <Title level={TitleLevel.LEVEL3}>Connexion requise</Title>
                </InfoBlockHeader>
                <InfoBlockContent>
                  <Title level={TitleLevel.LEVEL5}>
                    Vous devez être connecté pour accéder à la page d&apos;adhésion.
                  </Title>
                  <div style={{ marginTop: '1rem' }}>
                    <Button
                      id="adhesion-login-btn"
                      markup={ButtonMarkup.BUTTON}
                      variant={VariantState.PRIMARY}
                      onClick={() => router.push('/auth/?mode=user')}
                    >
                      Se connecter
                    </Button>
                  </div>
                </InfoBlockContent>
              </InfoBlock>
            </Section>
          </Box>
        </div>
      </View>
    );
  }

  if (pageState === 'loading' || pageState === 'checking') {
    return (
      <View>
        <div style={{ maxWidth: '920px', margin: '2rem auto' }}>
          <Box className={classNames(flexStyles.hasTextTertiary)}>
            <Section>
              <InfoBlock>
                <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.SMILE}>
                </InfoBlockHeader>
                <InfoBlockContent>
                  <Title level={TitleLevel.LEVEL5}>
                    Vérification de votre adhésion en cours...
                  </Title>
                </InfoBlockContent>
              </InfoBlock>
            </Section>
          </Box>
        </div>
      </View>
    );
  }

  if (pageState === 'error') {
    return (
      <View>
        <div style={{ maxWidth: '920px', margin: '2rem auto' }}>
          <Box>
            <Section>
              <InfoBlock>
                <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                  <Title level={TitleLevel.LEVEL3}>Erreur</Title>
                </InfoBlockHeader>
                <InfoBlockContent>
                  <Title level={TitleLevel.LEVEL5}>
                    {errorMessage || "Une erreur inattendue est survenue."}
                  </Title>
                  <div style={{ marginTop: '1rem' }}>
                    <Button
                      id="adhesion-retry-btn"
                      markup={ButtonMarkup.BUTTON}
                      variant={VariantState.SECONDARY}
                      onClick={() => window.location.reload()}
                    >
                      Réessayer
                    </Button>
                  </div>
                </InfoBlockContent>
              </InfoBlock>
            </Section>
          </Box>
        </div>
      </View>
    );
  }

  if (pageState === 'already-subscribed') {
    return (
      <View>
        <div style={{ maxWidth: '920px', margin: '2rem auto' }}>
          <Box className={classNames(flexStyles.hasTextTertiary)}>
            <Section>
              <InfoBlock>
                <InfoBlockHeader status={InfoBlockStatus.SUCCESS} customIcon={IconName.UI_CHECK_CIRCLE}>
                  <Title level={TitleLevel.LEVEL3}>Vous êtes déjà adhérent(e)</Title>
                </InfoBlockHeader>
                <InfoBlockContent>
                  <Title level={TitleLevel.LEVEL5}>
                    Une adhésion est déjà enregistrée pour l&apos;adresse <strong>{userEmail}</strong>
                    {subscriberInfo?.payer && (
                      <> au nom de {subscriberInfo.payer.firstName} {subscriberInfo.payer.lastName}</>
                    )}
                    {subscriberInfo?.date && (
                      <> en date du {new Date(subscriberInfo.date).toLocaleDateString('fr-FR')}</>
                    )}
                    .
                  </Title>
                  <Title level={TitleLevel.LEVEL5} style={{ marginTop: '1rem' }}>
                    Si vous avez une question, veuillez contacter l&apos;APE à{' '}
                    <strong style={{ color: '#0055a4' }}>{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</strong>.
                  </Title>
                </InfoBlockContent>
              </InfoBlock>
            </Section>
          </Box>
        </div>
      </View>
    );
  }

  // pageState === 'ready'
  return (
    <View>
      <div style={{ maxWidth: '920px', margin: '2rem auto' }} className={classNames(flexStyles.hasTextTertiary)}>
        <Section>
          <InfoBlock>
            <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.SHOOTING_STAR}>
              <Title level={TitleLevel.LEVEL3}>Adhésion APE La Source</Title>
            </InfoBlockHeader>
            <InfoBlockContent>
              <Title level={TitleLevel.LEVEL5}>
                Bienvenue <strong>{userEmail}</strong>.
              </Title>
              <Title level={TitleLevel.LEVEL5} style={{ marginTop: '0.5rem' }}>
                Pour finaliser votre adhésion, vous allez être redirigé(e) vers le formulaire
                sécurisé HelloAsso. Le paiement est géré directement par HelloAsso.
              </Title>
              <Title level={TitleLevel.LEVEL5} style={{ marginTop: '0.5rem' }}>
                L&apos;adhésion est annuelle et couvre l&apos;ensemble de la famille (deux adultes).
              </Title>
              <div style={{ marginTop: '1.5rem' }}>
                <Button
                  id="adhesion-proceed-btn"
                  markup={ButtonMarkup.BUTTON}
                  variant={VariantState.PRIMARY}
                  onClick={() => window.open(formDirectUrl, '_blank', 'noopener,noreferrer')}
                >
                  Adhérer via HelloAsso
                </Button>
              </div>
              <Title level={TitleLevel.LEVEL5} style={{ marginTop: '1.5rem' }}>
                Si vous avez une question, veuillez contacter l&apos;APE à{' '}
                <strong style={{ color: '#0055a4' }}>{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</strong>.
              </Title>
            </InfoBlockContent>
          </InfoBlock>
        </Section>
      </div>
    </View>
  );
}
