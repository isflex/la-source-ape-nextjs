# Admin Authentication System

## Overview
Secure client-side password verification system for admin access using Web Crypto API with SHA-256 hashing.

## Security Features
- ✅ **Password never transmitted**: Only computed hash is used
- ✅ **Salt protection**: Prevents rainbow table attacks
- ✅ **Session-based**: Authentication persists during browser session
- ✅ **Secure storage**: Credentials stored in environment variables

## Configuration

### Environment Variables (in `.env.development`)
```bash
# Admin Authentication Configuration
NEXT_PUBLIC_ADMIN_SALT=la-source-admin-salt-2024-career-discovery
NEXT_PUBLIC_ADMIN_HASH=b7f4337471328b74da1085f5874ad0d5496cb4a8d362b8f6646a21aceb407ec2
```

### Default Credentials
- **Password**: `admin123`
- **Hash**: Generated using SHA-256(password + salt)

## Usage

### Basic Implementation
```typescript
import {
  isAdminAuthenticated,
  promptAdminPassword,
  setAdminAuthenticated,
  logoutAdmin
} from '@src/lib/admin-auth';

// Check if already authenticated
const authenticated = isAdminAuthenticated();

// Prompt for password
const success = await promptAdminPassword('Enter admin password:');

// Manual logout
logoutAdmin();
```

### In React Components
```typescript
const [isAuthenticated, setIsAuthenticated] = React.useState(false);

React.useEffect(() => {
  setIsAuthenticated(isAdminAuthenticated());
}, []);

const handleAdminAccess = async () => {
  if (!isAuthenticated) {
    const success = await promptAdminPassword();
    if (success) {
      setIsAuthenticated(true);
      // Show admin interface
    }
  }
};
```

## Security Considerations

### Production Setup
1. **Encrypt environment variables** using your deployment platform
2. **Use strong passwords** (minimum 12 characters)
3. **Rotate credentials** regularly
4. **Use HTTPS only** in production

### Password Changes
To change the admin password:

1. Update password in your records
2. Generate new hash:
   ```javascript
   const crypto = require('crypto');
   const password = 'new-password';
   const salt = 'la-source-admin-salt-2024-career-discovery';
   const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
   console.log('New hash:', hash);
   ```
3. Update `NEXT_PUBLIC_ADMIN_HASH` in environment variables

### Salt Reuse
The same salt can be safely used across:
- ✅ Different pages in the same application
- ✅ Multiple admin functions with the same password
- ✅ Different environments (dev, staging, prod)

**Do NOT reuse salt for:**
- ❌ Different passwords for the same purpose
- ❌ User-specific authentication
- ❌ Multiple admin users with different passwords

## API Reference

### `verifyAdminPassword(password: string): Promise<boolean>`
Verifies a password against the stored hash.

### `isAdminAuthenticated(): boolean`
Checks if admin is currently authenticated in session.

### `setAdminAuthenticated(authenticated: boolean): void`
Sets authentication state in session storage.

### `promptAdminPassword(message?: string): Promise<boolean>`
Shows password prompt and verifies input.

### `logoutAdmin(): void`
Clears authentication state from session.

### `generatePasswordHash(password: string): Promise<string>`
Development utility to generate password hashes.

## Browser Compatibility
- ✅ Chrome 37+
- ✅ Firefox 34+
- ✅ Safari 7+
- ✅ Edge 12+

Uses native Web Crypto API for maximum compatibility and security.

## Run by creating a Temporary Script
1. Create a file generate-hash.cjs in the gateway directory:
   ```javascript
    // generate-hash.cjs
    const crypto = require('crypto');
    const password = 'your-new-password'; // Change this
    const salt = 'la-source-admin-salt-2024-career-discovery'; // Same salt from env
    const hash = crypto.createHash('sha256')
      .update(password + salt)
      .digest('hex');
    console.log('Password:', password);
    console.log('Salt:', salt);
    console.log('Generated Hash:', hash);
    console.log('\nAdd this to your .env file:');
    console.log(`NEXT_PUBLIC_ADMIN_HASH=${hash}`);
   ```
2. Run it:
   ```bash
    node generate-hash.cjs
   ```
3. Delete the file when done
