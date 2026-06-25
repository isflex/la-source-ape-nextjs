#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * One-off reconciliation: sweep the contributor fee-buffer surplus out of the
 * connected account(s) back to the platform.
 *
 * Background (see also STRIPE.md / the cagnotte fee model):
 * Before the application_fee_amount fix, the "contributor pays fees" mode
 * transferred the FULL charge (desired amount + fee buffer) to the connected
 * account, while Stripe deducted its real fee from the PLATFORM. Result: the
 * platform went negative by ~the total fees, and the exact-equal fee buffer got
 * stranded on the connected account (e.g. €10.64 across the two live cagnottes).
 *
 * This script reverses, for each affected destination-charge transfer, the
 * buffer = charge.amount - metadata.desired_amount, moving it back to the
 * platform balance. A transfer reversal is an instant balance-ledger move
 * (connected -> platform); it does NOT delay the recipient's bank payout.
 *
 * IMPORTANT: run this BEFORE "Demander le paiement". Once a payout fires, only
 * the residual surplus stays reversible.
 *
 * Usage:
 *   FLEX_STRIPE_SECRET_KEY=sk_live_... node bin/reconcile-cagnotte-surplus.mjs            # dry-run
 *   FLEX_STRIPE_SECRET_KEY=sk_live_... node bin/reconcile-cagnotte-surplus.mjs --confirm  # execute
 *
 * Optional filters:
 *   --jackpot=<jackpotFormId>   only this cagnotte (repeatable)
 *   --account=<acct_...>        only transfers to this connected account
 *   --limit=<n>                 max charges to scan (default 1000)
 */

import Stripe from "stripe";

function parseArgs(argv) {
  const args = { confirm: false, jackpots: [], account: undefined, limit: 1000 };
  for (const a of argv) {
    if (a === "--confirm") args.confirm = true;
    else if (a.startsWith("--jackpot=")) args.jackpots.push(a.slice("--jackpot=".length));
    else if (a.startsWith("--account=")) args.account = a.slice("--account=".length);
    else if (a.startsWith("--limit=")) args.limit = parseInt(a.slice("--limit=".length), 10);
  }
  return args;
}

const fmtEur = (cents) => `€${(cents / 100).toFixed(2)}`;

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const key = process.env.FLEX_STRIPE_SECRET_KEY;
  if (!key) {
    console.error("ERROR: FLEX_STRIPE_SECRET_KEY env var is required.");
    process.exit(1);
  }
  const stripe = new Stripe(key);

  console.log(`\nMode: ${args.confirm ? "EXECUTE (--confirm)" : "DRY-RUN (no writes)"}`);
  if (args.jackpots.length) console.log(`Filter jackpotFormId in: ${args.jackpots.join(", ")}`);
  if (args.account) console.log(`Filter destination account: ${args.account}`);
  console.log("");

  const plan = [];
  let scanned = 0;

  // Walk platform charges, newest first, until we hit the scan limit.
  for await (const charge of stripe.charges.list({ limit: 100, expand: ["data.balance_transaction"] })) {
    if (scanned >= args.limit) break;
    scanned += 1;

    const jackpotFormId = charge.metadata?.jackpotFormId;
    const desiredRaw = charge.metadata?.desired_amount;
    const transferId = typeof charge.transfer === "string" ? charge.transfer : charge.transfer?.id;

    if (!jackpotFormId || !desiredRaw || !transferId) continue; // not a cagnotte destination charge
    if (charge.status !== "succeeded" || charge.refunded) continue;
    if (args.jackpots.length && !args.jackpots.includes(jackpotFormId)) continue;

    const desired = parseInt(desiredRaw, 10);
    const buffer = charge.amount - desired; // the fee buffer that must return to the platform
    if (!Number.isFinite(buffer) || buffer <= 0) continue;

    // Inspect the transfer: skip if it already went to a different account
    // (filter) or has already been (fully) reversed by a previous run.
    const transfer = await stripe.transfers.retrieve(transferId);
    if (args.account && transfer.destination !== args.account) continue;
    const alreadyReversed = transfer.amount_reversed ?? 0;
    const remaining = Math.max(0, buffer - alreadyReversed);

    plan.push({
      chargeId: charge.id,
      jackpotFormId,
      jackpotTitle: charge.metadata?.jackpotTitle ?? "",
      transferId,
      destination: transfer.destination,
      chargeAmount: charge.amount,
      desired,
      buffer,
      alreadyReversed,
      remaining,
    });
  }

  if (plan.length === 0) {
    console.log("No eligible charges found. Nothing to reconcile.");
    return;
  }

  // Report
  let totalRemaining = 0;
  console.log("Planned reversals (connected account -> platform):\n");
  for (const p of plan) {
    totalRemaining += p.remaining;
    const note = p.remaining === 0 ? "  (already reversed — skip)" : "";
    console.log(
      `  ${p.chargeId}  ${p.jackpotTitle || p.jackpotFormId}\n` +
        `    charge ${fmtEur(p.chargeAmount)}  desired ${fmtEur(p.desired)}  ` +
        `buffer ${fmtEur(p.buffer)}  reverse ${fmtEur(p.remaining)}  -> transfer ${p.transferId}${note}`,
    );
  }
  console.log(`\n  Charges eligible: ${plan.length}`);
  console.log(`  Total to reverse back to platform: ${fmtEur(totalRemaining)}\n`);

  if (!args.confirm) {
    console.log("Dry-run only. Re-run with --confirm to execute the reversals.");
    return;
  }

  // Execute
  let done = 0;
  for (const p of plan) {
    if (p.remaining <= 0) continue;
    try {
      const reversal = await stripe.transfers.createReversal(
        p.transferId,
        {
          amount: p.remaining,
          description: `Fee-buffer sweep to platform — ${p.jackpotTitle || p.jackpotFormId}`,
          metadata: { jackpotFormId: p.jackpotFormId, reason: "fee_buffer_reconciliation" },
        },
        { idempotencyKey: `feebuffer-reversal-${p.transferId}` },
      );
      done += 1;
      console.log(`  ✓ ${p.transferId}  reversed ${fmtEur(p.remaining)}  (${reversal.id})`);
    } catch (error) {
      console.error(`  ✗ ${p.transferId}  FAILED: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  console.log(`\nDone. ${done}/${plan.filter((p) => p.remaining > 0).length} reversals executed.`);
}

main().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});
