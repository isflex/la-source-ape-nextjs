import { describe, expect, it } from 'vitest';
import { getStepStatus } from './getStepStatus';

describe('getStepStatus', () => {
  describe('!detailsSubmitted gate', () => {
    it('returns all false when no requirements arrived from Stripe yet (default DB state right after account creation)', () => {
      const status = getStepStatus([], [], false);

      expect(status.personalInfoComplete).toBe(false);
      expect(status.bankingInfoComplete).toBe(false);
      expect(status.identityComplete).toBe(false);
    });

    it('returns all false when the user opened Stripe onboarding and returned without saving — currentlyDue is populated but nothing has been submitted', () => {
      const status = getStepStatus(
        ['individual.first_name', 'individual.last_name', 'individual.address.line1', 'external_account'],
        [],
        false,
      );

      expect(status.personalInfoComplete).toBe(false);
      expect(status.bankingInfoComplete).toBe(false);
      expect(status.identityComplete).toBe(false);
    });
  });

  describe('post-detailsSubmitted', () => {
    it('returns all true when Stripe has nothing left to ask — user is in "En attente de vérification"', () => {
      const status = getStepStatus([], [], true);

      expect(status.personalInfoComplete).toBe(true);
      expect(status.bankingInfoComplete).toBe(true);
      expect(status.identityComplete).toBe(true);
    });

    it('keeps identity ✗ while Stripe still wants a verification document', () => {
      const status = getStepStatus(['individual.verification.document'], [], true);

      expect(status.personalInfoComplete).toBe(true);
      expect(status.bankingInfoComplete).toBe(true);
      expect(status.identityComplete).toBe(false);
    });

    it('keeps banking ✗ while external_account is still requested — identity also stays ✗ while anything is in currentlyDue', () => {
      const status = getStepStatus(['external_account'], [], true);

      expect(status.personalInfoComplete).toBe(true);
      expect(status.bankingInfoComplete).toBe(false);
      expect(status.identityComplete).toBe(false);
    });

    it('catches a leftover personal field (not just individual.email) since email is pre-filled by our route — identity also stays ✗', () => {
      const status = getStepStatus(['individual.address.line1'], [], true);

      expect(status.personalInfoComplete).toBe(false);
      expect(status.bankingInfoComplete).toBe(true);
      expect(status.identityComplete).toBe(false);
    });

    it('production-reported bug: after Stripe stage 1 only, currentlyDue has a personal field but no verification.document — step 3 must still be "3"', () => {
      // acct_1TeUKKDhDNZCk4lz screenshot 2026-06-04: user submitted stage 1, Stripe holds the
      // account at "EN ATTENTE DE VÉRIFICATION" but does not yet list the identity document
      // explicitly. Step 3 cannot be ✓ until everything in currentlyDue clears.
      const status = getStepStatus(['individual.first_name'], [], true);

      expect(status.personalInfoComplete).toBe(false);
      expect(status.bankingInfoComplete).toBe(true);
      expect(status.identityComplete).toBe(false);
    });

    it('treats identity in eventuallyDue as still pending (Stripe will lazily ask later)', () => {
      const status = getStepStatus([], ['individual.verification.document'], true);

      expect(status.identityComplete).toBe(false);
    });

    it('treats tos_acceptance leftover as a personal-info gap — identity also stays ✗', () => {
      const status = getStepStatus(['tos_acceptance.date'], [], true);

      expect(status.personalInfoComplete).toBe(false);
      expect(status.bankingInfoComplete).toBe(true);
      expect(status.identityComplete).toBe(false);
    });

    it('does NOT misclassify verification.document under individual.* as a personal-info gap', () => {
      const status = getStepStatus(['individual.verification.document'], [], true);

      expect(status.personalInfoComplete).toBe(true);
      expect(status.identityComplete).toBe(false);
    });
  });

  it('tolerates null entries in the input arrays', () => {
    const status = getStepStatus(['individual.address.line1', null], [null], true);

    expect(status.personalInfoComplete).toBe(false);
  });
});
