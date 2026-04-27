# APE Strands Agent — AgentCore Deployment Guide

End-to-end steps to ship the Python agent in `agent/` to Amazon Bedrock AgentCore Runtime. The agent serves the AG-UI protocol consumed by the CopilotKit sidebar in `apps/gateway`.

---

## 1. Prerequisites

Install on your machine:

- Docker with `buildx` (we build **linux/arm64** images — AgentCore runs on Graviton)
- `uv` (Python project/venv manager)
- `pnpm` (so `pnpm exec dotenvx` works — `dotenvx` is not on the global PATH)
- `aws` CLI
- IAM user/role (`AWS_PROFILE` in `env/public/.env.$FLEX_MODE`) with these permissions:
  - `AmazonEC2ContainerRegistryFullAccess` — push + create ECR repos
  - `BedrockAgentCoreFullAccess` — create / update AgentCore runtimes
  - `iam:PassRole` on the runtime role (covered by `BedrockAgentCoreFullAccess`, but only for roles named `*BedrockAgentCore*`)

An IAM **runtime role** already created with:
- Trust policy: `bedrock-agentcore.amazonaws.com` as a trusted principal
- Permissions: Bedrock model invoke, CloudWatch logs, and any AWS services the agent's tools touch
- **Role name must contain `BedrockAgentCore`** (e.g. `BedrockAgentCoreRuntimeRole`) — otherwise the `BedrockAgentCoreFullAccess` managed policy's `PassRole` resource pattern (`arn:aws:iam::*:role/*BedrockAgentCore*`) won't match and deployment fails with an AccessDenied.

Confirm env file for the target mode exists and has all required keys:

```
env/public/.env.development
env/public/.env.production
```

Required keys:

| Key                                       | Purpose                                                     |
|-------------------------------------------|-------------------------------------------------------------|
| `AWS_REGION`                              | AWS region (e.g. `eu-west-3`)                               |
| `AWS_PROFILE`                             | Local profile used by `aws`, `boto3`                        |
| `FLEX_AWS_ORG_ID`                         | AWS account ID                                              |
| `FLEX_ECR_REPOSITORY`                     | ECR repo name, e.g. `gateway-strands-agent`                 |
| `FLEX_AGENT_RUNTIME_NAME`                 | Runtime name, e.g. `ape_assistant`                          |
| `FLEX_AGENT_RUNTIME_ROLE_ARN`             | ARN of the runtime role (must match `*BedrockAgentCore*`)   |
| `FLEX_AWS_COGNITO_USER_POOL_ID`           | Cognito pool that issues JWTs AgentCore will trust          |
| `FLEX_AWS_COGNITO_USER_POOL_APP_CLIENT_ID`| App client ID — used as `allowedClients` on the authorizer  |
| `NEXT_PUBLIC_AGENT_URL`                   | Invocation URL the Next proxy forwards to (set after step 4)|

Sensitive values should be dotenvx-encrypted.

---

## 2. Build the ARM64 Docker image

```bash
cd agent
docker buildx build --platform linux/arm64 -t gateway-strands-agent:latest .
```

The `buildx --platform linux/arm64` flag is required. AgentCore rejects amd64 images.

Quick smoke test locally (works without AgentCore):

```bash
./run.sh        # uses dotenvx to load env/public/.env.development, runs uvicorn on $FLEX_AGENT_PORT
curl http://localhost:8061/ping     # expect {"status": "healthy"}
```

---

## 3. Push the image to ECR

```bash
cd agent
./push-to-ecr.sh              # development (default)
./push-to-ecr.sh production   # production
```

What the script does:
1. Loads env from `env/public/.env.$FLEX_MODE` via `pnpm exec dotenvx`.
2. `aws ecr describe-repositories` — creates the repo if missing.
3. `aws ecr get-login-password | docker login …` — auth Docker to ECR.
4. `docker tag` + `docker push` — remote tag defaults to `latest`; override with `IMAGE_TAG=…`.

Common override:

```bash
LOCAL_IMAGE=gateway-strands-agent:latest IMAGE_TAG=v2 ./push-to-ecr.sh production
```

---

## 4. Create / update the AgentCore runtime

```bash
cd agent
./deploy.sh              # development
./deploy.sh production   # production
```

Under the hood `deploy.sh` runs `pnpm exec dotenvx run -f env/public/.env.$FLEX_MODE -- uv run --project agent python deploy_agent.py`. The `uv run --project` + absolute script path shields it from pnpm shifting the working directory to the workspace root.

`deploy_agent.py`:
- Pages `list_agent_runtimes` to find a runtime by name (AgentCore's update API keys on `agentRuntimeId`, not name).
- If one exists → `update_agent_runtime`. Otherwise → `create_agent_runtime`.
- If `FLEX_AWS_COGNITO_USER_POOL_ID` + `FLEX_AWS_COGNITO_USER_POOL_APP_CLIENT_ID` are set, wires up `authorizerConfiguration.customJWTAuthorizer` with:
  - `discoveryUrl`: `https://cognito-idp.{region}.amazonaws.com/{poolId}/.well-known/openid-configuration`
  - `allowedClients`: `[appClientId]`

The script prints the ARN and the invocation URL — copy the invocation URL into `NEXT_PUBLIC_AGENT_URL` (or `FLEX_AGENT_HOST`) in the matching env file. **Keep the `?accountId=…&qualifier=DEFAULT` query params** — the Next proxy in `apps/gateway/src/app/api/copilotkit/[[...path]]/route.ts` forwards the URL verbatim; AgentCore requires both.

Example invocation URL shape:

```
https://bedrock-agentcore.eu-west-3.amazonaws.com/runtimes/ape_assistant/invocations?accountId=658302359958&qualifier=DEFAULT
```

---

## 5. Authentication: Cognito JWT via the Next proxy (Option A, current)

### How the token flows

```
Browser (Amplify session)
  │  Next.js page fetches /api/copilotkit/...   (cookies attached)
  ▼
Next route handler    apps/gateway/src/app/api/copilotkit/[[...path]]/route.ts
  │  runWithAmplifyServerContext → fetchAuthSession → accessToken JWT
  │  AsyncLocalStorage.run(token, () => honoHandler(req))
  ▼
AuthForwardingHttpAgent.requestInit → adds `Authorization: Bearer <jwt>`
  ▼
Bedrock AgentCore → validates JWT against discoveryUrl + allowedClients
  ▼
Strands runtime → Python agent → Bedrock model
```

Key pieces:

- **Route handler** (`route.ts`) grabs the Cognito access token from the request cookies via `runWithAmplifyServerContext` + `fetchAuthSession`, stashes it in an `AsyncLocalStorage`, then calls the Hono handler.
- **`AuthForwardingHttpAgent`** (subclass of `@ag-ui/client`'s `HttpAgent`) overrides `requestInit` to inject the token from ALS — so the singleton agent instance stays thread-safe across concurrent requests.
- **Internal JSON-RPC re-fetch** (the root POST handler's `fetch(agentUrl)`) forwards the bearer token explicitly, because the inner HTTP request does not carry session cookies.
- **Runtime-side** (`deploy_agent.py`) wires the Cognito pool as the `customJWTAuthorizer` so AgentCore rejects anything without a valid JWT issued for the matching app client.

### Why this choice

- Browser users are already signed in to the Amplify Cognito pool (shared with the rest of the app); no separate user pool via `agentcore identity setup-cognito`.
- Per-user identity reaches AgentCore: real audit trail, per-user rate limits, no risk that a scraper hammering `/api/copilotkit/…` runs up Bedrock bills.
- The Next server never signs with its own IAM credentials for agent traffic — smaller blast radius if the server leaks.

### Verify end-to-end

1. Deploy (step 4) — watch for `JWT authorizer: …/.well-known/openid-configuration` in the output.
2. Sign in to the app → open the CopilotKit sidebar → send a message. Network panel should show:
   - Browser → `/api/copilotkit/…` without Authorization header (just cookies).
   - Next proxy → AgentCore with `Authorization: Bearer eyJ…`.
3. Sign out → sidebar message fails with 401 / 403 from AgentCore. Expected.
4. Curl the invocation URL directly without a token → 401. Confirms the authorizer is live.

---

## 6. Updating the agent

Same loop: rebuild → push → deploy.

```bash
cd agent
docker buildx build --platform linux/arm64 -t gateway-strands-agent:latest .
./push-to-ecr.sh production
./deploy.sh production
```

`deploy_agent.py` detects the existing runtime and issues `update_agent_runtime` with the new container URI. AgentCore re-rolls the fleet; no downtime handling needed.

---

## 7. Troubleshooting

| Symptom                                                         | Likely cause / fix                                                                                                                |
|-----------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `AccessDeniedException` on `ecr:CreateRepository`               | Attach `AmazonEC2ContainerRegistryFullAccess` (legacy name — search IAM for `EC2ContainerRegistry`, not `ECR`).                   |
| `AccessDeniedException … iam:PassRole … role/AgentRuntimeRole`  | Runtime role name doesn't match `*BedrockAgentCore*`. Rename the role (e.g. `BedrockAgentCoreRuntimeRole`) and update `FLEX_AGENT_RUNTIME_ROLE_ARN`. |
| `ParamValidationError: Missing required parameter: agentRuntimeId` | You're on an older `deploy_agent.py`. Update — the API updates by `agentRuntimeId`, not name.                                  |
| `ModuleNotFoundError: No module named 'boto3'`                  | You ran `python deploy_agent.py` with the system Python. Use `uv run python deploy_agent.py` (or `./deploy.sh`).                  |
| `can't open file '/…/deploy_agent.py'`                          | `pnpm exec` shifted CWD to the workspace root. Use `./deploy.sh` — it passes an absolute path.                                    |
| `dotenvx: command not found`                                    | Bare `dotenvx` isn't on PATH in this repo. Use `pnpm exec dotenvx` or just `./deploy.sh` / `./push-to-ecr.sh`.                    |
| 401/403 from AgentCore                                          | JWT issue. Check user is signed in, access token not expired, `allowedClients` includes the Amplify app client ID.                |
| 400 "qualifier is required"                                     | You stripped `?qualifier=DEFAULT` from `NEXT_PUBLIC_AGENT_URL`. Put it back.                                                      |

---

## 8. Future — Option B: browser → AgentCore direct (nice-to-have)

Today every agent message double-hops Browser → Next proxy → AgentCore. The proxy buys us server-side token extraction from HTTP-only auth cookies and a single place to log / rate-limit. Cost: extra latency on SSE streams, one more moving part.

If we want to drop the proxy:

1. **CopilotKit client** is configured with `runtimeUrl` pointing at the bare AgentCore invocation URL rather than `/api/copilotkit`.
2. **Amplify client** retrieves the Cognito access token in the browser (`fetchAuthSession().tokens?.accessToken?.toString()`) and attaches it as `Authorization: Bearer …` via CopilotKit's `headers` / `transport` hook.
3. **AgentCore**'s `customJWTAuthorizer` is unchanged — validation already happens there, not in the Next route.
4. **CORS**: AgentCore's invocation endpoint must return the right `Access-Control-Allow-Origin` for our domain. This needs verification — it's the main unknown and the reason this isn't the default today.
5. **Next route** (`/api/copilotkit/[[...path]]/route.ts`) can then be deleted entirely, along with the `AuthForwardingHttpAgent` / ALS plumbing. `NEXT_PUBLIC_AGENT_URL` becomes the client-facing URL.

Benefits:
- Shorter latency for SSE (CopilotKit streams tokens to the browser in real time).
- Less code in `apps/gateway`.
- One trust boundary instead of two.

Blockers to research before committing:
- CORS on the AgentCore invocation endpoint (preflight + credentialed fetches).
- Whether the CopilotKit v2 client can be told to send `Authorization` per-request from an async source (access tokens expire and must be refreshed).
- Observability — today we can log every agent request in the Next proxy; direct calls only show up in CloudWatch.

Revisit once the server-proxy approach has been stable in production for a while.
