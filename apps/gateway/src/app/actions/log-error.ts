'use server'

import { logServerError } from '@src/lib/server-error-logger'

interface ClientErrorInput {
  errorName: string
  errorMessage: string
  errorDigest?: string
  route: string
  userAgent?: string
}

export async function logClientError(input: ClientErrorInput): Promise<void> {
  const error = new Error(input.errorMessage)
  error.name = input.errorName

  await logServerError(error, {
    route: input.route,
    method: 'GET', // Client errors typically from page renders
    userAgent: input.userAgent,
    additionalContext: {
      source: 'global-error.tsx',
      errorDigest: input.errorDigest
    }
  })
}
