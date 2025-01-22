// https://docs.amplify.aws/nextjs/build-a-backend/server-side-rendering/nextjs-app-router-server-components/#configure-amplify-server-side
// https://articles.wesionary.team/next-js-14-aws-amplify-authentication-how-to-setup-and-configure-in-your-app-f30b70bc9377
// https://docs.amplify.aws/nextjs/build-a-backend/data/connect-from-server-runtime/nextjs-server-runtime/
// https://docs.amplify.aws/nextjs/build-a-backend/server-side-rendering/#with-nextjs-pages-router
// https://docs.amplify.aws/gen1/nextjs/build-a-backend/server-side-rendering/nextjs/

// App router
import { cookies } from 'next/headers';

import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api';
import { getCurrentUser } from 'aws-amplify/auth/server';

import { type Schema } from '@amplify/data/resource';
import { AMPLIFY_AUTH_CONFIG_V2 } from '@src/utils/amplify/configure';
// import outputs from '@root/amplify_outputs.json';

export const { runWithAmplifyServerContext } = createServerRunner({
  config: AMPLIFY_AUTH_CONFIG_V2,
  // config: outputs,
});

export const cookiesClient = generateServerClientUsingCookies<Schema>({
  config: AMPLIFY_AUTH_CONFIG_V2,
  // config: outputs,
  cookies,
});

export async function AuthGetCurrentUserServer() {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    return currentUser;
  } catch (error) {
    console.error(error);
  }
}

export const isAuthenticated = async () =>
  await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      try {
        const user = await getCurrentUser(contextSpec)
        return !!user
      } catch (error) {
        return false
      }
    },
  })
