import type { HelloAssoClient } from './client';

export interface HelloAssoOrderPayer {
  email: string;
  firstName: string;
  lastName: string;
}

export interface HelloAssoFormOrder {
  id: number;
  payer: HelloAssoOrderPayer;
  items?: Array<{ name: string; amount: number; type?: string; state?: string }>;
  amount?: { total: number; vat: number; discount: number };
  date?: string;
  formSlug?: string;
  formType?: string;
}

interface OrdersResponse {
  data: HelloAssoFormOrder[];
  pagination: unknown;
}

export interface SubscriberCheckResult {
  isSubscribed: boolean;
  order: HelloAssoFormOrder | undefined;
}

export async function checkSubscriberByEmail(
  client: HelloAssoClient,
  formSlug: string,
  email: string,
): Promise<SubscriberCheckResult> {
  const response = await client.request<OrdersResponse>(
    `/v5/organizations/${client.organizationSlug}/forms/Membership/${formSlug}/orders?userSearchKey=${encodeURIComponent(email)}`,
  );

  const order = response.data.find(
    (o) => o.payer?.email?.toLowerCase() === email.toLowerCase(),
  );

  return { isSubscribed: !!order, order };
}
