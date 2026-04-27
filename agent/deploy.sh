#!/bin/bash
# Deploy the Strands agent to Amazon Bedrock AgentCore Runtime.
# Assumes the Docker image is already built and pushed via push-to-ecr.sh.
#
# Usage:
#   ./deploy.sh              # Development mode (default)
#   ./deploy.sh production   # Production mode
#
# Requires:
#   - dotenvx CLI (reachable via `pnpm exec dotenvx`)
#   - uv CLI
#   - aws credentials with bedrock-agentcore + iam:PassRole permissions

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FLEX_PROJ_ROOT="${FLEX_PROJ_ROOT:-$(cd "$SCRIPT_DIR/.." && pwd)}"

FLEX_MODE="${1:-${FLEX_MODE:-development}}"
ENV_FILE="$FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: Environment file not found: $ENV_FILE" >&2
    exit 1
fi

echo "Deploying Strands agent to AgentCore..."
echo "  Mode: $FLEX_MODE"
echo "  Env file: $ENV_FILE"
echo "  Agent dir: $SCRIPT_DIR"
echo ""

# Use --project + absolute script path so uv/python don't care about the
# invoking shell's CWD (pnpm may shift CWD to the workspace root).
exec pnpm exec dotenvx run -f "$ENV_FILE" -- \
    uv run --project "$SCRIPT_DIR" python "$SCRIPT_DIR/deploy_agent.py"
