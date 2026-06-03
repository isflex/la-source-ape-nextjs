import { NextRequest, NextResponse } from "next/server";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@amplify/data/resource";
import Stripe from "stripe";
import { getCurrentConfig } from "@src/utils/amplify/configureAmplifyWithPortDetection";
import { logServerError, type ErrorContext } from "@src/lib/server-error-logger";
import { getStripeSecrets } from "@src/lib/secrets";
import { mapStripeAccountToConnectFields } from "@src/lib/stripe-connect-sync";
import { debug } from "@flexiness/domain-utils";

// Configure Amplify for server-side API routes
Amplify.configure(getCurrentConfig(), { ssr: true });

const client = generateClient<Schema>();

// Lazy initialization with caching - fetches secrets from AWS Secrets Manager
let stripeClient: Stripe | null = null;
let cachedWebhookSecret: string | null = null;

async function getStripeClient(): Promise<Stripe> {
  if (!stripeClient) {
    const secrets = await getStripeSecrets();
    stripeClient = new Stripe(secrets.FLEX_STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

async function getWebhookSecret(): Promise<string> {
  if (!cachedWebhookSecret) {
    const secrets = await getStripeSecrets();
    cachedWebhookSecret = secrets.FLEX_STRIPE_WEBHOOK_SECRET;
  }
  return cachedWebhookSecret;
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

    // Verify webhook signature (CRITICAL for security)
    let event: Stripe.Event;
    try {
      const stripe = await getStripeClient();
      const webhookSecret = await getWebhookSecret();
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      await logWebhookError(err, "signature_verification_failed");
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }

    eventType = event.type;

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
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

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const { contributionId } = session.metadata || {};

    if (!contributionId) {
      await logWebhookError(new Error("No contributionId in session metadata"), "checkout.session.completed", { sessionId: session.id });
      return;
    }

    // Find the contribution
    const { data: contribution } = await client.models.JackpotContribution.get({
      id: contributionId,
    });

    if (!contribution) {
      await logWebhookError(new Error(`Contribution ${contributionId} not found`), "checkout.session.completed", {
        contributionId,
        sessionId: session.id,
      });
      return;
    }

    // Check if already processed (prevent duplicate processing)
    if (contribution.paymentStatus === "SUCCEEDED") {
      return;
    }

    // Update contribution status
    await client.models.JackpotContribution.update({
      id: contributionId,
      paymentStatus: "SUCCEEDED",
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: new Date().toISOString(),
    });
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
