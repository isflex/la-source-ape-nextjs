#!/bin/bash

# API Route Pre-warming Script
# Listens to next:dev:all's stdout (mirrored to a shared log file via `tee`)
# and warms HTTP routes the moment Next.js reports it is ready.

set -u

LOG_FILE="$FLEX_PROJ_ROOT/tmp/next-dev-all.log"
GATEWAY_URL="http://${FLEX_GATEWAY_HOSTNAME}:${FLEX_GATEWAY_PORT}"

mkdir -p "$(dirname "$LOG_FILE")"

# Delete any stale log from a previous run before tailing, otherwise a stale
# "○ Compiling /xxx" line would trigger awk instantly. next:dev:all's `tee`
# (sibling, started simultaneously) will recreate the file.
rm -f "$LOG_FILE"
touch "$LOG_FILE"

echo "⏳ Listening to $LOG_FILE for Next.js dev server readiness..."

# Block until awk sees the first "Compiling /<route>" line.
# Matches `○ Compiling /instrumentation`, `○ Compiling /about`,
# `○ Compiling /api/...`, etc. — but NOT `○ Compiling proxy` or
# `○ Compiling middleware` (their argument doesn't start with `/`).
# `tail -F` re-attaches to the file after `tee` truncates it on dev start.
tail -F -n +1 "$LOG_FILE" 2>/dev/null | awk '
  /Compiling \// {
    print "🔥 Warming up API routes..."
    fflush()
    exit
  }
'

echo "   📧 Newsletter API..."
RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  --connect-timeout 60 --max-time 120 "$GATEWAY_URL/api/newsletter")
echo "      Newsletter API responded with: $RESPONSE_CODE"

echo "   🖼️  Newsletter logo API..."
LOGO_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  --connect-timeout 60 --max-time 120 "$GATEWAY_URL/api/newsletter?logo=base64")
echo "      Logo API responded with: $LOGO_RESPONSE"

echo "   📤 Upload API..."
UPLOAD_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  --connect-timeout 60 --max-time 120 "$GATEWAY_URL/api/upload")
echo "      Upload API responded with: $UPLOAD_RESPONSE"

if [[ "$RESPONSE_CODE" == "200" ]] || [[ "$UPLOAD_RESPONSE" == "405" ]]; then
  echo "✅ API routes pre-warming completed successfully"
else
  echo "⚠️  API routes may not have compiled properly"
fi
echo "🚀 API routes should now respond faster!"
