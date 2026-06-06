import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import robots from './robots';
import { PROD_AWS_APP_ID, PROD_SANDBOX_AWS_APP_ID } from '@src/lib/deployment';

const ENV_KEYS = ['NEXT_PUBLIC_AWS_APP_ID', 'NEXT_PUBLIC_FLEX_GATEWAY_BASE_URL'] as const;

describe('robots', () => {
  const snapshot: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

  beforeEach(() => {
    for (const k of ENV_KEYS) {
      snapshot[k] = process.env[k];
      delete process.env[k];
    }
    process.env.NEXT_PUBLIC_FLEX_GATEWAY_BASE_URL = 'https://apelasource.org';
  });

  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (snapshot[k] === undefined) {
        delete process.env[k];
      } else {
        process.env[k] = snapshot[k];
      }
    }
  });

  it('disallows all crawling on the production-sandbox deployment', () => {
    process.env.NEXT_PUBLIC_AWS_APP_ID = PROD_SANDBOX_AWS_APP_ID;

    const result = robots();

    expect(result.rules).toEqual([{ userAgent: '*', disallow: '/' }]);
    expect(result.sitemap).toBeUndefined();
  });

  it('allows crawling and advertises the sitemap on production', () => {
    process.env.NEXT_PUBLIC_AWS_APP_ID = PROD_AWS_APP_ID;

    const result = robots();

    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(rules[0]).toMatchObject({ userAgent: '*', allow: '/' });
    expect(rules[0]?.disallow).toContain('/api/');
    expect(result.sitemap).toBe('https://apelasource.org/sitemap.xml');
  });
});
