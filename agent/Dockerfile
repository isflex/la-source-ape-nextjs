# APE Strands Agent Dockerfile
# For Amazon Bedrock AgentCore Runtime (ARM64 required)
#
# Build:
#   docker buildx build --platform linux/arm64 -t ape-agent:latest .
#
# Run locally (with AWS credentials):
#   docker run --platform linux/arm64 -p 8061:8061 \
#     -e AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
#     -e AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
#     -e AWS_SESSION_TOKEN="$AWS_SESSION_TOKEN" \
#     -e AWS_REGION="eu-west-3" \
#     ape-agent:latest

FROM --platform=linux/arm64 ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

# Copy dependency files first for better caching
COPY pyproject.toml ./
# Generate uv.lock if it doesn't exist
RUN uv lock --no-cache || true

# Install dependencies
RUN uv sync --frozen --no-cache || uv sync --no-cache

# Copy application code
COPY main.py ./

# AgentCore requires port 8061
EXPOSE 8061

# Environment variables for AgentCore deployment
# FLEX_AGENT_PATH=/invocations makes AG-UI endpoints available at /invocations/*
ENV FLEX_AGENT_PORT=8061
ENV FLEX_AGENT_PATH=/invocations

# Run the application
# Use uvicorn directly for production (no reload)
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8061"]
