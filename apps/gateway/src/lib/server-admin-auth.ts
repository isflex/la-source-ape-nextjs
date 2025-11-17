/**
 * Server-Side Admin Authentication
 * Clean implementation using AdminInitiateAuthCommand for server-side admin authentication
 */

import { CognitoIdentityProviderClient, AdminInitiateAuthCommand, UpdateUserPoolClientCommand, AuthFlowType } from '@aws-sdk/client-cognito-identity-provider'
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
 * Updates User Pool client to enable required authentication flows
 * This enables ALLOW_USER_PASSWORD_AUTH and other necessary flows
 */
async function enableAuthFlows(cognitoClient: CognitoIdentityProviderClient, userPoolId: string, clientId: string, region: string): Promise<boolean> {
  try {
    console.log('🔧 Updating User Pool client to enable authentication flows...')

    const updateCommand = new UpdateUserPoolClientCommand({
      UserPoolId: userPoolId,
      ClientId: clientId,
      ExplicitAuthFlows: [
        'ALLOW_USER_SRP_AUTH',
        'ALLOW_USER_PASSWORD_AUTH',
        'ALLOW_ADMIN_USER_PASSWORD_AUTH',
        'ALLOW_REFRESH_TOKEN_AUTH'
      ]
    })

    await cognitoClient.send(updateCommand)
    console.log('✅ User Pool client auth flows updated successfully')
    return true

  } catch (error: any) {
    console.warn('⚠️  Failed to update User Pool client auth flows:', error.name, error.message)
    console.warn(`⚠️  User Pool ID: ${userPoolId}`)
    console.warn(`⚠️  Client ID: ${clientId}`)
    console.warn(`⚠️  Region: ${region}`)
    if (error.name === 'ResourceNotFoundException') {
      console.warn(`⚠️  User Pool client ${clientId} not found in User Pool ${userPoolId}`)
      console.warn('⚠️  This may be a permissions issue or the client ID may be incorrect')
      console.warn('⚠️  Check if AWS credentials have cognito-idp:UpdateUserPoolClient permission')
    }
    return false
  }
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

    console.log('🔐 Attempting server-side admin authentication for:', adminEmail)

    // Create Cognito client
    // const region = outputs?.auth?.aws_region || 'eu-west-3'
    const cognitoClient = new CognitoIdentityProviderClient({})

    // // Try to enable required auth flows first (this is idempotent)
    // const authFlowsEnabled = await enableAuthFlows(cognitoClient, userPoolId, clientId, region)

    // if (authFlowsEnabled) {
    //   console.log('✅ Auth flows enabled, proceeding with authentication...')
    // } else {
    //   console.log('⚠️  Failed to enable auth flows, trying with existing configuration...')
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

    console.log('✅ Server-side admin authentication successful')

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
    console.error('❌ Server-side admin authentication failed:', error)
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
