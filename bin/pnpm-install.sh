#!/bin/bash
# Detect host (cpu / os / libc) and run `pnpm install` filtered to that host
# only, so we don't materialise wrong-platform native binaries (e.g. musl
# variants on a glibc host). Forwards extra args to pnpm.
#
# pnpm 10 only honours `supportedArchitectures` from package.json#pnpm —
# CLI flags / .npmrc are silently ignored — so we mutate package.json,
# run install, and restore on exit (success, error, or interrupt).
#
# Bypass with FLEX_INSTALL_NO_FILTER=1 or CI=true to run a plain
# `pnpm install` — used by Amplify CI which manages its own platform.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."

cd "$PROJECT_ROOT"

if [ "${FLEX_INSTALL_NO_FILTER:-}" = "1" ] || [ "${CI:-}" = "true" ]; then
    echo "pnpm-install: bypassing platform filter (CI/FLEX_INSTALL_NO_FILTER)"
    exec pnpm install "$@"
fi

case "$(uname -m)" in
    x86_64|amd64) CPU="x64" ;;
    aarch64|arm64) CPU="arm64" ;;
    i386|i686) CPU="ia32" ;;
    *) echo "pnpm-install: unknown cpu '$(uname -m)' — falling back to plain install" >&2
       exec pnpm install "$@" ;;
esac

case "$(uname -s)" in
    Linux) OS="linux" ;;
    Darwin) OS="darwin" ;;
    MINGW*|MSYS*|CYGWIN*) OS="win32" ;;
    *) echo "pnpm-install: unknown os '$(uname -s)' — falling back to plain install" >&2
       exec pnpm install "$@" ;;
esac

LIBC=""
if [ "$OS" = "linux" ]; then
    if ldd --version 2>&1 | grep -qi musl; then
        LIBC="musl"
    else
        LIBC="glibc"
    fi
fi

PKG="$PROJECT_ROOT/package.json"
LOCK="$PROJECT_ROOT/pnpm-lock.yaml"
PKG_BACKUP="$(mktemp)"
LOCK_BACKUP="$(mktemp)"
cp "$PKG" "$PKG_BACKUP"
HAD_LOCK=0
if [ -f "$LOCK" ]; then
    cp "$LOCK" "$LOCK_BACKUP"
    HAD_LOCK=1
fi
# Restore both files on any exit. The committed lockfile must not drift
# from the unfiltered shape — pnpm install under supportedArchitectures
# prunes optional native deps and CI then trips on ERR_PNPM_EEXIST.
trap '
    cp "$PKG_BACKUP" "$PKG"
    if [ "$HAD_LOCK" = "1" ]; then cp "$LOCK_BACKUP" "$LOCK"; fi
    rm -f "$PKG_BACKUP" "$LOCK_BACKUP"
' EXIT INT TERM

echo "pnpm-install: filtering to cpu=$CPU os=$OS${LIBC:+ libc=$LIBC}"

CPU="$CPU" OS="$OS" LIBC="$LIBC" PKG="$PKG" node -e '
  const fs = require("fs");
  const pkg = JSON.parse(fs.readFileSync(process.env.PKG, "utf8"));
  pkg.pnpm = pkg.pnpm || {};
  const sa = { cpu: [process.env.CPU], os: [process.env.OS] };
  if (process.env.LIBC) sa.libc = [process.env.LIBC];
  pkg.pnpm.supportedArchitectures = sa;
  fs.writeFileSync(process.env.PKG, JSON.stringify(pkg, null, 2) + "\n");
'

pnpm install "$@"
