export type HelloAssoEnv = 'sandbox' | 'production';

const BASE_URLS: Record<HelloAssoEnv, string> = {
  sandbox: 'https://api.helloasso-sandbox.com',
  production: 'https://api.helloasso.com',
};

const DEFAULT_TOKEN_REFRESH_BUFFER_MS = 60_000;

export interface HelloAssoClientConfig {
  env: HelloAssoEnv;
  clientId: string;
  clientSecret: string;
  organizationSlug: string;
  fetchImpl?: typeof fetch;
  now?: () => number;
  tokenRefreshBufferMs?: number;
}

export interface HelloAssoRequestInit extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
}

export interface HelloAssoClient {
  readonly baseUrl: string;
  readonly organizationSlug: string;
  getAccessToken(): Promise<string>;
  request<T = unknown>(path: string, init?: HelloAssoRequestInit): Promise<T>;
}

export interface HelloAssoApiErrorDetails {
  fieldErrors?: Record<string, string[]>;
  apiErrors?: Array<{ code: string; message: string }>;
  traceId?: string;
  title?: string;
  rawBody?: string;
}

export class HelloAssoApiError extends Error {
  readonly status: number;

  readonly details: HelloAssoApiErrorDetails;

  constructor(status: number, message: string, details: HelloAssoApiErrorDetails = {}) {
    super(message);
    this.name = 'HelloAssoApiError';
    this.status = status;
    this.details = details;
  }
}

interface CachedToken {
  accessToken: string;
  expiresAtMs: number;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

export function createHelloAssoClient(config: HelloAssoClientConfig): HelloAssoClient {
  const {
    env,
    clientId,
    clientSecret,
    organizationSlug,
    fetchImpl = fetch,
    now = () => Date.now(),
    tokenRefreshBufferMs = DEFAULT_TOKEN_REFRESH_BUFFER_MS,
  } = config;

  const baseUrl = BASE_URLS[env];

  let cachedToken: CachedToken | null = null;
  let pendingToken: Promise<string> | null = null;

  async function mintToken(): Promise<string> {
    // OAuth2 RFC 6749 mandates these field names — keep as-is.
    /* eslint-disable camelcase */
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    });
    /* eslint-enable camelcase */

    const res = await fetchImpl(`${baseUrl}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!res.ok) {
      throw await buildApiError(res);
    }

    const json = (await res.json()) as TokenResponse;
    cachedToken = {
      accessToken: json.access_token,
      expiresAtMs: now() + json.expires_in * 1000,
    };
    return json.access_token;
  }

  async function getAccessToken(): Promise<string> {
    if (cachedToken && cachedToken.expiresAtMs - now() > tokenRefreshBufferMs) {
      return cachedToken.accessToken;
    }
    if (pendingToken) {
      return pendingToken;
    }
    pendingToken = mintToken().finally(() => {
      pendingToken = null;
    });
    return pendingToken;
  }

  async function request<T = unknown>(
    path: string,
    init: HelloAssoRequestInit = {},
  ): Promise<T> {
    const { body, auth = true, headers: callerHeaders, ...rest } = init;

    const headers: Record<string, string> = {};
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    if (auth) {
      headers.Authorization = `Bearer ${await getAccessToken()}`;
    }
    if (callerHeaders) {
      Object.assign(headers, callerHeaders);
    }

    const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
    const res = await fetchImpl(url, {
      ...rest,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!res.ok) {
      throw await buildApiError(res);
    }
    if (res.status === 204) {
      return undefined as T;
    }

    const text = await res.text();
    if (!text) {
      return undefined as T;
    }
    return JSON.parse(text) as T;
  }

  return {
    baseUrl,
    organizationSlug,
    getAccessToken,
    request,
  };
}

async function buildApiError(res: Response): Promise<HelloAssoApiError> {
  const rawBody = await res.text();
  if (!rawBody) {
    return new HelloAssoApiError(res.status, res.statusText || `HTTP ${res.status}`, {
      rawBody: '',
    });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return new HelloAssoApiError(res.status, res.statusText || `HTTP ${res.status}`, {
      rawBody,
    });
  }

  if (parsed && typeof parsed === 'object' && 'errors' in parsed) {
    const body = parsed as {
      errors: unknown;
      title?: string;
      extensions?: { traceId?: string };
    };

    if (Array.isArray(body.errors)) {
      const apiErrors = body.errors as Array<{ code: string; message: string }>;
      const first = apiErrors[0];
      return new HelloAssoApiError(
        res.status,
        first?.message ?? body.title ?? res.statusText ?? `HTTP ${res.status}`,
        { apiErrors, rawBody },
      );
    }

    if (body.errors && typeof body.errors === 'object') {
      return new HelloAssoApiError(
        res.status,
        body.title ?? 'Validation error',
        {
          fieldErrors: body.errors as Record<string, string[]>,
          traceId: body.extensions?.traceId,
          title: body.title,
          rawBody,
        },
      );
    }
  }

  return new HelloAssoApiError(res.status, res.statusText || `HTTP ${res.status}`, {
    rawBody,
  });
}
