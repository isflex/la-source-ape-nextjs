/* eslint-disable no-console */
import type { KeyValueStorageInterface } from 'aws-amplify/utils'

/**
 * SharedCookieStorage - Cross-system token storage for Amplify Gen1 and Gen2
 *
 * This class implements Amplify's KeyValueStorageInterface using cookies
 * to enable authentication state sharing between different Amplify systems
 * running on the same domain.
 */
export class SharedCookieStorage implements KeyValueStorageInterface {
  private storagePrefix = 'amplify_shared_'

  private cookiePath = '/'

  private domain: string

  private secure: boolean

  private sameSite: 'strict' | 'lax' | 'none'

  constructor(options?: {
    domain?: string
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
    storagePrefix?: string
  }) {
    this.domain = options?.domain || this.getDomainFromLocation()
    this.secure = options?.secure ?? (typeof window !== 'undefined' ? window.location.protocol === 'https:' : true)
    this.sameSite = options?.sameSite || 'lax'
    this.storagePrefix = options?.storagePrefix || 'amplify_shared_'
  }

  /**
   * Get the domain from current location, fallback to environment variable
   */
  private getDomainFromLocation(): string {
    if (typeof window !== 'undefined') {
      // Extract the main domain (handle subdomains)
      const {hostname} = window.location
      const parts = hostname.split('.')

      // For localhost or IP addresses, use as-is
      if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        return hostname
      }

      // For regular domains, use the last two parts (domain.tld)
      if (parts.length >= 2) {
        return `.${  parts.slice(-2).join('.')}`
      }

      return hostname
    }

    // Server-side fallback
    return process.env.FLEX_DOMAIN_NAME || 'localhost'
  }

  /**
   * Generate cookie key with prefix
   */
  private getCookieKey(key: string): string {
    return this.storagePrefix + key
  }

  /**
   * Set cookie with proper configuration for cross-system sharing
   */
  private setCookie(name: string, value: string, options?: { expires?: number }): void {
    if (typeof document === 'undefined') {
      console.warn('SharedCookieStorage: Cannot set cookie in server-side environment')
      return
    }

    let cookieString = `${name}=${encodeURIComponent(value)}`
    cookieString += `; Path=${this.cookiePath}`

    if (this.domain !== 'localhost') {
      cookieString += `; Domain=${this.domain}`
    }

    if (this.secure) {
      cookieString += '; Secure'
    }

    cookieString += `; SameSite=${this.sameSite}`

    // Set expiration (default 30 days for auth tokens)
    const expirationDays = options?.expires || 30
    const expirationDate = new Date()
    expirationDate.setTime(expirationDate.getTime() + (expirationDays * 24 * 60 * 60 * 1000))
    cookieString += `; Expires=${expirationDate.toUTCString()}`

    document.cookie = cookieString
  }

  /**
   * Get cookie value by name
   */
  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      console.warn('SharedCookieStorage: Cannot get cookie in server-side environment')
      return null
    }

    const nameEQ = `${name  }=`
    const cookies = document.cookie.split(';')

    for (let cookie of cookies) {
      cookie = cookie.trim()
      if (cookie.indexOf(nameEQ) === 0) {
        const value = cookie.substring(nameEQ.length)
        return decodeURIComponent(value)
      }
    }

    return null
  }

  /**
   * Delete cookie by setting expiration to past date
   */
  private deleteCookie(name: string): void {
    if (typeof document === 'undefined') {
      console.warn('SharedCookieStorage: Cannot delete cookie in server-side environment')
      return
    }

    let cookieString = `${name}=`
    cookieString += `; Path=${this.cookiePath}`

    if (this.domain !== 'localhost') {
      cookieString += `; Domain=${this.domain}`
    }

    cookieString += '; Expires=Thu, 01 Jan 1970 00:00:00 UTC'

    document.cookie = cookieString
  }

  /**
   * Implement KeyValueStorageInterface: setItem
   */
  async setItem(key: string, value: string): Promise<void> {
    const cookieKey = this.getCookieKey(key)

    // For large tokens, consider compression or chunking
    if (value.length > 4000) {
      console.warn(`SharedCookieStorage: Value for key "${key}" is large (${value.length} chars), may exceed cookie limits`)
    }

    this.setCookie(cookieKey, value)

    // Debug logging
    if (process.env.DEBUG === 'true') {
      console.log(`SharedCookieStorage: Set ${cookieKey}`)
    }
  }

  /**
   * Implement KeyValueStorageInterface: getItem
   */
  async getItem(key: string): Promise<string | null> {
    const cookieKey = this.getCookieKey(key)
    const value = this.getCookie(cookieKey)

    // Debug logging
    if (process.env.DEBUG === 'true') {
      console.log(`SharedCookieStorage: Get ${cookieKey}`, !!value)
    }

    return value
  }

  /**
   * Implement KeyValueStorageInterface: removeItem
   */
  async removeItem(key: string): Promise<void> {
    const cookieKey = this.getCookieKey(key)
    this.deleteCookie(cookieKey)

    // Debug logging
    if (process.env.DEBUG === 'true') {
      console.log(`SharedCookieStorage: Removed ${cookieKey}`)
    }
  }

  /**
   * Implement KeyValueStorageInterface: clear
   */
  async clear(): Promise<void> {
    if (typeof document === 'undefined') {
      console.warn('SharedCookieStorage: Cannot clear cookies in server-side environment')
      return
    }

    const cookies = document.cookie.split(';')

    for (const cookie of cookies) {
      const [name] = cookie.trim().split('=')
      if (name.startsWith(this.storagePrefix)) {
        this.deleteCookie(name)
      }
    }

    // Debug logging
    if (process.env.DEBUG === 'true') {
      console.log('SharedCookieStorage: Cleared all amplify cookies')
    }
  }

  /**
   * Get all stored items (useful for debugging)
   */
  async getAllItems(): Promise<Record<string, string>> {
    if (typeof document === 'undefined') {
      return {}
    }

    const items: Record<string, string> = {}
    const cookies = document.cookie.split(';')

    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name && name.startsWith(this.storagePrefix)) {
        const key = name.substring(this.storagePrefix.length)
        items[key] = decodeURIComponent(value || '')
      }
    }

    return items
  }

  /**
   * Check if the storage is available
   */
  isAvailable(): boolean {
    return typeof document !== 'undefined'
  }

  /**
   * Get storage info for debugging
   */
  getStorageInfo(): {
    domain: string
    secure: boolean
    sameSite: string
    storagePrefix: string
    isAvailable: boolean
  } {
    return {
      domain: this.domain,
      secure: this.secure,
      sameSite: this.sameSite,
      storagePrefix: this.storagePrefix,
      isAvailable: this.isAvailable()
    }
  }
}

/**
 * Default instance for immediate use
 */
export const sharedAuthStorage = new SharedCookieStorage()

/**
 * Factory function for creating configured instances
 */
export function createSharedAuthStorage(options?: {
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  storagePrefix?: string
}): SharedCookieStorage {
  return new SharedCookieStorage(options)
}