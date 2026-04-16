import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { HelloAssoClient } from './client';
import { checkSubscriberByEmail } from './subscribers';

function createMockClient(
  requestImpl: HelloAssoClient['request'] = vi.fn(),
): HelloAssoClient {
  return {
    baseUrl: 'https://api.helloasso-sandbox.com',
    organizationSlug: 'test-org',
    getAccessToken: vi.fn(),
    request: requestImpl,
  };
}

describe('checkSubscriberByEmail', () => {
  const FORM_SLUG = 'test-subscribe';

  it('returns isSubscribed: false when the orders list is empty', async () => {
    const client = createMockClient(
      vi.fn().mockResolvedValueOnce({ data: [], pagination: {} }),
    );

    const result = await checkSubscriberByEmail(client, FORM_SLUG, 'nobody@example.com');

    expect(result).toEqual({ isSubscribed: false, order: undefined });
    expect(client.request).toHaveBeenCalledWith(
      `/v5/organizations/test-org/forms/Membership/${FORM_SLUG}/orders?userSearchKey=nobody%40example.com`,
    );
  });

  it('returns isSubscribed: true with the matching order when payer email matches', async () => {
    const order = {
      id: 123,
      payer: { email: 'parent@example.com', firstName: 'Marie', lastName: 'Durand' },
      items: [{ name: 'Adhésion 2026-27', amount: 2500 }],
    };
    const client = createMockClient(
      vi.fn().mockResolvedValueOnce({ data: [order], pagination: {} }),
    );

    const result = await checkSubscriberByEmail(client, FORM_SLUG, 'parent@example.com');

    expect(result).toEqual({ isSubscribed: true, order });
  });

  it('matches email case-insensitively', async () => {
    const order = {
      id: 456,
      payer: { email: 'Parent@Example.COM', firstName: 'Jean', lastName: 'Martin' },
    };
    const client = createMockClient(
      vi.fn().mockResolvedValueOnce({ data: [order], pagination: {} }),
    );

    const result = await checkSubscriberByEmail(client, FORM_SLUG, 'parent@example.com');

    expect(result.isSubscribed).toBe(true);
    expect(result.order).toBe(order);
  });

  it('returns isSubscribed: false when userSearchKey matches on name but not email', async () => {
    const order = {
      id: 789,
      payer: { email: 'other@example.com', firstName: 'Parent', lastName: 'Test' },
    };
    const client = createMockClient(
      vi.fn().mockResolvedValueOnce({ data: [order], pagination: {} }),
    );

    const result = await checkSubscriberByEmail(client, FORM_SLUG, 'parent@different.com');

    expect(result).toEqual({ isSubscribed: false, order: undefined });
  });
});
