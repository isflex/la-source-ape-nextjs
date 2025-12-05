/* eslint-disable camelcase */

/**
 * Fee Management Module
 *
 * Controls who pays Stripe fees for pay-ins and payouts.
 * Based on reference implementation from stripe-teacher-gift-pot-nextjs
 */

// ============================================
// FEE CONFIGURATION TYPES
// ============================================

export type FeePayer = 'platform' | 'contributor' | 'recipient';

export interface FeeConfig {
  // Who pays the card processing fee on contributions?
  payInFeePayer: FeePayer;

  // Who pays the payout fee when money goes to bank?
  payoutFeePayer: 'platform' | 'recipient';

  // Optional platform commission (on top of Stripe fees)
  platformCommissionPercent: number; // e.g., 0 for non-profit, 5 for 5%
}

// ============================================
// STRIPE FEE RATES (France/EUR)
// ============================================

export const STRIPE_RATES = {
  // Card payment fees (European cards)
  card: {
    percentFee: 1.5,      // 1.5%
    fixedFee: 25,         // €0.25 in centimes
  },
  // International cards
  cardInternational: {
    percentFee: 2.9,      // 2.9%
    fixedFee: 25,         // €0.25
  },
  // SEPA payout fee
  payout: {
    fixedFee: 25,         // €0.25 per payout
  },
};

// ============================================
// DEFAULT FEE CONFIGURATION FROM ENV
// ============================================

/**
 * Default fee configuration loaded from environment variables
 * Can be overridden per-jackpot in the database
 */
export const DEFAULT_FEE_CONFIG: FeeConfig = {
  payInFeePayer: (process.env.NEXT_PUBLIC_STRIPE_FEE_PAY_IN_PAYER || 'platform') as FeePayer,
  payoutFeePayer: (process.env.NEXT_PUBLIC_STRIPE_FEE_PAYOUT_PAYER || 'platform') as 'platform' | 'recipient',
  platformCommissionPercent: parseFloat(process.env.NEXT_PUBLIC_STRIPE_PLATFORM_COMMISSION_PERCENT || '0'),
};

// ============================================
// FEE CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate Stripe's fee for a card payment
 */
export function calculateStripeFee(amountCentimes: number, international = false): number {
  const rates = international ? STRIPE_RATES.cardInternational : STRIPE_RATES.card;
  const percentFee = Math.round(amountCentimes * (rates.percentFee / 100));
  return percentFee + rates.fixedFee;
}

/**
 * Calculate platform commission
 */
export function calculatePlatformCommission(amountCentimes: number, percent: number): number {
  if (percent === 0) return 0;
  return Math.round(amountCentimes * (percent / 100));
}

/**
 * Calculate what amount to charge the contributor
 * based on who is covering the fees
 */
export function calculateChargeAmount(
  desiredContributionCentimes: number,
  config: FeeConfig
): {
  chargeAmount: number;           // What to charge the contributor
  contributionAmount: number;     // What goes to the pot
  stripeFee: number;              // Stripe's cut
  platformFee: number;            // Platform's cut (application_fee_amount)
  contributorPays: number;        // Extra the contributor pays for fees
  recipientPays: number;          // Deducted from recipient's share
} {
  const stripeFee = calculateStripeFee(desiredContributionCentimes);
  const platformCommission = calculatePlatformCommission(
    desiredContributionCentimes,
    config.platformCommissionPercent
  );

  let chargeAmount: number;
  let contributionAmount: number;
  let contributorPays = 0;
  let recipientPays = 0;
  const platformFee = platformCommission;

  switch (config.payInFeePayer) {
    case 'platform':
      // Platform covers Stripe fees
      // Contributor pays exact amount, recipient gets exact amount
      // Platform absorbs Stripe fee via reduced margin
      chargeAmount = desiredContributionCentimes;
      contributionAmount = desiredContributionCentimes;
      // Note: Stripe fee comes out of platform's application_fee or margin
      break;

    case 'contributor':
      // Contributor covers Stripe fees
      // We need to charge more so that after Stripe takes their cut,
      // the desired amount reaches the recipient
      // Formula: chargeAmount = (desiredAmount + fixedFee) / (1 - percentFee)
      const percentRate = STRIPE_RATES.card.percentFee / 100;
      chargeAmount = Math.ceil(
        (desiredContributionCentimes + STRIPE_RATES.card.fixedFee) / (1 - percentRate)
      );
      contributionAmount = desiredContributionCentimes;
      contributorPays = chargeAmount - desiredContributionCentimes;
      break;

    case 'recipient':
      // Recipient covers Stripe fees (deducted from their share)
      chargeAmount = desiredContributionCentimes;
      contributionAmount = desiredContributionCentimes - stripeFee;
      recipientPays = stripeFee;
      break;

    default:
      throw new Error(`Invalid payInFeePayer: ${config.payInFeePayer}`);
  }

  return {
    chargeAmount,
    contributionAmount,
    stripeFee,
    platformFee,
    contributorPays,
    recipientPays,
  };
}

/**
 * Calculate payout amount after fees
 */
export function calculatePayoutAmount(
  balanceCentimes: number,
  config: FeeConfig
): {
  payoutAmount: number;       // Amount sent to bank
  payoutFee: number;          // Payout fee
  recipientReceives: number;  // Final amount in bank
  platformPays: number;       // Fee covered by platform
} {
  const payoutFee = STRIPE_RATES.payout.fixedFee;

  if (config.payoutFeePayer === 'platform') {
    // Platform covers payout fee
    // Recipient receives full balance
    return {
      payoutAmount: balanceCentimes,
      payoutFee,
      recipientReceives: balanceCentimes,
      platformPays: payoutFee,
    };
  } else {
    // Recipient covers payout fee
    // Deducted from their payout
    return {
      payoutAmount: balanceCentimes - payoutFee,
      payoutFee,
      recipientReceives: balanceCentimes - payoutFee,
      platformPays: 0,
    };
  }
}

// ============================================
// STRIPE API PARAMETER BUILDERS
// ============================================

/**
 * Build PaymentIntent parameters based on fee configuration
 * Returns parameters for destination charge with application_fee_amount
 */
export function buildPaymentIntentParams(
  desiredAmountCentimes: number,
  destinationAccountId: string,
  config: FeeConfig
): {
  amount: number;
  application_fee_amount: number;
  transfer_data: { destination: string };
  metadata: Record<string, string>;
} {
  const calculation = calculateChargeAmount(desiredAmountCentimes, config);

  // Determine application_fee_amount
  // This is what the platform keeps
  let applicationFee = calculation.platformFee;

  // If recipient pays Stripe fees, we add it to application_fee
  // so it's deducted from their share
  if (config.payInFeePayer === 'recipient') {
    applicationFee += calculation.stripeFee;
  }

  return {
    amount: calculation.chargeAmount,
    application_fee_amount: applicationFee,
    transfer_data: {
      destination: destinationAccountId,
    },
    metadata: {
      desired_amount: desiredAmountCentimes.toString(),
      fee_payer: config.payInFeePayer,
      stripe_fee: calculation.stripeFee.toString(),
      platform_commission: calculation.platformFee.toString(),
      contributor_extra: calculation.contributorPays.toString(),
      recipient_deduction: calculation.recipientPays.toString(),
    },
  };
}

/**
 * Build Payout parameters based on fee configuration
 */
export function buildPayoutParams(
  balanceCentimes: number,
  config: FeeConfig
): {
  amount: number;
  metadata: Record<string, string>;
} {
  const calculation = calculatePayoutAmount(balanceCentimes, config);

  return {
    amount: calculation.payoutAmount,
    metadata: {
      original_balance: balanceCentimes.toString(),
      payout_fee: calculation.payoutFee.toString(),
      fee_payer: config.payoutFeePayer,
    },
  };
}

// ============================================
// DISPLAY HELPERS
// ============================================

/**
 * Format fee breakdown for display to user
 */
export function formatFeeBreakdown(
  amountEuros: number,
  config: FeeConfig
): {
  contribution: string;
  stripeFee: string;
  platformFee: string;
  totalCharge: string;
  recipientReceives: string;
  feeNote: string;
} {
  const amountCentimes = Math.round(amountEuros * 100);
  const calc = calculateChargeAmount(amountCentimes, config);

  const format = (centimes: number) => `€${(centimes / 100).toFixed(2)}`;

  let feeNote: string;
  switch (config.payInFeePayer) {
    case 'platform':
      feeNote = 'Les frais sont offerts par la plateforme';
      break;
    case 'contributor':
      feeNote = `Frais de traitement: ${format(calc.contributorPays)}`;
      break;
    case 'recipient':
      feeNote = `Frais déduits de la cagnotte: ${format(calc.recipientPays)}`;
      break;
  }

  return {
    contribution: format(amountCentimes),
    stripeFee: format(calc.stripeFee),
    platformFee: format(calc.platformFee),
    totalCharge: format(calc.chargeAmount),
    recipientReceives: format(calc.contributionAmount),
    feeNote,
  };
}

// ============================================
// CONFIGURATION PRESETS
// ============================================

export const FEE_PRESETS = {
  // Non-profit: Platform covers everything
  nonprofit: {
    payInFeePayer: 'platform' as FeePayer,
    payoutFeePayer: 'platform' as const,
    platformCommissionPercent: 0,
  },

  // Freemium: Contributors cover card fees, no commission
  freemium: {
    payInFeePayer: 'contributor' as FeePayer,
    payoutFeePayer: 'recipient' as const,
    platformCommissionPercent: 0,
  },

  // Standard: Contributors cover fees + 5% commission
  standard: {
    payInFeePayer: 'contributor' as FeePayer,
    payoutFeePayer: 'recipient' as const,
    platformCommissionPercent: 5,
  },

  // Recipient pays: All fees from pot
  recipientPays: {
    payInFeePayer: 'recipient' as FeePayer,
    payoutFeePayer: 'recipient' as const,
    platformCommissionPercent: 0,
  },
};
