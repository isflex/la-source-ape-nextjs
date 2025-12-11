import { NextRequest, NextResponse } from 'next/server';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import Stripe from 'stripe';
import { getCurrentConfig } from '@src/utils/amplify/configureAmplifyWithPortDetection';

// Configure Amplify for server-side API routes
Amplify.configure(getCurrentConfig(), { ssr: true });

const client = generateClient<Schema>();

// Initialize Stripe
const stripe = new Stripe(process.env.FLEX_STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

const webhookSecret = process.env.FLEX_STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text (required for signature verification)
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature (CRITICAL for security)
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

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
    console.error('Webhook handler error:', error);
    // Always return 200 to prevent Stripe from retrying
    return NextResponse.json({ received: true });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const { contributionId } = session.metadata || {};

    if (!contributionId) {
      console.error('No contributionId in session metadata');
      return;
    }

    // Find the contribution
    const { data: contribution } = await client.models.JackpotContribution.get({
      id: contributionId
    });

    if (!contribution) {
      console.error(`Contribution ${contributionId} not found`);
      return;
    }

    // Check if already processed (prevent duplicate processing)
    if (contribution.paymentStatus === 'SUCCEEDED') {
      console.log(`Contribution ${contributionId} already processed`);
      return;
    }

    // Update contribution status
    await client.models.JackpotContribution.update({
      id: contributionId,
      paymentStatus: 'SUCCEEDED',
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: new Date().toISOString(),
    });

    console.log(`Payment succeeded for contribution ${contributionId}`);
  } catch (error) {
    console.error('Error handling checkout.session.completed:', error);
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

    console.log(`Checkout session expired for contribution ${contributionId}`);
  } catch (error) {
    console.error('Error handling checkout.session.expired:', error);
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

    console.log(`Payment failed for contribution ${contribution.id}`);
  } catch (error) {
    console.error('Error handling payment_intent.payment_failed:', error);
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

    console.log(`Charge refunded for contribution ${contribution.id}`);
  } catch (error) {
    console.error('Error handling charge.refunded:', error);
  }
}

async function handleAccountUpdated(account: Stripe.Account) {
  try {
    // Find StripeConnectAccount by stripeAccountId
    const { data: connectAccounts } = await client.models.StripeConnectAccount.list({
      filter: { stripeAccountId: { eq: account.id } }
    });

    if (!connectAccounts || connectAccounts.length === 0) {
      console.log(`StripeConnectAccount not found for account ${account.id}`);
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

    console.log(`Account ${account.id} updated to status ${accountStatus}`);
  } catch (error) {
    console.error('Error handling account.updated:', error);
  }
}
