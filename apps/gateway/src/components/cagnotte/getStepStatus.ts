export type StepStatus = {
  personalInfoComplete: boolean;
  bankingInfoComplete: boolean;
  identityComplete: boolean;
};

// Identity is only considered ✓ once Stripe has actually verified the documents.
// Form-submission (`detailsSubmitted`) is necessary but not sufficient — Stripe can hold an
// account at `details_submitted=true` / `charges_enabled=false` while running internal checks.
// The user-facing list must reflect that wait, otherwise we show "Configuration terminée"
// while the badge still reads "EN ATTENTE DE VÉRIFICATION".
export function getStepStatus(
  currentlyDue: (string | null)[] | null | undefined,
  eventuallyDue: (string | null)[] | null | undefined,
  detailsSubmitted: boolean = false,
  chargesEnabled: boolean = false,
): StepStatus {
  const currentRequirements = currentlyDue?.filter((req): req is string => req !== null) || [];
  const eventualRequirements = eventuallyDue?.filter((req): req is string => req !== null) || [];

  // If no requirements in either array
  if (currentRequirements.length === 0 && eventualRequirements.length === 0) {
    return {
      personalInfoComplete: true,
      bankingInfoComplete: true,
      identityComplete: detailsSubmitted && chargesEnabled,
    };
  }

  // Personal info complete: individual.email is NOT in currentlyDue
  // (email is removed once user enters Stripe onboarding and provides it)
  const hasEmailRequirement = currentRequirements.some(req => req.includes('individual.email'));

  // Banking complete: external_account is NOT in currentlyDue
  const hasBankingRequirement = currentRequirements.some(req => req.includes('external_account'));

  // Identity: check both arrays, and require detailsSubmitted + chargesEnabled
  const identityPatterns = ['verification.document', 'verification.additional_document'];
  const hasIdentityRequirements =
    currentRequirements.some(req => identityPatterns.some(pattern => req.includes(pattern))) ||
    eventualRequirements.some(req => identityPatterns.some(pattern => req.includes(pattern)));

  return {
    personalInfoComplete: !hasEmailRequirement,
    bankingInfoComplete: !hasBankingRequirement,
    identityComplete: !hasIdentityRequirements && detailsSubmitted && chargesEnabled,
  };
}
