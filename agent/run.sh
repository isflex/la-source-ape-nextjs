#!/bin/bash
# Run the Strands agent with dotenvx environment injection
#
# Usage:
#   ./run.sh              # Development mode (default)
#   ./run.sh production   # Production mode
#
# Requires:
#   - dotenvx CLI installed (npx dotenvx or pnpm dotenvx)
#   - FLEX_PROJ_ROOT set or running from monorepo

set -e

# Determine project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FLEX_PROJ_ROOT="${FLEX_PROJ_ROOT:-$(cd "$SCRIPT_DIR/.." && pwd)}"

# Determine environment mode
FLEX_MODE="${1:-${FLEX_MODE:-development}}"
ENV_FILE="$FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: Environment file not found: $ENV_FILE"
    exit 1
fi

echo "Starting Strands agent..."
echo "  Mode: $FLEX_MODE"
echo "  Env file: $ENV_FILE"
echo "  Port: $FLEX_AGENT_PORT"

cd "$SCRIPT_DIR"

# Run with dotenvx to inject environment variables
exec dotenvx run -f "$ENV_FILE" -- uv run uvicorn main:app --host 0.0.0.0 --port $FLEX_AGENT_PORT --reload
