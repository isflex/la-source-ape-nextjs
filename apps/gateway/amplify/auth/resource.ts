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
export const auth = referenceAuth({
  userPoolId: process.env.FLEX_AWS_COGNITO_USER_POOL_ID!,
  identityPoolId: process.env.FLEX_AWS_COGNITO_IDENTITY_POOL!,
  userPoolClientId: process.env.FLEX_AWS_COGNITO_USER_POOL_APP_CLIENT_ID!,
  authRoleArn: process.env.FLEX_AWS_AUTHENTICATED_ROLE_ARN!,
  unauthRoleArn: process.env.FLEX_AWS_UNAUTHENTICATED_ROLE_ARN!,
});
