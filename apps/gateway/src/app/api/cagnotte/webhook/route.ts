import { NextRequest, NextResponse } from "next/server";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@amplify/data/resource";
import Stripe from "stripe";
import { getCurrentConfig } from "@src/utils/amplify/configureAmplifyWithPortDetection";
import { logServerError, type ErrorContext } from "@src/lib/server-error-logger";
import { getStripeSecrets } from "@src/lib/secrets";
import { mapStripeAccountToConnectFields } from "@src/lib/stripe-connect-sync";
import { syncContributionFromSession } from "@src/lib/cagnotte-session-sync";
import { enrichConnectedAccountMetadata } from "@src/lib/cagnotte-transfer-metadata";
import { applyPayoutResult } from "@src/lib/cagnotte-payout-sync";
import { debug } from "@flexiness/domain-utils";

// Configure Amplify for server-side API routes
Amplify.configure(getCurrentConfig(), { ssr: true });

const client = generateClient<Schema>();

// Lazy initialization with caching - fetches secrets from AWS Secrets Manager
let stripeClient: Stripe | null = null;
let cachedWebhookSecrets: string[] | null = null;

async function getStripeClient(): Promise<Stripe> {
  if (!stripeClient) {
    const secrets = await getStripeSecrets();
    stripeClient = new Stripe(secrets.FLEX_STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

// As a Connect platform we run two scoped event destinations ("Your account"
// and "Connected accounts"), each with its own signing secret, both pointing at
// this route. Verify against whichever secrets are configured.
async function getWebhookSecrets(): Promise<string[]> {
  if (!cachedWebhookSecrets) {
    const secrets = await getStripeSecrets();
    cachedWebhookSecrets = [
      secrets.FLEX_STRIPE_WEBHOOK_SECRET,
      secrets.FLEX_STRIPE_WEBHOOK_SECRET_CONNECT,
    ].filter((s): s is string => Boolean(s));
  }
  return cachedWebhookSecrets;
}

// Helper to log webhook errors
async function logWebhookError(error: Error | unknown, eventType: string, additionalContext?: Record<string, unknown>): Promise<void> {
  const context: ErrorContext = {
    route: "/api/cagnotte/webhook",
    method: "POST",
    additionalContext: {
      source: "stripe-webhook",
      eventType,
      ...additionalContext,
    },
  };
  await logServerError(error, context);
}

export async function POST(request: NextRequest) {
  let eventType = "unknown";

  try {
    // Get the raw body as text (required for signature verification)
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      await logWebhookError(new Error("Missing Stripe signature"), "signature_missing");
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    // Verify webhook signature (CRITICAL for security). Try each configured
    // signing secret (one per scoped event destination) until one validates.
    let event: Stripe.Event | null = null;
    const stripe = await getStripeClient();
    for (const secret of await getWebhookSecrets()) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, secret);
        break;
      } catch {
        // Signature didn't match this secret — try the next one.
      }
    }

    if (!event) {
      await logWebhookError(new Error("Webhook signature verification failed"), "signature_verification_failed");
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }

    eventType = event.type;

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, stripe);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutExpired(session);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        await handleAccountUpdated(account);
        break;
      }

      case "payout.paid":
      case "payout.failed": {
        const payout = event.data.object as Stripe.Payout;
        await handlePayoutEvent(event.type, payout);
        break;
      }

      default:
        debug.webhooks(`Unhandled event type: ${event.type}`);
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    await logWebhookError(error, eventType);
    // Always return 200 to prevent Stripe from retrying
    return NextResponse.json({ received: true });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe) {
  try {
    await syncContributionFromSession(client, session);
    // Stamp the connected-account-visible Stripe objects (Transfer + destination
    // payment) with jackpotFormId + friendly title. Best-effort and idempotent.
    await enrichConnectedAccountMetadata(stripe, client, session);
  } catch (error) {
    await logWebhookError(error, "checkout.session.completed", {
      sessionId: session.id,
      contributionId: session.metadata?.contributionId,
    });
  }
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  try {
    const { contributionId } = session.metadata || {};

    if (!contributionId) {
      return;
    }

    const { data: contribution } = await client.models.JackpotContribution.get({
      id: contributionId,
    });

    if (!contribution || contribution.paymentStatus !== "PENDING") {
      return;
    }

    await client.models.JackpotContribution.update({
      id: contributionId,
      paymentStatus: "CANCELED",
    });
  } catch (error) {
    await logWebhookError(error, "checkout.session.expired", {
      sessionId: session.id,
      contributionId: session.metadata?.contributionId,
    });
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find contribution by payment intent ID
    const { data: contributions } = await client.models.JackpotContribution.list({
      filter: {
        stripePaymentIntentId: { eq: paymentIntent.id },
      },
    });

    if (!contributions || contributions.length === 0) {
      return;
    }

    const contribution = contributions[0];

    await client.models.JackpotContribution.update({
      id: contribution.id,
      paymentStatus: "FAILED",
    });
  } catch (error) {
    await logWebhookError(error, "payment_intent.payment_failed", {
      paymentIntentId: paymentIntent.id,
    });
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    const paymentIntentId = charge.payment_intent as string;

    if (!paymentIntentId) {
      return;
    }

    // Find contribution by payment intent ID
    const { data: contributions } = await client.models.JackpotContribution.list({
      filter: {
        stripePaymentIntentId: { eq: paymentIntentId },
      },
    });

    if (!contributions || contributions.length === 0) {
      return;
    }

    const contribution = contributions[0];

    await client.models.JackpotContribution.update({
      id: contribution.id,
      paymentStatus: "REFUNDED",
    });
  } catch (error) {
    await logWebhookError(error, "charge.refunded", {
      chargeId: charge.id,
      paymentIntentId: charge.payment_intent as string,
    });
  }
}

async function handleAccountUpdated(account: Stripe.Account) {
  try {
    // Find StripeConnectAccount by stripeAccountId
    const { data: connectAccounts } = await client.models.StripeConnectAccount.list({
      filter: { stripeAccountId: { eq: account.id } },
    });

    if (!connectAccounts || connectAccounts.length === 0) {
      // This is not necessarily an error - could be a new account not yet in our system
      return;
    }

    const connectAccount = connectAccounts[0];

    const mapped = mapStripeAccountToConnectFields(account, connectAccount);

    debug.webhooks("account.updated processing:", {
      stripeAccountId: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      computedStatus: mapped.accountStatus,
    });

    await client.models.StripeConnectAccount.update({
      id: connectAccount.id,
      ...mapped,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    await logWebhookError(error, "account.updated", {
      stripeAccountId: account.id,
    });
  }
}

async function handlePayoutEvent(eventType: string, payout: Stripe.Payout) {
  try {
    debug.webhooks(`${eventType} processing:`, {
      payoutId: payout.id,
      status: payout.status,
      jackpotFormId: payout.metadata?.jackpotFormId,
    });
    await applyPayoutResult(client, payout);
  } catch (error) {
    await logWebhookError(error, eventType, {
      payoutId: payout.id,
      jackpotFormId: payout.metadata?.jackpotFormId,
    });
  }
}
