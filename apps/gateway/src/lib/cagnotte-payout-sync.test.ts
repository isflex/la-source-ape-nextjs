/* eslint-disable camelcase */

import { describe, expect, it, vi } from 'vitest';
import type Stripe from 'stripe';
import { applyPayoutResult } from './cagnotte-payout-sync';

type JackpotFormState = {
  id: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'PAID_OUT';
  payoutRequested: boolean;
  payoutRequestedAt?: string | null;
  payoutCompletedAt?: string | null;
  payoutStripeId?: string | null;
  payoutNotes?: string | null;
};

function makeClient(initial: JackpotFormState | null) {
  const state: { value: JackpotFormState | null } = { value: initial };

  const get = vi.fn(async ({ id }: { id: string }) => ({
    data: state.value && state.value.id === id ? { ...state.value } : null,
  }));

  const update = vi.fn(async (patch: Partial<JackpotFormState> & { id: string }) => {
    if (!state.value || state.value.id !== patch.id) {
      return { data: null, errors: [{ message: 'not found' }] };
    }
    state.value = { ...state.value, ...patch } as JackpotFormState;
    return { data: { ...state.value }, errors: undefined };
  });

  const client = {
    models: { JackpotForm: { get, update } },
  } as unknown as Parameters<typeof applyPayoutResult>[0];

  return { client, get, update, state };
}

function makePayout(overrides: Partial<Stripe.Payout> & { metadata?: Stripe.Metadata } = {}): Stripe.Payout {
  return {
    id: 'po_test_default',
    status: 'paid',
    arrival_date: 1780000000,
    failure_code: null,
    failure_message: null,
    metadata: { jackpotFormId: 'form_1' },
    ...overrides,
  } as Stripe.Payout;
}

describe('applyPayoutResult', () => {
  it('on paid → flips status to PAID_OUT and stamps payoutCompletedAt from arrival_date', async () => {
    const { client, update, state } = makeClient({
      id: 'form_1',
      status: 'CLOSED',
      payoutRequested: true,
      payoutStripeId: 'po_test_default',
    });

    await applyPayoutResult(client, makePayout());

    expect(update).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'form_1',
        status: 'PAID_OUT',
        payoutCompletedAt: new Date(1780000000 * 1000).toISOString(),
      }),
    );
    expect(state.value?.status).toBe('PAID_OUT');
  });

  it('on paid is idempotent — already-PAID_OUT row triggers no DB write', async () => {
    const { client, update } = makeClient({
      id: 'form_1',
      status: 'PAID_OUT',
      payoutRequested: true,
      payoutCompletedAt: '2026-05-01T00:00:00.000Z',
    });

    await applyPayoutResult(client, makePayout());

    expect(update).not.toHaveBeenCalled();
  });

  it('on failed → stores notes, resets payoutRequested, clears payoutStripeId so the owner can retry', async () => {
    const { client, update, state } = makeClient({
      id: 'form_1',
      status: 'CLOSED',
      payoutRequested: true,
      payoutStripeId: 'po_test_default',
    });

    await applyPayoutResult(
      client,
      makePayout({
        status: 'failed',
        failure_code: 'account_closed',
        failure_message: 'The bank account has been closed.',
      }),
    );

    expect(update).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'form_1',
        payoutRequested: false,
        payoutStripeId: null,
        payoutNotes: JSON.stringify({
          code: 'account_closed',
          message: 'The bank account has been closed.',
        }),
      }),
    );
    expect(state.value?.payoutRequested).toBe(false);
    expect(state.value?.payoutStripeId).toBeNull();
  });

  it('on pending / in_transit / canceled → no DB write', async () => {
    const { client, update } = makeClient({
      id: 'form_1',
      status: 'CLOSED',
      payoutRequested: true,
      payoutStripeId: 'po_test_default',
    });

    for (const status of ['pending', 'in_transit', 'canceled'] as const) {
      await applyPayoutResult(client, makePayout({ status }));
    }

    expect(update).not.toHaveBeenCalled();
  });

  it('throws when the payout has no jackpotFormId metadata', async () => {
    const { client } = makeClient(null);
    await expect(
      applyPayoutResult(client, makePayout({ metadata: {} })),
    ).rejects.toThrow(/no jackpotFormId metadata/);
  });

  it('throws when the JackpotForm record cannot be found', async () => {
    const { client } = makeClient(null);
    await expect(
      applyPayoutResult(client, makePayout()),
    ).rejects.toThrow(/JackpotForm form_1 not found/);
  });
});
