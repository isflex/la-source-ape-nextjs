/**
 * Server-Side Admin Authentication
 * Clean implementation using AdminInitiateAuthCommand for server-side admin authentication
 */

import { debug } from '@flexiness/domain-utils';
import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
  // UpdateUserPoolClientCommand,
  AuthFlowType
} from '@aws-sdk/client-cognito-identity-provider'
import { getAuthConfig } from '@src/utils/amplify/configureAmplifyWithPortDetection'

export interface AdminAuthResult {
  success: boolean
  message: string
  tokens?: {
    accessToken: string
    idToken: string
    refreshToken: string
    expiresIn: number
    expiresAt: string
  }
  userPoolId?: string
}

/**
 * Authenticates admin user using AdminInitiateAuthCommand
 * Clean server-side authentication with admin permissions
 */
export async function authenticateAdminUser(): Promise<AdminAuthResult> {
  try {
    // Use outputs from centralized configuration
    const authConfig = getAuthConfig();
    const userPoolId = authConfig?.user_pool_id
    const clientId = authConfig?.user_pool_client_id

    if (!userPoolId || !clientId) {
      return {
        success: false,
        message: 'Cognito configuration not found in amplify_outputs.json'
      }
    }

    // Get admin credentials from environment (decrypted by dotenvx)
    const adminEmail = process.env.FLEX_ADMIN_USERNAME
    const adminPassword = process.env.FLEX_ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      return {
        success: false,
        message: 'Admin credentials not found in environment variables'
      }
    }

    debug.admin('🔐 Attempting server-side admin authentication for:', adminEmail)

    // Create Cognito client
    // const region = outputs?.auth?.aws_region || 'eu-west-3'
    const cognitoClient = new CognitoIdentityProviderClient({})

    // // Try to enable required auth flows first (this is idempotent)
    // const authFlowsEnabled = await enableAuthFlows(cognitoClient, userPoolId, clientId, region)

    // if (authFlowsEnabled) {
    //   debug.admin('✅ Auth flows enabled, proceeding with authentication...')
    // } else {
    //   debug.admin('⚠️  Failed to enable auth flows, trying with existing configuration...')
    // }

    // Use AdminInitiateAuthCommand with ADMIN_USER_PASSWORD_AUTH
    const adminAuthCommand = new AdminInitiateAuthCommand({
      AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
      UserPoolId: userPoolId,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: adminEmail,
        PASSWORD: adminPassword
      }
    })

    const authResponse = await cognitoClient.send(adminAuthCommand)

    if (!authResponse.AuthenticationResult) {
      return {
        success: false,
        message: 'Authentication failed - no result from Cognito'
      }
    }

    const { AccessToken, IdToken, RefreshToken, ExpiresIn } = authResponse.AuthenticationResult

    if (!AccessToken || !IdToken) {
      return {
        success: false,
        message: 'Authentication failed - missing tokens'
      }
    }

    debug.admin('✅ Server-side admin authentication successful')

    return {
      success: true,
      message: `Admin authenticated: ${adminEmail}`,
      tokens: {
        accessToken: AccessToken,
        idToken: IdToken,
        refreshToken: RefreshToken || '',
        expiresIn: ExpiresIn || 3600,
        expiresAt: new Date(Date.now() + ((ExpiresIn || 3600) * 1000)).toISOString()
      },
      userPoolId
    }

  } catch (error: any) {
    debug.error('❌ Server-side admin authentication failed:', error)
    return {
      success: false,
      message: `Authentication error: ${error.name || 'Unknown error'}`
    }
  }
}

/**
 * Get admin authentication status for development display
 */
export async function getAdminAuthStatus(): Promise<{
  isConfigured: boolean
  userPoolId?: string
  adminEmail?: string
  message: string
}> {
  try {
    // Use outputs from centralized configuration
    const authConfig = getAuthConfig();
    const userPoolId = authConfig?.user_pool_id
    const adminEmail = process.env.FLEX_ADMIN_USERNAME

    if (!userPoolId) {
      return {
        isConfigured: false,
        message: 'User Pool ID not found in amplify_outputs.json'
      }
    }

    if (!adminEmail) {
      return {
        isConfigured: false,
        userPoolId,
        message: 'Admin email not found in environment variables'
      }
    }

    return {
      isConfigured: true,
      userPoolId,
      adminEmail,
      message: 'Admin authentication configured'
    }

  } catch (error) {
    return {
      isConfigured: false,
      message: `Configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}
