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
import {
  // Icon,
  // IconSize,
  // IconPosition,
  IconName,
} from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
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

const IFRAME_MIN_HEIGHT_DESKTOP = '1300px';
const IFRAME_MIN_HEIGHT_MOBILE = '1600px';

export default function AdhesionContent({ mobileCheck }: { mobileCheck: boolean }) {
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

  const formWidgetUrl = `${websiteBase}/associations/${helloassoOrgSlug}/adhesions/${helloassoFormSlug}/widget`;
  const formDirectUrl = `${websiteBase}/associations/${helloassoOrgSlug}/adhesions/${helloassoFormSlug}`;

  const iframeMinHeight = mobileCheck ? IFRAME_MIN_HEIGHT_MOBILE : IFRAME_MIN_HEIGHT_DESKTOP;

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
              {/* <div className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>
                <Icon size={IconSize.LARGE} position={IconPosition.UP} name={IconName.UI_CHECK_CIRCLE} />
              </div>
              <Title level={TitleLevel.LEVEL3} className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>
                Vérification de votre adhésion en cours...
              </Title> */}
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
              {/* <div className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)} style={{ marginBottom: '1.5rem' }}>
                <Icon size={IconSize.LARGE} position={IconPosition.UP} name={IconName.UI_CHECK_CIRCLE} />
              </div> */}
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
      <div style={{ margin: '2rem auto' }} className={classNames(flexStyles.hasTextTertiary)}>
        <Section>
          {/* <div className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)} style={{ marginBottom: '2rem' }}>
            <Icon size={IconSize.LARGE} position={IconPosition.UP} name={IconName.UI_CHECK_CIRCLE} />
            <Title level={TitleLevel.LEVEL3}>
              Adhésion APE La Source
            </Title>
            <Title level={TitleLevel.LEVEL5}>
              Bienvenue <strong>{userEmail}</strong>. Complétez le formulaire ci-dessous pour finaliser votre adhésion.
            </Title>
          </div> */}
          <InfoBlock>
            <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.SHOOTING_STAR}>
              <Title level={TitleLevel.LEVEL3}>Adhésion APE La Source</Title>
            </InfoBlockHeader>
            <InfoBlockContent>
              Bienvenue <strong>{userEmail}</strong><br/>Complétez le formulaire ci-dessous pour finaliser votre adhésion.
            </InfoBlockContent>
          </InfoBlock>
          <div style={{ width: '100%' }}>
            <iframe
              src={formWidgetUrl}
              style={{
                width: '100%',
                minHeight: iframeMinHeight,
                border: 'none',
                overflow: 'hidden',
              }}
              title="Formulaire d'adhésion HelloAsso"
              allow="payment"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
              id="haWidget"
              scrolling="no"
            />
          </div>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Title level={TitleLevel.LEVEL5} className={classNames(flexStyles.hasTextTertiary)}>
              Si le formulaire ne s&apos;affiche pas correctement,{' '}
              <a href={formDirectUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0055a4' }}>
                cliquez ici pour accéder directement au formulaire HelloAsso
              </a>.
            </Title>
          </div>
        </Section>
      </div>
    </View>
  );
}
