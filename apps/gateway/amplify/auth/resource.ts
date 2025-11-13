// import { defineAuth } from '@aws-amplify/backend';

// /**
//  * Define auth resource for sandbox development
//  * @see https://docs.amplify.aws/gen2/build-a-backend/auth/concepts/
//  */
// export const auth = defineAuth({
//   loginWith: {
//     email: true,
//   },
// });


import { referenceAuth } from '@aws-amplify/backend';

/**
 * Reference existing Cognito User Pool for admin authentication
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth/concepts/
 */

// Determine if we're in production/CI environment or sandbox
const isProduction = process.env.FLEX_MODE === 'production' || process.env.NODE_ENV === 'production' || process.env.AWS_BRANCH || process.env.CI;

export const auth = referenceAuth({
  // userPoolId: isProduction
  //   ? `arn:aws:cognito-idp:${process.env.AWS_REGION}:${process.env.FLEX_AWS_ORG_ID }:userpool/${process.env.FLEX_AWS_COGNITO_USER_POOL_ID}`
  //   : process.env.FLEX_AWS_COGNITO_USER_POOL_ID!,
  userPoolId: process.env.FLEX_AWS_COGNITO_USER_POOL_ID!,
  identityPoolId: process.env.FLEX_AWS_COGNITO_IDENTITY_POOL!,
  userPoolClientId: process.env.FLEX_AWS_COGNITO_USER_POOL_APP_CLIENT_ID!,
  authRoleArn: process.env.FLEX_AWS_AUTHENTICATED_ROLE_ARN!,
  unauthRoleArn: process.env.FLEX_AWS_UNAUTHENTICATED_ROLE_ARN!,
});
