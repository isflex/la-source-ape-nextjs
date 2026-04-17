/**
 * HelloAsso webhook event parsing and validation utilities.
 *
 * Webhook envelope shape (captured from sandbox, supersedes docs):
 * {
 *   data:      { full Order or Payment object },
 *   eventType: "Order" | "Payment",
 *   metadata:  { echoed from checkout intent — absent for native form submissions }
 * }
 */

// Known HelloAsso source IPs for webhook verification
const HELLOASSO_SOURCE_IPS: Record<string, string> = {
  production: '51.138.206.200',
  sandbox: '4.233.135.234',
};

export type HelloAssoEventType = 'Order' | 'Payment';

export interface HelloAssoWebhookEnvelope {
  data: HelloAssoOrderData | HelloAssoPaymentData;
  eventType: HelloAssoEventType;
  metadata?: Record<string, unknown>;
}

export interface HelloAssoOrderData {
  id: number;
  date: string;
  formSlug: string;
  formType: string; // "Membership", "Checkout", etc.
  organizationSlug: string;
  amount: { total: number; vat: number; discount: number };
  payer: {
    email: string;
    firstName: string;
    lastName: string;
    country?: string;
  };
  items: Array<{
    id: number;
    name: string;
    amount: number;
    type: string;
    state: string;
    payments: Array<{ id: number; shareAmount: number }>;
  }>;
  payments: Array<{
    id: number;
    amount: number;
    date: string;
    paymentMeans: string;
    state: string;
  }>;
  meta?: { createdAt: string; updatedAt: string };
}

export interface HelloAssoPaymentData {
  id: number;
  amount: number;
  date: string;
  paymentMeans: string;
  state: string;
  order: { id: number; date: string; formSlug: string; formType: string };
  meta?: { createdAt: string; updatedAt: string };
}

/**
 * Extract the real client IP from the request, handling proxies (CloudFront, etc.)
 */
export function extractClientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return null;
}

/**
 * Verify that the webhook request comes from a known HelloAsso IP.
 */
export function verifySourceIp(clientIp: string | null, env: string): boolean {
  if (!clientIp) return false;
  const expectedIp = HELLOASSO_SOURCE_IPS[env];
  if (!expectedIp) return false;
  return clientIp === expectedIp;
}

/**
 * Parse and validate the webhook envelope.
 * Returns null if the body is not a valid HelloAsso webhook event.
 */
export function parseWebhookEnvelope(body: unknown): HelloAssoWebhookEnvelope | null {
  if (!body || typeof body !== 'object') return null;

  const envelope = body as Record<string, unknown>;

  if (!envelope.data || typeof envelope.data !== 'object') return null;
  if (!envelope.eventType || typeof envelope.eventType !== 'string') return null;
  if (envelope.eventType !== 'Order' && envelope.eventType !== 'Payment') return null;

  const data = envelope.data as Record<string, unknown>;
  if (typeof data.id !== 'number') return null;

  return {
    data: data as unknown as HelloAssoOrderData | HelloAssoPaymentData,
    eventType: envelope.eventType as HelloAssoEventType,
    metadata: envelope.metadata as Record<string, unknown> | undefined,
  };
}

/**
 * Check if an Order event is from a Membership form (not a Checkout intent).
 */
export function isMembershipOrder(data: HelloAssoOrderData): boolean {
  return data.formType === 'Membership';
}

/**
 * Build a dedupe key from eventType + data id.
 * Used to prevent processing the same event twice.
 */
export function buildDedupeKey(eventType: HelloAssoEventType, dataId: number): string {
  return `${eventType}:${dataId}`;
}
