"use server";

import { NextRequest, NextResponse } from "next/server";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@amplify/data/resource";
import Stripe from "stripe";
import { getCurrentConfig } from "@src/utils/amplify/configureAmplifyWithPortDetection";
import { logApiError } from "@src/lib/with-error-logging";
import { getStripeSecrets } from "@src/lib/secrets";
import { syncContributionFromSession } from "@src/lib/cagnotte-session-sync";
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

export async function POST(request: NextRequest) {
  let sessionId: string | undefined;

  try {
    const body = await request.json();
    sessionId = body?.sessionId;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const stripe = await getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    debug.cagnotte("refresh-session-status: syncing", {
      sessionId,
      paymentStatus: session.payment_status,
      status: session.status,
      contributionId: session.metadata?.contributionId,
    });

    const updated = await syncContributionFromSession(client, session);

    return NextResponse.json({
      success: true,
      paymentStatus: updated.paymentStatus,
      contributionId: updated.id,
    });
  } catch (error) {
    debug.error(
      "[CAGNOTTE-REFRESH-SESSION-ERROR]",
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? { name: error.name, message: error.message } : String(error),
          sessionId,
        },
        null,
        2,
      ),
    );

    const requestId = await logApiError(error, request, {
      operation: "refresh-session-status",
      sessionId,
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
