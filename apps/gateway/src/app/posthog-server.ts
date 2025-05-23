import PostHogNodeClient from '@src/utils/posthog/initPostHogNode'

let posthogInstance: any = null

export function getPostHogServer() {
  if (!posthogInstance) {
    posthogInstance = PostHogNodeClient()
  }
  return posthogInstance
}
