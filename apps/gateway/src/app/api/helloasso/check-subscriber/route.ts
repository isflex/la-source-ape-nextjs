"use server";

import { NextRequest, NextResponse } from "next/server";

import { getDefaultHelloAssoClient } from "@src/lib/helloasso/default-client";
import { checkSubscriberByEmail } from "@src/lib/helloasso/subscribers";

const FORM_SLUG = process.env.FLEX_HELLOASSO_FORM_SLUG || "test-subscribe";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Missing email parameter" },
      { status: 400 },
    );
  }

  try {
    const client = await getDefaultHelloAssoClient();
    const result = await checkSubscriberByEmail(client, FORM_SLUG, email);

    return NextResponse.json({
      isSubscribed: result.isSubscribed,
      order: result.order
        ? {
            id: result.order.id,
            date: result.order.date,
            payer: {
              firstName: result.order.payer.firstName,
              lastName: result.order.payer.lastName,
            },
          }
        : null,
    });
  } catch (error) {
    console.error("[helloasso/check-subscriber] Error:", error);
    return NextResponse.json(
      { error: "Failed to check subscriber status" },
      { status: 500 },
    );
  }
}
