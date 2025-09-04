import { defineAuth, secret  } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 * @see https://docs.amplify.aws/nextjs/build-a-backend/auth/concepts/
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});

// // https://github.com/aws-amplify/amplify-backend/issues/1548#issuecomment-2401421204

// export const auth = defineAuth({
//   loginWith: {
//     email: true,
//     phone: true,
//     externalProviders: {
//       google: {
//         clientId: secret('FLEX_GOOGLE_APP_CLIENT_ID'),
//         clientSecret: secret('FLEX_GOOGLE_APP_CLIENT_SECRET')
//       },
//       logoutUrls: [
//         `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_DOMAIN_NAME as string}/`,
//         `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_1_DOMAIN_NAME_1 as string}/`,
//         `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_1_DOMAIN_NAME_2 as string}/`,
//         `${process.env.FLEX_POKER_CLIENT_HOST as string}/`,
//         `${process.env.FLEX_GATEWAY_HOST as string}/`,
//         `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_DOMAIN_NAME as string}:${process.env.FLEX_PROXY_PORT as string}/`,
//         `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_1_DOMAIN_NAME_1 as string}:${process.env.FLEX_PROXY_PORT as string}/`,
//         `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_1_DOMAIN_NAME_2 as string}:${process.env.FLEX_PROXY_PORT as string}/`,
//         `http://localhost:${process.env.FLEX_GATEWAY_PORT!}/`,
//         `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME as string}/`,
//         `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME as string}/`,
//       ],
//       callbackUrls: [
//         `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_DOMAIN_NAME as string}/`,
//         `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_1_DOMAIN_NAME_1 as string}/`,
//         `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_1_DOMAIN_NAME_2 as string}/`,
//         `${process.env.FLEX_POKER_CLIENT_HOST as string}/`,
//         `${process.env.FLEX_GATEWAY_HOST as string}/`,
//         `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_DOMAIN_NAME as string}:${process.env.FLEX_PROXY_PORT as string}/`,
//         `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_1_DOMAIN_NAME_1 as string}:${process.env.FLEX_PROXY_PORT as string}/`,
//         `${process.env.FLEX_PROTOCOL as string}${process.env.FLEX_FUTUR_PROOF_1_DOMAIN_NAME_2 as string}:${process.env.FLEX_PROXY_PORT as string}/`,
//         `http://localhost:${process.env.FLEX_GATEWAY_PORT!}/`,
//         `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME as string}/`,
//         `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME as string}/`,
//       ],
//     },
//   },
//   userAttributes: {
//     givenName: {
//       required: true,
//       mutable: false,
//     },
//     familyName: {
//       required: true,
//       mutable: false,
//     },
//   },
// });

// import { referenceAuth } from '@aws-amplify/backend'

// // https://github.com/aws-amplify/amplify-backend/issues/2287

// export const auth = referenceAuth({
//   userPoolId: process.env.FLEX_AWS_COGNITO_USER_POOL_ID!,
//   identityPoolId: process.env.FLEX_AWS_COGNITO_IDENTITY_POOL!,
//   // authRoleArn: process.env.FLEX_AWS_AUTHENTICATED_ROLE_ARN!,
//   // unauthRoleArn: process.env.FLEX_AWS_UNAUTHENTICATED_ROLE_ARN!,
//   userPoolClientId: process.env.FLEX_AWS_COGNITO_USER_POOL_APP_CLIENT_ID!,
// });
