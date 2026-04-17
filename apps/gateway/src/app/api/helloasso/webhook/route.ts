import { NextRequest, NextResponse } from "next/server";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@amplify/data/resource";
import { getCurrentConfig } from "@src/utils/amplify/configureAmplifyWithPortDetection";
import { logServerError, type ErrorContext } from "@src/lib/server-error-logger";
import {
  extractClientIp,
  verifySourceIp,
  parseWebhookEnvelope,
  isMembershipOrder,
  buildDedupeKey,
  type HelloAssoOrderData,
} from "@src/lib/helloasso/webhook";

// Configure Amplify for server-side API routes
Amplify.configure(getCurrentConfig(), { ssr: true });

const client = generateClient<Schema>();

const HELLOASSO_ENV = process.env.FLEX_HELLOASSO_ENV || "sandbox";

// In-memory dedupe set (per Lambda / server instance).
// Prevents processing the same event twice within a single cold-start.
// Across cold-starts, DB-level idempotency (unique helloassoOrderId) is the fallback.
const processedEvents = new Set<string>();

async function logWebhookError(
  error: Error | unknown,
  eventType: string,
  additionalContext?: Record<string, unknown>,
): Promise<void> {
  const context: ErrorContext = {
    route: "/api/helloasso/webhook",
    method: "POST",
    additionalContext: {
      source: "helloasso-webhook",
      eventType,
      ...additionalContext,
    },
  };
  await logServerError(error, context);
}

export async function POST(request: NextRequest) {
  let eventType = "unknown";

  try {
    // 1. Verify source IP
    const clientIp = extractClientIp(request);
    if (!verifySourceIp(clientIp, HELLOASSO_ENV)) {
      console.warn(
        `[helloasso/webhook] Rejected request from IP: ${clientIp} (expected env: ${HELLOASSO_ENV})`,
      );
      // Return 200 even for rejected IPs to avoid information leakage
      // (attacker doesn't learn this is a valid webhook endpoint)
      return NextResponse.json({ received: true });
    }

    // 2. Parse body
    const body = await request.json();
    const envelope = parseWebhookEnvelope(body);

    if (!envelope) {
      console.warn("[helloasso/webhook] Invalid webhook envelope");
      return NextResponse.json({ received: true });
    }

    eventType = envelope.eventType;

    // 3. Deduplicate
    const dedupeKey = buildDedupeKey(
      envelope.eventType,
      (envelope.data as { id: number }).id,
    );
    if (processedEvents.has(dedupeKey)) {
      console.log(`[helloasso/webhook] Duplicate event skipped: ${dedupeKey}`);
      return NextResponse.json({ received: true });
    }
    processedEvents.add(dedupeKey);

    // Cap the set size to prevent memory leaks on long-running instances
    if (processedEvents.size > 10000) {
      const entries = Array.from(processedEvents);
      for (let i = 0; i < 5000; i++) {
        processedEvents.delete(entries[i]);
      }
    }

    // 4. Handle event
    if (envelope.eventType === "Order") {
      const orderData = envelope.data as HelloAssoOrderData;

      if (isMembershipOrder(orderData)) {
        await handleMembershipOrder(orderData);
      } else {
        console.log(
          `[helloasso/webhook] Non-membership order ignored (formType: ${orderData.formType})`,
        );
      }
    } else {
      // Payment events: log only, the Order event handles the DB write
      console.log(
        `[helloasso/webhook] Payment event received (id: ${(envelope.data as { id: number }).id})`,
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    await logWebhookError(error, eventType);
    // Always return 200 to prevent HelloAsso from retrying
    return NextResponse.json({ received: true });
  }
}

async function handleMembershipOrder(order: HelloAssoOrderData) {
  try {
    const { payer, amount, payments } = order;
    const paymentId = payments?.[0]?.id;
    const paidAt = order.date;

    // Calculate validity: 1 year from payment date
    const paidDate = new Date(paidAt);
    const validUntil = new Date(paidDate);
    validUntil.setFullYear(validUntil.getFullYear() + 1);

    // Check if this order already exists (DB-level idempotency)
    const { data: existing } = await client.models.Membership.list({
      filter: { helloassoOrderId: { eq: order.id } },
    });

    if (existing && existing.length > 0) {
      console.log(
        `[helloasso/webhook] Membership for order ${order.id} already exists, skipping`,
      );
      return;
    }

    // Webhook cannot know the Cognito email — optimistically assume the payer
    // used the same email as their Cognito account. The page-load orchestrator
    // reconciles divergence when the authenticated user visits /adhesion.
    await client.models.Membership.create({
      emailCognito: payer.email,
      emailPayerHelloAsso: payer.email,
      firstName: payer.firstName,
      lastName: payer.lastName,
      status: "ACTIVE",
      helloassoOrderId: order.id,
      helloassoPaymentId: paymentId,
      amountCents: amount.total,
      paidAt: paidAt,
      validUntil: validUntil.toISOString(),
      helloassoFormSlug: order.formSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log(
      `[helloasso/webhook] Membership created for ${payer.email} (order: ${order.id}, valid until: ${validUntil.toISOString()})`,
    );
  } catch (error) {
    await logWebhookError(error, "Order", {
      orderId: order.id,
      payerEmail: order.payer?.email,
    });
  }
}
