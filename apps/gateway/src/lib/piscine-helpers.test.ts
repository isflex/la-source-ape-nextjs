import { describe, expect, it } from 'vitest';
import { getCandidatQueryOptions, CANDIDAT_COUNT_SELECTION_SET, buildCandidatEditors } from './piscine-helpers';

describe('getCandidatQueryOptions', () => {
  describe('authenticated session', () => {
    it('queries with userPool auth mode and no restricted selection set (full PII access)', () => {
      const options = getCandidatQueryOptions(true);

      expect(options.authMode).toBe('userPool');
      expect(options.selectionSet).toBeUndefined();
    });
  });

  describe('unauthenticated (guest) session', () => {
    it('queries with apiKey auth mode and a PII-free selection set (counts only)', () => {
      const options = getCandidatQueryOptions(false);

      expect(options.authMode).toBe('apiKey');
      expect(options.selectionSet).toEqual(CANDIDAT_COUNT_SELECTION_SET);
    });

    it('never requests any PII field for guests', () => {
      const options = getCandidatQueryOptions(false);
      const piiFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'nameOfChild'];

      for (const field of piiFields) {
        expect(options.selectionSet).not.toContain(field);
      }
    });
  });
});

describe('buildCandidatEditors', () => {
  it('includes both the participant and the planning creator when they differ', () => {
    expect(buildCandidatEditors('participant-1', 'creator-9')).toEqual(['participant-1', 'creator-9']);
  });

  it('de-duplicates when the creator enrols themselves (participant === creator)', () => {
    expect(buildCandidatEditors('creator-9', 'creator-9')).toEqual(['creator-9']);
  });

  it('filters out missing ids (null / undefined / empty)', () => {
    expect(buildCandidatEditors('participant-1', null)).toEqual(['participant-1']);
    expect(buildCandidatEditors(null, 'creator-9')).toEqual(['creator-9']);
    expect(buildCandidatEditors(undefined, undefined)).toEqual([]);
    expect(buildCandidatEditors('', 'creator-9')).toEqual(['creator-9']);
  });
});
