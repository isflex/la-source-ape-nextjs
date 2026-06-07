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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    ({ userId } = auth);

    const body = await request.json();
    jackpotFormId = body?.jackpotFormId;
    if (!jackpotFormId || typeof jackpotFormId !== "string") {
      return NextResponse.json({ error: "Missing jackpotFormId" }, { status: 400 });
    }

    const { data: jackpotForm } = await client.models.JackpotForm.get({ id: jackpotFormId });
    if (!jackpotForm) {
      return NextResponse.json({ error: "Jackpot not found" }, { status: 404 });
    }

    if (jackpotForm.owner !== userId) {
      return NextResponse.json({ error: "Not the cagnotte owner" }, { status: 403 });
    }

    if (jackpotForm.status !== "CLOSED") {
      return NextResponse.json(
        { error: "Cagnotte must be CLOSED before requesting payout" },
        { status: 409 },
      );
    }

    if (jackpotForm.payoutRequested) {
      return NextResponse.json(
        { error: "A payout request is already in flight" },
        { status: 409 },
      );
    }

    if (jackpotForm.payoutCompletedAt) {
      return NextResponse.json(
        { error: "This cagnotte has already been paid out" },
        { status: 409 },
      );
    }

    if (!jackpotForm.stripeAccountId) {
      return NextResponse.json(
        { error: "No Stripe Connect account linked to this cagnotte" },
        { status: 409 },
      );
    }

    const { data: connectAccounts } = await client.models.StripeConnectAccount.list({
      filter: { stripeAccountId: { eq: jackpotForm.stripeAccountId } },
    });
    const connectAccount = connectAccounts?.[0];
    if (!connectAccount) {
      return NextResponse.json({ error: "Connect account not found" }, { status: 409 });
    }
    if (
      connectAccount.accountStatus !== "ACTIVE" ||
      !connectAccount.chargesEnabled ||
      !connectAccount.payoutsEnabled
    ) {
      return NextResponse.json(
        { error: "Connect account is not ready to receive payouts" },
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
        { error: "No successful contributions to pay out" },
        { status: 409 },
      );
    }

    const stripe = await getStripeClient();

    const balance = await stripe.balance.retrieve({ stripeAccount: jackpotForm.stripeAccountId });
    const availableEurCents = balance.available
      .filter((b) => b.currency === "eur")
      .reduce((sum, b) => sum + b.amount, 0);
    const amountCents = Math.min(requestedCents, availableEurCents);
    if (amountCents <= 0) {
      return NextResponse.json(
        { error: "Connect account has no available EUR balance" },
        { status: 409 },
      );
    }

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
      cappedFromCents: requestedCents,
    });

    return NextResponse.json({
      success: true,
      payoutId: payout.id,
      amount: amountCents / 100,
      currency: "eur",
      capped: amountCents < requestedCents,
      requestedAmount: requestedCents / 100,
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
        error: error instanceof Error ? error.message : "Internal server error",
        requestId,
      },
      { status: 500 },
    );
  }
}
