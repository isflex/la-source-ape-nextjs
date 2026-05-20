import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PROD_AWS_APP_ID, PROD_SANDBOX_AWS_APP_ID } from './deployment';

const { mockSend, MockGetSecretValueCommand } = vi.hoisted(() => ({
  mockSend: vi.fn(),
  MockGetSecretValueCommand: vi.fn(function MockGetSecretValueCommand(
    this: { __type: string; input: unknown },
    input: unknown,
  ) {
    this.__type = 'GetSecretValueCommand';
    this.input = input;
  }),
}));

vi.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManagerClient: function MockSecretsManagerClient(this: { send: typeof mockSend }) {
    this.send = mockSend;
  },
  GetSecretValueCommand: MockGetSecretValueCommand,
}));

const HELLOASSO_ENV_KEYS = [
  'FLEX_HELLOASSO_API_KEY',
  'FLEX_HELLOASSO_API_SECRET',
  'FLEX_HELLOASSO_ORGANIZATION_SLUG',
  'FLEX_HELLOASSO_ENV',
  'FLEX_HELLOASSO_SECRET_ARN',
  'NEXT_PUBLIC_AWS_APP_ID',
] as const;

describe('getHelloAssoSecrets', () => {
  const snapshot: Partial<Record<(typeof HELLOASSO_ENV_KEYS)[number], string | undefined>> = {};

  beforeEach(() => {
    vi.resetModules();
    mockSend.mockReset();
    MockGetSecretValueCommand.mockClear();

    for (const k of HELLOASSO_ENV_KEYS) {
      snapshot[k] = process.env[k];
      delete process.env[k];
    }
  });

  afterEach(() => {
    for (const k of HELLOASSO_ENV_KEYS) {
      if (snapshot[k] === undefined) {
        delete process.env[k];
      } else {
        process.env[k] = snapshot[k];
      }
    }
  });

  it('returns secrets from env vars when all required values are present', async () => {
    process.env.FLEX_HELLOASSO_API_KEY = 'env-key';
    process.env.FLEX_HELLOASSO_API_SECRET = 'env-secret';
    process.env.FLEX_HELLOASSO_ORGANIZATION_SLUG = 'env-org';
    process.env.FLEX_HELLOASSO_ENV = 'sandbox';

    const { getHelloAssoSecrets } = await import('./secrets');
    const secrets = await getHelloAssoSecrets();

    expect(secrets).toEqual({
      FLEX_HELLOASSO_API_KEY: 'env-key',
      FLEX_HELLOASSO_API_SECRET: 'env-secret',
      FLEX_HELLOASSO_ORGANIZATION_SLUG: 'env-org',
      FLEX_HELLOASSO_ENV: 'sandbox',
    });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('throws when FLEX_HELLOASSO_ENV has an unsupported value', async () => {
    process.env.FLEX_HELLOASSO_API_KEY = 'k';
    process.env.FLEX_HELLOASSO_API_SECRET = 's';
    process.env.FLEX_HELLOASSO_ORGANIZATION_SLUG = 'o';
    process.env.FLEX_HELLOASSO_ENV = 'staging';

    const { getHelloAssoSecrets } = await import('./secrets');
    await expect(getHelloAssoSecrets()).rejects.toThrow(/FLEX_HELLOASSO_ENV/);
  });

  it('caches the secrets across calls without re-reading the environment', async () => {
    process.env.FLEX_HELLOASSO_API_KEY = 'env-key';
    process.env.FLEX_HELLOASSO_API_SECRET = 'env-secret';
    process.env.FLEX_HELLOASSO_ORGANIZATION_SLUG = 'env-org';
    process.env.FLEX_HELLOASSO_ENV = 'sandbox';

    const { getHelloAssoSecrets } = await import('./secrets');
    const first = await getHelloAssoSecrets();

    process.env.FLEX_HELLOASSO_API_KEY = 'mutated';
    const second = await getHelloAssoSecrets();

    expect(second).toBe(first);
    expect(second.FLEX_HELLOASSO_API_KEY).toBe('env-key');
  });

  it('falls back to AWS Secrets Manager when env vars are absent', async () => {
    mockSend.mockResolvedValueOnce({
      SecretString: JSON.stringify({
        FLEX_HELLOASSO_API_KEY: 'sm-key',
        FLEX_HELLOASSO_API_SECRET: 'sm-secret',
        FLEX_HELLOASSO_ORGANIZATION_SLUG: 'sm-org',
        FLEX_HELLOASSO_ENV: 'production',
      }),
    });

    const { getHelloAssoSecrets } = await import('./secrets');
    const secrets = await getHelloAssoSecrets();

    expect(secrets).toEqual({
      FLEX_HELLOASSO_API_KEY: 'sm-key',
      FLEX_HELLOASSO_API_SECRET: 'sm-secret',
      FLEX_HELLOASSO_ORGANIZATION_SLUG: 'sm-org',
      FLEX_HELLOASSO_ENV: 'production',
    });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(MockGetSecretValueCommand).toHaveBeenCalledWith({
      SecretId: 'apelasource/helloasso',
    });
  });

  it('uses the production SecretId on the production Amplify app', async () => {
    process.env.NEXT_PUBLIC_AWS_APP_ID = PROD_AWS_APP_ID;
    mockSend.mockResolvedValueOnce({
      SecretString: JSON.stringify({
        FLEX_HELLOASSO_API_KEY: 'k',
        FLEX_HELLOASSO_API_SECRET: 's',
        FLEX_HELLOASSO_ORGANIZATION_SLUG: 'o',
        FLEX_HELLOASSO_ENV: 'production',
      }),
    });

    const { getHelloAssoSecrets } = await import('./secrets');
    await getHelloAssoSecrets();

    expect(MockGetSecretValueCommand).toHaveBeenCalledWith({
      SecretId: 'apelasource/helloasso',
    });
  });

  it('uses the sandbox SecretId on the production-sandbox Amplify app', async () => {
    process.env.NEXT_PUBLIC_AWS_APP_ID = PROD_SANDBOX_AWS_APP_ID;
    mockSend.mockResolvedValueOnce({
      SecretString: JSON.stringify({
        FLEX_HELLOASSO_API_KEY: 'k',
        FLEX_HELLOASSO_API_SECRET: 's',
        FLEX_HELLOASSO_ORGANIZATION_SLUG: 'o',
        FLEX_HELLOASSO_ENV: 'sandbox',
      }),
    });

    const { getHelloAssoSecrets } = await import('./secrets');
    await getHelloAssoSecrets();

    expect(MockGetSecretValueCommand).toHaveBeenCalledWith({
      SecretId: 'apelasource-sandbox/helloasso',
    });
  });

  it('lets FLEX_HELLOASSO_SECRET_ARN override the sandbox SecretId', async () => {
    process.env.NEXT_PUBLIC_AWS_APP_ID = PROD_SANDBOX_AWS_APP_ID;
    process.env.FLEX_HELLOASSO_SECRET_ARN =
      'arn:aws:secretsmanager:eu-west-3:123:secret:custom-helloasso';
    mockSend.mockResolvedValueOnce({
      SecretString: JSON.stringify({
        FLEX_HELLOASSO_API_KEY: 'k',
        FLEX_HELLOASSO_API_SECRET: 's',
        FLEX_HELLOASSO_ORGANIZATION_SLUG: 'o',
        FLEX_HELLOASSO_ENV: 'sandbox',
      }),
    });

    const { getHelloAssoSecrets } = await import('./secrets');
    await getHelloAssoSecrets();

    expect(MockGetSecretValueCommand).toHaveBeenCalledWith({
      SecretId: 'arn:aws:secretsmanager:eu-west-3:123:secret:custom-helloasso',
    });
  });

  it('uses FLEX_HELLOASSO_SECRET_ARN as the Secrets Manager SecretId when provided', async () => {
    process.env.FLEX_HELLOASSO_SECRET_ARN =
      'arn:aws:secretsmanager:eu-west-3:123:secret:custom-helloasso';
    mockSend.mockResolvedValueOnce({
      SecretString: JSON.stringify({
        FLEX_HELLOASSO_API_KEY: 'k',
        FLEX_HELLOASSO_API_SECRET: 's',
        FLEX_HELLOASSO_ORGANIZATION_SLUG: 'o',
        FLEX_HELLOASSO_ENV: 'sandbox',
      }),
    });

    const { getHelloAssoSecrets } = await import('./secrets');
    await getHelloAssoSecrets();

    expect(MockGetSecretValueCommand).toHaveBeenCalledWith({
      SecretId: 'arn:aws:secretsmanager:eu-west-3:123:secret:custom-helloasso',
    });
  });

  it('treats an empty FLEX_HELLOASSO_SECRET_ARN as absent and falls through to the default', async () => {
    process.env.FLEX_HELLOASSO_SECRET_ARN = '';
    mockSend.mockResolvedValueOnce({
      SecretString: JSON.stringify({
        FLEX_HELLOASSO_API_KEY: 'k',
        FLEX_HELLOASSO_API_SECRET: 's',
        FLEX_HELLOASSO_ORGANIZATION_SLUG: 'o',
        FLEX_HELLOASSO_ENV: 'sandbox',
      }),
    });

    const { getHelloAssoSecrets } = await import('./secrets');
    await getHelloAssoSecrets();

    expect(MockGetSecretValueCommand).toHaveBeenCalledWith({
      SecretId: 'apelasource/helloasso',
    });
  });
});

const STRIPE_ENV_KEYS = [
  'FLEX_STRIPE_SECRET_KEY',
  'FLEX_STRIPE_WEBHOOK_SECRET',
  'FLEX_STRIPE_SECRET_ARN',
  'NEXT_PUBLIC_AWS_APP_ID',
] as const;

describe('getStripeSecrets', () => {
  const snapshot: Partial<Record<(typeof STRIPE_ENV_KEYS)[number], string | undefined>> = {};

  beforeEach(() => {
    vi.resetModules();
    mockSend.mockReset();
    MockGetSecretValueCommand.mockClear();

    for (const k of STRIPE_ENV_KEYS) {
      snapshot[k] = process.env[k];
      delete process.env[k];
    }
  });

  afterEach(() => {
    for (const k of STRIPE_ENV_KEYS) {
      if (snapshot[k] === undefined) {
        delete process.env[k];
      } else {
        process.env[k] = snapshot[k];
      }
    }
  });

  it('returns secrets from env vars when both values are present', async () => {
    process.env.FLEX_STRIPE_SECRET_KEY = 'env-sk';
    process.env.FLEX_STRIPE_WEBHOOK_SECRET = 'env-whsec';

    const { getStripeSecrets } = await import('./secrets');
    const secrets = await getStripeSecrets();

    expect(secrets).toEqual({
      FLEX_STRIPE_SECRET_KEY: 'env-sk',
      FLEX_STRIPE_WEBHOOK_SECRET: 'env-whsec',
    });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('uses the production SecretId on the production Amplify app', async () => {
    process.env.NEXT_PUBLIC_AWS_APP_ID = PROD_AWS_APP_ID;
    mockSend.mockResolvedValueOnce({
      SecretString: JSON.stringify({
        FLEX_STRIPE_SECRET_KEY: 'sm-sk',
        FLEX_STRIPE_WEBHOOK_SECRET: 'sm-whsec',
      }),
    });

    const { getStripeSecrets } = await import('./secrets');
    await getStripeSecrets();

    expect(MockGetSecretValueCommand).toHaveBeenCalledWith({
      SecretId: 'apelasource/stripe',
    });
  });

  it('uses the sandbox SecretId on the production-sandbox Amplify app', async () => {
    process.env.NEXT_PUBLIC_AWS_APP_ID = PROD_SANDBOX_AWS_APP_ID;
    mockSend.mockResolvedValueOnce({
      SecretString: JSON.stringify({
        FLEX_STRIPE_SECRET_KEY: 'sm-sk',
        FLEX_STRIPE_WEBHOOK_SECRET: 'sm-whsec',
      }),
    });

    const { getStripeSecrets } = await import('./secrets');
    await getStripeSecrets();

    expect(MockGetSecretValueCommand).toHaveBeenCalledWith({
      SecretId: 'apelasource-sandbox/stripe',
    });
  });

  it('defaults to the production SecretId when no Amplify app id is set', async () => {
    mockSend.mockResolvedValueOnce({
      SecretString: JSON.stringify({
        FLEX_STRIPE_SECRET_KEY: 'sm-sk',
        FLEX_STRIPE_WEBHOOK_SECRET: 'sm-whsec',
      }),
    });

    const { getStripeSecrets } = await import('./secrets');
    await getStripeSecrets();

    expect(MockGetSecretValueCommand).toHaveBeenCalledWith({
      SecretId: 'apelasource/stripe',
    });
  });

  it('lets FLEX_STRIPE_SECRET_ARN override the sandbox SecretId', async () => {
    process.env.NEXT_PUBLIC_AWS_APP_ID = PROD_SANDBOX_AWS_APP_ID;
    process.env.FLEX_STRIPE_SECRET_ARN =
      'arn:aws:secretsmanager:eu-west-3:123:secret:custom-stripe';
    mockSend.mockResolvedValueOnce({
      SecretString: JSON.stringify({
        FLEX_STRIPE_SECRET_KEY: 'sm-sk',
        FLEX_STRIPE_WEBHOOK_SECRET: 'sm-whsec',
      }),
    });

    const { getStripeSecrets } = await import('./secrets');
    await getStripeSecrets();

    expect(MockGetSecretValueCommand).toHaveBeenCalledWith({
      SecretId: 'arn:aws:secretsmanager:eu-west-3:123:secret:custom-stripe',
    });
  });
});
