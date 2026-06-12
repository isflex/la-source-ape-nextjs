# Plan: Sign-in question/answer gate (works for password AND Google sign-in)

> **Status:** Planned, not yet implemented. The Gen-1 Amplify auth changes (`amplify push`) cannot be
> done on the current machine. Commit this doc, then re-open the plan on a machine with the Gen-1 Amplify
> CLI authenticated for this AWS account and execute the "Division of labor" below.

## Context

We want users to answer a simple static question after signing in, **regardless of how they signed in**
(email+password or Google). The gateway authenticates against an existing Cognito pool via
`referenceAuth()`; the pool is owned by the Gen-1 `websocket-app` repo.

**Key platform constraint:** Cognito custom-auth challenges (`Define/Create/VerifyAuthChallenge`) only run
for the `CUSTOM_AUTH` InitiateAuth path — they **do not run for federated/Hosted-UI (Google) sign-in**.
So a Cognito-native challenge can never gate Google users. To cover Google, the question must be asked at
the **application level** after Cognito auth, and enforced via a **token claim**.

Decisions (confirmed with the user):
- **Unified app-level gate** for all sign-in methods (no Cognito-native challenge).
- **Enforcement = token claim** via a `PreTokenGeneration` Lambda reading a `custom:challenge_passed`
  user attribute (PreTokenGeneration *does* run for federated sign-in and on token refresh).
- **Single static Q&A**; the answer is checked server-side, never shipped to the client.

This is the simple first step; it also lays the groundwork for the future accreditation-claims direction
(same PreTokenGeneration mechanism, richer claims later — cf. sister repo
`…/on-board/server/src/middlewares/onboard/amplify/login-accreditation-amplify.mts`, which is post-login
accreditation, not a Cognito challenge).

Repo paths:
- Gen-1 backend: `/home/ischerer/workspaces/ape-la-source/amplify-gen-1/websocket-app/ape-la-source`
- Gateway: `/home/ischerer/workspaces/ape-la-source/amplify-gen-2/gateway/flexi/apps/gateway`

## How it works (end to end)

1. User signs in (password or Google) → Cognito issues tokens. `PreTokenGeneration` adds a
   `challenge_passed` claim derived from `custom:challenge_passed` (false/absent on first sign-in).
2. The app sees `challenge_passed !== 'true'` and shows a blocking **question** UI.
3. User submits the answer to a Next.js API route. The route verifies the caller's token, compares the
   answer to the server-side secret, and on success calls **AdminUpdateUserAttributes** to set
   `custom:challenge_passed = true` (admin creds — the user cannot self-set it).
4. The app forces a token refresh (`fetchAuthSession({ forceRefresh: true })`); PreTokenGeneration re-runs,
   reads the now-true attribute, and the refreshed token carries `challenge_passed: 'true'`.
5. The gate is satisfied; the app proceeds. Same flow for password and Google users.

## Part A — Gen-1: PreTokenGeneration trigger + custom attribute

Via `amplify update auth` (interactive) on resource `v3onBoard05c84909`:
- Add a **custom attribute** `custom:challenge_passed` (String).
  **Security:** it must NOT be in the app client's *write* attributes (so a user can't self-grant via
  `updateUserAttributes`); only the backend sets it with `AdminUpdateUserAttributes`. Verify the generated
  `cli-inputs.json` `userpoolClientWriteAttributes` does **not** list it (and the gateway's
  `bin/update-cognito-user-pool.sh` `--write-attributes` likewise omits it).
- Enable the **PreTokenGeneration** trigger (new function
  `amplify/backend/function/v3onBoard05c84909PreTokenGeneration/`).

**Handler (authored by us; CommonJS, matching `…PostConfirmation/src/add-to-group.js` style):**
```js
exports.handler = async (event) => {
  const passed = event.request.userAttributes['custom:challenge_passed'] === 'true';
  event.response.claimsOverrideDetails = {
    claimsToAddOrOverride: { challenge_passed: passed ? 'true' : 'false' },
  };
  return event;
};
```
(v1 claims override → ID token. If access-token/AppSync enforcement is wanted later, switch to the v2
`claimsAndScopeOverrideDetails`.) Then `amplify push`.

The `Define/Create/Verify` custom-auth Lambdas and `ALLOW_CUSTOM_AUTH` are **not** needed.

## Part B — Gateway: answer-verification API route

New `apps/gateway/src/app/api/auth/challenge/route.ts` (POST):
- Authenticate the caller: verify their Cognito access token with `CognitoJwtVerifier` (reuse the pattern
  in `src/app/api/admin/login/route.ts` GET) to get their `sub`/username.
- Compare the submitted answer to the server secret using a pure helper
  `isChallengeAnswerCorrect(answer, expected)` (case/space-insensitive). Expected answer from server env
  `CHALLENGE_ANSWER` (never `NEXT_PUBLIC_`).
- On success: `AdminUpdateUserAttributes({ UserPoolId, Username, UserAttributes: [{Name:'custom:challenge_passed', Value:'true'}] })`
  via `CognitoIdentityProviderClient` (reuse `src/lib/server-admin-auth.ts` credential/config pattern).
  Ensure the server role has `cognito-idp:AdminUpdateUserAttributes`.
- Return `{ success }`. On wrong answer return `{ success:false }` (no attribute change).

## Part C — Gateway: the blocking question UI

- A pure helper file (e.g. `src/lib/auth-challenge.ts`) with `isChallengeAnswerCorrect` (shared by the
  route) and a `readChallengePassed(session)` reader of the `challenge_passed` ID-token claim.
- A `ChallengeGate` client component that wraps authenticated content (mount near `AuthProvider` in
  `src/app/layout.tsx` / `src/components/auth/AuthProvider.tsx`):
  - If no `useAuthenticator().user` → render children (public browsing unaffected).
  - If signed in and `challenge_passed !== 'true'` (from `fetchAuthSession()`), render the question form
    (static question text — not secret) blocking the app.
  - On submit → POST to the route; on success `await fetchAuthSession({ forceRefresh: true })` then
    re-check and render children.
- Question text can be a non-secret constant / `NEXT_PUBLIC_CHALLENGE_QUESTION`; the **answer stays
  server-side only**.

No change to `src/utils/amplify/configure.ts`. No change to the `<Authenticator>` sign-in flow itself —
the gate sits *after* any successful sign-in, which is what makes it work for Google too.

## TDD

- **PreTokenGeneration** handler — `node --test` (zero deps): attribute `'true'` → claim `'true'`;
  absent/`'false'` → `'false'`.
- **`isChallengeAnswerCorrect`** — vitest (gateway already uses vitest): correct (incl. different
  case/whitespace) → true; wrong/empty → false. Write tests first.

## Critical files

- Gen-1 `amplify/backend/function/v3onBoard05c84909PreTokenGeneration/src/index.js` (+ `*.test.js`)
- Gen-1 `amplify/backend/auth/v3onBoard05c84909/cli-inputs.json` — custom attribute + trigger (via `amplify update auth`)
- Gateway `src/app/api/auth/challenge/route.ts` — verify answer + `AdminUpdateUserAttributes`
- Gateway `src/lib/auth-challenge.ts` (+ `.test.ts`) — `isChallengeAnswerCorrect`, claim reader
- Gateway `ChallengeGate` component + wire into `src/app/layout.tsx` / `AuthProvider`
- Gateway `bin/update-cognito-user-pool.sh` — confirm `custom:challenge_passed` stays OUT of write attrs

## Verification

1. **Unit:** `node --test` (PreTokenGeneration) and `pnpm test:vitest` (`isChallengeAnswerCorrect`).
2. **Deploy Gen-1:** `amplify push`; confirm the custom attribute exists and is not client-writable
   (`aws cognito-idp describe-user-pool-client … --query 'UserPoolClient.WriteAttributes'` excludes it).
3. **Gateway lint:** `pnpm lint` — 0 errors.
4. **End-to-end** (`pnpm compile && pnpm dev`):
   - **Password** sign-in → question gate appears; wrong answer → stays gated; correct → attribute set,
     token refreshes, `challenge_passed:'true'` present (decode idToken), app proceeds.
   - **Google** sign-in → same gate appears after redirect → answer → access. (This is the key new case.)
   - Re-login later → still passed (attribute persists) → no gate.
   - Confirm a user **cannot** self-set the flag: calling `updateUserAttributes` for
     `custom:challenge_passed` from the client is rejected (not in write attrs).
   - **Admin** login + `/api/admin/login` unaffected (PreTokenGeneration just adds a harmless claim).

## Division of labor

- **Code (any machine):** the PreTokenGeneration handler + `node --test`, the gateway API route,
  `auth-challenge.ts` helper + vitest, the `ChallengeGate` component + layout wiring, the env-var wiring.
- **Requires the Gen-1-capable machine (interactive, via `!`):** `amplify update auth` to add
  `custom:challenge_passed` + the PreTokenGeneration trigger, set the `CHALLENGE_ANSWER` secret/env,
  ensure the server role has `AdminUpdateUserAttributes`, and `amplify push` from the Gen-1 repo.
