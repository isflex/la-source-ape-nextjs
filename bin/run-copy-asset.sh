#!/bin/bash
set -euo pipefail

if [[ "${FLEX_MODE:-}" != "development" ]]; then
  echo "[copy:asset] FLEX_MODE='${FLEX_MODE:-}' (not 'development') — skipping."
  exit 0
fi

if [[ $# -eq 0 ]]; then
  echo "[copy:asset] usage: $0 <SRC1:DEST1> [SRC2:DEST2 ...]" >&2
  echo "  SRC  is relative to \$FLEX_PROJ_ROOT/node_modules/" >&2
  echo "  DEST is relative to the caller's CWD" >&2
  exit 1
fi

: "${FLEX_PROJ_ROOT:?FLEX_PROJ_ROOT must be set}"

for pair in "$@"; do
  if [[ "$pair" != *:* ]]; then
    echo "[copy:asset] bad pair '$pair' (expected SRC:DEST)" >&2
    exit 1
  fi
  src="${pair%%:*}"
  dest="${pair#*:}"
  if [[ -z "$src" || -z "$dest" ]]; then
    echo "[copy:asset] bad pair '$pair' (expected SRC:DEST)" >&2
    exit 1
  fi
  abs_src="$FLEX_PROJ_ROOT/node_modules/$src"
  if [[ ! -f "$abs_src" ]]; then
    echo "[copy:asset] 🚨 source not found: $abs_src" >&2
    exit 0
  fi
  mkdir -p "$(dirname "$dest")"
  cp -v "$abs_src" "$dest"
done
