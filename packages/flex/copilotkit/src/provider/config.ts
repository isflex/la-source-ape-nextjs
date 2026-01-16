/**
 * CopilotKit Provider Configuration
 */

import type { FlexCopilotProviderConfig } from '../types';

// Default configuration values
export const DEFAULT_CONFIG: FlexCopilotProviderConfig = {
  runtimeUrl: '/api/copilotkit',
  showDevConsole: process.env.NODE_ENV === 'development',
  chatLabel: 'AI Assistant',
  defaultOpen: false,
  clickOutsideToClose: true,
};

// Environment-based configuration
export function getConfigFromEnv(): Partial<FlexCopilotProviderConfig> {
  return {
    runtimeUrl: process.env.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL || DEFAULT_CONFIG.runtimeUrl,
    publicApiKey: process.env.NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY,
    showDevConsole: process.env.NODE_ENV === 'development',
  };
}

// Merge configuration with defaults
export function mergeConfig(
  userConfig?: Partial<FlexCopilotProviderConfig>
): FlexCopilotProviderConfig {
  const envConfig = getConfigFromEnv();
  return {
    ...DEFAULT_CONFIG,
    ...envConfig,
    ...userConfig,
  };
}
