/* eslint-disable camelcase, no-console */

// Note: This is a server-side utility module, NOT a Server Actions file.
// Do not add 'use server' directive here - it would require all exports to be async.

import {
  CloudWatchLogsClient,
  PutLogEventsCommand,
  CreateLogStreamCommand
} from '@aws-sdk/client-cloudwatch-logs'
import { getPostHogServer } from '@src/app/posthog-server'
import { v4 as uuidv4 } from 'uuid'

// ============================================================================
// TYPES
// ============================================================================

export interface ErrorContext {
  route: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  userId?: string
  distinctId?: string // PostHog distinct ID
  requestId?: string
  userAgent?: string
  ip?: string
  additionalContext?: Record<string, unknown>
}

export interface SanitizedError {
  name: string
  message: string
  stack?: string
  code?: string | number
  type: ErrorType
}

export type ErrorType =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'STRIPE_ERROR'
  | 'DATABASE_ERROR'
  | 'EXTERNAL_SERVICE_ERROR'
  | 'INTERNAL_ERROR'
  | 'UNKNOWN_ERROR'

export interface StructuredLogEntry {
  timestamp: string
  requestId: string
  level: 'error' | 'warn' | 'info'
  error: SanitizedError
  context: ErrorContext
  environment: string
  appVersion: string
}

// ============================================================================
// PII SANITIZATION
// ============================================================================

const EMAIL_REGEX = /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (!domain) return '***@***'
  const maskedLocal =
    localPart.length > 2 ? `${localPart.substring(0, 2)}***` : '***'
  return `${maskedLocal}@${domain}`
}

export function sanitizeValue(value: unknown, key?: string): unknown {
  if (value === null || value === undefined) return value

  // Sensitive field names to fully redact
  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'apikey',
    'api_key',
    'authorization',
    'accesstoken',
    'access_token',
    'refreshtoken',
    'refresh_token',
    'idtoken',
    'id_token',
    'cardnumber',
    'card_number',
    'cvv',
    'cvc'
  ]

  const keyLower = key?.toLowerCase() || ''
  if (sensitiveKeys.some((k) => keyLower.includes(k))) {
    return '[REDACTED]'
  }

  if (typeof value === 'string') {
    // Mask emails in strings
    let sanitized = value.replace(EMAIL_REGEX, (match) => maskEmail(match))
    // Truncate very long strings
    if (sanitized.length > 500) {
      sanitized = `${sanitized.substring(0, 500)}...[TRUNCATED]`
    }
    return sanitized
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => sanitizeValue(item, `${key}[${index}]`))
  }

  if (typeof value === 'object') {
    const sanitized: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      sanitized[k] = sanitizeValue(v, k)
    }
    return sanitized
  }

  return value
}

export function sanitizeError(error: Error): SanitizedError {
  return {
    name: error.name,
    message: sanitizeValue(error.message) as string,
    stack:
      process.env.NODE_ENV === 'development' ? error.stack : undefined, // Don't send stack traces to prod logs
    code: (error as unknown as { code?: string | number }).code,
    type: classifyError(error)
  }
}

// ============================================================================
// ERROR CLASSIFICATION
// ============================================================================

export function classifyError(error: Error | unknown): ErrorType {
  if (!(error instanceof Error)) return 'UNKNOWN_ERROR'

  const message = error.message.toLowerCase()
  const name = error.name.toLowerCase()

  // Stripe errors
  if (name.includes('stripe') || message.includes('stripe')) {
    return 'STRIPE_ERROR'
  }

  // Validation errors
  if (
    name.includes('validation') ||
    name.includes('zod') ||
    message.includes('invalid') ||
    message.includes('required')
  ) {
    return 'VALIDATION_ERROR'
  }

  // Auth errors
  if (
    name.includes('auth') ||
    message.includes('unauthorized') ||
    message.includes('unauthenticated') ||
    message.includes('token')
  ) {
    return 'AUTHENTICATION_ERROR'
  }

  // Not found
  if (message.includes('not found') || message.includes('404')) {
    return 'NOT_FOUND_ERROR'
  }

  // Database errors
  if (
    message.includes('database') ||
    message.includes('dynamodb') ||
    message.includes('amplify') ||
    message.includes('graphql')
  ) {
    return 'DATABASE_ERROR'
  }

  return 'INTERNAL_ERROR'
}

// ============================================================================
// CLOUDWATCH CLIENT
// ============================================================================

let cloudWatchClient: CloudWatchLogsClient | null = null
let currentLogStreamName: string | null = null

function getCloudWatchClient(): CloudWatchLogsClient {
  if (!cloudWatchClient) {
    cloudWatchClient = new CloudWatchLogsClient({
      region: process.env.AWS_REGION || 'eu-west-3'
    })
  }
  return cloudWatchClient
}

const LOG_GROUP_NAME =
  process.env.CLOUDWATCH_LOG_GROUP || '/apelasource/gateway/errors'

async function ensureLogStream(): Promise<string> {
  if (currentLogStreamName) return currentLogStreamName

  const client = getCloudWatchClient()
  const date = new Date().toISOString().split('T')[0]
  const streamName = `${date}-${process.env.AWS_LAMBDA_FUNCTION_NAME || 'server'}-${uuidv4().substring(0, 8)}`

  try {
    await client.send(
      new CreateLogStreamCommand({
        logGroupName: LOG_GROUP_NAME,
        logStreamName: streamName
      })
    )
  } catch (error: unknown) {
    // Stream might already exist - that's OK
    if (
      error instanceof Error &&
      error.name !== 'ResourceAlreadyExistsException'
    ) {
      console.error('Failed to create CloudWatch log stream:', error)
    }
  }

  currentLogStreamName = streamName
  return streamName
}

// ============================================================================
// MAIN LOGGING FUNCTIONS
// ============================================================================

export async function logServerError(
  error: Error | unknown,
  context: ErrorContext
): Promise<string> {
  const requestId = context.requestId || uuidv4()
  const timestamp = new Date().toISOString()

  const sanitizedError =
    error instanceof Error
      ? sanitizeError(error)
      : {
          name: 'UnknownError',
          message: String(error),
          type: 'UNKNOWN_ERROR' as ErrorType
        }

  const sanitizedContext = sanitizeValue(context) as ErrorContext

  const logEntry: StructuredLogEntry = {
    timestamp,
    requestId,
    level: 'error',
    error: sanitizedError,
    context: sanitizedContext,
    environment: process.env.NODE_ENV || 'development',
    appVersion: process.env.npm_package_version || '0.0.0'
  }

  // Send to both PostHog and CloudWatch in parallel
  await Promise.allSettled([
    sendToPostHog(logEntry, error, context),
    sendToCloudWatch(logEntry)
  ])

  return requestId
}

async function sendToPostHog(
  logEntry: StructuredLogEntry,
  originalError: Error | unknown,
  context: ErrorContext
): Promise<void> {
  try {
    const posthog = await getPostHogServer()
    if (!posthog) return // posthog-node unavailable; CloudWatch still runs in parallel

    // Use captureException for error tracking
    await posthog.captureException(
      originalError instanceof Error
        ? originalError
        : new Error(String(originalError)),
      context.distinctId || context.userId || 'anonymous',
      {
        $set: {
          last_error_route: context.route,
          last_error_type: logEntry.error.type
        }
      }
    )

    // Also capture as structured event for dashboards
    posthog.capture({
      distinctId: context.distinctId || context.userId || 'anonymous',
      event: 'server_error',
      properties: {
        error_type: logEntry.error.type,
        error_name: logEntry.error.name,
        error_message: logEntry.error.message,
        route: context.route,
        method: context.method,
        request_id: logEntry.requestId,
        environment: logEntry.environment,
        timestamp: logEntry.timestamp
      }
    })

    await posthog.flush()
  } catch (postHogError) {
    console.error('Failed to send error to PostHog:', postHogError)
  }
}

async function sendToCloudWatch(logEntry: StructuredLogEntry): Promise<void> {
  try {
    const client = getCloudWatchClient()
    const streamName = await ensureLogStream()

    await client.send(
      new PutLogEventsCommand({
        logGroupName: LOG_GROUP_NAME,
        logStreamName: streamName,
        logEvents: [
          {
            timestamp: Date.now(),
            message: JSON.stringify(logEntry, null, 2)
          }
        ]
      })
    )
  } catch (cloudWatchError) {
    console.error('Failed to send error to CloudWatch:', cloudWatchError)
    // Fall back to structured console.log (Amplify will capture this)
    console.error(JSON.stringify(logEntry))
  }
}

// ============================================================================
// UTILITY: EXTRACT CONTEXT FROM REQUEST
// ============================================================================

export function extractRequestContext(
  request: Request,
  additionalContext?: Record<string, unknown>
): Partial<ErrorContext> {
  const url = new URL(request.url)

  return {
    route: url.pathname,
    method: request.method as ErrorContext['method'],
    userAgent: request.headers.get('user-agent') || undefined,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0] || undefined,
    additionalContext
  }
}

export function extractDistinctIdFromCookies(
  cookieHeader: string | null
): string | undefined {
  if (!cookieHeader) return undefined

  const postHogCookieMatch = cookieHeader.match(/ph_phc_.*?_posthog=([^;]+)/)
  if (postHogCookieMatch && postHogCookieMatch[1]) {
    try {
      const decodedCookie = decodeURIComponent(postHogCookieMatch[1])
      const postHogData = JSON.parse(decodedCookie)
      return postHogData.distinct_id
    } catch {
      return undefined
    }
  }
  return undefined
}
