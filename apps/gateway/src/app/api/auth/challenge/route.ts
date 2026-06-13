import { debug } from '@flexiness/domain-utils';
import { NextRequest, NextResponse } from 'next/server'
import { getAuthConfig } from '@src/utils/amplify/configureAmplifyWithPortDetection'
import { isChallengeAnswerCorrect } from '@src/lib/auth-challenge'
import { getChallengeAnswer } from '@src/lib/secrets'

/**
 * POST /api/auth/challenge
 * Verify the sign-in question answer for the authenticated caller and, on success,
 * set custom:challenge_passed='true' via AdminUpdateUserAttributes.
 * The PreTokenGeneration trigger (Gen-1 repo) turns that attribute into the
 * `challenge_passed` ID-token claim on the next token refresh.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessToken = authHeader.substring(7)

    // Verify the Cognito JWT token (access token: its `username` is valid for Admin
    // APIs, including federated users where it is `google_<sub>`)
    const { CognitoJwtVerifier } = await import('aws-jwt-verify')

    const verifier = CognitoJwtVerifier.create({
      userPoolId: getAuthConfig()?.user_pool_id || '',
      tokenUse: 'access',
      clientId: getAuthConfig()?.user_pool_client_id || ''
    })

    let username: string
    try {
      ({ username } = await verifier.verify(accessToken))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let expected: string | undefined
    try {
      expected = await getChallengeAnswer()
    } catch (error) {
      debug.error('❌ Failed to load challenge answer:', error)
    }
    if (!expected) {
      debug.error('❌ FLEX_CHALLENGE_ANSWER is not configured (env or Secrets Manager)')
      return NextResponse.json(
        { error: 'Challenge not configured', code: 'CHALLENGE_ANSWER_MISSING' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { answer } = body as { answer?: string }

    if (!isChallengeAnswerCorrect(answer, expected)) {
      debug.auth('Challenge answer incorrect for user:', username)
      return NextResponse.json({ success: false })
    }

    // Dynamic import to avoid compilation blocking
    const { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } =
      await import('@aws-sdk/client-cognito-identity-provider')

    const cognitoClient = new CognitoIdentityProviderClient({
      region: getAuthConfig()?.aws_region || 'eu-west-3'
    })

    await cognitoClient.send(new AdminUpdateUserAttributesCommand({
      UserPoolId: getAuthConfig()?.user_pool_id || '',
      Username: username,
      UserAttributes: [{ Name: 'custom:challenge_passed', Value: 'true' }]
    }))

    debug.auth('✅ Challenge passed, attribute set for user:', username)

    return NextResponse.json({ success: true })

  } catch (error) {
    debug.error('❌ Challenge verification failed:', error)
    return NextResponse.json({ error: 'Challenge verification failed' }, { status: 500 })
  }
}
