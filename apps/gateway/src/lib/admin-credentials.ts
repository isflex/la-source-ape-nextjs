/**
 * Admin Credential Management
 * Manages server-side admin credentials based on client-side authentication status
 */

import { debug } from '@flexiness/domain-utils';
import { AuthGetCurrentUserServer, isAuthenticated } from '@src/utils/amplify/server/app.router'
import { AdminAuthResult } from './server-admin-auth'

export interface AdminCredentials {
  accessToken: string
  idToken: string
  refreshToken: string
  expiresAt: string
}

/**
 * Checks if the client is authenticated as admin using existing Amplify server utilities
 */
export async function isClientAdminAuthenticated(): Promise<boolean> {
  try {
    // Use existing authentication check
    const authenticated = await isAuthenticated()

    if (!authenticated) {
      return false
    }

    // Get current user and verify it's the admin
    const currentUser = await AuthGetCurrentUserServer()

    if (!currentUser) {
      return false
    }

    // Verify this is the admin user
    const adminEmail = process.env.FLEX_ADMIN_USERNAME
    if (currentUser.signInDetails?.loginId === adminEmail || currentUser.userId === adminEmail) {
      return true
    }

    return false
  } catch (error) {
    debug.admin('Client admin authentication check failed:', error)
    return false
  }
}

/**
 * Returns admin credentials only if client is properly authenticated
 * Returns null if client is not authenticated as admin
 */
export async function getAdminCredentials(
  serverAuthResult: AdminAuthResult
): Promise<AdminCredentials | null> {
  // First check if server authentication was successful
  if (!serverAuthResult.success || !serverAuthResult.tokens) {
    return null
  }

  // Check if client is authenticated as admin
  if (!(await isClientAdminAuthenticated())) {
    debug.admin('🚫 Client not authenticated as admin - withholding server credentials')
    return null
  }

  // Client is authenticated, provide server credentials
  debug.admin('✅ Client authenticated as admin - providing server credentials')
  return {
    accessToken: serverAuthResult.tokens.accessToken,
    idToken: serverAuthResult.tokens.idToken,
    refreshToken: serverAuthResult.tokens.refreshToken,
    expiresAt: serverAuthResult.tokens.expiresAt
  }
}

/**
 * Revokes admin credentials using Amplify signOut
 */
export async function revokeAdminCredentials(): Promise<void> {
  try {
    const { signOut } = await import('aws-amplify/auth')

    await signOut()

    debug.admin('🔄 Admin credentials revoked via Amplify signOut')
  } catch (error) {
    debug.error('Failed to revoke admin credentials:', error)
  }
}

/**
 * Checks if admin credentials are expired using existing Amplify utilities
 */
export async function areCredentialsExpired(): Promise<boolean> {
  try {
    // If user is still authenticated, tokens are valid
    return !(await isAuthenticated())
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return true
  }
}

/**
 * Gets admin credentials for S3 operations using Amplify session
 */
export async function getS3AdminCredentials(
  serverAuthResult: AdminAuthResult
): Promise<{ idToken: string; accessToken: string } | null> {
  const credentials = await getAdminCredentials(serverAuthResult)

  if (!credentials) {
    return null
  }

  // For S3 operations, we need both ID and access tokens
  return {
    idToken: credentials.idToken,
    accessToken: credentials.accessToken
  }
}
