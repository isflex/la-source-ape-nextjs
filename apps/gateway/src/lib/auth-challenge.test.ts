import { describe, expect, it } from 'vitest';
import { isChallengeAnswerCorrect, readChallengePassed } from './auth-challenge';

describe('isChallengeAnswerCorrect', () => {
  it('returns true for an exact match', () => {
    expect(isChallengeAnswerCorrect('tournesol', 'tournesol')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isChallengeAnswerCorrect('TourneSol', 'tournesol')).toBe(true);
    expect(isChallengeAnswerCorrect('tournesol', 'TOURNESOL')).toBe(true);
  });

  it('ignores leading/trailing whitespace and collapses internal whitespace', () => {
    expect(isChallengeAnswerCorrect('  tournesol  ', 'tournesol')).toBe(true);
    expect(isChallengeAnswerCorrect('la  source', 'la source')).toBe(true);
    expect(isChallengeAnswerCorrect('la\tsource', 'la source')).toBe(true);
  });

  it('treats NFKC-equivalent strings as equal', () => {
    // U+FF54 FULLWIDTH LATIN SMALL LETTER T normalizes to 't' under NFKC
    expect(isChallengeAnswerCorrect('ｔournesol', 'tournesol')).toBe(true);
  });

  it('returns false for a wrong answer', () => {
    expect(isChallengeAnswerCorrect('marguerite', 'tournesol')).toBe(false);
  });

  it('returns false for empty or missing answer', () => {
    expect(isChallengeAnswerCorrect('', 'tournesol')).toBe(false);
    expect(isChallengeAnswerCorrect('   ', 'tournesol')).toBe(false);
    expect(isChallengeAnswerCorrect(undefined, 'tournesol')).toBe(false);
    expect(isChallengeAnswerCorrect(null, 'tournesol')).toBe(false);
  });

  it('returns false for empty or missing expected answer', () => {
    expect(isChallengeAnswerCorrect('tournesol', '')).toBe(false);
    expect(isChallengeAnswerCorrect('tournesol', undefined)).toBe(false);
    expect(isChallengeAnswerCorrect('tournesol', null)).toBe(false);
    expect(isChallengeAnswerCorrect('', '')).toBe(false);
  });
});

describe('readChallengePassed', () => {
  it('returns true when the challenge_passed claim is "true"', () => {
    const session = { tokens: { idToken: { payload: { 'challenge_passed': 'true' } } } };
    expect(readChallengePassed(session)).toBe(true);
  });

  it('returns false when the claim is "false"', () => {
    const session = { tokens: { idToken: { payload: { 'challenge_passed': 'false' } } } };
    expect(readChallengePassed(session)).toBe(false);
  });

  it('returns false when the claim is absent', () => {
    expect(readChallengePassed({ tokens: { idToken: { payload: {} } } })).toBe(false);
  });

  it('returns false when tokens are missing', () => {
    expect(readChallengePassed({})).toBe(false);
    expect(readChallengePassed({ tokens: undefined })).toBe(false);
    expect(readChallengePassed(undefined)).toBe(false);
    expect(readChallengePassed(null)).toBe(false);
  });

  it('returns false for non-string claim values', () => {
    const session = { tokens: { idToken: { payload: { 'challenge_passed': true } } } };
    expect(readChallengePassed(session)).toBe(false);
  });
});
