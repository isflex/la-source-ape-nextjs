import { describe, expect, it } from 'vitest';
import {
  extractClientIp,
  verifySourceIp,
  parseWebhookEnvelope,
  isMembershipOrder,
  buildDedupeKey,
  type HelloAssoOrderData,
} from './webhook';

// --- Fixtures ---

function makeOrderData(overrides: Partial<HelloAssoOrderData> = {}): HelloAssoOrderData {
  return {
    id: 84003,
    date: '2026-04-15T14:25:51.1632388+02:00',
    formSlug: 'test-subscribe',
    formType: 'Membership',
    organizationSlug: 'ape-sandbox',
    amount: { total: 1000, vat: 0, discount: 0 },
    payer: { email: 'test@example.com', firstName: 'Jean', lastName: 'Dupont' },
    items: [
      {
        id: 84003,
        name: 'Adhésion annuelle',
        amount: 1000,
        type: 'Payment',
        state: 'Processed',
        payments: [{ id: 53803, shareAmount: 1000 }],
      },
    ],
    payments: [
      {
        id: 53803,
        amount: 1000,
        date: '2026-04-15T14:25:51+02:00',
        paymentMeans: 'Card',
        state: 'Authorized',
      },
    ],
    ...overrides,
  };
}

function makeOrderEnvelope(overrides: Partial<HelloAssoOrderData> = {}) {
  return {
    data: makeOrderData(overrides),
    eventType: 'Order' as const,
  };
}

// --- Tests ---

describe('extractClientIp', () => {
  it('extracts from x-forwarded-for (single IP)', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '51.138.206.200' },
    });
    expect(extractClientIp(req)).toBe('51.138.206.200');
  });

  it('extracts first IP from x-forwarded-for chain', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '51.138.206.200, 10.0.0.1, 127.0.0.1' },
    });
    expect(extractClientIp(req)).toBe('51.138.206.200');
  });

  it('returns null when no forwarded header', () => {
    const req = new Request('http://localhost');
    expect(extractClientIp(req)).toBeNull();
  });
});

describe('verifySourceIp', () => {
  it('accepts sandbox IP for sandbox env', () => {
    expect(verifySourceIp('4.233.135.234', 'sandbox')).toBe(true);
  });

  it('accepts production IP for production env', () => {
    expect(verifySourceIp('51.138.206.200', 'production')).toBe(true);
  });

  it('rejects wrong IP', () => {
    expect(verifySourceIp('1.2.3.4', 'sandbox')).toBe(false);
  });

  it('rejects null IP', () => {
    expect(verifySourceIp(null, 'sandbox')).toBe(false);
  });

  it('rejects unknown env', () => {
    expect(verifySourceIp('51.138.206.200', 'staging')).toBe(false);
  });
});

describe('parseWebhookEnvelope', () => {
  it('parses a valid Order envelope', () => {
    const envelope = makeOrderEnvelope();
    const result = parseWebhookEnvelope(envelope);
    expect(result).not.toBeNull();
    expect(result!.eventType).toBe('Order');
    expect((result!.data as HelloAssoOrderData).id).toBe(84003);
  });

  it('parses a valid Payment envelope', () => {
    const envelope = {
      data: { id: 53803, amount: 1000, date: '2026-04-15', paymentMeans: 'Card', state: 'Authorized', order: { id: 84003, date: '2026-04-15', formSlug: 'test', formType: 'Membership' } },
      eventType: 'Payment',
    };
    const result = parseWebhookEnvelope(envelope);
    expect(result).not.toBeNull();
    expect(result!.eventType).toBe('Payment');
  });

  it('preserves metadata if present', () => {
    const envelope = { ...makeOrderEnvelope(), metadata: { trace: 'abc-123' } };
    const result = parseWebhookEnvelope(envelope);
    expect(result!.metadata).toEqual({ trace: 'abc-123' });
  });

  it('returns null for null body', () => {
    expect(parseWebhookEnvelope(null)).toBeNull();
  });

  it('returns null for missing data field', () => {
    expect(parseWebhookEnvelope({ eventType: 'Order' })).toBeNull();
  });

  it('returns null for missing eventType', () => {
    expect(parseWebhookEnvelope({ data: { id: 1 } })).toBeNull();
  });

  it('returns null for unknown eventType', () => {
    expect(parseWebhookEnvelope({ data: { id: 1 }, eventType: 'Form' })).toBeNull();
  });

  it('returns null for non-numeric data.id', () => {
    expect(parseWebhookEnvelope({ data: { id: 'abc' }, eventType: 'Order' })).toBeNull();
  });
});

describe('isMembershipOrder', () => {
  it('returns true for Membership formType', () => {
    expect(isMembershipOrder(makeOrderData())).toBe(true);
  });

  it('returns false for Checkout formType', () => {
    expect(isMembershipOrder(makeOrderData({ formType: 'Checkout' }))).toBe(false);
  });

  it('returns false for Donation formType', () => {
    expect(isMembershipOrder(makeOrderData({ formType: 'Donation' }))).toBe(false);
  });
});

describe('buildDedupeKey', () => {
  it('builds key from eventType and id', () => {
    expect(buildDedupeKey('Order', 84003)).toBe('Order:84003');
  });

  it('differentiates Order from Payment with same id', () => {
    expect(buildDedupeKey('Order', 100)).not.toBe(buildDedupeKey('Payment', 100));
  });
});
