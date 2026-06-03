import { describe, expect, it } from 'vitest';
import { getStepStatus } from './getStepStatus';

describe('getStepStatus — identity gating on chargesEnabled', () => {
  it('with no requirements and detailsSubmitted but chargesEnabled=false → identity is NOT complete', () => {
    const status = getStepStatus([], [], true, false);

    expect(status.personalInfoComplete).toBe(true);
    expect(status.bankingInfoComplete).toBe(true);
    expect(status.identityComplete).toBe(false);
  });

  it('with no requirements, detailsSubmitted and chargesEnabled=true → identity IS complete', () => {
    const status = getStepStatus([], [], true, true);

    expect(status.personalInfoComplete).toBe(true);
    expect(status.bankingInfoComplete).toBe(true);
    expect(status.identityComplete).toBe(true);
  });

  it('with an identity requirement still in currentlyDue, chargesEnabled=false → identity is NOT complete', () => {
    const status = getStepStatus(
      ['individual.verification.document'],
      [],
      false,
      false,
    );

    expect(status.identityComplete).toBe(false);
  });

  it('with email + external_account still in currentlyDue → personal & banking are NOT complete', () => {
    const status = getStepStatus(
      ['individual.email', 'external_account'],
      [],
      false,
      false,
    );

    expect(status.personalInfoComplete).toBe(false);
    expect(status.bankingInfoComplete).toBe(false);
    expect(status.identityComplete).toBe(false);
  });

  it('with identity in eventuallyDue and details submitted + chargesEnabled true → identity is NOT complete (Stripe still wants the doc)', () => {
    const status = getStepStatus(
      [],
      ['individual.verification.document'],
      true,
      true,
    );

    expect(status.identityComplete).toBe(false);
  });

  it('tolerates null entries in the arrays without crashing', () => {
    const status = getStepStatus(
      ['individual.email', null],
      [null],
      false,
      false,
    );

    expect(status.personalInfoComplete).toBe(false);
  });
});
