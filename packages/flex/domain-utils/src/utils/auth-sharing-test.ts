/* eslint-disable no-console */
import { sharedAuthStorage } from './shared-auth-storage.js'

/**
 * Test utilities for authentication sharing between systems
 */
export class AuthSharingTest {
  /**
   * Test basic storage functionality
   */
  static async testBasicStorage(): Promise<boolean> {
    console.log('🧪 Testing basic storage functionality...')

    try {
      const testKey = 'test_token'
      const testValue = `test_value_${  Date.now()}`

      // Test setItem
      await sharedAuthStorage.setItem(testKey, testValue)
      console.log('✅ setItem successful')

      // Test getItem
      const retrievedValue = await sharedAuthStorage.getItem(testKey)
      if (retrievedValue === testValue) {
        console.log('✅ getItem successful')
      } else {
        console.error('❌ getItem failed:', { expected: testValue, actual: retrievedValue })
        return false
      }

      // Test removeItem
      await sharedAuthStorage.removeItem(testKey)
      const removedValue = await sharedAuthStorage.getItem(testKey)
      if (removedValue === null) {
        console.log('✅ removeItem successful')
      } else {
        console.error('❌ removeItem failed:', { expected: null, actual: removedValue })
        return false
      }

      console.log('✅ All basic storage tests passed!')
      return true
    } catch (error) {
      console.error('❌ Basic storage test failed:', error)
      return false
    }
  }

  /**
   * Test token-like data storage (larger values)
   */
  static async testTokenStorage(): Promise<boolean> {
    console.log('🧪 Testing token storage functionality...')

    try {
      // Simulate JWT-like tokens
      const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      const idToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2NzAyNzUxODciLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiI1dGxxcjRwYjQ1MnNkZnNkZjJzZGYyc2QiLCJhdXRoX3RpbWUiOjE2NzAyNzUxODcsImF3czpjb2duaXRvOnVzZXJuYW1lIjoidGVzdEBleGFtcGxlLmNvbSJ9.example'

      const tokens = {
        'CognitoIdentityServiceProvider.5tlqr4pb452sdsdf2sdf2sd.testuser.accessToken': accessToken,
        'CognitoIdentityServiceProvider.5tlqr4pb452sdsdf2sdf2sd.testuser.idToken': idToken,
        'CognitoIdentityServiceProvider.5tlqr4pb452sdsdf2sdf2sd.testuser.refreshToken': 'refresh_token_example',
        'CognitoIdentityServiceProvider.5tlqr4pb452sdsdf2sdf2sd.LastAuthUser': 'testuser'
      }

      // Store all tokens
      for (const [key, value] of Object.entries(tokens)) {
        await sharedAuthStorage.setItem(key, value)
        console.log(`✅ Stored ${key}`)
      }

      // Retrieve and verify all tokens
      for (const [key, expectedValue] of Object.entries(tokens)) {
        const retrievedValue = await sharedAuthStorage.getItem(key)
        if (retrievedValue === expectedValue) {
          console.log(`✅ Retrieved ${key}`)
        } else {
          console.error(`❌ Token retrieval failed for ${key}`)
          return false
        }
      }

      // Clean up
      for (const key of Object.keys(tokens)) {
        await sharedAuthStorage.removeItem(key)
      }

      console.log('✅ All token storage tests passed!')
      return true
    } catch (error) {
      console.error('❌ Token storage test failed:', error)
      return false
    }
  }

  /**
   * Get current authentication state from storage
   */
  static async getCurrentAuthState(): Promise<{
    items: Record<string, string>
    hasTokens: boolean
    lastAuthUser?: string
  }> {
    const items = await sharedAuthStorage.getAllItems()
    const hasTokens = Object.keys(items).some(key =>
      key.includes('accessToken') || key.includes('idToken')
    )
    const lastAuthUser = items['CognitoIdentityServiceProvider.LastAuthUser'] ||
                        Object.keys(items).find(key => key.endsWith('.LastAuthUser'))

    return {
      items,
      hasTokens,
      lastAuthUser
    }
  }

  /**
   * Display storage information
   */
  static displayStorageInfo(): void {
    const info = sharedAuthStorage.getStorageInfo()
    console.log('📊 Storage Configuration:', {
      domain: info.domain,
      secure: info.secure,
      sameSite: info.sameSite,
      prefix: info.storagePrefix,
      available: info.isAvailable
    })
  }

  /**
   * Run all tests
   */
  static async runAllTests(): Promise<boolean> {
    console.log('🚀 Starting authentication sharing tests...')

    this.displayStorageInfo()

    const basicTest = await this.testBasicStorage()
    const tokenTest = await this.testTokenStorage()

    const allPassed = basicTest && tokenTest

    if (allPassed) {
      console.log('🎉 All authentication sharing tests passed!')
    } else {
      console.error('💥 Some authentication sharing tests failed!')
    }

    return allPassed
  }

  /**
   * Monitor authentication changes (useful for debugging)
   */
  static startAuthMonitor(): void {
    console.log('👀 Starting authentication monitor...')

    // Check for auth changes every 5 seconds
    setInterval(async () => {
      const authState = await this.getCurrentAuthState()
      if (authState.hasTokens) {
        console.log('🔐 Authentication detected:', {
          user: authState.lastAuthUser,
          tokenCount: Object.keys(authState.items).length
        })
      }
    }, 5000)
  }

  /**
   * Clear all authentication data (useful for testing)
   */
  static async clearAllAuthData(): Promise<void> {
    console.log('🧹 Clearing all authentication data...')
    await sharedAuthStorage.clear()
    console.log('✅ Authentication data cleared')
  }
}

/**
 * Convenience functions for testing in browser console
 */
export const authTest = {
  run: () => AuthSharingTest.runAllTests(),
  basic: () => AuthSharingTest.testBasicStorage(),
  tokens: () => AuthSharingTest.testTokenStorage(),
  state: () => AuthSharingTest.getCurrentAuthState(),
  info: () => AuthSharingTest.displayStorageInfo(),
  clear: () => AuthSharingTest.clearAllAuthData(),
  monitor: () => AuthSharingTest.startAuthMonitor()
}

// Make available in browser console for debugging
if (typeof window !== 'undefined') {
  // @ts-expect-error - Adding to window for debugging
  window.authTest = authTest
  console.log('🔧 Authentication test utilities available as window.authTest')
}