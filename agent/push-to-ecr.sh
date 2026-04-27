#!/bin/bash
# Push the local Strands agent Docker image to Amazon ECR.
#
# Usage:
#   ./push-to-ecr.sh              # Development mode (default)
#   ./push-to-ecr.sh production   # Production mode
#
# Optional environment overrides:
#   LOCAL_IMAGE   Local Docker image tag to push (default: gateway-strands-agent:latest)
#   IMAGE_TAG     Remote tag to publish (default: latest)
# Example : LOCAL_IMAGE=gateway-strands-agent:latest IMAGE_TAG=v1 ./push-to-ecr.sh production
#
# Requires:
#   - dotenvx CLI
#   - docker with buildx already used to build the ARM64 image
#   - aws CLI configured (AWS_PROFILE or ambient credentials)
#   - FLEX_AWS_ORG_ID, FLEX_ECR_REPOSITORY, AWS_REGION in env/public/.env.$FLEX_MODE

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FLEX_PROJ_ROOT="${FLEX_PROJ_ROOT:-$(cd "$SCRIPT_DIR/.." && pwd)}"

FLEX_MODE="${1:-${FLEX_MODE:-development}}"
ENV_FILE="$FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: Environment file not found: $ENV_FILE" >&2
    exit 1
fi

LOCAL_IMAGE="${LOCAL_IMAGE:-gateway-strands-agent:latest}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

if ! docker image inspect "$LOCAL_IMAGE" >/dev/null 2>&1; then
    echo "Error: Local image '$LOCAL_IMAGE' not found." >&2
    echo "Build it first with:" >&2
    echo "  docker buildx build --platform linux/arm64 -t $LOCAL_IMAGE $SCRIPT_DIR" >&2
    exit 1
fi

# Execute the push pipeline with env vars injected by dotenvx
pnpm exec dotenvx run -f "$ENV_FILE" -- bash -c '
set -euo pipefail

: "${AWS_REGION:?AWS_REGION not set in env file}"
: "${FLEX_AWS_ORG_ID:?FLEX_AWS_ORG_ID not set in env file}"
: "${FLEX_ECR_REPOSITORY:?FLEX_ECR_REPOSITORY not set in env file}"

REGISTRY="${FLEX_AWS_ORG_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
ECR_URI="${REGISTRY}/${FLEX_ECR_REPOSITORY}"

echo "================================================================"
echo "Push to ECR"
echo "================================================================"
echo "  Region:         $AWS_REGION"
echo "  Account:        $FLEX_AWS_ORG_ID"
echo "  Repository:     $FLEX_ECR_REPOSITORY"
echo "  Local image:    '"$LOCAL_IMAGE"'"
echo "  Remote image:   ${ECR_URI}:'"$IMAGE_TAG"'"
echo "================================================================"

echo ""
echo "[1/3] Ensuring ECR repository exists..."
if aws ecr describe-repositories \
        --repository-names "$FLEX_ECR_REPOSITORY" \
        --region "$AWS_REGION" >/dev/null 2>&1; then
    echo "       Repository already exists."
else
    echo "       Repository not found — creating..."
    aws ecr create-repository \
        --repository-name "$FLEX_ECR_REPOSITORY" \
        --region "$AWS_REGION" \
        --image-scanning-configuration scanOnPush=true >/dev/null
    echo "       Created."
fi

echo ""
echo "[2/3] Authenticating Docker to ECR..."
aws ecr get-login-password --region "$AWS_REGION" \
    | docker login --username AWS --password-stdin "$REGISTRY"

echo ""
echo "[3/3] Tagging and pushing image..."
docker tag "'"$LOCAL_IMAGE"'" "${ECR_URI}:'"$IMAGE_TAG"'"
docker push "${ECR_URI}:'"$IMAGE_TAG"'"

echo ""
echo "Done. Next step:"
echo "  dotenvx run -f '"$ENV_FILE"' -- python '"$SCRIPT_DIR"'/deploy_agent.py"
'
