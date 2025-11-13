import { defineAuth, secret } from '@aws-amplify/backend';
import { customMessage } from '../functions/custom-message/resource';
import { postConfirmation } from '../functions/post-confirmation/resource';

/**
 * Define auth resource with lambda triggers and Google OAuth
 * Migrated from previous Amplify setup to match production configuration
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    // phone: true, // Disabled until SNS production access approved
    externalProviders: {
      google: {
        clientId: secret('FLEX_GOOGLE_APP_CLIENT_ID'),
        clientSecret: secret('FLEX_GOOGLE_APP_CLIENT_SECRET'),
        scopes: ["email", "openid", "profile"]
      },
      callbackUrls: [
        "http://localhost:3000/",
        "http://localhost:3000/web-app/",
        "http://localhost:3001/",
        "http://localhost:4009/",
        "https://after-school.flexiness.com/",
        "https://after-school.flexiness.com:4009/",
        "https://ape.ecolelasource.org/",
        "https://ape.ecolelasource.org/web-app/",
        "https://ape.ecolelasource.org:9898/",
        "https://ape.ecolelasource.org:9898/web-app/",
        "https://apelasource.org/",
        "https://apelasource.org/web-app/",
        "https://local.flexiness.com:4009/",
        "https://main.d1cftsvc5q8k92.amplifyapp.com/",
        "https://main.d1cftsvc5q8k92.amplifyapp.com/web-app/",
        "https://main.d2hx7qu8b35esn.amplifyapp.com/",
        "https://main.d2hx7qu8b35esn.amplifyapp.com/web-app/",
        "https://main.d2hx7qu8b35esn.amplifyapp.com:9898/",
        "https://main.d2hx7qu8b35esn.amplifyapp.com:9898/web-app/",
        "https://web-app.ecolelasource.org/",
        "https://web-app.ecolelasource.org:4009/"
      ],
      logoutUrls: [
        "http://localhost:3000/",
        "http://localhost:3000/web-app/",
        "http://localhost:3001/",
        "http://localhost:4009/",
        "https://after-school.flexiness.com/",
        "https://after-school.flexiness.com:4009/",
        "https://ape.ecolelasource.org/",
        "https://ape.ecolelasource.org/web-app/",
        "https://ape.ecolelasource.org:9898/",
        "https://ape.ecolelasource.org:9898/web-app/",
        "https://apelasource.org/",
        "https://apelasource.org/web-app/",
        "https://local.flexiness.com:4009/",
        "https://main.d1cftsvc5q8k92.amplifyapp.com/",
        "https://main.d1cftsvc5q8k92.amplifyapp.com/web-app/",
        "https://main.d2hx7qu8b35esn.amplifyapp.com/",
        "https://main.d2hx7qu8b35esn.amplifyapp.com/web-app/",
        "https://main.d2hx7qu8b35esn.amplifyapp.com:9898/",
        "https://main.d2hx7qu8b35esn.amplifyapp.com:9898/web-app/",
        "https://web-app.ecolelasource.org/",
        "https://web-app.ecolelasource.org:4009/"
      ],
    },
  },
  // multifactor: {
  //   mode: 'OPTIONAL',
  //   sms: true,
  // }, // Disabled until SNS production access approved
  userAttributes: {
    email: {
      required: true,
      mutable: true
    },
    phoneNumber: {
      required: false,
      mutable: true
    },
    givenName: {
      required: true,
      mutable: true
    },
    familyName: {
      required: true,
      mutable: true
    }
  },
  triggers: {
    customMessage,
    postConfirmation
  },
  groups: ["v4onBoardSignUpGroup"]
});
