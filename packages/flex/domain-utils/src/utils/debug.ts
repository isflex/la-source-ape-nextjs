/**
 * Selective Debug Logging Utility
 *
 * Provides categorized, environment-aware logging for the entire monorepo.
 * Built on loglevel for production-ready performance and browser compatibility.
 *
 * Usage:
 *   import { debug } from '@flexiness/domain-utils'
 *   debug.userLookup('Found user:', user)
 *   debug.formSubmission('Form data:', data)
 *
 * Control:
 *   - Environment: NODE_ENV=development enables all categories
 *   - Global: DEBUG=true or window.DEBUG=true
 *   - Selective: DEBUG_USER_LOOKUP=false, etc.
 *   - Runtime: window.debugFlags = { USER_LOOKUP: false }
 *
 * cd /home/ischerer/workspaces/flex/websocket-app/ape-la-source/packages/flex/domain-utils && pnpm compile:tsup
 */

import log from 'loglevel'

// Environment-based base settings
const IS_DEVELOPMENT = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'development' || process.env?.FLEX_MODE === 'development')
const IS_BROWSER = typeof window !== 'undefined'

// Global debug enablement
const getGlobalDebugFlag = (): boolean => {
  if (typeof process !== 'undefined' && process.env?.DEBUG === 'true') return true
  if (IS_BROWSER && (window as any).DEBUG === true) return true
  return IS_DEVELOPMENT
}

// Category-specific debug flags
const getCategoryFlag = (category: string): boolean => {
  const globalEnabled = getGlobalDebugFlag()

  // Check environment variable (e.g., DEBUG_USER_LOOKUP=false)
  if (typeof process !== 'undefined') {
    const envVar = process.env[`DEBUG_${category}`]
    if (envVar !== undefined) {
      return envVar === 'true'
    }
  }

  // Check browser runtime flags
  if (IS_BROWSER) {
    const browserFlags = (window as any).debugFlags
    if (browserFlags && typeof browserFlags[category] === 'boolean') {
      return browserFlags[category]
    }
  }

  return globalEnabled
}

// Debug categories
const DEBUG_CATEGORIES = {
  USER_LOOKUP: 'USER_LOOKUP',
  FORM_SUBMISSION: 'FORM_SUBMISSION',
  WEBSOCKET: 'WEBSOCKET',
  GRAPHQL: 'GRAPHQL',
  AUTH: 'AUTH',
  SERVER: 'SERVER',
  CLIENT: 'CLIENT',
  SIGNED_FETCH: 'SIGNED_FETCH',
  MESSAGING_IN_APP: 'MESSAGING_IN_APP',
  CALENDAR_EVENTS: 'CALENDAR_EVENTS',
} as const

type DebugCategory = keyof typeof DEBUG_CATEGORIES

// Configure loglevel based on environment
if (IS_DEVELOPMENT) {
  log.setLevel('debug')
} else {
  log.setLevel('warn') // Only warnings and errors in production
}

// Utility to create categorized logger with source map support
const createCategoryLogger = (category: DebugCategory, emoji: string, color?: string) => {
  const prefix = `${emoji} [${category}]`

  return (...args: any[]) => {
    if (!getCategoryFlag(category)) return

    // In development, use console methods directly for better source maps
    if (IS_DEVELOPMENT && IS_BROWSER) {
      if (color) {
        console.log(`%c${prefix}`, `color: ${color}; font-weight: bold`, ...args)
      } else {
        console.log(prefix, ...args)
      }
    } else {
      // Use loglevel for production (structured logging)
      if (IS_BROWSER && color) {
        log.debug(`%c${prefix}`, `color: ${color}; font-weight: bold`, ...args)
      } else {
        log.debug(prefix, ...args)
      }
    }
  }
}

// Create category-specific loggers
export const debug = {
  // Category-specific loggers
  userLookup: createCategoryLogger('USER_LOOKUP', '🔍', '#3b82f6'),
  formSubmission: createCategoryLogger('FORM_SUBMISSION', '📝', '#10b981'),
  websocket: createCategoryLogger('WEBSOCKET', '🔌', '#8b5cf6'),
  graphql: createCategoryLogger('GRAPHQL', '📊', '#f59e0b'),
  auth: createCategoryLogger('AUTH', '🔐', '#ef4444'),
  server: createCategoryLogger('SERVER', '🖥️', '#6b7280'),
  client: createCategoryLogger('CLIENT', '🌐', '#06b6d4'),
  signedFetch: createCategoryLogger('SIGNED_FETCH', '📡', '#ea33ccff'),
  messagingInApp: createCategoryLogger('MESSAGING_IN_APP', '💬', '#9333ea'),
  calendarEvents: createCategoryLogger('CALENDAR_EVENTS', '📅', '#f97316'),

  // Generic debug with custom prefix
  log: (prefix: string, ...args: any[]) => {
    if (getGlobalDebugFlag()) {
      log.debug(`[${prefix}]`, ...args)
    }
  },

  // Always-on logging (regardless of debug flags)
  info: (...args: any[]) => log.info('ℹ️ [INFO]', ...args),
  warn: (...args: any[]) => log.warn('⚠️ [WARN]', ...args),
  error: (...args: any[]) => log.error('❌ [ERROR]', ...args),
  success: (...args: any[]) => {
    if (getGlobalDebugFlag()) {
      if (IS_BROWSER) {
        log.debug('%c✅ [SUCCESS]', 'color: #10b981; font-weight: bold', ...args)
      } else {
        log.debug('✅ [SUCCESS]', ...args)
      }
    }
  },

  // Utility functions
  isEnabled: (category?: DebugCategory): boolean => {
    return category ? getCategoryFlag(category) : getGlobalDebugFlag()
  },

  setCategory: (category: DebugCategory, enabled: boolean) => {
    if (IS_BROWSER) {
      const flags = (window as any).debugFlags || {}
      flags[category] = enabled
      ;(window as any).debugFlags = flags
    }
  },

  enableAll: () => {
    if (IS_BROWSER) {
      ;(window as any).DEBUG = true
    }
  },

  disableAll: () => {
    if (IS_BROWSER) {
      ;(window as any).DEBUG = false
    }
  },

  // Get current debug configuration
  getConfig: () => ({
    isDevelopment: IS_DEVELOPMENT,
    isBrowser: IS_BROWSER,
    globalEnabled: getGlobalDebugFlag(),
    categories: Object.keys(DEBUG_CATEGORIES).reduce(
      (acc, key) => {
        acc[key as DebugCategory] = getCategoryFlag(key as DebugCategory)
        return acc
      },
      {} as Record<DebugCategory, boolean>,
    ),
  }),

  // Direct console methods for better source maps in development
  // These bypass the wrapper function for cleaner stack traces
  direct: {
    userLookup: (...args: any[]) => {
      if (getCategoryFlag('USER_LOOKUP')) {
        console.log('%c🔍 [USER_LOOKUP]', 'color: #3b82f6; font-weight: bold', ...args)
      }
    },
    formSubmission: (...args: any[]) => {
      if (getCategoryFlag('FORM_SUBMISSION')) {
        console.log('%c📝 [FORM_SUBMISSION]', 'color: #10b981; font-weight: bold', ...args)
      }
    },
    websocket: (...args: any[]) => {
      if (getCategoryFlag('WEBSOCKET')) {
        console.log('%c🔌 [WEBSOCKET]', 'color: #8b5cf6; font-weight: bold', ...args)
      }
    },
    graphql: (...args: any[]) => {
      if (getCategoryFlag('GRAPHQL')) {
        console.log('%c📊 [GRAPHQL]', 'color: #f59e0b; font-weight: bold', ...args)
      }
    },
    auth: (...args: any[]) => {
      if (getCategoryFlag('AUTH')) {
        console.log('%c🔐 [AUTH]', 'color: #ef4444; font-weight: bold', ...args)
      }
    },
    server: (...args: any[]) => {
      if (getCategoryFlag('SERVER')) {
        console.log('%c🖥️ [SERVER]', 'color: #6b7280; font-weight: bold', ...args)
      }
    },
    client: (...args: any[]) => {
      if (getCategoryFlag('CLIENT')) {
        console.log('%c🌐 [CLIENT]', 'color: #06b6d4; font-weight: bold', ...args)
      }
    },
    signedFetch: (...args: any[]) => {
      if (getCategoryFlag('SIGNED_FETCH')) {
        console.log('%c📡 [SIGNED_FETCH]', 'color: #ea33ccff; font-weight: bold', ...args)
      }
    },
    messagingInApp: (...args: any[]) => {
      if (getCategoryFlag('MESSAGING_IN_APP')) {
        console.log('%c💬 [MESSAGING_IN_APP]', 'color: #9333ea; font-weight: bold', ...args)
      }
    },
    calendarEvents: (...args: any[]) => {
      if (getCategoryFlag('CALENDAR_EVENTS')) {
        console.log('%c📅 [CALENDAR_EVENTS]', 'color: #f97316; font-weight: bold', ...args)
      }
    },
  },
}

// Browser console helpers (development only)
if (IS_BROWSER && IS_DEVELOPMENT) {
  // Add debug utilities to window for easy console access
  ;(window as any).debugUtils = {
    enable: debug.enableAll,
    disable: debug.disableAll,
    config: debug.getConfig,
    categories: DEBUG_CATEGORIES,
    setCategory: debug.setCategory,
  }

  // Initial debug info
  if (getGlobalDebugFlag()) {
    console.log('%c🐛 Debug Logging Enabled', 'color: #3b82f6; font-size: 14px; font-weight: bold', '\nUse window.debugUtils for controls')
  }
}

export type { DebugCategory }
export { DEBUG_CATEGORIES }
