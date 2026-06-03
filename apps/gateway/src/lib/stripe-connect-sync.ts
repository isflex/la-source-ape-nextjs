import type Stripe from "stripe";
import type { Schema } from "@amplify/data/resource";
import type { generateClient } from "aws-amplify/data";

type DataClient = ReturnType<typeof generateClient<Schema>>;
type ConnectAccountRecord = Schema["StripeConnectAccount"]["type"];
type AccountStatus = Schema["EStripeAccountStatus"]["type"];

export interface MappedConnectFields {
  accountStatus: AccountStatus;
  onboardingComplete: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  currentlyDue: string[];
  eventuallyDue: string[];
  pastDue: string[];
  disabledReason: string | undefined;
  onboardingCompletedAt: string | null | undefined;
}

export function mapStripeAccountToConnectFields(
  account: Stripe.Account,
  existing: Pick<ConnectAccountRecord, "onboardingCompletedAt">,
): MappedConnectFields {
  let accountStatus: AccountStatus = "ONBOARDING_STARTED";

  if (account.charges_enabled && account.payouts_enabled) {
    accountStatus = "ACTIVE";
  } else if (account.details_submitted) {
    accountStatus = "ONBOARDING_COMPLETE";
  } else if (account.requirements?.currently_due && account.requirements.currently_due.length > 0) {
    accountStatus = "RESTRICTED";
  } else if (account.requirements?.disabled_reason && account.requirements.disabled_reason !== "requirements.past_due") {
    accountStatus = "DISABLED";
  }

  return {
    accountStatus,
    onboardingComplete: account.details_submitted || false,
    chargesEnabled: account.charges_enabled || false,
    payoutsEnabled: account.payouts_enabled || false,
    detailsSubmitted: account.details_submitted || false,
    currentlyDue: account.requirements?.currently_due || [],
    eventuallyDue: account.requirements?.eventually_due || [],
    pastDue: account.requirements?.past_due || [],
    disabledReason: account.requirements?.disabled_reason || undefined,
    onboardingCompletedAt:
      account.charges_enabled && account.payouts_enabled
        ? new Date().toISOString()
        : existing.onboardingCompletedAt,
  };
}

export async function syncConnectAccountFromStripe(
  stripe: Stripe,
  client: DataClient,
  accountRecord: ConnectAccountRecord,
): Promise<ConnectAccountRecord> {
  const account = await stripe.accounts.retrieve(accountRecord.stripeAccountId);
  const mapped = mapStripeAccountToConnectFields(account, accountRecord);

  const { data: updated, errors } = await client.models.StripeConnectAccount.update({
    id: accountRecord.id,
    ...mapped,
    updatedAt: new Date().toISOString(),
  });

  if (errors && errors.length > 0) {
    throw new Error(`Failed to update StripeConnectAccount: ${errors.map((e) => e.message).join(", ")}`);
  }

  return (updated ?? accountRecord) as ConnectAccountRecord;
}
