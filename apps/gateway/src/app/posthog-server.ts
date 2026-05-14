import type { PostHog as PostHogType } from 'posthog-node'
import PostHogNodeClient from '@src/utils/posthog/initPostHogNode'

let posthogInstance: PostHogType | null = null

export async function getPostHogServer(): Promise<PostHogType | null> {
  if (!posthogInstance) {
    posthogInstance = await PostHogNodeClient()
  }
  return posthogInstance
}
