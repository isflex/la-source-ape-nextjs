#!/bin/bash
# Run ampx sandbox with Zod 3.x compatibility, auto-restore Zod 4.x after
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."

cd "$PROJECT_ROOT"

echo "Switching to Zod 3.x for Amplify compatibility..."
node bin/switch-zod-version.mjs 3
pnpm install

echo "Running ampx sandbox..."
cd apps/gateway
pnpm ampx sandbox "$@"
EXIT_CODE=$?

echo "Restoring Zod 4.x for local development..."
cd "$PROJECT_ROOT"
node bin/switch-zod-version.mjs 4
pnpm install

exit $EXIT_CODE
