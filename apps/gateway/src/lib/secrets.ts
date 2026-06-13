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

interface ChallengeSecrets {
  FLEX_CHALLENGE_ANSWER: string;
}

let cachedSecrets: StripeSecrets | null = null;
let cacheExpiry: number = 0;
let cachedHelloAssoSecrets: HelloAssoSecrets | null = null;
let helloAssoCacheExpiry: number = 0;
let cachedChallengeSecrets: ChallengeSecrets | null = null;
let challengeCacheExpiry: number = 0;
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

/**
 * True when the active Stripe secret key is a TEST key (the string contains
 * "test", e.g. `sk_test_…`). Used to surface a sandbox banner on cagnotte
 * pages. Reuses the cached `getStripeSecrets()` and is resilient: returns
 * false when secrets can't be resolved (e.g. local dev without credentials).
 */
export async function isStripeTestMode(): Promise<boolean> {
  try {
    const { FLEX_STRIPE_SECRET_KEY } = await getStripeSecrets();
    return FLEX_STRIPE_SECRET_KEY.includes('test');
  } catch {
    return false;
  }
}

/**
 * The sign-in challenge answer (server-side only — never shipped to the client).
 *
 * - Local dev: `process.env.FLEX_CHALLENGE_ANSWER` (dotenvx-decrypted).
 * - Production: AWS Secrets Manager `apelasource[-sandbox]/challenge` →
 *   `{ "FLEX_CHALLENGE_ANSWER": "…" }`. This is required because the Amplify SSR
 *   runtime does NOT load the dotenvx env file, so server-only (non-NEXT_PUBLIC)
 *   vars are absent at runtime. Mirrors getStripeSecrets/getHelloAssoSecrets.
 */
export async function getChallengeAnswer(): Promise<string> {
  if (cachedChallengeSecrets && Date.now() < challengeCacheExpiry) {
    return cachedChallengeSecrets.FLEX_CHALLENGE_ANSWER;
  }

  const local = process.env.FLEX_CHALLENGE_ANSWER;
  if (local) {
    cachedChallengeSecrets = { FLEX_CHALLENGE_ANSWER: local };
    challengeCacheExpiry = Date.now() + CACHE_TTL;
    return local;
  }

  const command = new GetSecretValueCommand({
    SecretId: resolveSecretId('challenge', process.env.FLEX_CHALLENGE_SECRET_ARN),
  });
  const response = await getClient().send(command);

  if (!response.SecretString) {
    throw new Error('Challenge secret not found in Secrets Manager');
  }

  const parsed = JSON.parse(response.SecretString) as ChallengeSecrets;
  if (!parsed.FLEX_CHALLENGE_ANSWER) {
    throw new Error('Challenge secret is missing FLEX_CHALLENGE_ANSWER');
  }

  cachedChallengeSecrets = parsed;
  challengeCacheExpiry = Date.now() + CACHE_TTL;
  return parsed.FLEX_CHALLENGE_ANSWER;
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
