// https://docs.amplify.aws/nextjs/build-a-backend/server-side-rendering/nextjs-app-router-server-components/#configure-amplify-server-side
// https://articles.wesionary.team/next-js-14-aws-amplify-authentication-how-to-setup-and-configure-in-your-app-f30b70bc9377
// https://docs.amplify.aws/nextjs/build-a-backend/data/connect-from-server-runtime/nextjs-server-runtime/
// https://docs.amplify.aws/nextjs/build-a-backend/server-side-rendering/#with-nextjs-pages-router
// https://docs.amplify.aws/gen1/nextjs/build-a-backend/server-side-rendering/nextjs/

// Pages router
import { createServerRunner } from '@aws-amplify/adapter-nextjs';
// import { AMPLIFY_AUTH_CONFIG_V2 } from '@src/utils/amplify/configure';
import outputs from '@root/amplify_outputs.json';

export const { runWithAmplifyServerContext } = createServerRunner({
  // config: AMPLIFY_AUTH_CONFIG_V2,
  config: outputs,
})
