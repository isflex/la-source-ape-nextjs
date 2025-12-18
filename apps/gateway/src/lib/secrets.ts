import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'eu-west-3' });

interface StripeSecrets {
  FLEX_STRIPE_SECRET_KEY: string;
  FLEX_STRIPE_WEBHOOK_SECRET: string;
}

let cachedSecrets: StripeSecrets | null = null;
let cacheExpiry: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getStripeSecrets(): Promise<StripeSecrets> {
  // Return cached secrets if still valid
  if (cachedSecrets && Date.now() < cacheExpiry) {
    return cachedSecrets;
  }

  const command = new GetSecretValueCommand({
    SecretId: process.env.FLEX_STRIPE_SECRET_ARN || 'apelasource/stripe',
  });

  const response = await client.send(command);

  if (!response.SecretString) {
    throw new Error('Secret not found in Secrets Manager');
  }

  cachedSecrets = JSON.parse(response.SecretString);
  cacheExpiry = Date.now() + CACHE_TTL;

  return cachedSecrets!;
}
