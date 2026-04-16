import { getHelloAssoSecrets } from '@src/lib/secrets';

import { createHelloAssoClient, type HelloAssoClient } from './client';

let cachedClient: HelloAssoClient | null = null;
let pendingClient: Promise<HelloAssoClient> | null = null;

export async function getDefaultHelloAssoClient(): Promise<HelloAssoClient> {
  if (cachedClient) {
    return cachedClient;
  }
  if (pendingClient) {
    return pendingClient;
  }
  pendingClient = (async () => {
    const secrets = await getHelloAssoSecrets();
    const client = createHelloAssoClient({
      env: secrets.FLEX_HELLOASSO_ENV,
      clientId: secrets.FLEX_HELLOASSO_API_KEY,
      clientSecret: secrets.FLEX_HELLOASSO_API_SECRET,
      organizationSlug: secrets.FLEX_HELLOASSO_ORGANIZATION_SLUG,
    });
    cachedClient = client;
    return client;
  })().finally(() => {
    pendingClient = null;
  });
  return pendingClient;
}
