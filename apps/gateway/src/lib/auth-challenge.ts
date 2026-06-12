/**
 * Sign-in question gate helpers.
 *
 * Twin implementation of isChallengeAnswerCorrect lives in the websocket repo:
 * apps/la-source/ape/on-board/server/src/functions/auth-challenge.mts
 * Keep both byte-identical.
 */

const normalize = (s: string) => s.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()

export function isChallengeAnswerCorrect(answer?: string | null, expected?: string | null): boolean {
  if (!answer || !expected) return false
  const a = normalize(answer)
  return a.length > 0 && a === normalize(expected)
}

/** The question is not a secret — only the answer (FLEX_CHALLENGE_ANSWER) is server-side. */
export const CHALLENGE_QUESTION =
  process.env.NEXT_PUBLIC_FLEX_CHALLENGE_QUESTION ??
  'Quel est le nom de notre école ?'

type SessionLike = {
  tokens?: {
    idToken?: {
      payload?: Record<string, unknown>
    }
  }
} | null | undefined

/** Reads the `challenge_passed` ID-token claim added by the PreTokenGeneration trigger. */
export function readChallengePassed(session: SessionLike): boolean {
  return session?.tokens?.idToken?.payload?.['challenge_passed'] === 'true'
}
