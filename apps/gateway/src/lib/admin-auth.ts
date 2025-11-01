'use client';

/**
 * Admin Authentication Utility
 * Provides secure client-side password verification using Web Crypto API
 */

// Environment variables for admin credentials
const ADMIN_PASSWORD_HASH = process.env.NEXT_PUBLIC_ADMIN_HASH || '';
const ADMIN_SALT = process.env.NEXT_PUBLIC_ADMIN_SALT || 'default-salt-2024-career-discovery';

/**
 * Verifies admin password using SHA-256 hashing
 * @param inputPassword - The password entered by the user
 * @returns Promise<boolean> - True if password is correct
 */
export const verifyAdminPassword = async (inputPassword: string): Promise<boolean> => {
  try {
    // Early return if no hash is configured
    if (!ADMIN_PASSWORD_HASH) {
      console.warn('Admin password hash not configured');
      return false;
    }

    // Encode the password + salt combination
    const encoder = new TextEncoder();
    const data = encoder.encode(inputPassword + ADMIN_SALT);

    // Hash using Web Crypto API
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Compare with stored hash
    return hashHex === ADMIN_PASSWORD_HASH;
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return false;
  }
};

/**
 * Generates a hash for a given password (for initial setup)
 * This function is for development use to generate the hash to store in environment variables
 * @param password - The password to hash
 * @returns Promise<string> - The hex hash
 */
export const generatePasswordHash = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + ADMIN_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Session storage key for admin authentication state
 */
const ADMIN_SESSION_KEY = 'admin_authenticated';

/**
 * Check if admin is already authenticated in current session
 * @returns boolean - True if already authenticated
 */
export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
};

/**
 * Set admin authentication state in session
 * @param authenticated - Authentication state
 */
export const setAdminAuthenticated = (authenticated: boolean): void => {
  if (typeof window === 'undefined') return;

  if (authenticated) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
};

/**
 * Prompt user for admin password and verify
 * @param customMessage - Optional custom prompt message
 * @returns Promise<boolean> - True if authentication successful
 */
export const promptAdminPassword = async (customMessage?: string): Promise<boolean> => {
  const message = customMessage || 'Mot de passe administrateur:';
  const password = prompt(message);

  if (!password) {
    return false;
  }

  const isValid = await verifyAdminPassword(password);

  if (isValid) {
    setAdminAuthenticated(true);
  }

  return isValid;
};

/**
 * Logout admin (clear session)
 */
export const logoutAdmin = (): void => {
  setAdminAuthenticated(false);
};