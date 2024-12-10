import Express from 'express'
import contentSecurityPolicy from 'helmet-csp'
import { whiteList } from './csp-whitelist.js'
import psl, { ParsedDomain } from 'psl'
const parsedDomain = (psl.parse(`${process.env.FLEX_DOMAIN_NAME}`) as ParsedDomain)?.domain ?? process.env.FLEX_DOMAIN_NAME
const whiteListFlexDomain = `${process.env.FLEX_MODE === 'production' ? `*.${parsedDomain}:*` : 'localhost:*'}`

const getContentSecurityPolicy = (req: Express.Request, res: Express.Response, next: Express.NextFunction, cspNonce: string) => {
  try {
    return contentSecurityPolicy({
      directives: {
        'default-src': ["'self'", `${whiteListFlexDomain}`, '127.0.0.1:*'],
        'base-uri': ["'self'", `${whiteListFlexDomain}`, '127.0.0.1:*', () => `'nonce-${cspNonce}'`],
        'style-src': ["'self'", `${whiteListFlexDomain}`, '127.0.0.1:*', `${whiteList.styleSrc.join(' ')}`, () => `'nonce-${cspNonce}'`],
        'font-src': ["'self'", `${whiteListFlexDomain}`, '127.0.0.1:*', `${whiteList.fontSrc.join(' ')}`, () => `'nonce-${cspNonce}'`, 'data:'],
        'img-src': ["'self'", `${whiteListFlexDomain}`, '127.0.0.1:*', `${whiteList.imgSrc.join(' ')}`, () => `'nonce-${cspNonce}'`, 'data:'],
        // 'prefetch-src': ["'self'", `${whiteListFlexDomain}`, '127.0.0.1:*', () => `'nonce-${cspNonce}'`],
        'manifest-src': ["'self'", `${whiteListFlexDomain}`, '127.0.0.1:*', () => `'nonce-${cspNonce}'`],
        'child-src': ["'self'", `${whiteListFlexDomain}`, '127.0.0.1:*', () => `'nonce-${cspNonce}'`],
        'connect-src': [
          "'self'",
          `${whiteListFlexDomain}`,
          '127.0.0.1:*',
          `${whiteList.connectSrc.join(' ')}`,
          () => `'nonce-${cspNonce}'`,
          'data:',
          'blob:',
        ],
        // 'navigate-to': ["'self'", `${whiteListFlexDomain}`, '127.0.0.1:*', () => `'nonce-${cspNonce}'`],
        'form-action': ["'self'", `${whiteListFlexDomain}`, '127.0.0.1:*', () => `'nonce-${cspNonce}'`],
        'frame-ancestors': ["'self'", `${whiteListFlexDomain}`, '127.0.0.1:*'],
        'script-src-elem': ["'self'", `${whiteListFlexDomain}`, '127.0.0.1:*', () => `'nonce-${cspNonce}'`],
        'script-src-attr': ["'self'", `${whiteListFlexDomain}`, '127.0.0.1:*', () => `'nonce-${cspNonce}'`],
        ...(process.env.FLEX_MODE === 'development'
          ? {
              'script-src': [
                "'self'",
                `${whiteListFlexDomain}`,
                '127.0.0.1:*',
                `${whiteList.scriptSrc.join(' ')}`,
                () => `'nonce-${cspNonce}'`,
                "'strict-dynamic'",
                // 'https',
                // 'blob:',
                // "'unsafe-inline'",
                "'unsafe-eval'",
              ],
            }
          : {
              'script-src': [
                "'self'",
                `${whiteListFlexDomain}`,
                '127.0.0.1:*',
                `${whiteList.scriptSrc.join(' ')}`,
                () => `'nonce-${cspNonce}'`,
                "'strict-dynamic'",
                // 'https',
                // 'blob:',
                // "'unsafe-inline'",
                "'unsafe-eval'",
              ],
            }),
      },
      // reportOnly: true, // Set to 'true' to enable report-only mode
    })(req, res, next)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('error: ', err)
  }
}

export { getContentSecurityPolicy }
