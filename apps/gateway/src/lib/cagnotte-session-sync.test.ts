/* eslint-disable camelcase */

import { describe, expect, it, vi } from 'vitest';
import type Stripe from 'stripe';
import { syncContributionFromSession } from './cagnotte-session-sync';

type ContributionState = {
  id: string;
  paymentStatus: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED' | 'CANCELED';
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
  paidAt?: string | null;
};

function makeClient(initial: ContributionState | null) {
  const state: { value: ContributionState | null } = { value: initial };

  const get = vi.fn(async ({ id }: { id: string }) => ({
    data: state.value && state.value.id === id ? { ...state.value } : null,
  }));

  const update = vi.fn(async (patch: Partial<ContributionState> & { id: string }) => {
    if (!state.value || state.value.id !== patch.id) {
      return { data: null, errors: [{ message: 'not found' }] };
    }
    state.value = { ...state.value, ...patch } as ContributionState;
    return { data: { ...state.value }, errors: undefined };
  });

  const client = {
    models: { JackpotContribution: { get, update } },
  } as unknown as Parameters<typeof syncContributionFromSession>[0];

  return { client, get, update, state };
}

function makeSession(overrides: Partial<Stripe.Checkout.Session> & { metadata?: Stripe.Metadata } = {}): Stripe.Checkout.Session {
  return {
    id: 'cs_test_default',
    payment_status: 'paid',
    status: 'complete',
    payment_intent: 'pi_test_default',
    metadata: { contributionId: 'contrib_1' },
    ...overrides,
  } as Stripe.Checkout.Session;
}

describe('syncContributionFromSession', () => {
  it('flips a PENDING contribution to SUCCEEDED when Stripe says the session is paid', async () => {
    const { client, update, state } = makeClient({
      id: 'contrib_1',
      paymentStatus: 'PENDING',
      stripeSessionId: 'cs_test_default',
    });

    const result = await syncContributionFromSession(client, makeSession());

    expect(update).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'contrib_1',
        paymentStatus: 'SUCCEEDED',
        stripePaymentIntentId: 'pi_test_default',
      }),
    );
    expect(result.paymentStatus).toBe('SUCCEEDED');
    expect(state.value?.paymentStatus).toBe('SUCCEEDED');
  });

  it('is idempotent — already-SUCCEEDED contributions are returned without any DB write', async () => {
    const { client, update } = makeClient({
      id: 'contrib_1',
      paymentStatus: 'SUCCEEDED',
      stripeSessionId: 'cs_test_default',
    });

    const result = await syncContributionFromSession(client, makeSession());

    expect(update).not.toHaveBeenCalled();
    expect(result.paymentStatus).toBe('SUCCEEDED');
  });

  it('does NOT touch a PENDING contribution when Stripe reports the session as unpaid', async () => {
    const { client, update } = makeClient({
      id: 'contrib_1',
      paymentStatus: 'PENDING',
      stripeSessionId: 'cs_test_default',
    });

    const result = await syncContributionFromSession(
      client,
      makeSession({ payment_status: 'unpaid', status: 'open' }),
    );

    expect(update).not.toHaveBeenCalled();
    expect(result.paymentStatus).toBe('PENDING');
  });

  it('throws when the session has no contributionId metadata', async () => {
    const { client } = makeClient(null);

    await expect(
      syncContributionFromSession(client, makeSession({ metadata: {} })),
    ).rejects.toThrow(/no contributionId metadata/);
  });

  it('throws when the contribution row does not exist in the DB', async () => {
    const { client } = makeClient(null);

    await expect(
      syncContributionFromSession(client, makeSession()),
    ).rejects.toThrow(/Contribution contrib_1 not found/);
  });

  it('expands an object-form payment_intent to its id', async () => {
    const { client, update } = makeClient({
      id: 'contrib_1',
      paymentStatus: 'PENDING',
      stripeSessionId: 'cs_test_default',
    });

    await syncContributionFromSession(
      client,
      makeSession({
        payment_intent: { id: 'pi_test_expanded' } as unknown as Stripe.PaymentIntent,
      }),
    );

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ stripePaymentIntentId: 'pi_test_expanded' }),
    );
  });
});
