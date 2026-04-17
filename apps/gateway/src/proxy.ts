import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  // const cspHeader = `
  //   default-src 'self';
  //   script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
  //   style-src 'self' 'nonce-${nonce}';
  //   img-src 'self' blob: data:;
  //   font-src 'self';
  //   object-src 'none';
  //   base-uri 'self';
  //   form-action 'self';
  //   frame-ancestors 'none';
  //   upgrade-insecure-requests;
  // `
  // Replace newline characters and spaces
  // const contentSecurityPolicyHeaderValue = cspHeader
  //   .replace(/\s{2,}/g, ' ')
  //   .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  // Store current request url in a custom header, which you can read later
  requestHeaders.set('x-url', request.url)
  requestHeaders.set('x-origin', request.nextUrl.origin)
  requestHeaders.set('x-host', request.headers.get('host') || '')

  // Authentication flow handling
  const {pathname} = request.nextUrl
  const {searchParams} = request.nextUrl

  // Handle /auth route parameter preservation for OAuth flow
  if (pathname === '/auth') {
    const hasOAuthParams = searchParams.has('code') && searchParams.has('state')

    if (hasOAuthParams) {
      // OAuth redirect - set header to indicate this is an OAuth callback
      // Client-side code will handle restoring original params from sessionStorage
      requestHeaders.set('x-oauth-callback', 'true')
    } else {
      // Initial auth access - store all params in header for client-side sessionStorage
      const allParams = Array.from(searchParams.entries())
      if (allParams.length > 0) {
        requestHeaders.set('x-auth-original-params', JSON.stringify(Object.fromEntries(allParams)))
      }
    }
  }

  // For protected routes, we could add auth checks here in the future
  // if (pathname.startsWith('/newsletter/creer') || pathname.startsWith('/planning/piscine/creer')) {
  //   // Could check authentication status and redirect to auth page with return URL
  //   // This would require reading auth state from cookies/tokens
  // }

  // requestHeaders.set(
  //   'Content-Security-Policy',
  //   contentSecurityPolicyHeaderValue
  // )

  // /////////////////////////////////////////////////////////////////////////////////////////////////

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  // response.headers.set(
  //   'Content-Security-Policy',
  //   contentSecurityPolicyHeaderValue
  // )

  return response
}
