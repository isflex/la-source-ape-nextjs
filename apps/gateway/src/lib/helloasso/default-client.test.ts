import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { HelloAssoSecrets } from '@src/lib/secrets';

const { mockGetHelloAssoSecrets, mockCreateHelloAssoClient } = vi.hoisted(() => ({
  mockGetHelloAssoSecrets: vi.fn<() => Promise<HelloAssoSecrets>>(),
  mockCreateHelloAssoClient: vi.fn(),
}));

vi.mock('@src/lib/secrets', () => ({
  getHelloAssoSecrets: mockGetHelloAssoSecrets,
}));

vi.mock('./client', () => ({
  createHelloAssoClient: mockCreateHelloAssoClient,
}));

const SECRETS: HelloAssoSecrets = {
  FLEX_HELLOASSO_API_KEY: 'cid',
  FLEX_HELLOASSO_API_SECRET: 'csecret',
  FLEX_HELLOASSO_ORGANIZATION_SLUG: 'my-org',
  FLEX_HELLOASSO_ENV: 'sandbox',
};

describe('getDefaultHelloAssoClient', () => {
  beforeEach(() => {
    vi.resetModules();
    mockGetHelloAssoSecrets.mockReset();
    mockCreateHelloAssoClient.mockReset();
  });

  it('loads secrets and creates a client with the correct config on first call', async () => {
    const fakeClient = { baseUrl: 'sb', organizationSlug: 'my-org' };
    mockGetHelloAssoSecrets.mockResolvedValueOnce(SECRETS);
    mockCreateHelloAssoClient.mockReturnValueOnce(fakeClient);

    const { getDefaultHelloAssoClient } = await import('./default-client');
    const client = await getDefaultHelloAssoClient();

    expect(client).toBe(fakeClient);
    expect(mockGetHelloAssoSecrets).toHaveBeenCalledTimes(1);
    expect(mockCreateHelloAssoClient).toHaveBeenCalledTimes(1);
    expect(mockCreateHelloAssoClient).toHaveBeenCalledWith({
      env: 'sandbox',
      clientId: 'cid',
      clientSecret: 'csecret',
      organizationSlug: 'my-org',
    });
  });

  it('caches the client across calls without re-reading secrets or re-creating', async () => {
    const fakeClient = { baseUrl: 'sb', organizationSlug: 'my-org' };
    mockGetHelloAssoSecrets.mockResolvedValue(SECRETS);
    mockCreateHelloAssoClient.mockReturnValue(fakeClient);

    const { getDefaultHelloAssoClient } = await import('./default-client');
    const first = await getDefaultHelloAssoClient();
    const second = await getDefaultHelloAssoClient();

    expect(second).toBe(first);
    expect(mockGetHelloAssoSecrets).toHaveBeenCalledTimes(1);
    expect(mockCreateHelloAssoClient).toHaveBeenCalledTimes(1);
  });

  it('coalesces concurrent first-time callers into a single secrets fetch', async () => {
    let resolveSecrets: ((v: HelloAssoSecrets) => void) | null = null;
    mockGetHelloAssoSecrets.mockImplementationOnce(
      () =>
        new Promise<HelloAssoSecrets>((r) => {
          resolveSecrets = r;
        }),
    );
    const fakeClient = { baseUrl: 'sb', organizationSlug: 'my-org' };
    mockCreateHelloAssoClient.mockReturnValueOnce(fakeClient);

    const { getDefaultHelloAssoClient } = await import('./default-client');
    const p1 = getDefaultHelloAssoClient();
    const p2 = getDefaultHelloAssoClient();

    await Promise.resolve();
    expect(resolveSecrets).not.toBeNull();
    resolveSecrets!(SECRETS);

    const [c1, c2] = await Promise.all([p1, p2]);
    expect(c1).toBe(fakeClient);
    expect(c2).toBe(fakeClient);
    expect(mockGetHelloAssoSecrets).toHaveBeenCalledTimes(1);
    expect(mockCreateHelloAssoClient).toHaveBeenCalledTimes(1);
  });
});
