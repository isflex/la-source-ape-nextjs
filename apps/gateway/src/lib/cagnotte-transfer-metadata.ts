import type Stripe from "stripe";
import type { Schema } from "@amplify/data/resource";
import type { generateClient } from "aws-amplify/data";
import { debug } from "@flexiness/domain-utils";

type DataClient = ReturnType<typeof generateClient<Schema>>;

// Stamps jackpotFormId + a friendly title onto the Stripe objects that live on
// the CONNECTED-account side of a destination charge: the platform-created
// Transfer and the destination payment the connected account actually sees in
// its dashboard / CSV exports.
//
// Why this is needed: in a destination charge the only metadata we control is on
// the platform PaymentIntent/Charge. `transfer_data` takes no metadata, and the
// auto-created Transfer + destination payment inherit none — so a connected
// account running several cagnottes can't tell its incoming payments apart.
//
// Best-effort and idempotent: returns silently when the data isn't there yet,
// skips work when the metadata already matches, and never throws (the caller's
// job — recording the contribution — must not fail because of metadata).
export async function enrichConnectedAccountMetadata(
  stripe: Stripe,
  client: DataClient,
  session: Stripe.Checkout.Session,
): Promise<void> {
  try {
    const jackpotFormId = session.metadata?.jackpotFormId;
    const contributionId = session.metadata?.contributionId;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    if (!jackpotFormId || !paymentIntentId) return;

    // Friendly label for humans reading the connected account's transactions,
    // plus the connected account id (needed to address the destination payment).
    const { data: jackpotForm } = await client.models.JackpotForm.get({ id: jackpotFormId });
    const connectAccountId = jackpotForm?.stripeAccountId ?? undefined;

    const metadata: Record<string, string> = {
      jackpotFormId,
      jackpotTitle: jackpotForm?.title ?? "",
    };
    if (contributionId) metadata.contributionId = contributionId;

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["latest_charge"],
    });
    const charge = pi.latest_charge as Stripe.Charge | null;
    const transferId =
      typeof charge?.transfer === "string" ? charge.transfer : charge?.transfer?.id;

    // No transfer means this wasn't a destination charge (or it hasn't settled
    // yet) — nothing to enrich on the connected side.
    if (!transferId) return;

    // 1) Platform-side Transfer object.
    const transfer = await stripe.transfers.retrieve(transferId);
    if (!metadataAlreadySet(transfer.metadata, metadata)) {
      await stripe.transfers.update(transferId, { metadata });
    }

    // 2) The destination payment — the charge the CONNECTED account sees.
    const destinationPaymentId =
      typeof transfer.destination_payment === "string"
        ? transfer.destination_payment
        : transfer.destination_payment?.id;

    if (destinationPaymentId && connectAccountId) {
      const destCharge = await stripe.charges.retrieve(
        destinationPaymentId,
        {},
        { stripeAccount: connectAccountId },
      );
      if (!metadataAlreadySet(destCharge.metadata, metadata)) {
        await stripe.charges.update(
          destinationPaymentId,
          { metadata },
          { stripeAccount: connectAccountId },
        );
      }
    }
  } catch (error) {
    // Swallow — metadata enrichment is non-critical and must never break the
    // contribution flow. Surface it for diagnostics only.
    debug.cagnotte("enrichConnectedAccountMetadata failed", {
      sessionId: session.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function metadataAlreadySet(
  existing: Stripe.Metadata | null | undefined,
  desired: Record<string, string>,
): boolean {
  if (!existing) return false;
  return Object.entries(desired).every(([key, value]) => existing[key] === value);
}
