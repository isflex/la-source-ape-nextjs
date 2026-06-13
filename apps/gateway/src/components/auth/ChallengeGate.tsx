"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from "aws-amplify/auth";

import { default as flexStyles } from "@flex-design-system/framework";
import { Modal } from "@flex-design-system/react-ts/client-sync-styled-direct/modal";
import {
  Title,
  TitleLevel,
} from "@flex-design-system/react-ts/client-sync-styled-direct/title";
import { Text } from "@flex-design-system/react-ts/client-sync-styled-direct/text";
import {
  Button,
  ButtonMarkup,
} from "@flex-design-system/react-ts/client-sync-styled-direct/button";
import { VariantState } from "@flex-design-system/react-ts/client-sync-styled-direct/objects";
// import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import {
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus,
} from "@flex-design-system/react-ts/client-sync-styled-direct/info-block";
import { IconName } from "@flex-design-system/react-ts/client-sync-styled-direct/icon";
import {
  Input,
  type InputChangeEvent,
} from "@flex-design-system/react-ts/client-sync-styled-direct/input";

import {
  CHALLENGE_QUESTION,
  readChallengePassed,
} from "@src/lib/auth-challenge";
import LogoApe from "@src/components/logo-ape";

type GateStatus = "checking" | "gated" | "passed";

/**
 * Blocks signed-in users (password AND Google) until the `challenge_passed`
 * ID-token claim is 'true'. Unauthenticated visitors are unaffected.
 * The claim is the enforceable artifact — this UI is UX only; the answer is
 * verified server-side by POST /api/auth/challenge.
 */
const ChallengeGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, authStatus } = useAuthenticator((ctx) => [
    ctx.user,
    ctx.authStatus,
  ]);
  const [status, setStatus] = useState<GateStatus>("checking");
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const checkClaim = useCallback(
    async (forceRefresh = false): Promise<boolean> => {
      const session = await fetchAuthSession(
        forceRefresh ? { forceRefresh: true } : undefined,
      );
      return readChallengePassed(session);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        if (authStatus !== "authenticated" || !user) {
          // Public browsing (and the sign-in flow itself) stays unaffected.
          if (!cancelled) setStatus("passed");
          return;
        }
        const passed = await checkClaim();
        if (!cancelled) setStatus(passed ? "passed" : "gated");
      } catch {
        // If the session cannot be read, do not lock the user out of public content.
        if (!cancelled) setStatus("passed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authStatus, user, checkClaim]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();
      if (!accessToken) {
        setError("Session expirée. Veuillez vous reconnecter.");
        return;
      }
      const response = await fetch("/api/auth/challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ answer }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError("Une erreur est survenue. Veuillez réessayer.");
        return;
      }
      if (!result.success) {
        setError("Réponse incorrecte. Veuillez réessayer.");
        return;
      }
      // Attribute set server-side — refresh tokens so PreTokenGeneration re-runs.
      if (await checkClaim(true)) {
        setStatus("passed");
        return;
      }
      // Rare attribute-write/refresh race: one delayed retry.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (await checkClaim(true)) {
        setStatus("passed");
      } else {
        setError("Vérification en cours. Veuillez réessayer dans un instant.");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  // Mutual exclusion: when gated, render the modal INSTEAD OF children, so the
  // protected app is never in the DOM and can't be revealed by deleting the modal
  // node. 'checking' and 'passed' both render children (no blank-flash for public
  // visitors; preserves SSR/hydration parity — SSR initial status is 'checking').
  if (status === "gated") {
    return (
      <>
        {/* Centered logo behind the modal: the protected app is still never in the
            DOM (so deleting the modal node reveals only this branding, not the app),
            but the page isn't a blank void. */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            height: "100vh",
          }}
        >
          <LogoApe />
        </div>
        <Modal
          active={true}
          onClose={() => {
            /* non-dismissable: answering is the only way through */
          }}
        >
          <form onSubmit={(e) => void handleSubmit(e)}>
            <InfoBlock>
              <InfoBlockHeader
                status={InfoBlockStatus.INFO}
                customIcon={IconName.UI_QUESTION_CIRCLE}
              >
                <Title level={TitleLevel.LEVEL4}>Une dernière question</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Title level={TitleLevel.LEVEL5}>{CHALLENGE_QUESTION}</Title>
                <Input
                  id="challenge-answer"
                  type="text"
                  value={answer}
                  onChange={(e: InputChangeEvent) => setAnswer(e.inputValue)}
                  placeholder="Votre réponse..."
                  className={flexStyles.isFullwidth}
                  focused
                />
                {error && (
                  <div style={{ margin: "0 auto 1rem" }}>
                    <Text className={flexStyles.hasTextDanger}>{error}</Text>
                  </div>
                )}
              </InfoBlockContent>
              <InfoBlockAction>
                <Button
                  markup={ButtonMarkup.BUTTON}
                  type="submit"
                  variant={VariantState.PRIMARY}
                  disabled={submitting || !answer.trim()}
                >
                  {submitting ? "Vérification..." : "Valider"}
                </Button>
              </InfoBlockAction>
            </InfoBlock>
          </form>
        </Modal>
      </>
    );
  }

  return children;
};

export default ChallengeGate;
