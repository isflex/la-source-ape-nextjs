/**
 * Feature Flags
 *
 * Centralized feature flag configuration for the application.
 * Feature flags can be controlled via environment variables or by
 * the active Amplify deployment target (see `./deployment`).
 */

import { isProduction, isProductionSandbox } from "./deployment";

export const FEATURE_FLAGS = {
  /**
   * Multi-day planning mode for piscine planning app
   * When enabled, users can select multiple days with different time slots
   * When disabled, only single-day planning is available (legacy mode)
   *
   * Environment variable: NEXT_PUBLIC_FEATURE_MULTI_DAY
   * Default: false
   */
  MULTI_DAY_PLANNING: process.env.NEXT_PUBLIC_FEATURE_MULTI_DAY === "true",

  /**
   * `/adhesion` route, navbar entry, and sitemap entry.
   * Off on production (apelasource.org); on everywhere else
   * (production-sandbox and local dev).
   */
  ADHESION_ENABLED: !isProduction(),

  /**
   * About page variant. When true, /about renders the legacy
   * client-component.tsx (interactive multi-slide grid).
   * When false, /about renders client-component-2.tsx (single iframe).
   * On ONLY on production-sandbox — production and local both keep
   * client-component-2.
   */
  ABOUT_USES_LEGACY_V1: isProductionSandbox(),
} as const;

/**
 * Check if a feature is enabled
 *
 * @param flag - The feature flag to check
 * @returns true if the feature is enabled, false otherwise
 *
 * @example
 * if (isFeatureEnabled('MULTI_DAY_PLANNING')) {
 *   // Show multi-day mode UI
 * }
 */
export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag];
}

/**
 * Type for feature flag keys
 */
export type FeatureFlag = keyof typeof FEATURE_FLAGS;
