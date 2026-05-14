# Bypassing pnpm 10+ `verify-deps-before-run` for `pnpm reset:compile`

## Context

Previous fixes:
- `bin/run-reset-compile.sh` was rewritten to plain POSIX `find` + `rm -rf` (no `pnpm exec`, no `rimraf`). This removed the *mid-script* trigger where rimraf wiped its own `dist/` and pnpm auto-healed mid-run.
- That fix is sufficient when invoking `./bin/run-reset-compile.sh` directly.

Remaining problem: `pnpm reset:compile` still triggers a `pnpm install` *before* it launches the script body.

**Root cause:** pnpm 10.0.0 (Jan 2025) introduced `verify-deps-before-run`, defaulting to `install`. pnpm now runs `pnpm install` before any `pnpm run <script>` / `pnpm exec` if `node_modules` drifts from `pnpm-lock.yaml`. ("pnpm was never so invasive before" — correct; pnpm 9 didn't have this setting.)

The check happens *before* the script's body executes, so nothing inside `bin/run-reset-compile.sh` can prevent it. The override has to be applied at the call site or in config that pnpm reads before launching the script.

## What's possible and what isn't

**Not possible: from inside the script.** By the time `bin/run-reset-compile.sh` (or any line inside the `reset:compile` package.json script value) executes, pnpm has already completed the verification step and the unwanted install has already run.

**Possible: at the call site, via an environment variable.** pnpm inherits npm's config-via-env convention — `NPM_CONFIG_<UPPER_SNAKE_CASE>=value` overrides any matching `.npmrc` entry for that one process. The env var only lives for the duration of the command, so it "reverts" itself automatically — no manual cleanup needed.

The truly dynamic, no-config-change, no-revert-needed invocation is therefore:

```bash
NPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false pnpm reset:compile
```

That single command:
- sets the override only for this `pnpm` process
- pnpm skips verification, runs the script
- the env var disappears when the process exits — every other `pnpm run` keeps its safety net

## Implementation options

Pick one of three ergonomic shapes. All preserve the default safety net for normal workflows.

### Option A (recommended) — Per-developer shell alias / function

Each developer adds one line to `~/.bashrc` / `~/.zshrc`:

```bash
alias pnpm-reset='NPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false pnpm reset:compile'
```

…or, if you want it to work transparently when typing `pnpm reset:compile`:

```bash
pnpm() {
  if [[ "$1" == "reset:compile" || "$1" == "reset:install" ]]; then
    NPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false command pnpm "$@"
  else
    command pnpm "$@"
  fi
}
```

- **Pros:** zero repo change, truly dynamic, the rest of `pnpm` retains the default safety net.
- **Cons:** each developer sets it up once; CI / fresh checkouts don't get it.

### Option B — Repo-wide convenience: a wrapper script and a new package.json entry

Add a wrapper that does nothing but pre-set the env var:

**File:** `bin/run-pnpm-reset-compile.sh` (new):
```bash
#!/bin/bash
set -euo pipefail
exec env NPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false pnpm reset:compile
```

**File:** root `package.json`, alongside `reset:compile`:
```jsonc
"reset:compile": "./bin/run-reset-compile.sh",
"reset:compile:safe": "./bin/run-pnpm-reset-compile.sh",
```

Developers now have three entry points:
- `./bin/run-reset-compile.sh` — direct, no pnpm
- `pnpm reset:compile` — convenient but pays the verify-install
- `pnpm reset:compile:safe` — convenient *and* skips the verify-install (the wrapper re-enters pnpm with the env var set)

Note: the *outer* `pnpm reset:compile:safe` invocation still pays one verify-install, but that runs against the current (pre-reset) state. If `node_modules` already matches the lockfile when you call it (the normal case), it's a no-op. After the reset has wiped `node_modules`, subsequent calls in the same session should use `./bin/run-reset-compile.sh` directly.

- **Pros:** in-repo, discoverable via `pnpm run`.
- **Cons:** the indirection is subtle; the "first call after a drift" still verifies.

### Option C — Document a single canonical invocation

Don't add anything. Document in the repo's onboarding / `CLAUDE.md` that the supported invocations are:

- `./bin/run-reset-compile.sh` — direct (cleanest, no pnpm)
- `NPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false pnpm reset:compile` — when you want `pnpm run`'s output framing

And explicitly *not* `pnpm reset:compile` on its own (because the verify-install defeats the operation).

- **Pros:** smallest possible change, zero new files, captures the constraint at the place developers will look.
- **Cons:** relies on humans reading docs.

## Recommendation

Start with **Option C** (a one-paragraph note in `CLAUDE.md` under the reset/build section) plus **Option A** for your own shell. If the team hits this repeatedly, escalate to **Option B**.

Skip a permanent `.npmrc` flip of `verify-deps-before-run=false` — `install` is a useful default for normal dev (it catches lockfile drift on branch switches), and the env-var override gives us the same benefit only when we need it.

## Critical files

- `CLAUDE.md` (in each of the three repos: flexi, v1, apelasource) — add a "Resetting the workspace" note documenting the canonical invocation.
- (Option B only) `bin/run-pnpm-reset-compile.sh` + `package.json` `scripts` entry — only if the team wants the in-repo wrapper.

## Files to leave alone

- `.npmrc` — keep the pnpm 10+ default safety net for everything *except* reset.
- `bin/run-reset-compile.sh` — already correct from the previous round.
- `package.json` `reset:compile` entry — stays pointing at the existing script.

## Verification

```bash
# from $FLEX_PROJ_ROOT
NPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false pnpm reset:compile
# Expect: NO "Scope: all N workspace projects", NO "Done in … using pnpm",
# NO husky prepare output — only the script's own "✓ run-reset-compile.sh:
# workspace wiped clean." trailer.

# Confirm the override is dynamic — without the prefix, install kicks back in:
pnpm reset:compile
# Expect: pnpm runs install first (this is the documented behavior we're routing around)
```

For Option B, also verify:
```bash
pnpm reset:compile:safe
# Expect: same "no inner install" behavior as the env-var-prefixed call.
```

## References

- pnpm settings — `verify-deps-before-run`: https://pnpm.io/settings#verifydepsbeforerun
- pnpm 10.0.0 release notes: introduced `verify-deps-before-run`
- Default value: `install` (pnpm runs install if `node_modules` is not up to date)
