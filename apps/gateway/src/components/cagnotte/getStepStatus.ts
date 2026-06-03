export type StepStatus = {
  personalInfoComplete: boolean;
  bankingInfoComplete: boolean;
  identityComplete: boolean;
};

const IDENTITY_PATTERNS = ['verification.document', 'verification.additional_document'];

function matches(req: string, patterns: string[]): boolean {
  return patterns.some((p) => req.includes(p));
}

// Each step ticks when the user has submitted the corresponding info to Stripe — not when
// Stripe finishes its server-side verification (that's reflected by the badge + the
// "Vos informations sont en cours de vérification" block, not by the tick).
//
// Two gotchas we explicitly handle:
//   * Right after we create the Connect account, the DB record has currentlyDue=[] /
//     eventuallyDue=[] because we haven't synced from Stripe yet. The `!detailsSubmitted` gate
//     at the top keeps every step numbered in that window — otherwise the page flashes ticks.
//   * `create-account-link/route.ts` pre-fills `email`, so Stripe never lists `individual.email`
//     in currentlyDue. Personal-info detection has to look at the whole `individual.*` family,
//     not just email.
export function getStepStatus(
  currentlyDue: (string | null)[] | null | undefined,
  eventuallyDue: (string | null)[] | null | undefined,
  detailsSubmitted: boolean = false,
): StepStatus {
  const currentRequirements = (currentlyDue ?? []).filter((r): r is string => !!r);
  const eventualRequirements = (eventuallyDue ?? []).filter((r): r is string => !!r);

  if (!detailsSubmitted) {
    return { personalInfoComplete: false, bankingInfoComplete: false, identityComplete: false };
  }

  const identityStillPending =
    currentRequirements.some((r) => matches(r, IDENTITY_PATTERNS)) ||
    eventualRequirements.some((r) => matches(r, IDENTITY_PATTERNS));

  const bankingStillPending = currentRequirements.some((r) => r.includes('external_account'));

  const personalStillPending = currentRequirements.some(
    (r) =>
      (r.startsWith('individual.') && !matches(r, IDENTITY_PATTERNS)) ||
      r.startsWith('tos_acceptance.'),
  );

  return {
    personalInfoComplete: !personalStillPending,
    bankingInfoComplete: !bankingStillPending,
    identityComplete: !identityStillPending,
  };
}
