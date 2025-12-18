/* eslint-disable camelcase */

'use server'

import { NextRequest, NextResponse } from 'next/server';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import Stripe from 'stripe';
import { getCurrentConfig } from '@src/utils/amplify/configureAmplifyWithPortDetection';
import { logApiError } from '@src/lib/with-error-logging';

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

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  let userId: string | undefined;
  let existingAccountsCount = 0;

  try {
    const body = await request.json();
    userId = body.userId;
    const email = body.email;

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if account already exists
    const { data: existingAccounts } = await client.models.StripeConnectAccount.list({
      filter: { userId: { eq: userId } }
    });
    existingAccountsCount = existingAccounts?.length || 0;

    let stripeAccountId: string;
    let accountRecord: Schema['StripeConnectAccount']['type'] | null = null;

    if (existingAccounts && existingAccounts.length > 0) {
      // Use existing account
      accountRecord = existingAccounts[0];
      stripeAccountId = accountRecord.stripeAccountId;
    } else {
      // Get base URL for business profile (only valid in production)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const isProduction = baseUrl && !baseUrl.includes('localhost');

      // Build business profile - URL fields only in production (Stripe requires valid public URLs)
      const businessProfile: Stripe.AccountCreateParams['business_profile'] = {
        // Educational Services MCC code
        mcc: '8299',

        // Description for Stripe risk assessment
        product_description: 'Cagnotte collective pour cadeau enseignant - plateforme APE La Source',

        // Business name (appears on bank statements)
        name: 'Cagnotte APE La Source',

        // Support contact
        support_email: process.env.FLEX_HELP_EMAIL || 'contact@apelasource.org',
      };

      // Add URL fields only in production (Stripe requires valid public URLs)
      if (isProduction) {
        businessProfile.url = `${baseUrl}/cagnotte/latest/${userId}`;
        businessProfile.support_url = `${baseUrl}/cagnotte/info/`;
      }

      // Create new Express account with prefilled business profile
      // NOTE: 'transfers' capability allows receiving funds from platform account
      // This is NOT about SEPA bank transfers - those are handled by Stripe payouts
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'FR',
        email: email,

        // Business profile prefill for Stripe verification
        business_profile: businessProfile,

        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },  // Allows receiving transfers from platform
        },
        business_type: 'individual',

        // Payout settings - manual payouts for cagnotte workflow
        settings: {
          payouts: {
            schedule: { interval: 'manual' },
          },
        },

        metadata: {
          userId: userId,
          platform: 'apelasource-cagnotte'
        },
      });

      stripeAccountId = account.id;

      // Save to database
      const { data: newAccount, errors } = await client.models.StripeConnectAccount.create({
        userId,
        stripeAccountId: account.id,
        accountStatus: 'ONBOARDING_STARTED',
        onboardingComplete: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        email: email,
        onboardingStartedAt: new Date().toISOString(),
      });

      if (errors) {
        console.error('Error creating StripeConnectAccount:', errors);
        return NextResponse.json(
          { error: 'Failed to save account record' },
          { status: 500 }
        );
      }

      accountRecord = newAccount;
    }

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}`;

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${baseUrl}/cagnotte/compte-stripe/`,
      return_url: `${baseUrl}/cagnotte/compte-stripe/?success=true`,
      type: 'account_onboarding',
    });

    // Update last link created timestamp
    if (accountRecord) {
      await client.models.StripeConnectAccount.update({
        id: accountRecord.id,
        lastOnboardingLinkCreatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      url: accountLink.url,
      accountId: stripeAccountId,
    });
  } catch (error) {
    // Immediate sync logging for debugging (Amplify captures stdout/stderr)
    console.error('[STRIPE-CONNECT-ERROR]', JSON.stringify({
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : String(error),
      userId,
      hasExistingAccount: existingAccountsCount > 0
    }, null, 2));

    const requestId = await logApiError(error, request, {
      operation: 'create-account-link',
      userId,
      hasExistingAccount: existingAccountsCount > 0
    });

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        requestId
      },
      { status: 500 }
    );
  }
}
