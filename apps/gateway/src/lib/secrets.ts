import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { isProductionSandbox } from './deployment';

let _client: SecretsManagerClient | null = null;
function getClient(): SecretsManagerClient {
  if (!_client) {
    _client = new SecretsManagerClient({
      region: process.env.AWS_REGION || 'eu-west-3',
    });
  }
  return _client;
}

/**
 * Build a Secrets Manager SecretId for the active deployment target.
 *
 * - production-sandbox → `apelasource-sandbox/<name>`
 * - production / local → `apelasource/<name>`
 *
 * Pass `overrideArn` (e.g. process.env.FLEX_*_SECRET_ARN) to pin a
 * specific secret name or full ARN and bypass the convention.
 */
function resolveSecretId(name: string, overrideArn?: string): string {
  if (overrideArn) return overrideArn;
  const prefix = isProductionSandbox() ? 'apelasource-sandbox' : 'apelasource';
  return `${prefix}/${name}`;
}

interface StripeSecrets {
  FLEX_STRIPE_SECRET_KEY: string;
  FLEX_STRIPE_WEBHOOK_SECRET: string;
}

export type HelloAssoEnv = 'sandbox' | 'production';

export interface HelloAssoSecrets {
  FLEX_HELLOASSO_API_KEY: string;
  FLEX_HELLOASSO_API_SECRET: string;
  FLEX_HELLOASSO_ORGANIZATION_SLUG: string;
  FLEX_HELLOASSO_ENV: HelloAssoEnv;
}

let cachedSecrets: StripeSecrets | null = null;
let cacheExpiry: number = 0;
let cachedHelloAssoSecrets: HelloAssoSecrets | null = null;
let helloAssoCacheExpiry: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getStripeSecrets(): Promise<StripeSecrets> {
  // Return cached secrets if still valid
  if (cachedSecrets && Date.now() < cacheExpiry) {
    return cachedSecrets;
  }

  // Local development: use env vars directly (Stripe CLI provides webhook secret)
  const localSecretKey = process.env.FLEX_STRIPE_SECRET_KEY;
  const localWebhookSecret = process.env.FLEX_STRIPE_WEBHOOK_SECRET;

  if (localSecretKey && localWebhookSecret) {
    cachedSecrets = {
      FLEX_STRIPE_SECRET_KEY: localSecretKey,
      FLEX_STRIPE_WEBHOOK_SECRET: localWebhookSecret,
    };
    cacheExpiry = Date.now() + CACHE_TTL;
    return cachedSecrets;
  }

  // Production: fetch from AWS Secrets Manager
  const command = new GetSecretValueCommand({
    SecretId: resolveSecretId('stripe', process.env.FLEX_STRIPE_SECRET_ARN),
  });

  const response = await getClient().send(command);

  if (!response.SecretString) {
    throw new Error('Secret not found in Secrets Manager');
  }

  cachedSecrets = JSON.parse(response.SecretString);
  cacheExpiry = Date.now() + CACHE_TTL;

  return cachedSecrets!;
}

function assertHelloAssoEnv(value: string | undefined): asserts value is HelloAssoEnv {
  if (value !== 'sandbox' && value !== 'production') {
    throw new Error(
      `FLEX_HELLOASSO_ENV must be "sandbox" or "production"; got: ${JSON.stringify(value)}`,
    );
  }
}

export async function getHelloAssoSecrets(): Promise<HelloAssoSecrets> {
  if (cachedHelloAssoSecrets && Date.now() < helloAssoCacheExpiry) {
    return cachedHelloAssoSecrets;
  }

  const apiKey = process.env.FLEX_HELLOASSO_API_KEY;
  const apiSecret = process.env.FLEX_HELLOASSO_API_SECRET;
  const orgSlug = process.env.FLEX_HELLOASSO_ORGANIZATION_SLUG;
  const envValue = process.env.FLEX_HELLOASSO_ENV;

  if (apiKey && apiSecret && orgSlug && envValue) {
    assertHelloAssoEnv(envValue);
    cachedHelloAssoSecrets = {
      FLEX_HELLOASSO_API_KEY: apiKey,
      FLEX_HELLOASSO_API_SECRET: apiSecret,
      FLEX_HELLOASSO_ORGANIZATION_SLUG: orgSlug,
      FLEX_HELLOASSO_ENV: envValue,
    };
    helloAssoCacheExpiry = Date.now() + CACHE_TTL;
    return cachedHelloAssoSecrets;
  }

  const secretId = resolveSecretId('helloasso', process.env.FLEX_HELLOASSO_SECRET_ARN);
  const command = new GetSecretValueCommand({ SecretId: secretId });
  const response = await getClient().send(command);

  if (!response.SecretString) {
    throw new Error('HelloAsso secret not found in Secrets Manager');
  }

  const parsed = JSON.parse(response.SecretString) as HelloAssoSecrets;
  assertHelloAssoEnv(parsed.FLEX_HELLOASSO_ENV);

  cachedHelloAssoSecrets = parsed;
  helloAssoCacheExpiry = Date.now() + CACHE_TTL;
  return cachedHelloAssoSecrets;
}
