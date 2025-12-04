'use server'

import { NextRequest, NextResponse } from 'next/server';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import Stripe from 'stripe';
import { getCurrentConfig } from '@src/utils/amplify/configureAmplifyWithPortDetection';

// Configure Amplify for server-side API routes
Amplify.configure(getCurrentConfig(), { ssr: true });

const client = generateClient<Schema>();

const stripe = new Stripe(process.env.FLEX_STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json();

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

    let stripeAccountId: string;
    let accountRecord: any;

    if (existingAccounts && existingAccounts.length > 0) {
      // Use existing account
      accountRecord = existingAccounts[0];
      stripeAccountId = accountRecord.stripeAccountId;
    } else {
      // Create new Express account
      // NOTE: 'transfers' capability allows receiving funds from platform account
      // This is NOT about SEPA bank transfers - those are handled by Stripe payouts
      const account = await stripe.accounts.create({
        type: 'express',
        email: email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },  // Allows receiving transfers from platform
        },
        business_type: 'individual',
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
    console.error('Error creating account link:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
