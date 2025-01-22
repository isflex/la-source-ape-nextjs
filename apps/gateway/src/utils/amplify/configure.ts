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
            `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_DOMAIN_NAME as string}/`,
            `${process.env.FLEX_POKER_CLIENT_HOST as string}/`,
            `${process.env.FLEX_GATEWAY_HOST as string}/`,
            `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_DOMAIN_NAME as string}:${process.env.FLEX_PROXY_PORT as string}/`,
            `http://localhost:${process.env.FLEX_GATEWAY_PORT!}/`,
            // `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_HOST as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_HOSTNAME as string}/`,
          ],
          redirectSignOut: [
            `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_DOMAIN_NAME as string}/`,
            `${process.env.FLEX_POKER_CLIENT_HOST as string}/`,
            `${process.env.FLEX_GATEWAY_HOST as string}/`,
            `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_DOMAIN_NAME as string}:${process.env.FLEX_PROXY_PORT as string}/`,
            `http://localhost:${process.env.FLEX_GATEWAY_PORT!}/`,
            // `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_HOST as string}/`,
            `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_HOSTNAME as string}/`,
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
      // Set the default auth mode to 'apiKey' and provide the API key value
      // defaultAuthMode: 'apiKey',
      // apiKey: process.env.FLEX_AWS_APPSYNC_APIKEY as string,
    },
  },
}

export {
  AMPLIFY_AUTH_CONFIG_V2,
}
