"use server";

import { NextRequest, NextResponse } from "next/server";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@amplify/data/resource";
import Stripe from "stripe";
import { getCurrentConfig, getAuthConfig } from "@src/utils/amplify/configureAmplifyWithPortDetection";
import { logApiError } from "@src/lib/with-error-logging";
import { getStripeSecrets } from "@src/lib/secrets";
import { debug } from "@flexiness/domain-utils";

Amplify.configure(getCurrentConfig(), { ssr: true });

const client = generateClient<Schema>();

const formatEuroCents = (cents: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);

const sumEurCents = (entries: Stripe.Balance.Available[] | undefined) =>
  (entries ?? [])
    .filter((b) => b.currency === "eur")
    .reduce((sum, b) => sum + b.amount, 0);

let stripeClient: Stripe | null = null;

async function getStripeClient(): Promise<Stripe> {
  if (!stripeClient) {
    const secrets = await getStripeSecrets();
    stripeClient = new Stripe(secrets.FLEX_STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

async function verifyUserAuth(request: NextRequest): Promise<{ userId: string } | null> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const tokenPart = authHeader.substring(7);
    const [accessToken] = tokenPart.split(",");
    if (!accessToken) return null;

    const { CognitoJwtVerifier } = await import("aws-jwt-verify");

    const verifier = CognitoJwtVerifier.create({
      userPoolId: getAuthConfig()?.user_pool_id || "",
      tokenUse: "access",
      clientId: getAuthConfig()?.user_pool_client_id || "",
    });

    const payload = await verifier.verify(accessToken);
    return { userId: payload.sub };
  } catch (error) {
    debug.cagnotte("request-payout: token verification failed", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  let userId: string | undefined;
  let jackpotFormId: string | undefined;

  try {
    const auth = await verifyUserAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Non autorisé. Veuillez vous reconnecter." }, { status: 401 });
    }
    ({ userId } = auth);

    const body = await request.json();
    jackpotFormId = body?.jackpotFormId;
    if (!jackpotFormId || typeof jackpotFormId !== "string") {
      return NextResponse.json({ error: "Identifiant de cagnotte manquant" }, { status: 400 });
    }

    const { data: jackpotForm } = await client.models.JackpotForm.get({ id: jackpotFormId });
    if (!jackpotForm) {
      return NextResponse.json({ error: "Cagnotte introuvable" }, { status: 404 });
    }

    if (jackpotForm.owner !== userId) {
      return NextResponse.json({ error: "Vous n'êtes pas le créateur de cette cagnotte" }, { status: 403 });
    }

    if (jackpotForm.status !== "CLOSED") {
      return NextResponse.json(
        { error: "La cagnotte doit être fermée avant de demander le paiement" },
        { status: 409 },
      );
    }

    if (jackpotForm.payoutRequested) {
      return NextResponse.json(
        { error: "Une demande de paiement est déjà en cours" },
        { status: 409 },
      );
    }

    if (jackpotForm.payoutCompletedAt) {
      return NextResponse.json(
        { error: "Cette cagnotte a déjà été payée" },
        { status: 409 },
      );
    }

    if (!jackpotForm.stripeAccountId) {
      return NextResponse.json(
        { error: "Aucun compte Stripe Connect n'est lié à cette cagnotte" },
        { status: 409 },
      );
    }

    const { data: connectAccounts } = await client.models.StripeConnectAccount.list({
      filter: { stripeAccountId: { eq: jackpotForm.stripeAccountId } },
    });
    const connectAccount = connectAccounts?.[0];
    if (!connectAccount) {
      return NextResponse.json({ error: "Compte Stripe Connect introuvable" }, { status: 409 });
    }
    if (
      connectAccount.accountStatus !== "ACTIVE" ||
      !connectAccount.chargesEnabled ||
      !connectAccount.payoutsEnabled
    ) {
      return NextResponse.json(
        { error: "Le compte Stripe Connect n'est pas prêt à recevoir des paiements" },
        { status: 409 },
      );
    }

    const { data: contributions } = await client.models.JackpotContribution.list({
      filter: {
        and: [
          { jackpotFormId: { eq: jackpotFormId } },
          { paymentStatus: { eq: "SUCCEEDED" } },
        ],
      },
    });

    const succeededAmountEur = (contributions ?? []).reduce(
      (sum, c) => sum + (c.contributionAmount ?? 0),
      0,
    );
    const requestedCents = Math.round(succeededAmountEur * 100);
    if (requestedCents <= 0) {
      return NextResponse.json(
        { error: "Aucune contribution réussie à payer" },
        { status: 409 },
      );
    }

    const stripe = await getStripeClient();

    const balance = await stripe.balance.retrieve({ stripeAccount: jackpotForm.stripeAccountId });
    const availableEurCents = sumEurCents(balance.available);
    const pendingEurCents = sumEurCents(balance.pending);

    if (availableEurCents < requestedCents) {
      if (availableEurCents + pendingEurCents >= requestedCents) {
        return NextResponse.json(
          {
            error:
              `Les fonds (${formatEuroCents(requestedCents)}) ne sont pas encore disponibles. ` +
              "Stripe les libère après une période de sécurité (généralement 7 jours après chaque " +
              "contribution). Veuillez réessayer après cette période.",
          },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Aucun solde EUR disponible sur le compte Stripe Connect." },
        { status: 409 },
      );
    }

    const amountCents = requestedCents;

    const payout = await stripe.payouts.create(
      {
        amount: amountCents,
        currency: "eur",
        metadata: { jackpotFormId, userId },
        description: `Cagnotte ${jackpotForm.slug}`,
      },
      {
        stripeAccount: jackpotForm.stripeAccountId,
        idempotencyKey: `payout-${jackpotFormId}-${Date.now()}`,
      },
    );

    const { errors: updateErrors } = await client.models.JackpotForm.update({
      id: jackpotFormId,
      payoutRequested: true,
      payoutRequestedAt: new Date().toISOString(),
      payoutStripeId: payout.id,
    });
    if (updateErrors && updateErrors.length > 0) {
      debug.cagnotte("request-payout: DB update returned errors", updateErrors);
    }

    debug.cagnotte("request-payout: payout created", {
      jackpotFormId,
      payoutId: payout.id,
      amountCents,
    });

    return NextResponse.json({
      success: true,
      payoutId: payout.id,
      amount: amountCents / 100,
      currency: "eur",
    });
  } catch (error) {
    debug.error(
      "[CAGNOTTE-REQUEST-PAYOUT-ERROR]",
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? { name: error.name, message: error.message } : String(error),
          userId,
          jackpotFormId,
        },
        null,
        2,
      ),
    );

    const requestId = await logApiError(error, request, {
      operation: "request-payout",
      userId,
      jackpotFormId,
    });

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erreur interne du serveur",
        requestId,
      },
      { status: 500 },
    );
  }
}
