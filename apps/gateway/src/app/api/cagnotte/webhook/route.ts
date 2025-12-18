import { NextRequest, NextResponse } from 'next/server';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import Stripe from 'stripe';
import { getCurrentConfig } from '@src/utils/amplify/configureAmplifyWithPortDetection';
import { logServerError, type ErrorContext } from '@src/lib/server-error-logger';

// Configure Amplify for server-side API routes
Amplify.configure(getCurrentConfig(), { ssr: true });

const client = generateClient<Schema>();

// Lazy initialization with caching - env vars may not be available at module load in Amplify
let stripeClient: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!stripeClient) {
    const apiKey = process.env.FLEX_STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('FLEX_STRIPE_SECRET_KEY environment variable is not set');
    }
    stripeClient = new Stripe(apiKey, {
      apiVersion: '2025-11-17.clover',
    });
  }
  return stripeClient;
}

function getWebhookSecret(): string {
  const secret = process.env.FLEX_STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('FLEX_STRIPE_WEBHOOK_SECRET environment variable is not set');
  }
  return secret;
}

// Helper to log webhook errors
async function logWebhookError(
  error: Error | unknown,
  eventType: string,
  additionalContext?: Record<string, unknown>
): Promise<void> {
  const context: ErrorContext = {
    route: '/api/cagnotte/webhook',
    method: 'POST',
    additionalContext: {
      source: 'stripe-webhook',
      eventType,
      ...additionalContext
    }
  };
  await logServerError(error, context);
}

export async function POST(request: NextRequest) {
  let eventType = 'unknown';

  try {
    // Get the raw body as text (required for signature verification)
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      await logWebhookError(
        new Error('Missing Stripe signature'),
        'signature_missing'
      );
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature (CRITICAL for security)
    let event: Stripe.Event;
    try {
      event = getStripeClient().webhooks.constructEvent(
        body,
        signature,
        getWebhookSecret()
      );
    } catch (err) {
      await logWebhookError(err, 'signature_verification_failed');
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    eventType = event.type;

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutExpired(session);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        await handleAccountUpdated(account);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
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
      await logWebhookError(
        new Error('No contributionId in session metadata'),
        'checkout.session.completed',
        { sessionId: session.id }
      );
      return;
    }

    // Find the contribution
    const { data: contribution } = await client.models.JackpotContribution.get({
      id: contributionId
    });

    if (!contribution) {
      await logWebhookError(
        new Error(`Contribution ${contributionId} not found`),
        'checkout.session.completed',
        { contributionId, sessionId: session.id }
      );
      return;
    }

    // Check if already processed (prevent duplicate processing)
    if (contribution.paymentStatus === 'SUCCEEDED') {
      return;
    }

    // Update contribution status
    await client.models.JackpotContribution.update({
      id: contributionId,
      paymentStatus: 'SUCCEEDED',
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: new Date().toISOString(),
    });
  } catch (error) {
    await logWebhookError(error, 'checkout.session.completed', {
      sessionId: session.id,
      contributionId: session.metadata?.contributionId
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
      id: contributionId
    });

    if (!contribution || contribution.paymentStatus !== 'PENDING') {
      return;
    }

    await client.models.JackpotContribution.update({
      id: contributionId,
      paymentStatus: 'CANCELED',
    });
  } catch (error) {
    await logWebhookError(error, 'checkout.session.expired', {
      sessionId: session.id,
      contributionId: session.metadata?.contributionId
    });
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find contribution by payment intent ID
    const { data: contributions } = await client.models.JackpotContribution.list({
      filter: {
        stripePaymentIntentId: { eq: paymentIntent.id }
      }
    });

    if (!contributions || contributions.length === 0) {
      return;
    }

    const contribution = contributions[0];

    await client.models.JackpotContribution.update({
      id: contribution.id,
      paymentStatus: 'FAILED',
    });
  } catch (error) {
    await logWebhookError(error, 'payment_intent.payment_failed', {
      paymentIntentId: paymentIntent.id
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
        stripePaymentIntentId: { eq: paymentIntentId }
      }
    });

    if (!contributions || contributions.length === 0) {
      return;
    }

    const contribution = contributions[0];

    await client.models.JackpotContribution.update({
      id: contribution.id,
      paymentStatus: 'REFUNDED',
    });
  } catch (error) {
    await logWebhookError(error, 'charge.refunded', {
      chargeId: charge.id,
      paymentIntentId: charge.payment_intent as string
    });
  }
}

async function handleAccountUpdated(account: Stripe.Account) {
  try {
    // Find StripeConnectAccount by stripeAccountId
    const { data: connectAccounts } = await client.models.StripeConnectAccount.list({
      filter: { stripeAccountId: { eq: account.id } }
    });

    if (!connectAccounts || connectAccounts.length === 0) {
      // This is not necessarily an error - could be a new account not yet in our system
      return;
    }

    const connectAccount = connectAccounts[0];

    // Determine account status based on Stripe account state
    let accountStatus: Schema['EStripeAccountStatus']['type'] = 'ONBOARDING_STARTED';

    if (account.charges_enabled && account.payouts_enabled) {
      accountStatus = 'ACTIVE';
    } else if (account.details_submitted) {
      accountStatus = 'ONBOARDING_COMPLETE';
    } else if (account.requirements?.disabled_reason) {
      accountStatus = 'DISABLED';
    } else if (account.requirements?.currently_due && account.requirements.currently_due.length > 0) {
      accountStatus = 'RESTRICTED';
    }

    // Update StripeConnectAccount with latest info from Stripe
    await client.models.StripeConnectAccount.update({
      id: connectAccount.id,
      accountStatus,
      onboardingComplete: account.details_submitted || false,
      chargesEnabled: account.charges_enabled || false,
      payoutsEnabled: account.payouts_enabled || false,
      detailsSubmitted: account.details_submitted || false,
      currentlyDue: account.requirements?.currently_due || [],
      eventuallyDue: account.requirements?.eventually_due || [],
      pastDue: account.requirements?.past_due || [],
      disabledReason: account.requirements?.disabled_reason || undefined,
      onboardingCompletedAt: (account.charges_enabled && account.payouts_enabled)
        ? new Date().toISOString()
        : connectAccount.onboardingCompletedAt,
    });
  } catch (error) {
    await logWebhookError(error, 'account.updated', {
      stripeAccountId: account.id
    });
  }
}
