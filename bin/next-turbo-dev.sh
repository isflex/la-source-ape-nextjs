#!/bin/bash

# Next.js Turbopack Development Script
# Temporarily switches to Turbopack-compatible config

echo "🚀 Starting Next.js with Turbopack..."

# Backup original config if it exists
if [ -f "next.config.mjs" ] && [ ! -f "next.config.mjs.webpack" ]; then
    echo "📦 Backing up webpack config..."
    mv next.config.mjs next.config.mjs.webpack
fi

# Use Turbopack config
if [ -f "next.config.turbo.mjs" ]; then
    echo "⚡ Switching to Turbopack config..."
    cp next.config.turbo.mjs next.config.mjs
else
    echo "❌ Turbopack config not found!"
    exit 1
fi

# Cleanup function to restore webpack config
cleanup() {
    echo ""
    echo "🔄 Restoring webpack config..."
    if [ -f "next.config.mjs.webpack" ]; then
        mv next.config.mjs.webpack next.config.mjs
        echo "✅ Webpack config restored"
    fi
    exit 0
}

# Set trap for cleanup on exit
trap cleanup SIGINT SIGTERM EXIT

# Start Next.js with Turbopack
echo "🏃‍♂️ Running: next dev ./ --turbopack --port $FLEX_GATEWAY_PORT --hostname $FLEX_GATEWAY_HOSTNAME"
next dev ./ --turbopack --port $FLEX_GATEWAY_PORT --hostname $FLEX_GATEWAY_HOSTNAME
