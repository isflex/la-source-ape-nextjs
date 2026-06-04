import type Stripe from "stripe";
import type { Schema } from "@amplify/data/resource";
import type { generateClient } from "aws-amplify/data";

type DataClient = ReturnType<typeof generateClient<Schema>>;
type ContributionRecord = Schema["JackpotContribution"]["type"];

// Reconciles a JackpotContribution row against a Stripe Checkout Session.
//
// Used by:
//   * the success-redirect handler in apps/gateway/src/app/cagnotte/[[...slug]]/page.tsx
//     (via POST /api/cagnotte/refresh-session-status)
//   * the webhook handler in apps/gateway/src/app/api/cagnotte/webhook/route.ts
//     (checkout.session.completed)
//
// Idempotent: if the contribution is already SUCCEEDED, returns it unchanged. Only writes when
// Stripe confirms the session is paid — if the caller has a session whose payment hasn't
// actually succeeded (e.g. the donor closed the tab mid-flow), the PENDING row stays PENDING
// and the eventual webhook can update it.
export async function syncContributionFromSession(
  client: DataClient,
  session: Stripe.Checkout.Session,
): Promise<ContributionRecord> {
  const contributionId = session.metadata?.contributionId;
  if (!contributionId) {
    throw new Error(`Checkout session ${session.id} has no contributionId metadata`);
  }

  const { data: contribution } = await client.models.JackpotContribution.get({ id: contributionId });
  if (!contribution) {
    throw new Error(`Contribution ${contributionId} not found (session ${session.id})`);
  }

  if (contribution.paymentStatus === "SUCCEEDED") {
    return contribution;
  }

  const paid = session.payment_status === "paid" || session.status === "complete";
  if (!paid) {
    return contribution;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  const { data: updated, errors } = await client.models.JackpotContribution.update({
    id: contributionId,
    paymentStatus: "SUCCEEDED",
    stripePaymentIntentId: paymentIntentId,
    paidAt: new Date().toISOString(),
  });

  if (errors && errors.length > 0) {
    throw new Error(
      `Failed to update JackpotContribution ${contributionId}: ${errors.map((e) => e.message).join(", ")}`,
    );
  }

  return (updated ?? contribution) as ContributionRecord;
}
