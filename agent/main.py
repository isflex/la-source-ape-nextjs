"""
APE Strands Agent with Bedrock - AG-UI Protocol for CopilotKit

This implementation uses the ag_ui_strands package for proper AG-UI protocol
support with CopilotKit. Works for both local development and AgentCore deployment.

AG-UI endpoints are automatically created by ag_ui_strands:
- GET  /docs - Swagger UI documentation
- GET  /openapi.json - OpenAPI specification
- POST / - Main AG-UI agent endpoint

Run with dotenvx to inject environment variables:
  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- uv run uvicorn main:app --port 8061

See: https://strandsagents.com/latest/documentation/docs/community/integrations/ag-ui/
"""

import logging
import os

import boto3
from strands import Agent, tool
from strands.models.bedrock import BedrockModel
from ag_ui_strands import StrandsAgent, StrandsAgentConfig, create_strands_app
from ag_ui.core import RunAgentInput

logger = logging.getLogger(__name__)

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
Reponds toujours en francais.

Quand un contexte utilisateur est fourni entre balises <context>, utilise ces informations
pour personnaliser tes reponses. Par exemple, si le nom d'utilisateur est fourni,
utilise-le pour t'adresser a l'utilisateur."""


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


@tool
def debug_context() -> str:
    """Report the current user context and session information available to the agent.
    Use this tool when a user asks about their identity, session, or what data is available."""
    return "This tool reports context. The actual context is in the <context> tags of the user message."


def build_context_message(input_data: RunAgentInput, user_message: str) -> str:
    """Inject AG-UI context into the user message for the LLM."""
    logger.info("Context items received: %d", len(input_data.context) if input_data.context else 0)
    for i, ctx in enumerate(input_data.context or []):
        logger.info("  Context[%d] description=%s, value_len=%d", i, ctx.description, len(ctx.value))
        logger.debug("  Context[%d] value=%s", i, ctx.value)

    if not input_data.context:
        return user_message

    context_parts = []
    for ctx in input_data.context:
        context_parts.append(f"[{ctx.description}]: {ctx.value}")

    context_block = "\n".join(context_parts)
    return f"<context>\n{context_block}\n</context>\n\n{user_message}"


# Create the Strands Agent
strands_agent = Agent(
    model=model,
    system_prompt=system_prompt,
    tools=[navigate, search, debug_context],
)

# Agent ID - centralized via environment variable
# Must match: CopilotKitWrapper.tsx AGENT_ID, route.ts AGENT_ID
AGENT_ID = os.getenv("COPILOTKIT_AGENT_ID", "ape_assistant")

# Configure AG-UI integration with context builder
config = StrandsAgentConfig(
    state_context_builder=build_context_message,
)

# Wrap with AG-UI integration using official package
agui_agent = StrandsAgent(
    agent=strands_agent,
    name=AGENT_ID,
    description="La Source APE Assistant - aide les utilisateurs a naviguer sur le site",
    config=config,
)

# FLEX_AGENT_PATH controls the base path for AG-UI endpoints
# - Local dev: "/" (endpoints at /agent/{agent_id}/run)
# - AgentCore: "/invocations" (endpoints at /invocations/agent/{agent_id}/run)
agent_path = os.getenv("FLEX_AGENT_PATH", "/")
app = create_strands_app(agui_agent, path=agent_path)

# Dev-only diagnostic endpoint
if os.getenv("FLEX_MODE") == "development":
    @app.get("/debug/health")
    async def debug_health():
        """Dev-only: verify agent is running and context builder is configured."""
        return {
            "status": "ok",
            "agent_name": AGENT_ID,
            "has_context_builder": config.state_context_builder is not None,
            "active_threads": list(agui_agent._agents_by_thread.keys()),
        }

if __name__ == "__main__":
    import uvicorn

    logging.basicConfig(level=logging.INFO)
    port = int(os.getenv("FLEX_AGENT_PORT", "8061"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
