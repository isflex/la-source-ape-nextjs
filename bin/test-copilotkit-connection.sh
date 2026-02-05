#!/bin/bash
# CopilotKit Integration Diagnostic Script
# Tests environment variables, agent consistency, and connectivity

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS="${GREEN}PASS${NC}"
FAIL="${RED}FAIL${NC}"
WARN="${YELLOW}WARN${NC}"

echo "=============================================="
echo "  CopilotKit Integration Diagnostic"
echo "=============================================="
echo ""

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load environment variables
if [ -f "$PROJECT_ROOT/env/public/.env.development" ]; then
    set -a
    source "$PROJECT_ROOT/env/public/.env.development" 2>/dev/null || true
    set +a
fi

echo "1. Environment Variables"
echo "------------------------"

# Check NEXT_PUBLIC_COPILOTKIT_ENABLED
if [ "$NEXT_PUBLIC_COPILOTKIT_ENABLED" = "true" ]; then
    echo -e "   NEXT_PUBLIC_COPILOTKIT_ENABLED: $PASS (true)"
else
    echo -e "   NEXT_PUBLIC_COPILOTKIT_ENABLED: $FAIL (${NEXT_PUBLIC_COPILOTKIT_ENABLED:-not set})"
    echo "      → Set to 'true' in env/public/.env.development"
fi

# Check NEXT_PUBLIC_COPILOTKIT_AGENT_ID
if [ -n "$NEXT_PUBLIC_COPILOTKIT_AGENT_ID" ]; then
    echo -e "   NEXT_PUBLIC_COPILOTKIT_AGENT_ID: $PASS ($NEXT_PUBLIC_COPILOTKIT_AGENT_ID)"
else
    echo -e "   NEXT_PUBLIC_COPILOTKIT_AGENT_ID: $WARN (not set, will use default 'ape_assistant')"
fi

# Check NEXT_PUBLIC_AGENT_URL
if [ -n "$NEXT_PUBLIC_AGENT_URL" ]; then
    echo -e "   NEXT_PUBLIC_AGENT_URL: $PASS ($NEXT_PUBLIC_AGENT_URL)"
else
    echo -e "   NEXT_PUBLIC_AGENT_URL: $WARN (not set, will use default 'http://localhost:8080')"
fi

# Check AWS_PROFILE
if [ -n "$AWS_PROFILE" ]; then
    echo -e "   AWS_PROFILE: $PASS ($AWS_PROFILE)"
else
    echo -e "   AWS_PROFILE: $WARN (not set, may cause Bedrock auth issues)"
fi

echo ""
echo "2. Agent ID Consistency"
echo "-----------------------"

# Extract agent IDs from files
WRAPPER_FILE="$PROJECT_ROOT/apps/gateway/src/components/copilotkit/CopilotKitWrapper.tsx"
ROUTE_FILE="$PROJECT_ROOT/apps/gateway/src/app/api/copilotkit/[[...path]]/route.ts"
PYTHON_FILE="$PROJECT_ROOT/agent/main.py"

# Check if files exist and extract agent IDs
WRAPPER_ID=""
ROUTE_ID=""
PYTHON_ID=""

if [ -f "$WRAPPER_FILE" ]; then
    WRAPPER_ID=$(grep -o "NEXT_PUBLIC_COPILOTKIT_AGENT_ID.*||.*'[^']*'" "$WRAPPER_FILE" 2>/dev/null | grep -o "'[^']*'$" | tr -d "'" || echo "")
    if [ -z "$WRAPPER_ID" ]; then
        WRAPPER_ID=$(grep "const AGENT_ID" "$WRAPPER_FILE" 2>/dev/null | grep -o "'[^']*'" | tr -d "'" || echo "not found")
    fi
    echo "   CopilotKitWrapper.tsx default: $WRAPPER_ID"
else
    echo -e "   CopilotKitWrapper.tsx: $FAIL (file not found)"
fi

if [ -f "$ROUTE_FILE" ]; then
    ROUTE_ID=$(grep -o 'NEXT_PUBLIC_COPILOTKIT_AGENT_ID.*||.*"[^"]*"' "$ROUTE_FILE" 2>/dev/null | grep -o '"[^"]*"$' | tr -d '"' || echo "")
    if [ -z "$ROUTE_ID" ]; then
        ROUTE_ID=$(grep "const AGENT_ID" "$ROUTE_FILE" 2>/dev/null | grep -o '"[^"]*"' | tr -d '"' || echo "not found")
    fi
    echo "   route.ts default: $ROUTE_ID"
else
    echo -e "   route.ts: $FAIL (file not found)"
fi

if [ -f "$PYTHON_FILE" ]; then
    PYTHON_ID=$(grep 'os.getenv.*COPILOTKIT_AGENT_ID' "$PYTHON_FILE" 2>/dev/null | grep -o '"[^"]*"' | tail -1 | tr -d '"' || echo "")
    if [ -z "$PYTHON_ID" ]; then
        PYTHON_ID=$(grep 'name=' "$PYTHON_FILE" 2>/dev/null | grep -o '"[^"]*"' | tr -d '"' || echo "not found")
    fi
    echo "   main.py default: $PYTHON_ID"
else
    echo -e "   main.py: $WARN (file not found - may not be needed)"
fi

# Check consistency
if [ -n "$WRAPPER_ID" ] && [ -n "$ROUTE_ID" ]; then
    if [ "$WRAPPER_ID" = "$ROUTE_ID" ]; then
        echo -e "   Consistency check: $PASS (IDs match)"
    else
        echo -e "   Consistency check: $FAIL (IDs don't match!)"
    fi
fi

echo ""
echo "3. Service Connectivity"
echo "-----------------------"

# Check Python agent
AGENT_URL="${NEXT_PUBLIC_AGENT_URL:-http://localhost:8080}"
echo "   Testing Python agent at $AGENT_URL..."

if curl -s --connect-timeout 2 "$AGENT_URL" >/dev/null 2>&1; then
    echo -e "   Python agent: $PASS (reachable)"
else
    echo -e "   Python agent: $FAIL (not reachable)"
    echo "      → Start with: cd agent && uvicorn main:app --reload"
fi

# Check Next.js API route (if running)
GATEWAY_URL="${FLEX_GATEWAY_HOST:-http://localhost:3001}"
echo "   Testing API route at $GATEWAY_URL/api/copilotkit/info..."

if curl -s --connect-timeout 2 "$GATEWAY_URL/api/copilotkit/info" >/dev/null 2>&1; then
    RESPONSE=$(curl -s --connect-timeout 2 "$GATEWAY_URL/api/copilotkit/info" 2>/dev/null || echo "{}")
    if echo "$RESPONSE" | grep -q "agents"; then
        echo -e "   CopilotKit API: $PASS (responding)"
    else
        echo -e "   CopilotKit API: $WARN (responding but unexpected format)"
    fi
else
    echo -e "   CopilotKit API: $WARN (not reachable - start Next.js first)"
    echo "      → Start with: pnpm dev"
fi

echo ""
echo "4. AWS Bedrock Access"
echo "---------------------"

if command -v aws >/dev/null 2>&1; then
    if [ -n "$AWS_PROFILE" ]; then
        echo "   Checking AWS credentials for profile: $AWS_PROFILE"
        if aws sts get-caller-identity --profile "$AWS_PROFILE" >/dev/null 2>&1; then
            echo -e "   AWS credentials: $PASS (valid)"

            # Check Bedrock access
            AWS_REGION="${AWS_REGION:-eu-west-3}"
            if aws bedrock list-foundation-models --region "$AWS_REGION" --profile "$AWS_PROFILE" --max-results 1 >/dev/null 2>&1; then
                echo -e "   Bedrock access: $PASS (region: $AWS_REGION)"
            else
                echo -e "   Bedrock access: $FAIL (no permission or not enabled)"
                echo "      → Check IAM permissions for bedrock:InvokeModel"
            fi
        else
            echo -e "   AWS credentials: $FAIL (invalid or expired)"
            echo "      → Run: aws sso login --profile $AWS_PROFILE"
        fi
    else
        echo -e "   AWS profile: $WARN (AWS_PROFILE not set)"
    fi
else
    echo -e "   AWS CLI: $WARN (not installed)"
fi

echo ""
echo "=============================================="
echo "  Diagnostic Complete"
echo "=============================================="
