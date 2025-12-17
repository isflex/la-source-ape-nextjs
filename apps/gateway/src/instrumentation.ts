export function register() {
  // No-op for initialization
}

export const onRequestError = async (
  err: Error,
  request: {
    path: string
    method: string
    headers: { cookie?: string; 'user-agent'?: string }
  },
  context: {
    routerKind: 'Pages Router' | 'App Router'
    routePath: string
    routeType: 'render' | 'route'
  }
) => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const {
      logServerError,
      extractDistinctIdFromCookies
    } = await import('./lib/server-error-logger')

    const distinctId = extractDistinctIdFromCookies(
      request.headers.cookie || null
    )

    await logServerError(err, {
      route: context.routePath || request.path,
      method: request.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      distinctId,
      userAgent: request.headers['user-agent'],
      additionalContext: {
        routerKind: context.routerKind,
        routeType: context.routeType,
        source: 'instrumentation.onRequestError'
      }
    })
  }
}
