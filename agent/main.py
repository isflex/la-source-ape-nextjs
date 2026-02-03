"""
APE Strands Agent with Bedrock - AG-UI Protocol for CopilotKit

This implementation uses the ag_ui_strands package for proper AG-UI protocol
support with CopilotKit. Works for both local development and AgentCore deployment.

AG-UI endpoints are automatically created by ag_ui_strands:
- GET  /docs - Swagger UI documentation
- GET  /openapi.json - OpenAPI specification
- POST / - Main AG-UI agent endpoint

Run with dotenvx to inject environment variables:
  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- uv run uvicorn main:app --port 8080

See: https://strandsagents.com/latest/documentation/docs/community/integrations/ag-ui/
"""

import os

import boto3
from strands import Agent, tool
from strands.models.bedrock import BedrockModel
from ag_ui_strands import StrandsAgent, create_strands_app

# Create boto3 session with explicit profile support
# For local dev: uses AWS_PROFILE from .env
# For AgentCore: uses IAM role (no profile needed)
aws_profile = os.getenv("AWS_PROFILE")
aws_region = os.getenv("AWS_REGION", "eu-west-3")

session = boto3.Session(
    region_name=aws_region,
    profile_name=aws_profile if aws_profile else None,
)

# Initialize Bedrock model with boto3 session
model = BedrockModel(
    model_id=os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0"),
    boto_session=session,
)

system_prompt = """Tu es un assistant pour le site La Source APE.
Tu aides les utilisateurs a naviguer sur le site, creer des newsletters,
gerer des cagnottes, et comprendre les fonctionnalites disponibles.
Reponds toujours en francais."""


@tool
def navigate(page: str) -> str:
    """Navigate to a page on the site. Valid pages: home, newsletter, cagnotte, events, profile."""
    valid_pages = ["home", "newsletter", "cagnotte", "events", "profile"]
    if page.lower() not in valid_pages:
        return f"Page invalide. Pages disponibles: {', '.join(valid_pages)}"
    return f"Navigation vers {page}"


@tool
def search(query: str) -> str:
    """Search for content on the site."""
    return f"Recherche de: {query}"


# Create the Strands Agent
strands_agent = Agent(
    model=model,
    system_prompt=system_prompt,
    tools=[navigate, search],
)

# Agent ID - centralized via environment variable
# Must match: CopilotKitWrapper.tsx AGENT_ID, route.ts AGENT_ID
AGENT_ID = os.getenv("COPILOTKIT_AGENT_ID", "ape_assistant")

# Wrap with AG-UI integration using official package
agui_agent = StrandsAgent(
    agent=strands_agent,
    name=AGENT_ID,
    description="La Source APE Assistant - aide les utilisateurs a naviguer sur le site",
)

# FLEX_AGENT_PATH controls the base path for AG-UI endpoints
# - Local dev: "/" (endpoints at /agent/{agent_id}/run)
# - AgentCore: "/invocations" (endpoints at /invocations/agent/{agent_id}/run)
agent_path = os.getenv("FLEX_AGENT_PATH", "/")
app = create_strands_app(agui_agent, path=agent_path)

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("FLEX_AGENT_PORT", "8080"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
