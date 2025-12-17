/* eslint-disable no-console */

// Note: This is a server-side utility module, NOT a Server Actions file.

import { NextRequest, NextResponse } from 'next/server'
import {
  logServerError,
  extractRequestContext,
  extractDistinctIdFromCookies,
  type ErrorContext
} from './server-error-logger'

export type ApiRouteHandler = (
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>

export interface WithErrorLoggingOptions {
  // Optional function to extract userId from request
  getUserId?: (request: NextRequest) => Promise<string | undefined>
  // Additional context to include in logs
  additionalContext?: Record<string, unknown>
}

/**
 * Wraps an API route handler with automatic error logging
 */
export function withErrorLogging(
  handler: ApiRouteHandler,
  options: WithErrorLoggingOptions = {}
): ApiRouteHandler {
  return async (request: NextRequest, routeContext) => {
    const startTime = Date.now()

    try {
      const response = await handler(request, routeContext)

      // Log slow requests (> 5 seconds) as warnings
      const duration = Date.now() - startTime
      if (duration > 5000) {
        console.warn(`Slow API request: ${request.url} took ${duration}ms`)
      }

      return response
    } catch (error) {
      // Build error context
      const baseContext = extractRequestContext(
        request,
        options.additionalContext
      )
      const distinctId = extractDistinctIdFromCookies(
        request.headers.get('cookie')
      )

      let userId: string | undefined
      if (options.getUserId) {
        try {
          userId = await options.getUserId(request)
        } catch {
          // Ignore errors extracting userId
        }
      }

      const errorContext: ErrorContext = {
        route: baseContext.route || request.url,
        method: baseContext.method || 'GET',
        userId,
        distinctId,
        userAgent: baseContext.userAgent,
        ip: baseContext.ip,
        additionalContext: {
          ...baseContext.additionalContext,
          routeParams: routeContext?.params
            ? await routeContext.params
            : undefined,
          duration: Date.now() - startTime
        }
      }

      // Log the error
      const requestId = await logServerError(error, errorContext)

      // Return appropriate error response
      const statusCode = getStatusCode(error)
      const message =
        error instanceof Error ? error.message : 'Internal server error'

      return NextResponse.json(
        {
          error: message,
          requestId // Include for debugging reference
        },
        { status: statusCode }
      )
    }
  }
}

function getStatusCode(error: unknown): number {
  if (!(error instanceof Error)) return 500

  const message = error.message.toLowerCase()

  if (message.includes('not found')) return 404
  if (
    message.includes('unauthorized') ||
    message.includes('unauthenticated')
  ) {
    return 401
  }
  if (message.includes('forbidden') || message.includes('permission')) return 403
  if (message.includes('invalid') || message.includes('validation')) return 400

  return 500
}

/**
 * Manual error logging for more control in existing routes
 */
export async function logApiError(
  error: Error | unknown,
  request: NextRequest,
  additionalContext?: Record<string, unknown>
): Promise<string> {
  const baseContext = extractRequestContext(request, additionalContext)
  const distinctId = extractDistinctIdFromCookies(
    request.headers.get('cookie')
  )

  const errorContext: ErrorContext = {
    route: baseContext.route || request.url,
    method: baseContext.method || 'GET',
    distinctId,
    userAgent: baseContext.userAgent,
    ip: baseContext.ip,
    additionalContext: baseContext.additionalContext
  }

  return logServerError(error, errorContext)
}
