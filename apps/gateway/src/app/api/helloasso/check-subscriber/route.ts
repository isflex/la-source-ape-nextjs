"use server";

import { NextRequest, NextResponse } from "next/server";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@amplify/data/resource";
import { getCurrentConfig } from "@src/utils/amplify/configureAmplifyWithPortDetection";

import { getDefaultHelloAssoClient } from "@src/lib/helloasso/default-client";
import {
  checkSubscriberByEmail,
  type HelloAssoFormOrder,
} from "@src/lib/helloasso/subscribers";

Amplify.configure(getCurrentConfig(), { ssr: true });
const dbClient = generateClient<Schema>();

const FORM_SLUG = process.env.FLEX_HELLOASSO_FORM_SLUG || "test-subscribe";

function serializeOrder(order: HelloAssoFormOrder | undefined) {
  if (!order) return null;
  return {
    id: order.id,
    date: order.date,
    payer: {
      firstName: order.payer.firstName,
      lastName: order.payer.lastName,
    },
  };
}

export async function GET(request: NextRequest) {
  const emailParam = request.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json(
      { error: "Missing email parameter" },
      { status: 400 },
    );
  }

  const cognitoEmail = emailParam.toLowerCase();

  try {
    const helloassoClient = await getDefaultHelloAssoClient();

    // Step 1 — find the user's ACTIVE membership row via the emailCognito GSI.
    const { data: existing } =
      await dbClient.models.Membership.listMembershipByEmailCognito({
        emailCognito: cognitoEmail,
      });

    const activeRow = existing?.find((m) => m.status === "ACTIVE");

    if (activeRow) {
      // Step 2 — verify with HelloAsso using the email actually used on the form.
      const payerEmail = (
        activeRow.emailPayerHelloAsso || cognitoEmail
      ).toLowerCase();
      const verify = await checkSubscriberByEmail(
        helloassoClient,
        FORM_SLUG,
        payerEmail,
      );

      if (!verify.isSubscribed) {
        // Admin removed the order in HelloAsso back-office → mark DELETED.
        await dbClient.models.Membership.update({
          id: activeRow.id,
          status: "DELETED",
          updatedAt: new Date().toISOString(),
        });
        return NextResponse.json({ isSubscribed: false, order: null });
      }

      return NextResponse.json({
        isSubscribed: true,
        order: serializeOrder(verify.order),
      });
    }

    // Step 3 — no DB row. Fallback: ask HelloAsso directly using the Cognito
    // email. If found (webhook missed or payer used matching email), backfill.
    const fallback = await checkSubscriberByEmail(
      helloassoClient,
      FORM_SLUG,
      cognitoEmail,
    );

    if (fallback.isSubscribed && fallback.order) {
      const order = fallback.order;
      const paidAt = order.date || new Date().toISOString();
      const paidDate = new Date(paidAt);
      const validUntil = new Date(paidDate);
      validUntil.setFullYear(validUntil.getFullYear() + 1);

      await dbClient.models.Membership.create({
        emailCognito: cognitoEmail,
        emailPayerHelloAsso: order.payer.email.toLowerCase(),
        firstName: order.payer.firstName,
        lastName: order.payer.lastName,
        status: "ACTIVE",
        helloassoOrderId: order.id,
        amountCents: order.amount?.total ?? 0,
        paidAt,
        validUntil: validUntil.toISOString(),
        helloassoFormSlug: order.formSlug || FORM_SLUG,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      isSubscribed: fallback.isSubscribed,
      order: serializeOrder(fallback.order),
    });
  } catch (error) {
    console.error("[helloasso/check-subscriber] Error:", error);
    return NextResponse.json(
      { error: "Failed to check subscriber status" },
      { status: 500 },
    );
  }
}
