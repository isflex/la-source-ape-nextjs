import type { PostHog as PostHogType } from 'posthog-node'

let cachedClient: PostHogType | null = null
let loadFailed = false

export default async function PostHogNodeClient(): Promise<PostHogType | null> {
  if (cachedClient) return cachedClient
  if (loadFailed) return null

  try {
    const { PostHog } = await import('posthog-node')
    cachedClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
      flushAt: 1,
      flushInterval: 0
    })
    return cachedClient
  } catch (err) {
    loadFailed = true
    // eslint-disable-next-line no-console
    console.error('posthog-node unavailable, falling back to CloudWatch-only logging:', err)
    return null
  }
}
