# Plan: Sign-in question/answer gate (works for password AND Google sign-in)

> **Status:** Application code implemented in BOTH repos (gateway route/helper/ChallengeGate +
> websocket express endpoint/ChallengeGateComponent/AuthComponent wiring). Gen-1 backend **deployed
> to the `dev` env and verified**: `custom:challenge_passed` in schema (not client-writable),
> PreTokenGeneration attached and live-invoked (absent→'false', 'true'→'true'), backends' IAM user
> (`isflex-amplify`, shared by both repos in dev) has Cognito admin-API access. Remaining: browser
> e2e (password + Google), the `prod` amplify env (same Part A steps incl. the corepack lockfile
> gotcha), and production `FLEX_CHALLENGE_ANSWER` values in both repos' `.env.production`.

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
- Gen-1 backend (websocket app): `/home/ischerer/workspaces/flex/websocket-app/ape-la-source`
- Gateway: `/home/ischerer/workspaces/flex/la-source-ape/gateway/flexi/apps/gateway`

**Scope addition:** the gate is wired not only into the gateway (`src/app/layout.tsx` /
`AuthProvider`) but also into the websocket repo's own client at
`apps/la-source/ape/on-board/client/src/AuthComponent.tsx`, with a matching express verification
endpoint — see Part D.

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

Runs anywhere the Amplify CLI 14.x is installed and AWS creds work (this dev machine qualifies —
the original "needs a separate Gen-1 machine" assumption was wrong). In this order:

1. **Custom attribute via direct CLI** — the Gen-1 `amplify update auth` walkthrough has no
   custom-attribute prompt, and `amplify override auth` CFN `Schema` edits on an existing pool risk
   user-pool *replacement*. The direct call is append-only and creates no Amplify-config drift
   (cli-inputs.json has no representation of custom attributes):
   ```bash
   aws cognito-idp add-custom-attributes --user-pool-id $FLEX_AWS_COGNITO_USER_POOL_ID \
     --custom-attributes Name=challenge_passed,AttributeDataType=String,Mutable=true,StringAttributeConstraints='{MinLength=0,MaxLength=8}'
   ```
   **Security:** it must NOT be in the app client's *write* attributes (so a user can't self-grant via
   `updateUserAttributes`); only the backends set it with `AdminUpdateUserAttributes`. Leave
   `cli-inputs.json` `userpoolClientWriteAttributes`/`ReadAttributes` untouched (and the gateway's
   `bin/update-cognito-user-pool.sh` `--write-attributes` likewise omits it).

2. **PreTokenGeneration trigger** via `amplify update auth` (interactive) on resource
   `v3onBoard05c84909`, choosing "Walkthrough all the auth configurations" and re-confirming every
   existing answer. ⚠️ The trigger config hides behind a **Y/n question near the END of the long
   walkthrough** — "Do you want to configure Lambda Triggers for Cognito?" defaults to No and is
   easy to miss; a first attempt recorded *nothing* because of it. Answer **Yes** → checklist:
   **keep Custom Message and Post Confirmation checked** (unchecking unregisters them), additionally
   check **Pre Token Generation** → template **"Alter Claims in Id Token"** → "edit the function
   now?" → No. Do NOT pre-create the function dir — the CLI scaffolds
   `amplify/backend/function/v3onBoard05c84909PreTokenGeneration/`. No IAM `permissions` entry is
   needed (the Lambda only reads the event).

   **Pre-push verification gate** (the CLI writes everything BEFORE push — if `git diff` is missing
   any of these, the trigger was not recorded and push will not create it):
   - new function dir with `function-parameters.json` → `"triggerTemplate": "PreTokenGeneration.json.ejs"`
   - `cli-inputs.json`: `triggers.PreTokenGeneration: ["alter-claims"]` + `dependsOn` +
     `authTriggerConnections` entries
   - `backend-config.json`: `function.v3onBoard05c84909PreTokenGeneration` entry + auth `dependsOn` entry
   - no unwanted changes (write attributes / OAuth URLs untouched)

3. **Replace the generated `src/alter-claims.js`** (authored by us; CommonJS, matching
   `…PostConfirmation/src/add-to-group.js` style). It MUST never throw — a throwing
   PreTokenGeneration blocks ALL sign-ins pool-wide:
```js
/**
 * PreTokenGeneration (V1): map custom:challenge_passed -> `challenge_passed` ID-token claim.
 * Twin consumer: gateway src/lib/auth-challenge.ts readChallengePassed().
 * MUST never throw — a PreTokenGeneration error blocks ALL sign-ins.
 */
exports.handler = async (event) => {
  const passed = event?.request?.userAttributes?.['custom:challenge_passed'] === 'true'
  event.response = event.response || {}
  event.response.claimsOverrideDetails = {
    claimsToAddOrOverride: { challenge_passed: passed ? 'true' : 'false' },
  }
  return event
}
```
(v1 claims override → ID token. If access-token/AppSync enforcement is wanted later, switch to the v2
`claimsAndScopeOverrideDetails`.)

4. **Add `src/alter-claims.test.js`** (zero-dep `node --test`, run with
   `node --test amplify/backend/function/v3onBoard05c84909PreTokenGeneration/src/alter-claims.test.js`
   — point at the file, NOT the directory: a directory run also executes the scaffolded `index.js`
   loader, which throws on the missing `MODULES` env var):
```js
const { test } = require('node:test')
const assert = require('node:assert')
const { handler } = require('./alter-claims')

const claim = (event) => event.response.claimsOverrideDetails.claimsToAddOrOverride.challenge_passed

test("attribute 'true' -> claim 'true'", async () => {
  const event = { request: { userAttributes: { 'custom:challenge_passed': 'true' } }, response: {} }
  assert.strictEqual(claim(await handler(event)), 'true')
})

test("attribute absent -> claim 'false'", async () => {
  const event = { request: { userAttributes: {} }, response: {} }
  assert.strictEqual(claim(await handler(event)), 'false')
})

test("attribute 'false' -> claim 'false'", async () => {
  const event = { request: { userAttributes: { 'custom:challenge_passed': 'false' } }, response: {} }
  assert.strictEqual(claim(await handler(event)), 'false')
})

test('malformed event does not throw, claim false', async () => {
  const event = {}
  assert.strictEqual(claim(await handler(event)), 'false')
})
```

5. ⚠️ **Corepack gotcha:** before pushing, the new function's `src/` needs a `package-lock.json`
   (`cd …PreTokenGeneration/src && npm install --package-lock-only --ignore-scripts`). Without a
   lockfile, Amplify's function build probes `yarn --version`, which corepack kills in this repo
   (root `"packageManager": "pnpm@…"`) and the push aborts during local packaging. The existing
   CustomMessage/PostConfirmation functions already carry npm lockfiles for this reason.

6. Validate generation first with `pnpm exec amplify build` — the regenerated
   `amplify/backend/auth/v3onBoard05c84909/build/auth-trigger-cloudformation-template.json` must
   contain a `UserPoolPreTokenGenerationLambdaInvokePermission` alongside the existing two. Then
   `amplify push` — review the CFN diff: new Lambda + `LambdaConfig` wiring only, **no UserPool
   replacement**. Repeat Part A for the `prod` amplify env later (`amplify env checkout prod`;
   attribute creation on the prod pool + push).

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
    (static question text — not secret) **instead of** children (mutual exclusion — NOT an overlay), so
    the protected app is never in the DOM while gated and can't be revealed by deleting the modal node
    in devtools. ('checking' and 'passed' both render children → no blank-flash for public visitors,
    SSR/hydration parity preserved.)
  - On submit → POST to the route; on success `await fetchAuthSession({ forceRefresh: true })` then
    re-check and render children.
- Question text can be a non-secret constant / `NEXT_PUBLIC_CHALLENGE_QUESTION`; the **answer stays
  server-side only**.

No change to `src/utils/amplify/configure.ts`. No change to the `<Authenticator>` sign-in flow itself —
the gate sits *after* any successful sign-in, which is what makes it work for Google too.

## Part D — Websocket repo: gate in AuthComponent.tsx + express verification endpoint

The websocket repo's own client must be gated too (same pool, same claim). **Implemented:**

- **Client** `apps/la-source/ape/on-board/client/src/ChallengeGateComponent.tsx` (new; mirrors
  `BouncerComponent.tsx` idioms — `Modal`/`InfoBlock*` from
  `@flex-design-system/react-ts/client-sync-styled-default`): reads
  `session.tokens?.idToken?.payload?.['challenge_passed']` via `fetchAuthSession()`; when not
  `'true'`, replaces its children with a blocking question modal; POSTs `{ answer }` with
  `Authorization: Bearer <accessToken>` to `${FLEX_POKER_BACK_HOST}/api/verify-challenge-amplify`;
  on success `fetchAuthSession({ forceRefresh: true })`. The question text is a hard-coded constant
  (non-secret; rspack has no env plumbing for new vars).
- **Wiring** in `AuthComponent.tsx`'s `route === 'authenticated'` branch:
  `<AuthSignedIn /><ChallengeGateComponent><BouncerComponent …/></ChallengeGateComponent>`.
- **Hub interaction:** the module-level `Hub.listen('auth')` in `AuthComponent.tsx` reloads the page
  on `tokenRefresh`. The post-answer `forceRefresh` therefore reloads — this is safe and loop-free
  (tokens carrying the new claim are persisted before the event fires; after reload the cached
  session reads `'true'`).
- **Server** `apps/la-source/ape/on-board/server/src/middlewares/onboard/amplify/verify-challenge-amplify.mts`
  (new; mirrors `sign-user-agreement-amplify.mts`): zod-validates `{ answer }`, verifies the access
  token via `req.app.locals.authManager`, compares with `isChallengeAnswerCorrect` (twin helper at
  `src/functions/auth-challenge.mts`) against `FLEX_CHALLENGE_ANSWER`, then
  `AdminUpdateUserAttributesCommand` (`@aws-sdk/client-cognito-identity-provider`, added to the
  server package) with `UserPoolId: FLEX_AWS_COGNITO_USER_POOL_ID`. Registered in `src/server.mts` as
  `POST /api/verify-challenge-amplify`. The server's IAM user needs
  `cognito-idp:AdminUpdateUserAttributes` on the pool.
- **Env:** `FLEX_CHALLENGE_ANSWER` (same value as the gateway's) in `env/public/.env.development`
  (done, dev placeholder) and `.env.production` (to set at deploy time).

## Part E — Deploy ordering

Backend first, then clients: a client gate shipped before the attribute + PreTokenGeneration Lambda
exist is **unpassable** (the claim never appears and `AdminUpdateUserAttributes` errors on the
unknown attribute). Order: Part A (`amplify push`) → websocket server → websocket client → gateway.
Pre-existing users are gated once at their next sign-in/refresh; optionally pre-seed the admin
user's attribute so automated flows never see the gate.

## TDD

- **PreTokenGeneration** handler — `node --test` (zero deps): attribute `'true'` → claim `'true'`;
  absent/`'false'` → `'false'`.
- **`isChallengeAnswerCorrect`** — vitest (gateway already uses vitest): correct (incl. different
  case/whitespace) → true; wrong/empty → false. Write tests first.

## Critical files

- Gen-1 `amplify/backend/function/v3onBoard05c84909PreTokenGeneration/src/alter-claims.js` (+ `.test.js`) — CLI-scaffolded, then replaced with the code in Part A
- Gen-1 `amplify/backend/auth/v3onBoard05c84909/cli-inputs.json` — trigger wiring (via `amplify update auth`); attribute via `add-custom-attributes` (Part A)
- Gateway `src/app/api/auth/challenge/route.ts` — verify answer + `AdminUpdateUserAttributes` ✅
- Gateway `src/lib/auth-challenge.ts` (+ `.test.ts`) — `isChallengeAnswerCorrect`, claim reader ✅
- Gateway `src/components/auth/ChallengeGate.tsx` + wired into `src/app/layout.tsx` ✅
- Gateway `bin/update-cognito-user-pool.sh` — confirm `custom:challenge_passed` stays OUT of write attrs (verified, no change needed)
- Websocket `apps/la-source/ape/on-board/client/src/ChallengeGateComponent.tsx` + `AuthComponent.tsx` wiring ✅
- Websocket `apps/la-source/ape/on-board/server/src/middlewares/onboard/amplify/verify-challenge-amplify.mts` + `src/functions/auth-challenge.mts` + `src/server.mts` registration ✅

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

- **Code (any machine) — DONE:** the gateway API route, `auth-challenge.ts` helper + vitest, the
  `ChallengeGate` component + layout wiring, the websocket `ChallengeGateComponent` +
  `AuthComponent.tsx` wiring, the `verify-challenge-amplify.mts` middleware + registration, and the
  dev env-var wiring (`FLEX_CHALLENGE_ANSWER` placeholder "La Source" /
  `NEXT_PUBLIC_FLEX_CHALLENGE_QUESTION` in both repos' `.env.development` — choose real production
  values at deploy time).
- **Gen-1 backend (`dev` env) — DONE except push:** attribute created, trigger scaffolded
  (walkthrough Part A.2, pre-push gate verified), handler + test in place (4/4 pass),
  `amplify build` validated. **Remaining (interactive, via `!`):** `amplify push` for `dev`, the
  same Part A run for `prod`, set `FLEX_CHALLENGE_ANSWER` in `.env.production` of both repos, and
  ensure both backends' principals have `cognito-idp:AdminUpdateUserAttributes` on the pool.

## Part F — Server-side guardrail (websocket app; defense beyond the client gate)

The client `ChallengeGateComponent` is UX/defense-in-depth only (a user can delete the modal node or
call the backend directly). Real enforcement of `custom:challenge_passed` was added server-side:

- **Express middleware** `apps/la-source/ape/on-board/server/src/middlewares/onboard/amplify/
  require-challenge-passed.mts` — verifies the access token (`authManager`), then reads
  `custom:challenge_passed` via Cognito `AdminGetUser` (the V1 claim is in the ID token, not the
  access token the client sends to express; AdminGetUser is also staleness-free). 403
  `{ code: 'CHALLENGE_NOT_PASSED' }` if not `'true'`; 60s positive in-memory cache. Wired as the first
  handler on the express WRITE routes in `server.mts`: add/remove-participant, submit-controle-parentale,
  submit-sponsoring, create-contact-form, create-reply-contact-form. (login-accreditation &
  verify-challenge & get-* are intentionally NOT guarded.)
- **AppSync resolver gate** for create-event, which writes **directly client→AppSync** (bypassing
  express): additive `postAuth.2` VTL slots in `amplify/backend/api/v3onBoardEvent/resolvers/` for
  `Mutation.create{OnBoardEvent,Times,TTime,Attendees}` — `$util.unauthorized()` when
  `$util.authType() == "User Pool Authorization"` and `challenge_passed != 'true'`. IAM (server) and
  API-key callers pass through. Works because Amplify sends the **ID token** (which carries the claim)
  to AppSync for userPool auth. Needs `amplify push` to deploy (review CFN: resolver changes only).
- IAM: the server principal (`isflex-amplify`) already has Cognito admin access (AdminGetUser confirmed
  available at runtime) — no new grant needed for `dev`.
- Verify: claim=false → guarded express route returns 403 + client surfaces the gate (via
  `openChallengeGate()`/`ChallengeGateHost`); raw userPool `createOnBoardEvent` → `Unauthorized`; pass
  the gate (token refresh) → both succeed; server IAM writes and apiKey reads unaffected throughout.
