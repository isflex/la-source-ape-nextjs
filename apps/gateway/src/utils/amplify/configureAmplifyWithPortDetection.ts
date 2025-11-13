import { Amplify, type ResourcesConfig } from 'aws-amplify';
import outputs from '@root/amplify_outputs.json';
import { AMPLIFY_AUTH_CONFIG_V2 } from './configure';

// Configuration mode switcher
type ConfigMode = 'outputs' | 'v2-config';
let CONFIG_MODE: ConfigMode = 'v2-config'; // Change this to switch between configurations

// Function to set configuration mode
export const setConfigMode = (mode: ConfigMode) => {
  CONFIG_MODE = mode;
};

// Function to get current configuration mode
export const getConfigMode = (): ConfigMode => CONFIG_MODE;

// Type-safe OAuth configuration interface
interface OAuthConfig {
  domain?: string;
  scopes?: string[];
  redirectSignIn?: string[];
  redirectSignOut?: string[];
  responseType?: string;
  // outputs format
  redirect_sign_in_uri?: string[];
  redirect_sign_out_uri?: string[];
}

// Function to get OAuth configuration from the current config mode
const getBaseOAuthConfig = (mode: ConfigMode = CONFIG_MODE): OAuthConfig => {
  if (mode === 'v2-config') {
    return AMPLIFY_AUTH_CONFIG_V2.Auth?.Cognito?.loginWith?.oauth || {};
  } else {
    return outputs.auth?.oauth || {};
  }
};

// Function to get redirect URIs in a unified format
const getRedirectUris = (config: OAuthConfig, mode: ConfigMode = CONFIG_MODE): { signIn: string[]; signOut: string[] } => {
  if (mode === 'v2-config') {
    return {
      signIn: config.redirectSignIn || [],
      signOut: config.redirectSignOut || []
    };
  } else {
    return {
      signIn: config.redirect_sign_in_uri || [],
      signOut: config.redirect_sign_out_uri || []
    };
  }
};

// Function to create OAuth config in the expected format
const createOAuthConfig = (signInUris: string[], signOutUris: string[], baseConfig: OAuthConfig, mode: ConfigMode = CONFIG_MODE): OAuthConfig => {
  if (mode === 'v2-config') {
    return {
      ...baseConfig,
      redirectSignIn: signInUris,
      redirectSignOut: signOutUris
    };
  } else {
    return {
      ...baseConfig,
      redirect_sign_in_uri: signInUris,
      redirect_sign_out_uri: signOutUris
    };
  }
};

// Function to get the current port-specific OAuth configuration
export const getOAuthConfig = (): OAuthConfig => {
  const currentMode = CONFIG_MODE;
  const baseConfig = getBaseOAuthConfig(currentMode);

  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const currentPort = window.location.port;
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;

    // If we're on a specific port, prioritize that port for OAuth redirects
    if (currentPort && (currentPort === '3001' || currentPort === '3000')) {
      const prioritizedRedirectUri = `${protocol}//${hostname}:${currentPort}/`;

      // Get existing URIs in unified format
      const { signIn: existingSignInUris, signOut: existingSignOutUris } = getRedirectUris(baseConfig, currentMode);

      // Filter out the prioritized URI from existing list and put it first
      const otherSignInUris = existingSignInUris.filter(uri => uri !== prioritizedRedirectUri);
      const otherSignOutUris = existingSignOutUris.filter(uri => uri !== prioritizedRedirectUri);

      return createOAuthConfig(
        [prioritizedRedirectUri, ...otherSignInUris],
        [prioritizedRedirectUri, ...otherSignOutUris],
        baseConfig,
        currentMode
      );
    }
  }

  // Return original configuration if not in browser or no specific port
  return baseConfig;
};

// Configure Amplify with port-aware OAuth settings
export const configureAmplifyWithPortDetection = () => {
  let customConfig: any;

  if (CONFIG_MODE === 'v2-config') {
    // Use ResourcesConfig format
    customConfig = {
      ...AMPLIFY_AUTH_CONFIG_V2,
      Auth: {
        ...AMPLIFY_AUTH_CONFIG_V2.Auth,
        Cognito: {
          ...AMPLIFY_AUTH_CONFIG_V2.Auth?.Cognito,
          loginWith: {
            ...AMPLIFY_AUTH_CONFIG_V2.Auth?.Cognito?.loginWith,
            oauth: getOAuthConfig()
          }
        }
      }
    };
  } else {
    // Use outputs format
    customConfig = {
      ...outputs,
      auth: {
        ...outputs.auth,
        oauth: getOAuthConfig()
      }
    };
  }

  Amplify.configure(customConfig, { ssr: true });
  return customConfig;
};

// Export the outputs for backward compatibility
export { outputs };
