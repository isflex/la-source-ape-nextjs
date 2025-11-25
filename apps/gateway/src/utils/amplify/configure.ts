import type { ResourcesConfig } from 'aws-amplify'

const AMPLIFY_AUTH_CONFIG_V2: ResourcesConfig = {
  Auth: {
    Cognito: {
      //  Amazon Cognito User Pool ID
      userPoolId: process.env.FLEX_AWS_COGNITO_USER_POOL_ID as string,
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: process.env.FLEX_AWS_COGNITO_USER_POOL_APP_CLIENT_ID as string,
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: process.env.FLEX_AWS_COGNITO_IDENTITY_POOL as string,
      // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
      // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
      signUpVerificationMethod: 'code', // 'code' | 'link'
      loginWith: {
        // OPTIONAL - Hosted UI configuration
        username: false,
        email: true,
        phone: true,
        oauth: {
          domain: process.env.FLEX_AWS_COGNITO_OAUTH_DOMAIN as string,
          // https://stackoverflow.com/a/77596876/10159170
          scopes: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
          redirectSignIn: [
            `http://localhost:${process.env.FLEX_GATEWAY_PORT!}/`,
            `http://localhost:${process.env.FLEX_GATEWAY_PORT!}/web-app/`,
            `http://localhost:${process.env.FLEX_GATEWAY_PORT!}/auth/`,
            `http://localhost:${process.env.FLEX_POKER_CLIENT_PORT!}/`,
            `${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME as string}/`,
            `${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME as string}:${process.env.FLEX_POKER_CLIENT_PORT as string}/`,
            `${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME as string}:${process.env.FLEX_PROXY_PORT as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME_1 as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME_1 as string}/web-app/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME_1 as string}/auth/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME_2 as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME_2 as string}/web-app/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME_2 as string}/auth/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_1 as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_1 as string}/web-app/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_1 as string}/auth/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_2 as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_2 as string}/web-app/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_2 as string}/auth/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_3 as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_3 as string}/web-app/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_3 as string}/auth/`,
            `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_2_BASE_DOMAIN as string}/`,
            `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_2_BASE_DOMAIN as string}/web-app/`,
            `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_2_BASE_DOMAIN as string}/auth/`,
          ],
          redirectSignOut: [
            `http://localhost:${process.env.FLEX_GATEWAY_PORT!}/`,
            `http://localhost:${process.env.FLEX_GATEWAY_PORT!}/web-app/`,
            `http://localhost:${process.env.FLEX_GATEWAY_PORT!}/auth/`,
            `http://localhost:${process.env.FLEX_POKER_CLIENT_PORT!}/`,
            `${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME as string}/`,
            `${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME as string}:${process.env.FLEX_POKER_CLIENT_PORT as string}/`,
            `${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME as string}:${process.env.FLEX_PROXY_PORT as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME_1 as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME_1 as string}/web-app/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME_1 as string}/auth/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME_2 as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME_2 as string}/web-app/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME_2 as string}/auth/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_1 as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_1 as string}/web-app/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_1 as string}/auth/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_2 as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_2 as string}/web-app/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_2 as string}/auth/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_3 as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_3 as string}/web-app/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME_3 as string}/auth/`,
            `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_2_BASE_DOMAIN as string}/`,
            `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_2_BASE_DOMAIN as string}/web-app/`,
            `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_2_BASE_DOMAIN as string}/auth/`,
          ],
          responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
          providers: ['Google'],
        },
      },
      userAttributes: {
        email: {
          required: true,
        },
        given_name: {
          required: true,
        },
        family_name: {
          required: true,
        },
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.FLEX_AWS_APPSYNC_GRAPHQL_ENDPOINT as string,
      region: process.env.FLEX_AWS_PROJECT_REGION as string,
      defaultAuthMode: 'userPool',
      // Set the default auth mode to "apiKey" and provide the API key value
      // defaultAuthMode: 'apiKey',
      apiKey: process.env.FLEX_AWS_APPSYNC_APIKEY as string,
    },
  },
}

export {
  AMPLIFY_AUTH_CONFIG_V2,
}
