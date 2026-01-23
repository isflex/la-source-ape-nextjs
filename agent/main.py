"""
APE Strands Agent with Bedrock - Using official ag_ui_strands package

This implementation uses the official ag_ui_strands package for proper
AG-UI protocol support with CopilotKit.
"""

import os

import boto3
from dotenv import load_dotenv
from strands import Agent, tool
from strands.models.bedrock import BedrockModel
from ag_ui_strands import StrandsAgent, create_strands_app

load_dotenv()

# Create boto3 session with explicit profile support
# This ensures AWS credentials are properly loaded from the AWS profile
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

# Create FastAPI app using the official helper
app = create_strands_app(agui_agent)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AGENT_PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
