/* eslint-disable camelcase */

import { describe, expect, it } from 'vitest';
import type Stripe from 'stripe';
import { mapStripeAccountToConnectFields } from './stripe-connect-sync';

function buildAccount(overrides: Partial<Stripe.Account> & { requirements?: Partial<Stripe.Account.Requirements> } = {}): Stripe.Account {
  const { requirements, ...rest } = overrides;
  return {
    id: 'acct_test',
    charges_enabled: false,
    payouts_enabled: false,
    details_submitted: false,
    requirements: {
      currently_due: [],
      eventually_due: [],
      past_due: [],
      disabled_reason: null,
      ...requirements,
    } as Stripe.Account.Requirements,
    ...rest,
  } as Stripe.Account;
}

describe('mapStripeAccountToConnectFields', () => {
  it('maps a fully verified account to ACTIVE and stamps onboardingCompletedAt', () => {
    const account = buildAccount({
      charges_enabled: true,
      payouts_enabled: true,
      details_submitted: true,
    });

    const before = new Date();
    const result = mapStripeAccountToConnectFields(account, { onboardingCompletedAt: null });
    const after = new Date();

    expect(result.accountStatus).toBe('ACTIVE');
    expect(result.chargesEnabled).toBe(true);
    expect(result.payoutsEnabled).toBe(true);
    expect(result.detailsSubmitted).toBe(true);
    expect(result.onboardingComplete).toBe(true);
    expect(result.currentlyDue).toEqual([]);
    expect(result.onboardingCompletedAt).toBeTruthy();
    const stamp = new Date(result.onboardingCompletedAt as string);
    expect(stamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(stamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('maps details_submitted without charges enabled to ONBOARDING_COMPLETE and preserves prior onboardingCompletedAt', () => {
    const account = buildAccount({
      details_submitted: true,
      charges_enabled: false,
      payouts_enabled: false,
    });

    const previous = '2025-01-01T00:00:00.000Z';
    const result = mapStripeAccountToConnectFields(account, { onboardingCompletedAt: previous });

    expect(result.accountStatus).toBe('ONBOARDING_COMPLETE');
    expect(result.onboardingComplete).toBe(true);
    expect(result.onboardingCompletedAt).toBe(previous);
  });

  it('maps an account with pending requirements to RESTRICTED', () => {
    const account = buildAccount({
      details_submitted: false,
      requirements: { currently_due: ['individual.verification.document'] },
    });

    const result = mapStripeAccountToConnectFields(account, { onboardingCompletedAt: null });

    expect(result.accountStatus).toBe('RESTRICTED');
    expect(result.currentlyDue).toEqual(['individual.verification.document']);
    expect(result.detailsSubmitted).toBe(false);
  });

  it('maps a real disabled_reason to DISABLED but ignores requirements.past_due', () => {
    const disabled = buildAccount({
      requirements: { disabled_reason: 'rejected.fraud' },
    });
    const pastDue = buildAccount({
      requirements: { disabled_reason: 'requirements.past_due' },
    });

    expect(mapStripeAccountToConnectFields(disabled, { onboardingCompletedAt: null }).accountStatus).toBe('DISABLED');
    expect(mapStripeAccountToConnectFields(pastDue, { onboardingCompletedAt: null }).accountStatus).toBe('ONBOARDING_STARTED');
  });

  it('falls back to ONBOARDING_STARTED when nothing else applies', () => {
    const account = buildAccount();

    const result = mapStripeAccountToConnectFields(account, { onboardingCompletedAt: null });

    expect(result.accountStatus).toBe('ONBOARDING_STARTED');
    expect(result.onboardingCompletedAt).toBeNull();
  });
});
