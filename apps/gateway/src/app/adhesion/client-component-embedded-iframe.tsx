"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import { debug } from "@flexiness/domain-utils";

import classNames from "classnames";
import { Box } from "@flex-design-system/react-ts/client-sync-styled-direct/box";
import {
  Button,
  ButtonMarkup,
} from "@flex-design-system/react-ts/client-sync-styled-direct/button";
import { Section } from "@flex-design-system/react-ts/client-sync-styled-direct/section";
import {
  Title,
  TitleLevel,
} from "@flex-design-system/react-ts/client-sync-styled-direct/title";
import { Text } from "@flex-design-system/react-ts/client-sync-styled-direct/text";
import { VariantState } from "@flex-design-system/react-ts/client-sync-styled-direct/objects";
import {
  InfoBlock,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus,
} from "@flex-design-system/react-ts/client-sync-styled-direct/info-block";
import {
  Icon,
  IconSize,
  // IconPosition,
  IconName,
  // IconStatus,
} from "@flex-design-system/react-ts/client-sync-styled-direct/icon";
import { Link } from "@flex-design-system/react-ts/client-sync-styled-direct/link";
import { View } from "@flex-design-system/react-ts/client-sync-styled-direct/view";
import { default as flexStyles } from "@flex-design-system/framework";
import { default as stylesPage } from "@src/styles/scss/pages/adhesion.module.scss";
import { LoadingBackdrop } from "@src/components/loading/LoadingBackdrop";
import AuthBanner from "@src/components/auth/AuthBanner";

const ADHESION_RETURN_URL = encodeURIComponent("/adhesion/");

const HELLOASSO_WEBSITE_URLS: Record<string, string> = {
  sandbox: "https://www.helloasso-sandbox.com",
  production: "https://www.helloasso.com",
};

interface SubscriberCheckResponse {
  isSubscribed: boolean;
  order: {
    id: number;
    date: string;
    payer: { firstName: string; lastName: string };
  } | null;
}

type PageState =
  | "loading"
  | "unauthenticated"
  | "checking"
  | "already-subscribed"
  | "ready"
  | "error";

const IFRAME_MIN_HEIGHT_DESKTOP = "1300px";
const IFRAME_MIN_HEIGHT_MOBILE = "1600px";

export default function AdhesionContent({
  mobileCheck,
}: {
  mobileCheck: boolean;
}) {
  const { user } = useAuthenticator();
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [userLastName, setUserLastName] = useState<string | null>(null);
  const [subscriberInfo, setSubscriberInfo] =
    useState<SubscriberCheckResponse["order"]>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync UI state to async auth user
      setPageState("unauthenticated");
      return;
    }

    let cancelled = false;

    async function checkSubscription() {
      try {
        setPageState("checking");
        const attributes = await fetchUserAttributes();
        const { email } = attributes;

        if (!email) {
          setErrorMessage("Impossible de récupérer votre adresse email.");
          setPageState("error");
          return;
        }
        if (cancelled) return;

        setUserEmail(email);
        if (attributes.given_name) setUserFirstName(attributes.given_name);
        if (attributes.family_name) setUserLastName(attributes.family_name);

        const res = await fetch(
          `/api/helloasso/check-subscriber?email=${encodeURIComponent(email)}`,
        );
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: SubscriberCheckResponse = await res.json();
        if (cancelled) return;

        if (data.isSubscribed) {
          setSubscriberInfo(data.order);
          setPageState("already-subscribed");
        } else {
          setPageState("ready");
        }
      } catch (err) {
        if (cancelled) return;
        debug.adhesion("Subscription check failed:", err);
        setErrorMessage(
          "Erreur lors de la vérification de votre adhésion. Veuillez réessayer.",
        );
        setPageState("error");
      }
    }

    checkSubscription();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const helloassoEnv = process.env.NEXT_PUBLIC_FLEX_HELLOASSO_ENV || "sandbox";
  const helloassoOrgSlug =
    process.env.NEXT_PUBLIC_FLEX_HELLOASSO_ORGANIZATION_SLUG || "";
  const helloassoFormSlug =
    process.env.NEXT_PUBLIC_FLEX_HELLOASSO_FORM_SLUG || "test-subscribe";
  const websiteBase =
    HELLOASSO_WEBSITE_URLS[helloassoEnv] || HELLOASSO_WEBSITE_URLS.sandbox;

  const formWidgetBase = `${websiteBase}/associations/${helloassoOrgSlug}/adhesions/${helloassoFormSlug}/widget`;
  const prefillParams = new URLSearchParams();
  if (userEmail) prefillParams.set("email", userEmail);
  if (userFirstName) prefillParams.set("firstName", userFirstName);
  if (userLastName) prefillParams.set("lastName", userLastName);
  const formWidgetUrl = prefillParams.toString()
    ? `${formWidgetBase}?${prefillParams.toString()}`
    : formWidgetBase;
  const formDirectUrl = `${websiteBase}/associations/${helloassoOrgSlug}/adhesions/${helloassoFormSlug}`;

  const iframeMinHeight = mobileCheck
    ? IFRAME_MIN_HEIGHT_MOBILE
    : IFRAME_MIN_HEIGHT_DESKTOP;

  const iframeRef = useCallback((node: HTMLIFrameElement | null) => {
    if (!node) return;
    iframeNodeRef.current = node;
  }, []);
  const iframeNodeRef = React.useRef<HTMLIFrameElement | null>(null);

  // Listen for postMessage height updates from the HelloAsso widget
  useEffect(() => {
    if (pageState !== "ready") return;

    const expectedOrigin = websiteBase;

    function handleMessage(e: MessageEvent) {
      if (e.origin !== expectedOrigin) return;
      const dataHeight = e.data?.height;
      if (typeof dataHeight !== "number" || dataHeight <= 0) return;

      const iframe = iframeNodeRef.current;
      if (!iframe) return;

      // const currentHeight = parseFloat(iframe.style.minHeight) || 0;
      // if (dataHeight > currentHeight) {
      //   iframe.style.minHeight = `${dataHeight}px`;
      // }

      iframe.style.minHeight = `${dataHeight + 40}px`;
    }

    window.addEventListener("message", handleMessage);
    document
      .querySelector(`.adhesion__${process.env.NEXT_PUBLIC_BUILD_ID}`)
      ?.classList.remove(`withSvgBg__${process.env.NEXT_PUBLIC_BUILD_ID}`);
    return () => {
      window.removeEventListener("message", handleMessage);
      document
        .querySelector(`.adhesion__${process.env.NEXT_PUBLIC_BUILD_ID}`)
        ?.classList.add(`withSvgBg__${process.env.NEXT_PUBLIC_BUILD_ID}`);
    };
  }, [pageState, websiteBase]);

  if (pageState === "unauthenticated") {
    return (
      <View>
        <div style={{ maxWidth: "920px", margin: "2rem auto" }}>
          <InfoBlock>
            <InfoBlockHeader
              status={InfoBlockStatus.INFO}
              customIcon={IconName.SHOOTING_STAR}
            >
              <Title level={TitleLevel.LEVEL2}>Adhésion APE La Source</Title>
            </InfoBlockHeader>
          </InfoBlock>
          <Box className={stylesPage.boxedCustomColor}>
            <Section>
              <InfoBlock>
                <InfoBlockHeader status={InfoBlockStatus.WARNING}>
                  <Title level={TitleLevel.LEVEL4}>Connexion requise</Title>
                </InfoBlockHeader>
                <InfoBlockContent>
                  <Title level={TitleLevel.LEVEL5}>
                    Vous devez être connecté pour accéder à la page
                    d&apos;adhésion.
                  </Title>
                  <div style={{ marginTop: "1rem" }}>
                    <Button
                      id="adhesion-login-btn"
                      markup={ButtonMarkup.BUTTON}
                      variant={VariantState.PRIMARY}
                      onClick={() =>
                        router.push(
                          `/auth/?mode=user&returnUrl=${ADHESION_RETURN_URL}`,
                        )
                      }
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

  if (pageState === "loading" || pageState === "checking") {
    return (
      <View>
        {user && <AuthBanner />}
        <div style={{ maxWidth: "920px", margin: "2rem auto" }}>
          <InfoBlock>
            <InfoBlockHeader
              status={InfoBlockStatus.INFO}
              customIcon={IconName.SHOOTING_STAR}
            >
              <Title level={TitleLevel.LEVEL2}>Adhésion APE La Source</Title>
            </InfoBlockHeader>
          </InfoBlock>
          <Box className={stylesPage.boxedCustomColor}>
            <Section>
              <InfoBlock>
                <InfoBlockHeader
                  status={InfoBlockStatus.INFO}
                  customIcon={IconName.SMILE}
                ></InfoBlockHeader>
                <InfoBlockContent>
                  <Title level={TitleLevel.LEVEL5}>
                    Vérification de votre adhésion en cours...
                  </Title>
                </InfoBlockContent>
              </InfoBlock>
              <LoadingBackdrop />
            </Section>
          </Box>
        </div>
      </View>
    );
  }

  if (pageState === "error") {
    return (
      <View>
        {user && <AuthBanner />}
        <div style={{ maxWidth: "920px", margin: "2rem auto" }}>
          <InfoBlock>
            <InfoBlockHeader
              status={InfoBlockStatus.INFO}
              customIcon={IconName.SHOOTING_STAR}
            >
              <Title level={TitleLevel.LEVEL2}>Adhésion APE La Source</Title>
            </InfoBlockHeader>
          </InfoBlock>
          <Box className={stylesPage.boxedCustomColor}>
            <Section>
              <InfoBlock>
                <InfoBlockHeader
                  status={InfoBlockStatus.WARNING}
                  customIcon={IconName.UI_EXCLAMATION_CIRCLE}
                >
                  <Title level={TitleLevel.LEVEL4}>Erreur</Title>
                </InfoBlockHeader>
                <InfoBlockContent>
                  <Title level={TitleLevel.LEVEL5}>
                    {errorMessage || "Une erreur inattendue est survenue."}
                  </Title>
                  <div style={{ marginTop: "1rem" }}>
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

  if (pageState === "already-subscribed") {
    return (
      <View>
        {user && <AuthBanner />}
        <div style={{ maxWidth: "920px", margin: "2rem auto" }}>
          <InfoBlock>
            <InfoBlockHeader
              status={InfoBlockStatus.INFO}
              customIcon={IconName.SHOOTING_STAR}
            >
              <Title level={TitleLevel.LEVEL2}>Adhésion APE La Source</Title>
            </InfoBlockHeader>
          </InfoBlock>
          <Box className={stylesPage.boxedCustomColor}>
            <Section>
              <InfoBlock>
                <InfoBlockHeader
                  status={InfoBlockStatus.SUCCESS}
                  customIcon={IconName.UI_CHECK_CIRCLE}
                >
                  <Title level={TitleLevel.LEVEL4}>
                    Vous êtes déjà adhérent(e)
                  </Title>
                </InfoBlockHeader>
                <InfoBlockContent>
                  <Title level={TitleLevel.LEVEL5}>
                    Une adhésion est déjà enregistrée pour l&apos;adresse{" "}
                    <strong>{userEmail}</strong>
                    {subscriberInfo?.payer && (
                      <>
                        {" "}
                        au nom de {subscriberInfo.payer.firstName}{" "}
                        {subscriberInfo.payer.lastName}
                      </>
                    )}
                    {subscriberInfo?.date && (
                      <>
                        {" "}
                        en date du{" "}
                        {new Date(subscriberInfo.date).toLocaleDateString(
                          "fr-FR",
                        )}
                      </>
                    )}
                    .
                  </Title>
                  <Title
                    level={TitleLevel.LEVEL5}
                    style={{ marginTop: "1rem" }}
                  >
                    Si vous avez une question, veuillez contacter l&apos;APE à{" "}
                    <br />
                    <div style={{ marginTop: "0.5rem" }}>
                      <Link
                        href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                      >
                        {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                      </Link>
                    </div>
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
      {user && <AuthBanner />}
      <div
        style={{ margin: "2rem auto" }}
        className={classNames(flexStyles.hasTextTertiary)}
      >
        <Section>
          <InfoBlock>
            <InfoBlockHeader
              status={InfoBlockStatus.INFO}
              customIcon={IconName.SHOOTING_STAR}
            >
              <Title level={TitleLevel.LEVEL2}>Adhésion APE La Source</Title>
            </InfoBlockHeader>
            <InfoBlockContent>
              <Title level={TitleLevel.LEVEL5}>
                Bienvenue <strong>{userEmail}</strong>
              </Title>
              <Title
                level={TitleLevel.LEVEL5}
                className={classNames(flexStyles.hasTextInfo)}
              >
                Complétez le formulaire ci-dessous pour finaliser votre
                adhésion.
              </Title>
              <br />
              <div
                style={{
                  maxWidth: "680px",
                  display: "flex",
                  flexDirection: "row",
                  margin: "0 auto",
                }}
              >
                <Icon size={IconSize.SMALL} name={IconName.UI_INFO_CIRCLE} />
                <Text>
                  Veuillez utiliser l'adresse <strong>{userEmail}</strong> lors
                  du paiement pour que votre adhésion soit automatiquement
                  reliée à votre compte.
                </Text>
              </div>
            </InfoBlockContent>
          </InfoBlock>
          {/* <div style={{ marginTop: '1rem' }}>
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                <Title level={TitleLevel.LEVEL4}>À noter</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Title level={TitleLevel.LEVEL5}>
                  Veuillez utiliser l&apos;adresse <strong>{userEmail}</strong> lors du paiement
                  pour que votre adhésion soit automatiquement reliée à votre compte.
                </Title>
              </InfoBlockContent>
            </InfoBlock>
          </div> */}
          <div style={{ width: "100%" }}>
            <iframe
              ref={iframeRef}
              src={formWidgetUrl}
              style={{
                width: "100%",
                minHeight: iframeMinHeight,
                border: "none",
                overflow: "hidden",
              }}
              title="Formulaire d'adhésion HelloAsso"
              allow="payment"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
              id="haWidget"
              scrolling="no"
            />
          </div>
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <Title
              level={TitleLevel.LEVEL5}
              className={classNames(flexStyles.hasTextTertiary)}
            >
              Si le formulaire ne s&apos;affiche pas correctement,{" "}
              <a
                href={formDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0055a4" }}
              >
                cliquez ici pour accéder directement au formulaire HelloAsso
              </a>
              .
            </Title>
          </div>
        </Section>
      </div>
    </View>
  );
}
