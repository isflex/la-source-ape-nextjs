#!/bin/bash
set -euo pipefail

cd "$FLEX_PROJ_ROOT"

# Each line below is an INDEPENDENT find call. Comment any line out to skip
# that category — same workflow as the previous rimraf version.
#
# Every cache-pass line begins with `-name node_modules -prune -o` so find
# never descends into node_modules subtrees (the .pnpm/<pkg>/dist explosion
# is what made naive globbing unbearably slow on a populated workspace).
# node_modules itself is wiped by the final block.

# --- caches & build outputs --------------------------------------------------
find . -name node_modules -prune -o -type d -name '.turbo'         -prune -exec rm -rf {} +
find . -name node_modules -prune -o -type d -name '.webpack-cache' -prune -exec rm -rf {} +
find . -name node_modules -prune -o -type d -name 'dist'           -prune -exec rm -rf {} +
find . -name node_modules -prune -o -type d -name 'build'          -prune -exec rm -rf {} +
find . -name node_modules -prune -o -type d -name '.next'          -prune -exec rm -rf {} +

# --- typescript build info ---------------------------------------------------
find . -name node_modules -prune -o -type f -name '*.tsbuildinfo' -exec rm -f {} +

# --- ALL node_modules (workspace + nested) — comment out to keep them --------
find . -type d -name 'node_modules' -prune -exec rm -rf {} +

echo "✓ run-reset-compile.sh: workspace wiped clean."
