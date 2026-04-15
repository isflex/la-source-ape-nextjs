import { describe, expect, it, vi } from 'vitest';

import {
  createHelloAssoClient,
  HelloAssoApiError,
  type HelloAssoClientConfig,
} from './client';

const BASE_CONFIG: Omit<HelloAssoClientConfig, 'env'> = {
  clientId: 'test-client',
  clientSecret: 'test-secret',
  organizationSlug: 'test-org',
};

function tokenResponse(opts: { accessToken?: string; expiresIn?: number } = {}): Response {
  return new Response(
    JSON.stringify({
      /* eslint-disable camelcase */
      access_token: opts.accessToken ?? 'token-1',
      refresh_token: 'refresh-1',
      token_type: 'bearer',
      expires_in: opts.expiresIn ?? 1800,
      /* eslint-enable camelcase */
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );
}

function jsonResponse(status: number, body: unknown, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...extraHeaders },
  });
}

function emptyResponse(status: number): Response {
  return new Response(null, { status });
}

describe('createHelloAssoClient', () => {
  describe('base URL resolution', () => {
    it('uses the sandbox base URL when env is sandbox', () => {
      const c = createHelloAssoClient({ ...BASE_CONFIG, env: 'sandbox' });
      expect(c.baseUrl).toBe('https://api.helloasso-sandbox.com');
    });

    it('uses the production base URL when env is production', () => {
      const c = createHelloAssoClient({ ...BASE_CONFIG, env: 'production' });
      expect(c.baseUrl).toBe('https://api.helloasso.com');
    });

    it('exposes the configured organization slug', () => {
      const c = createHelloAssoClient({ ...BASE_CONFIG, env: 'sandbox' });
      expect(c.organizationSlug).toBe('test-org');
    });
  });

  describe('getAccessToken', () => {
    it('POSTs form-urlencoded credentials to /oauth2/token and returns the access_token', async () => {
      const fetchImpl = vi.fn().mockResolvedValue(tokenResponse({ accessToken: 'first' }));
      const c = createHelloAssoClient({ ...BASE_CONFIG, env: 'sandbox', fetchImpl });

      const token = await c.getAccessToken();

      expect(token).toBe('first');
      expect(fetchImpl).toHaveBeenCalledTimes(1);

      const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
      expect(url).toBe('https://api.helloasso-sandbox.com/oauth2/token');
      expect(init.method).toBe('POST');
      const headers = init.headers as Record<string, string>;
      expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded');

      const body = init.body as URLSearchParams;
      expect(body).toBeInstanceOf(URLSearchParams);
      expect(body.get('client_id')).toBe('test-client');
      expect(body.get('client_secret')).toBe('test-secret');
      expect(body.get('grant_type')).toBe('client_credentials');
    });

    it('returns the cached token on subsequent calls without refetching', async () => {
      const fetchImpl = vi.fn().mockResolvedValue(tokenResponse({ accessToken: 'cached' }));
      const c = createHelloAssoClient({ ...BASE_CONFIG, env: 'sandbox', fetchImpl });

      const t1 = await c.getAccessToken();
      const t2 = await c.getAccessToken();

      expect(t1).toBe('cached');
      expect(t2).toBe('cached');
      expect(fetchImpl).toHaveBeenCalledTimes(1);
    });

    it('refetches a new token once the clock advances past the refresh buffer', async () => {
      let nowMs = 1_000_000;
      const fetchImpl = vi
        .fn()
        .mockResolvedValueOnce(tokenResponse({ accessToken: 'old', expiresIn: 100 }))
        .mockResolvedValueOnce(tokenResponse({ accessToken: 'new', expiresIn: 100 }));

      const c = createHelloAssoClient({
        ...BASE_CONFIG,
        env: 'sandbox',
        fetchImpl,
        now: () => nowMs,
        tokenRefreshBufferMs: 10_000,
      });

      expect(await c.getAccessToken()).toBe('old');

      // 95s elapsed of 100s TTL → 5s remaining, below 10s buffer → refresh
      nowMs += 95_000;
      expect(await c.getAccessToken()).toBe('new');
      expect(fetchImpl).toHaveBeenCalledTimes(2);
    });

    it('coalesces concurrent first-time callers into a single token mint', async () => {
      let resolveFetch: ((v: Response) => void) | null = null;
      const fetchImpl = vi.fn(
        () =>
          new Promise<Response>((r) => {
            resolveFetch = r;
          }),
      );

      const c = createHelloAssoClient({ ...BASE_CONFIG, env: 'sandbox', fetchImpl });

      const p1 = c.getAccessToken();
      const p2 = c.getAccessToken();

      // Flush microtasks so both callers have queued behind the pending promise.
      await Promise.resolve();
      expect(resolveFetch).not.toBeNull();
      resolveFetch!(tokenResponse({ accessToken: 'once' }));

      const [t1, t2] = await Promise.all([p1, p2]);
      expect(t1).toBe('once');
      expect(t2).toBe('once');
      expect(fetchImpl).toHaveBeenCalledTimes(1);
    });

    it('throws HelloAssoApiError when the token endpoint returns non-2xx', async () => {
      const fetchImpl = vi.fn(
        async () =>
          new Response(JSON.stringify({ error: 'invalid_client' }), {
            status: 401,
            headers: { 'content-type': 'application/json' },
          }),
      );

      const c = createHelloAssoClient({ ...BASE_CONFIG, env: 'sandbox', fetchImpl });

      await expect(c.getAccessToken()).rejects.toBeInstanceOf(HelloAssoApiError);
      await expect(c.getAccessToken()).rejects.toMatchObject({ status: 401 });
      expect(fetchImpl).toHaveBeenCalledTimes(2);
    });
  });

  describe('request', () => {
    it('attaches the bearer token and prefixes the base URL for relative paths', async () => {
      const fetchImpl = vi
        .fn()
        .mockResolvedValueOnce(tokenResponse({ accessToken: 'bearer-xyz' }))
        .mockResolvedValueOnce(jsonResponse(200, { ok: true, id: 42 }));

      const c = createHelloAssoClient({ ...BASE_CONFIG, env: 'sandbox', fetchImpl });
      const result = await c.request<{ ok: boolean; id: number }>('/v5/organizations/test-org');

      expect(result).toEqual({ ok: true, id: 42 });
      expect(fetchImpl).toHaveBeenCalledTimes(2);

      const [url, init] = fetchImpl.mock.calls[1] as [string, RequestInit];
      expect(url).toBe('https://api.helloasso-sandbox.com/v5/organizations/test-org');
      const headers = init.headers as Record<string, string>;
      expect(headers.Authorization).toBe('Bearer bearer-xyz');
    });

    it('serializes JSON bodies and sets Content-Type: application/json', async () => {
      const fetchImpl = vi
        .fn()
        .mockResolvedValueOnce(tokenResponse())
        .mockResolvedValueOnce(jsonResponse(200, { id: 1 }));

      const c = createHelloAssoClient({ ...BASE_CONFIG, env: 'sandbox', fetchImpl });
      await c.request('/v5/organizations/test-org/checkout-intents', {
        method: 'POST',
        body: { totalAmount: 1000, initialAmount: 1000, containsDonation: false },
      });

      const [, init] = fetchImpl.mock.calls[1] as [
        string,
        RequestInit & { body: string; headers: Record<string, string> },
      ];
      expect(init.method).toBe('POST');
      expect(init.headers['Content-Type']).toBe('application/json');
      expect(JSON.parse(init.body)).toEqual({
        totalAmount: 1000,
        initialAmount: 1000,
        containsDonation: false,
      });
    });

    it('skips auth when auth: false is passed', async () => {
      const fetchImpl = vi.fn().mockResolvedValueOnce(jsonResponse(200, { ok: true }));
      const c = createHelloAssoClient({ ...BASE_CONFIG, env: 'sandbox', fetchImpl });

      await c.request('/v5/organizations/test-org', { auth: false });

      expect(fetchImpl).toHaveBeenCalledTimes(1);
      const [, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
      const headers = init.headers as Record<string, string>;
      expect(headers.Authorization).toBeUndefined();
    });
  });

  describe('error mapping', () => {
    it('throws HelloAssoApiError with fieldErrors on RFC 9457 problem+json 400', async () => {
      const problem = {
        errors: {
          totalAmount: ['The TotalAmount field is required.'],
          initialAmount: ['The InitialAmount field is required.'],
        },
        type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
        title: 'One or more validation errors occurred.',
        status: 400,
        extensions: { traceId: 'abc-123' },
      };

      const fetchImpl = vi
        .fn()
        .mockResolvedValueOnce(tokenResponse())
        .mockResolvedValueOnce(
          new Response(JSON.stringify(problem), {
            status: 400,
            headers: { 'content-type': 'application/problem+json' },
          }),
        );

      const c = createHelloAssoClient({ ...BASE_CONFIG, env: 'sandbox', fetchImpl });

      await expect(
        c.request('/v5/organizations/test-org/checkout-intents', { method: 'POST', body: {} }),
      ).rejects.toMatchObject({
        name: 'HelloAssoApiError',
        status: 400,
        details: {
          fieldErrors: problem.errors,
          traceId: 'abc-123',
        },
      });
    });

    it('throws HelloAssoApiError with apiErrors on HelloAsso custom error shape', async () => {
      const fetchImpl = vi
        .fn()
        .mockResolvedValueOnce(tokenResponse())
        .mockResolvedValueOnce(
          jsonResponse(400, {
            errors: [{ code: 'ArgumentInvalid', message: 'Le champ prénom est invalide' }],
          }),
        );

      const c = createHelloAssoClient({ ...BASE_CONFIG, env: 'sandbox', fetchImpl });

      await expect(
        c.request('/v5/organizations/test-org/checkout-intents', { method: 'POST', body: {} }),
      ).rejects.toMatchObject({
        name: 'HelloAssoApiError',
        status: 400,
        message: 'Le champ prénom est invalide',
        details: {
          apiErrors: [{ code: 'ArgumentInvalid', message: 'Le champ prénom est invalide' }],
        },
      });
    });

    it('throws HelloAssoApiError on an empty 404 body without JSON-parsing it', async () => {
      const fetchImpl = vi
        .fn()
        .mockResolvedValueOnce(tokenResponse())
        .mockResolvedValueOnce(emptyResponse(404));

      const c = createHelloAssoClient({ ...BASE_CONFIG, env: 'sandbox', fetchImpl });

      await expect(c.request('/v5/orders/does-not-exist')).rejects.toMatchObject({
        name: 'HelloAssoApiError',
        status: 404,
      });
    });
  });
});
