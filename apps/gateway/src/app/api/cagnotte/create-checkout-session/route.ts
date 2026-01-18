/* eslint-disable camelcase */

"use server";

import { NextRequest, NextResponse } from "next/server";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@amplify/data/resource";
import Stripe from "stripe";
import { ContributionSchema } from "@src/lib/cagnotte-helpers";
import { buildPaymentIntentParams, calculateChargeAmount, DEFAULT_FEE_CONFIG, type FeeConfig } from "@src/lib/cagnotte-fees";
import { getCurrentConfig } from "@src/utils/amplify/configureAmplifyWithPortDetection";
import { logApiError } from "@src/lib/with-error-logging";
import { getStripeSecrets } from "@src/lib/secrets";

// Configure Amplify for server-side API routes
Amplify.configure(getCurrentConfig(), { ssr: true });

const client = generateClient<Schema>();

// Lazy initialization with caching - fetches secrets from AWS Secrets Manager
let stripeClient: Stripe | null = null;

async function getStripeClient(): Promise<Stripe> {
  if (!stripeClient) {
    const secrets = await getStripeSecrets();
    stripeClient = new Stripe(secrets.FLEX_STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
    });
  }
  return stripeClient;
}

export async function POST(request: NextRequest) {
  const stripe = await getStripeClient();
  let logJackpotFormId: string | undefined;
  let logContributionId: string | undefined;

  try {
    const body = await request.json();
    logJackpotFormId = body.jackpotFormId;

    // Validate input
    const validation = ContributionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.issues }, { status: 400 });
    }

    const {
      jackpotFormId,
      contributorName,
      contributorEmail,
      amount,
      contributorMessage,
      isAnonymous,
      showAmount,
      owner,
      coverFees = false, // NEW: Contributor opt-in to cover fees
      paymentMethodType = "CARD", // NEW: Payment method type
    } = body;

    // Load and validate jackpot
    const { data: jackpotForm } = await client.models.JackpotForm.get({ id: jackpotFormId });

    if (!jackpotForm) {
      return NextResponse.json({ error: "Jackpot not found" }, { status: 404 });
    }

    if (jackpotForm.status !== "ACTIVE") {
      return NextResponse.json({ error: "This jackpot is not accepting contributions" }, { status: 400 });
    }

    // Check deadline
    const deadline = new Date(jackpotForm.deadline);
    if (new Date() > deadline) {
      return NextResponse.json({ error: "This jackpot has reached its deadline" }, { status: 400 });
    }

    // SEPA payment validation
    if (paymentMethodType === "SEPA") {
      if (!jackpotForm.sepaPaymentsAllowed) {
        return NextResponse.json({ error: "SEPA payments are not enabled for this jackpot" }, { status: 400 });
      }

      if (jackpotForm.sepaPaymentsCutoffAt) {
        const cutoffDate = new Date(jackpotForm.sepaPaymentsCutoffAt);
        if (new Date() > cutoffDate) {
          const sepaDays = parseInt(process.env.NEXT_PUBLIC_STRIPE_SEPA_CUTOFF_DAYS || "8", 10);
          return NextResponse.json({ error: `SEPA payments must be made at least ${sepaDays} days before deadline` }, { status: 400 });
        }
      }
    }

    // Validate Connect account exists and is active
    if (!jackpotForm.stripeAccountId) {
      return NextResponse.json({ error: "No Stripe Connect account configured for this jackpot" }, { status: 400 });
    }

    const { data: connectAccounts } = await client.models.StripeConnectAccount.list({
      filter: { stripeAccountId: { eq: jackpotForm.stripeAccountId } },
    });

    if (!connectAccounts || connectAccounts.length === 0) {
      return NextResponse.json({ error: "Connect account not found" }, { status: 400 });
    }

    const connectAccount = connectAccounts[0];

    if (connectAccount.accountStatus !== "ACTIVE" || !connectAccount.chargesEnabled) {
      return NextResponse.json({ error: "Creator Stripe account is not active or cannot accept charges" }, { status: 400 });
    }

    // Build fee configuration from jackpot settings (with env defaults as fallback, allow contributor override)
    const feeConfig: FeeConfig = {
      payInFeePayer: coverFees ? "contributor" : (jackpotForm.feePayInPayer as any) || DEFAULT_FEE_CONFIG.payInFeePayer,
      payoutFeePayer: (jackpotForm.feePayoutPayer as any) || DEFAULT_FEE_CONFIG.payoutFeePayer,
      platformCommissionPercent: jackpotForm.platformCommissionPercent ?? DEFAULT_FEE_CONFIG.platformCommissionPercent,
    };

    // Calculate fees
    const amountCentimes = Math.round(amount * 100);
    const feeCalc = calculateChargeAmount(amountCentimes, feeConfig);

    // Build PaymentIntent params with destination charge
    const piParams = buildPaymentIntentParams(amountCentimes, jackpotForm.stripeAccountId, feeConfig);

    // Create contribution record with full fee breakdown
    const { data: contribution, errors: contributionErrors } = await client.models.JackpotContribution.create({
      jackpotFormId,
      contributorName,
      contributorEmail,
      amount,
      contributorMessage: contributorMessage || undefined,
      isAnonymous,
      showAmount,
      paymentStatus: "PENDING",
      paymentMethodType,
      owner: owner || null,

      // Fee breakdown fields
      chargeAmount: feeCalc.chargeAmount / 100, // Convert back to EUR
      contributionAmount: feeCalc.contributionAmount / 100,
      stripeFeeAmount: feeCalc.stripeFee / 100,
      platformFeeAmount: feeCalc.platformFee / 100,
      contributorPaidFees: feeCalc.contributorPays / 100,
      recipientPaidFees: feeCalc.recipientPays / 100,
      feePayerType: feeConfig.payInFeePayer,
      contributorOptedToCoverFees: coverFees,

      stripeSessionId: "temp", // Will be updated with actual session ID
    });

    if (contributionErrors || !contribution) {
      const requestId = await logApiError(new Error("Failed to create contribution record"), request, {
        operation: "create-checkout-session",
        jackpotFormId: logJackpotFormId,
        contributionErrors,
      });
      return NextResponse.json({ error: "Failed to create contribution record", requestId }, { status: 500 });
    }

    logContributionId = contribution.id;

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;

    // Build payment method types array
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ["card"];
    if (paymentMethodType === "SEPA" && jackpotForm.sepaPaymentsAllowed) {
      paymentMethodTypes.push("sepa_debit");
    }

    // Create Stripe Checkout Session with DESTINATION CHARGE
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Cagnotte: ${jackpotForm.title}`,
              description: `Pour ${jackpotForm.teacherName}`,
            },
            unit_amount: piParams.amount, // Uses calculated charge amount (may include fees)
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      // *** CRITICAL: Destination charge with application fee ***
      payment_intent_data: {
        transfer_data: piParams.transfer_data, // Funds go to creator's Connect account
        application_fee_amount: piParams.application_fee_amount, // Platform fee
        metadata: {
          ...piParams.metadata,
          jackpotFormId,
          contributionId: contribution.id,
          contributorName,
          contributorEmail,
          connectAccountId: jackpotForm.stripeAccountId,
        },
      },

      success_url: `${baseUrl}/cagnotte/${jackpotForm.slug}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cagnotte/${jackpotForm.slug}?canceled=true`,
      customer_email: contributorEmail,
      metadata: {
        jackpotFormId,
        contributionId: contribution.id,
      },
    });

    // Update contribution with actual Stripe session ID
    await client.models.JackpotContribution.update({
      id: contribution.id,
      stripeSessionId: session.id,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      // Return fee breakdown for UI confirmation
      feeBreakdown: {
        chargeAmount: feeCalc.chargeAmount / 100,
        contributionAmount: feeCalc.contributionAmount / 100,
        stripeFee: feeCalc.stripeFee / 100,
        platformFee: feeCalc.platformFee / 100,
        contributorExtra: feeCalc.contributorPays / 100,
        recipientDeduction: feeCalc.recipientPays / 100,
      },
    });
  } catch (error) {
    const requestId = await logApiError(error, request, {
      operation: "create-checkout-session",
      jackpotFormId: logJackpotFormId,
      contributionId: logContributionId,
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
