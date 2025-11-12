import { Amplify } from 'aws-amplify';
import outputs from '@root/amplify_outputs.json';

// Function to get the current port-specific OAuth configuration
export const getOAuthConfig = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const currentPort = window.location.port;
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;

    // If we're on a specific port, prioritize that port for OAuth redirects
    if (currentPort && (currentPort === '3001' || currentPort === '3000')) {
      const prioritizedRedirectUri = `${protocol}//${hostname}:${currentPort}/`;

      // Filter out the prioritized URI from existing list and put it first
      const existingRedirectUris = outputs.auth.oauth.redirect_sign_in_uri || [];
      const otherUris = existingRedirectUris.filter(uri => uri !== prioritizedRedirectUri);

      return {
        ...outputs.auth.oauth,
        redirect_sign_in_uri: [prioritizedRedirectUri, ...otherUris],
        redirect_sign_out_uri: [prioritizedRedirectUri, ...(outputs.auth.oauth.redirect_sign_out_uri || [])]
      };
    }
  }

  // Return original configuration if not in browser or no specific port
  return outputs.auth.oauth;
};

// Configure Amplify with port-aware OAuth settings
export const configureAmplifyWithPortDetection = () => {
  const customConfig = {
    ...outputs,
    auth: {
      ...outputs.auth,
      oauth: getOAuthConfig()
    }
  };

  Amplify.configure(customConfig, { ssr: true });
  return customConfig;
};

// Export the outputs for backward compatibility
export { outputs };