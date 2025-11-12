#!/bin/bash

# API Route Pre-warming Script
# This script pre-compiles API routes during development startup to eliminate first-call delays

echo "🔥 Warming up API routes..."

# Configuration
GATEWAY_URL="http://${FLEX_GATEWAY_HOSTNAME}:${FLEX_GATEWAY_PORT}"
MAX_RETRIES=30
RETRY_DELAY=2

# Dynamic delay based on whether we're using Turbopack (faster) or Webpack (slower)
if [[ "$0" == *"turbo"* ]] || [[ "$TURBO_ENABLED" == "true" ]]; then
  INITIAL_DELAY=5  # Turbopack is faster
else
  INITIAL_DELAY=15  # Webpack needs more time
fi

# Initial delay to let dev server fully start
echo "⏳ Waiting ${INITIAL_DELAY}s for development server to initialize..."
sleep $INITIAL_DELAY

# Wait for dev server to be ready by checking if it responds (any status is fine)
echo "⏳ Checking development server at $GATEWAY_URL..."
for i in $(seq 1 $MAX_RETRIES); do
  # Check if server responds (404/500 is ok, just means server is running)
  if curl -s -o /dev/null -w "%{http_code}" "$GATEWAY_URL" | grep -E "^[0-9]{3}$" > /dev/null 2>&1; then
    echo "✅ Development server is responding"
    break
  fi

  if [ $i -eq $MAX_RETRIES ]; then
    echo "❌ Development server not responding after $MAX_RETRIES attempts"
    exit 1
  fi

  echo "   Attempt $i/$MAX_RETRIES - waiting ${RETRY_DELAY}s..."
  sleep $RETRY_DELAY
done

# Pre-warm API routes
echo "🔥 Pre-warming API routes..."

# Use a different approach: Make actual requests and wait for responses
echo "   📧 Newsletter API..."
echo "      Triggering compilation with actual request..."

# Make request and wait for actual response (this should trigger compilation)
RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 60 --max-time 120 "$GATEWAY_URL/api/newsletter")
echo "      Newsletter API responded with: $RESPONSE_CODE"

# Newsletter logo API
echo "   🖼️  Newsletter logo API..."
LOGO_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 60 --max-time 120 "$GATEWAY_URL/api/newsletter?logo=base64")
echo "      Logo API responded with: $LOGO_RESPONSE"

# Upload API (GET should return 405 but still compile the route)
echo "   📤 Upload API..."
echo "      Triggering compilation with GET request..."
UPLOAD_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 60 --max-time 120 "$GATEWAY_URL/api/upload")
echo "      Upload API responded with: $UPLOAD_RESPONSE"

if [[ "$RESPONSE_CODE" == "200" ]] || [[ "$UPLOAD_RESPONSE" == "405" ]]; then
  echo "✅ API routes pre-warming completed successfully"
else
  echo "⚠️  API routes may not have compiled properly"
fi
echo "🚀 API routes should now respond faster!"