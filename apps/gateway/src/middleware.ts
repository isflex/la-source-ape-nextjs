import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  // Store current request url in a custom header, which you can read later
  requestHeaders.set('x-url', request.url)
  requestHeaders.set('x-origin', request.nextUrl.origin)
  requestHeaders.set('x-host', request.headers.get('host') || '')

  // Authentication flow handling
  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.searchParams

  // Handle OAuth redirect back from Google
  if (pathname === '/' && searchParams.has('code') && searchParams.has('state')) {
    // This is an OAuth redirect from Google - redirect to auth page to handle it
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    // Keep the OAuth parameters for Amplify to process
    return NextResponse.redirect(url)
  }

  // Handle authentication redirects and return URLs
  if (pathname === '/auth') {
    // Auth page is being accessed
    const mode = searchParams.get('mode')
    const returnUrl = searchParams.get('returnUrl')

    // Store auth context in headers for potential use
    if (mode) {
      requestHeaders.set('x-auth-mode', mode)
    }
    if (returnUrl) {
      requestHeaders.set('x-auth-return-url', returnUrl)
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

  ///////////////////////////////////////////////////////////////////////////////////////////////////

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
