// import { defineAuth } from '@aws-amplify/backend';

// /**
//  * Define and configure your auth resource
//  * @see https://docs.amplify.aws/gen2/build-a-backend/auth
//  */
// export const auth = defineAuth({
//   loginWith: {
//     email: true,
//   },
// });

import { referenceAuth } from '@aws-amplify/backend'

export const auth = referenceAuth({
  userPoolId: process.env.FLEX_AWS_COGNITO_USER_POOL_ID!,
  identityPoolId: process.env.FLEX_AWS_COGNITO_IDENTITY_POOL!,
  authRoleArn: process.env.FLEX_AWS_AUTHENTICATED_ROLE_ARN!,
  unauthRoleArn: process.env.FLEX_AWS_UNAUTHENTICATED_ROLE_ARN!,
  userPoolClientId: process.env.FLEX_AWS_COGNITO_USER_POOL_APP_CLIENT_ID!,
});
