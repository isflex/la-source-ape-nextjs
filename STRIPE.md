# Stripe Integration

## Overview

The cagnotte (fundraiser/jackpot) feature uses **Stripe Checkout** with **Stripe Connect** (Express accounts) to allow organizations to receive contributions. Each organization onboards their own Stripe Connect account; the platform handles fee calculation, checkout session creation, and webhook processing.

### Key Components

| Component | Path |
|-----------|------|
| Webhook endpoint | `apps/gateway/src/app/api/cagnotte/webhook/route.ts` |
| Checkout session | `apps/gateway/src/app/api/cagnotte/create-checkout-session/route.ts` |
| Connect onboarding | `apps/gateway/src/app/api/stripe-connect/create-account-link/route.ts` |
| Fee calculator | `apps/gateway/src/lib/cagnotte-fees.ts` |
| Secrets manager | `apps/gateway/src/lib/secrets.ts` |
| Checkout button | `apps/gateway/src/components/cagnotte/StripeCheckoutButton.tsx` |

### Dependencies

```json
{
  "stripe": "^20.0.0",
  "@stripe/react-stripe-js": "^5.4.1",
  "@stripe/stripe-js": "^8.5.3"
}
```

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `FLEX_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (also exposed as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) | `pk_test_...` |
| `FLEX_STRIPE_SECRET_KEY` | Stripe secret key (dev: env var, prod: AWS Secrets Manager) | `sk_test_...` |
| `FLEX_STRIPE_WEBHOOK_SECRET` | Webhook signing secret (dev: env var, prod: AWS Secrets Manager) | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_MODE` | `local` (Next.js API routes) or `backend` (shared backend API) | `local` |

### Fee Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `FLEX_STRIPE_FEE_PAY_IN_PAYER` | Who covers Stripe card processing fees: `platform`, `contributor`, or `recipient` | `platform` |
| `FLEX_STRIPE_FEE_PAYOUT_PAYER` | Who covers payout fees: `platform` or `recipient` | `platform` |
| `FLEX_STRIPE_PLATFORM_COMMISSION_PERCENT` | Platform commission percentage | `0` |

### SEPA Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `FLEX_STRIPE_SEPA_PAYMENTS_ALLOWED` | Enable SEPA Direct Debit payments | `true` |
| `FLEX_STRIPE_SEPA_CUTOFF_DAYS` | Minimum days before deadline for SEPA payments | `8` |

### Secrets Management

- **Development**: Secrets loaded directly from environment variables (encrypted with dotenvx)
- **Production**: Fetched from AWS Secrets Manager via `FLEX_STRIPE_SECRET_ARN` (region: `eu-west-3`, cached for 5 minutes)

## Stripe CLI Installation

### Download and install

```bash
# Download
curl -sLO https://github.com/stripe/stripe-cli/releases/download/v1.33.0/stripe_1.33.0_linux_x86_64.tar.gz

# Extract
tar -xzvf stripe_1.33.0_linux_x86_64.tar.gz

# Move to PATH
sudo mv stripe /usr/local/bin/
```

### Forward webhooks to local dev server

```bash
stripe listen --forward-to localhost:3001/api/cagnotte/webhook/
```

This outputs a local webhook signing secret (`whsec_...`) — use it as `FLEX_STRIPE_WEBHOOK_SECRET` for local development.

## Webhook Events

The webhook endpoint (`POST /api/cagnotte/webhook/`) handles the following Stripe events:

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Updates contribution status to `SUCCEEDED` |
| `checkout.session.expired` | Updates contribution status to `CANCELED` |
| `payment_intent.payment_failed` | Updates contribution status to `FAILED` |
| `charge.refunded` | Updates contribution status to `REFUNDED` |
| `account.updated` | Updates Stripe Connect account status |
| `payout.paid` | Flips JackpotForm to `PAID_OUT` and stamps `payoutCompletedAt` |
| `payout.failed` | Resets `payoutRequested=false`, stores failure details in `payoutNotes` so the owner can retry |

## Stripe Dashboard Webhook Setup (Production)

1. Go to **Developers > Webhooks** in the Stripe Dashboard
2. Click **Add endpoint**
3. Set the endpoint URL: `https://yourdomain.com/api/cagnotte/webhook/`
4. **Set "Listen to events on" to `Connected accounts`** (not "Account") — `account.updated` for an Express connected account is a Connect event and is only delivered to endpoints that opt in. Without this, the platform endpoint receives checkout/charge events but never the connected-account onboarding update, leaving `StripeConnectAccount` stuck at `ONBOARDING_STARTED`. If both platform and connected events are needed, either flip the toggle to include both or register a second endpoint.
5. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `account.updated`
   - `payout.paid`
   - `payout.failed`
6. Copy the webhook signing secret
7. Store it as `FLEX_STRIPE_WEBHOOK_SECRET` (in AWS Secrets Manager for production)

### Cagnotte payout (manual schedule)

Connect accounts are created with `payouts.schedule.interval = 'manual'`, so funds collected
through Stripe Checkout sit on the connected account's Stripe balance until explicitly paid
out. The flow:

1. Cagnotte transitions to `CLOSED` (deadline reached or owner closed manually).
2. Owner clicks **"Demander paiement"** from `/cagnotte/creer` or the public detail page
   `/cagnotte/<slug>/` (creator-only).
3. Frontend calls `POST /api/cagnotte/request-payout` with the cagnotte ID and a Cognito
   token. The server validates ownership, sums SUCCEEDED contributions, confirms the connected
   account's available EUR balance, and calls
   `stripe.payouts.create({ amount, currency: 'eur', metadata: { jackpotFormId, userId } },
   { stripeAccount, idempotencyKey })`. It also stores the resulting `po_…` id on
   `JackpotForm.payoutStripeId`.
4. `payout.paid` webhook fires → `applyPayoutResult` flips
   `JackpotForm.status='PAID_OUT'` and stamps `payoutCompletedAt`.
5. If `payout.failed` fires instead, the helper resets `payoutRequested=false`, clears
   `payoutStripeId`, and writes the failure code/message into `payoutNotes`. The owner sees
   the "Demander paiement" button reappear and can retry.

Stripe holds card transactions on a rolling clearing period (typically 7 days for French
Express accounts) before they can be paid out. Until funds move from "Available soon"
(`balance.pending`) to "Available" (`balance.available`), `request-payout` returns a 409 with
a French wait message and does **not** call Stripe or write `payoutRequested=true`. Two ways
to get money out earlier exist but are not wired in today:

1. `stripe.payouts.create({ method: 'instant' }, { stripeAccount })` against
   `balance.instant_available` — same-day, ~1% Stripe fee.
2. Ask Stripe Support to reduce the rolling reserve for a specific account once it has a
   track record (months, not days).

### Defense in depth: `/api/stripe-connect/refresh-account-status`

The page at `/cagnotte/compte-stripe/` also calls `POST /api/stripe-connect/refresh-account-status` when the user returns from Stripe (`?success=true`). That endpoint calls `stripe.accounts.retrieve()` directly and syncs the DB record, so the UI updates correctly even if the webhook is misconfigured or delivery is delayed. The webhook remains the source of truth for async state changes (later disputes, balance restrictions, etc.).

## Payment Flow

1. **Organization onboards** via Stripe Connect Express (`/api/stripe-connect/create-account-link/`)
2. **Contributor visits** the public cagnotte page (`/cagnotte/[slug]/`)
3. **Contributor clicks "Contribute"** — fees are previewed in `StripeCheckoutButton`
4. **Checkout session created** via `/api/cagnotte/create-checkout-session/` with:
   - Destination charge to the creator's Connect account
   - Application fee for the platform (if configured)
   - Support for Card and SEPA payment methods
5. **Contribution record** stored as `JackpotContribution` with status `PENDING`
6. **Webhook fires** on payment completion, updating the contribution status

## Fee Presets

| Preset | Pay-in fees | Payout fees | Commission | Use case |
|--------|-------------|-------------|------------|----------|
| `nonprofit` | Platform | Platform | 0% | Charity/nonprofit campaigns |
| `freemium` | Contributor | Platform | 0% | Free platform, contributor absorbs fees |
| `standard` | Contributor | Recipient | 5% | Standard commercial model |
| `recipientPays` | Recipient | Recipient | 0% | All fees deducted from the pot |

### Stripe Fee Rates (France/EUR)

- **Card**: 1.5% + 0.25 EUR
- **International card**: 2.9% + 0.25 EUR
- **SEPA payout**: 0.25 EUR

## Testing

### Test the payment flow

1. Start the dev server: `pnpm dev`
2. Start the Stripe webhook listener: `stripe listen --forward-to localhost:3001/api/cagnotte/webhook/`
3. Create a test cagnotte at `/cagnotte/creer/`
4. Visit the public page at `/cagnotte/[slug]/`
5. Click "Contribute" and use a Stripe test card (see below)
6. Verify the contribution appears with `SUCCEEDED` status

### Test Cards

#### Primary Test Card (always succeeds)

| Field | Value |
|-------|-------|
| Card Number | `4242 4242 4242 4242` |
| Expiry | Any future date (e.g., `12/34`) |
| CVC | Any 3 digits (e.g., `123`) |
| ZIP | Any 5 digits (e.g., `12345`) |

#### Other Useful Test Cards

| Scenario | Card Number | Description |
|----------|-------------|-------------|
| 3D Secure required | `4000 0025 0000 3155` | Triggers 3D Secure authentication flow |
| Card declined | `4000 0000 0000 0002` | Always fails with "card declined" |
| Insufficient funds | `4000 0000 0000 9995` | Decline with insufficient funds |
| Expired card | `4000 0000 0000 0069` | Decline with expired card |

All test cards work in **test mode only** and will never create real charges. Payments appear in your Stripe Dashboard test mode and trigger the webhook to update the contribution status to `SUCCEEDED`.
