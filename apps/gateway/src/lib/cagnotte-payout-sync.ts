import type Stripe from "stripe";
import type { Schema } from "@amplify/data/resource";
import type { generateClient } from "aws-amplify/data";

type DataClient = ReturnType<typeof generateClient<Schema>>;
type JackpotFormRecord = Schema["JackpotForm"]["type"];

// Reconciles a JackpotForm row against a Stripe Payout webhook event.
//
// Used by the webhook handler in apps/gateway/src/app/api/cagnotte/webhook/route.ts for
// payout.paid and payout.failed events. Branches on payout.status:
//   * paid           → status='PAID_OUT', payoutCompletedAt=arrival_date.
//   * failed         → payoutNotes={code,message}, payoutRequested=false (so the owner can
//                      retry from the UI), payoutStripeId=null.
//   * other statuses → no-op (no DB write).
//
// Throws on missing metadata.jackpotFormId / missing JackpotForm record so the caller can log.
export async function applyPayoutResult(
  client: DataClient,
  payout: Stripe.Payout,
): Promise<JackpotFormRecord> {
  const jackpotFormId = payout.metadata?.jackpotFormId;
  if (!jackpotFormId) {
    throw new Error(`Payout ${payout.id} has no jackpotFormId metadata`);
  }

  const { data: jackpotForm } = await client.models.JackpotForm.get({ id: jackpotFormId });
  if (!jackpotForm) {
    throw new Error(`JackpotForm ${jackpotFormId} not found (payout ${payout.id})`);
  }

  if (payout.status === "paid") {
    if (jackpotForm.status === "PAID_OUT") {
      return jackpotForm;
    }
    const arrival = new Date(payout.arrival_date * 1000).toISOString();
    const { data: updated, errors } = await client.models.JackpotForm.update({
      id: jackpotFormId,
      status: "PAID_OUT",
      payoutCompletedAt: arrival,
    });
    if (errors && errors.length > 0) {
      throw new Error(
        `Failed to mark JackpotForm ${jackpotFormId} as PAID_OUT: ${errors.map((e) => e.message).join(", ")}`,
      );
    }
    return (updated ?? jackpotForm) as JackpotFormRecord;
  }

  if (payout.status === "failed") {
    const notes = JSON.stringify({
      code: payout.failure_code ?? null,
      message: payout.failure_message ?? null,
    });
    const { data: updated, errors } = await client.models.JackpotForm.update({
      id: jackpotFormId,
      payoutRequested: false,
      payoutStripeId: null,
      payoutNotes: notes,
    });
    if (errors && errors.length > 0) {
      throw new Error(
        `Failed to reset JackpotForm ${jackpotFormId} after payout failure: ${errors.map((e) => e.message).join(", ")}`,
      );
    }
    return (updated ?? jackpotForm) as JackpotFormRecord;
  }

  return jackpotForm;
}
