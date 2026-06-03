"use server";

import { NextRequest, NextResponse } from "next/server";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@amplify/data/resource";
import Stripe from "stripe";
import { getCurrentConfig, getAuthConfig } from "@src/utils/amplify/configureAmplifyWithPortDetection";
import { logApiError } from "@src/lib/with-error-logging";
import { getStripeSecrets } from "@src/lib/secrets";
import { syncConnectAccountFromStripe } from "@src/lib/stripe-connect-sync";
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
    debug.stripeConnect("refresh-account-status: token verification failed", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  let userId: string | undefined;

  try {
    const auth = await verifyUserAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    ({ userId } = auth);

    const { data: accounts } = await client.models.StripeConnectAccount.list({
      filter: { userId: { eq: userId } },
    });

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({ error: "No Stripe Connect account for this user" }, { status: 404 });
    }

    const [accountRecord] = accounts;
    const stripe = await getStripeClient();

    debug.stripeConnect("refresh-account-status: syncing", {
      userId,
      stripeAccountId: accountRecord.stripeAccountId,
      previousStatus: accountRecord.accountStatus,
    });

    const updated = await syncConnectAccountFromStripe(stripe, client, accountRecord);

    debug.stripeConnect("refresh-account-status: synced", {
      stripeAccountId: updated.stripeAccountId,
      newStatus: updated.accountStatus,
      chargesEnabled: updated.chargesEnabled,
      payoutsEnabled: updated.payoutsEnabled,
      detailsSubmitted: updated.detailsSubmitted,
    });

    return NextResponse.json({
      success: true,
      accountStatus: updated.accountStatus,
      chargesEnabled: updated.chargesEnabled,
      payoutsEnabled: updated.payoutsEnabled,
      detailsSubmitted: updated.detailsSubmitted,
      currentlyDue: updated.currentlyDue,
      eventuallyDue: updated.eventuallyDue,
      pastDue: updated.pastDue,
      disabledReason: updated.disabledReason,
    });
  } catch (error) {
    debug.error(
      "[STRIPE-CONNECT-REFRESH-ERROR]",
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : String(error),
          userId,
        },
        null,
        2,
      ),
    );

    const requestId = await logApiError(error, request, {
      operation: "refresh-account-status",
      userId,
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
