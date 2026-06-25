import { describe, expect, it } from 'vitest';
import {
  STRIPE_RATES,
  calculateChargeAmount,
  calculateStripeFee,
  buildPaymentIntentParams,
  type FeeConfig,
} from './cagnotte-fees';

const DESTINATION = 'acct_test_destination';

const config = (overrides: Partial<FeeConfig> = {}): FeeConfig => ({
  payInFeePayer: 'contributor',
  payoutFeePayer: 'recipient',
  platformCommissionPercent: 0,
  ...overrides,
});

// In a destination charge, the connected account receives:
//   chargeAmount - application_fee_amount
// We assert the orchestrator is never out of pocket: the application fee it
// keeps must at least cover Stripe's own card fee, and the connected account
// must receive exactly the intended pot amount (minus any platform commission).
describe('buildPaymentIntentParams — fee recovery via application_fee_amount', () => {
  describe('contributor pays fees (the production config for the live cagnottes)', () => {
    it('keeps the contributor buffer on the platform as the application fee', () => {
      const desired = 2000; // €20.00
      const calc = calculateChargeAmount(desired, config());
      const pi = buildPaymentIntentParams(desired, DESTINATION, config());

      // The whole buffer the contributor paid is retained by the platform.
      expect(pi.application_fee_amount).toBe(calc.contributorPays);
      // The connected account receives exactly the pot (commission = 0).
      expect(pi.amount - pi.application_fee_amount).toBe(desired);
      expect(pi.transfer_data.destination).toBe(DESTINATION);
    });

    it('retains at least Stripe’s real EU card fee so the platform never goes negative', () => {
      for (const desired of [500, 1000, 1750, 2000, 3000]) {
        const calc = calculateChargeAmount(desired, config());
        const pi = buildPaymentIntentParams(desired, DESTINATION, config());
        // application fee retained >= Stripe's fee charged to the platform.
        expect(pi.application_fee_amount).toBeGreaterThanOrEqual(calculateStripeFee(desired));
        // pot is untouched by the safety margin.
        expect(calc.contributionAmount).toBe(desired);
      }
    });

    it('adds a safety margin on top of the bare EU rate in the gross-up', () => {
      const desired = 2000;
      const bareRate = STRIPE_RATES.card.percentFee / 100;
      const bareCharge = Math.ceil((desired + STRIPE_RATES.card.fixedFee) / (1 - bareRate));
      const calc = calculateChargeAmount(desired, config());
      // With a positive safety margin the charge is at least the bare gross-up.
      expect(calc.chargeAmount).toBeGreaterThanOrEqual(bareCharge);
    });

    it('still covers the platform commission on top of the buffer', () => {
      const desired = 2000;
      const cfg = config({ platformCommissionPercent: 5 });
      const calc = calculateChargeAmount(desired, cfg);
      const pi = buildPaymentIntentParams(desired, DESTINATION, cfg);

      expect(pi.application_fee_amount).toBe(calc.platformFee + calc.contributorPays);
      // Connected account receives the pot minus the platform commission.
      expect(pi.amount - pi.application_fee_amount).toBe(desired - calc.platformFee);
    });
  });

  describe('recipient pays fees (unchanged behaviour)', () => {
    it('takes Stripe’s fee as the application fee and deducts it from the pot', () => {
      const desired = 2000;
      const cfg = config({ payInFeePayer: 'recipient' });
      const calc = calculateChargeAmount(desired, cfg);
      const pi = buildPaymentIntentParams(desired, DESTINATION, cfg);

      expect(pi.amount).toBe(desired);
      expect(pi.application_fee_amount).toBe(calc.platformFee + calc.stripeFee);
      expect(pi.amount - pi.application_fee_amount).toBe(desired - calc.stripeFee);
    });
  });

  describe('platform absorbs fees (unchanged behaviour)', () => {
    it('charges the exact amount and keeps no application fee (commission = 0)', () => {
      const desired = 2000;
      const cfg = config({ payInFeePayer: 'platform' });
      const pi = buildPaymentIntentParams(desired, DESTINATION, cfg);

      expect(pi.amount).toBe(desired);
      expect(pi.application_fee_amount).toBe(0);
      // Whole charge transfers; platform absorbs Stripe's fee from its margin.
      expect(pi.amount - pi.application_fee_amount).toBe(desired);
    });
  });
});
