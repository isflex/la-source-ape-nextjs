import { NextRequest, NextResponse } from 'next/server'
import outputs from '@root/amplify_outputs.json'

/**
 * POST /api/admin/login
 * Authenticate with Cognito and return JWT tokens
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      )
    }

    console.log('🔐 Attempting Cognito authentication for:', username)

    // Dynamic import to avoid compilation blocking
    const { CognitoIdentityProviderClient, InitiateAuthCommand } = await import('@aws-sdk/client-cognito-identity-provider')

    // Create Cognito client
    const cognitoClient = new CognitoIdentityProviderClient({
      region: outputs?.auth?.aws_region || 'eu-west-3'
    })

    // Use USER_PASSWORD_AUTH (enabled by default with defineAuth)
    const authCommand = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: outputs?.auth?.user_pool_client_id || '',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    })

    const authResponse = await cognitoClient.send(authCommand)

    if (!authResponse.AuthenticationResult) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    const { AccessToken, IdToken, RefreshToken, ExpiresIn } = authResponse.AuthenticationResult

    console.log('✅ Cognito authentication successful')

    return NextResponse.json({
      success: true,
      accessToken: AccessToken,
      idToken: IdToken,
      refreshToken: RefreshToken,
      expiresIn: ExpiresIn,
      expiresAt: new Date(Date.now() + (ExpiresIn! * 1000)).toISOString()
    })

  } catch (error: any) {
    console.error('❌ Cognito authentication failed:', error)
    return NextResponse.json(
      { error: 'Authentication failed', details: error.name || 'Unknown error' },
      { status: 401 }
    )
  }
}

/**
 * GET /api/admin/login
 * Verify Cognito token status
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const idToken = authHeader.substring(7)

    // Verify the Cognito JWT token
    const { CognitoJwtVerifier } = await import('aws-jwt-verify')

    const verifier = CognitoJwtVerifier.create({
      userPoolId: outputs?.auth?.user_pool_id || '',
      tokenUse: 'id',
      clientId: outputs?.auth?.user_pool_client_id || ''
    })

    const payload = await verifier.verify(idToken)

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: payload.sub,
        email: payload.email
      }
    })

  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
