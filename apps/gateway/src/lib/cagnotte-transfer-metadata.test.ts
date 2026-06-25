/* eslint-disable camelcase */

import { describe, expect, it, vi } from 'vitest';
import type Stripe from 'stripe';
import { enrichConnectedAccountMetadata } from './cagnotte-transfer-metadata';

function makeStripe(opts: {
  transferId?: string | null;
  destinationPaymentId?: string | null;
  transferMetadata?: Stripe.Metadata;
  destChargeMetadata?: Stripe.Metadata;
}) {
  const {
    transferId = 'tr_123',
    destinationPaymentId = 'py_123',
    transferMetadata = {},
    destChargeMetadata = {},
  } = opts;

  const stripe = {
    paymentIntents: {
      retrieve: vi.fn(async () => ({
        id: 'pi_123',
        latest_charge: { id: 'ch_123', transfer: transferId },
      })),
    },
    transfers: {
      retrieve: vi.fn(async () => ({
        id: transferId,
        destination_payment: destinationPaymentId,
        metadata: transferMetadata,
      })),
      update: vi.fn(async () => ({})),
    },
    charges: {
      retrieve: vi.fn(async () => ({ id: destinationPaymentId, metadata: destChargeMetadata })),
      update: vi.fn(async () => ({})),
    },
  } as unknown as Stripe;

  return stripe;
}

function makeClient(jackpotForm: { title?: string; stripeAccountId?: string } | null) {
  const get = vi.fn(async () => ({ data: jackpotForm }));
  return {
    models: { JackpotForm: { get } },
  } as unknown as Parameters<typeof enrichConnectedAccountMetadata>[1];
}

function makeSession(overrides: Partial<Stripe.Checkout.Session> = {}): Stripe.Checkout.Session {
  return {
    id: 'cs_123',
    payment_intent: 'pi_123',
    metadata: { jackpotFormId: 'jp_1', contributionId: 'contrib_1' },
    ...overrides,
  } as Stripe.Checkout.Session;
}

describe('enrichConnectedAccountMetadata', () => {
  it('stamps jackpotFormId + friendly title on the transfer and the destination payment', async () => {
    const stripe = makeStripe({});
    const client = makeClient({ title: 'Cagnotte pour Ophélie', stripeAccountId: 'acct_1' });

    await enrichConnectedAccountMetadata(stripe, client, makeSession());

    expect(stripe.transfers.update).toHaveBeenCalledWith(
      'tr_123',
      expect.objectContaining({
        metadata: expect.objectContaining({
          jackpotFormId: 'jp_1',
          jackpotTitle: 'Cagnotte pour Ophélie',
          contributionId: 'contrib_1',
        }),
      }),
    );
    expect(stripe.charges.update).toHaveBeenCalledWith(
      'py_123',
      expect.objectContaining({
        metadata: expect.objectContaining({ jackpotFormId: 'jp_1', jackpotTitle: 'Cagnotte pour Ophélie' }),
      }),
      { stripeAccount: 'acct_1' },
    );
  });

  it('is idempotent — skips writes when metadata is already present', async () => {
    const meta = { jackpotFormId: 'jp_1', jackpotTitle: 'Cagnotte pour Ophélie', contributionId: 'contrib_1' };
    const stripe = makeStripe({ transferMetadata: meta, destChargeMetadata: meta });
    const client = makeClient({ title: 'Cagnotte pour Ophélie', stripeAccountId: 'acct_1' });

    await enrichConnectedAccountMetadata(stripe, client, makeSession());

    expect(stripe.transfers.update).not.toHaveBeenCalled();
    expect(stripe.charges.update).not.toHaveBeenCalled();
  });

  it('does nothing when the charge has no transfer (not a destination charge)', async () => {
    const stripe = makeStripe({ transferId: null });
    const client = makeClient({ title: 'X', stripeAccountId: 'acct_1' });

    await enrichConnectedAccountMetadata(stripe, client, makeSession());

    expect(stripe.transfers.retrieve).not.toHaveBeenCalled();
    expect(stripe.transfers.update).not.toHaveBeenCalled();
  });

  it('returns silently when the session lacks jackpotFormId metadata', async () => {
    const stripe = makeStripe({});
    const client = makeClient({ title: 'X', stripeAccountId: 'acct_1' });

    await enrichConnectedAccountMetadata(stripe, client, makeSession({ metadata: {} }));

    expect(stripe.paymentIntents.retrieve).not.toHaveBeenCalled();
  });

  it('never throws — swallows Stripe errors so the contribution sync is unaffected', async () => {
    const stripe = makeStripe({});
    (stripe.paymentIntents.retrieve as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('boom'));
    const client = makeClient({ title: 'X', stripeAccountId: 'acct_1' });

    await expect(
      enrichConnectedAccountMetadata(stripe, client, makeSession()),
    ).resolves.toBeUndefined();
  });
});
