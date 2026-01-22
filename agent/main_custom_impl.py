import os
import json
import uuid
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from strands import Agent, tool
from strands.models.bedrock import BedrockModel

load_dotenv()

# Initialize Bedrock model
model = BedrockModel(
    model_id=os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0"),
    region_name=os.getenv("AWS_REGION", "eu-west-3"),
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


def create_sse_event(event_type: str, data: dict) -> str:
    """Create an SSE event in AG-UI format."""
    event = {"type": event_type, **data}
    return f"data: {json.dumps(event)}\n\n"


async def run_agent_stream(messages: list, thread_id: str, run_id: str) -> AsyncGenerator[str, None]:
    """Run the agent and stream AG-UI events."""

    # Send run started event
    yield create_sse_event("RUN_STARTED", {
        "threadId": thread_id,
        "runId": run_id,
    })

    # Extract the last user message
    user_message = ""
    for msg in reversed(messages):
        if msg.get("role") == "user":
            content = msg.get("content", "")
            if isinstance(content, str):
                user_message = content
            elif isinstance(content, list):
                for part in content:
                    if isinstance(part, dict) and part.get("type") == "text":
                        user_message = part.get("text", "")
                        break
            break

    if not user_message:
        yield create_sse_event("RUN_ERROR", {
            "message": "No user message found",
            "code": "NO_USER_MESSAGE",
        })
        return

    # Generate message ID
    message_id = str(uuid.uuid4())

    # Send text message start
    yield create_sse_event("TEXT_MESSAGE_START", {
        "messageId": message_id,
        "role": "assistant",
    })

    try:
        # Run the agent (non-streaming for simplicity)
        print(f"[Agent] Processing message: {user_message[:100]}...")
        result = strands_agent(user_message)
        response_text = str(result)
        print(f"[Agent] Response: {response_text[:200]}...")

        # Send content in chunks (simulate streaming)
        chunk_size = 50
        for i in range(0, len(response_text), chunk_size):
            chunk = response_text[i:i + chunk_size]
            yield create_sse_event("TEXT_MESSAGE_CONTENT", {
                "messageId": message_id,
                "delta": chunk,
            })

        # Send text message end
        yield create_sse_event("TEXT_MESSAGE_END", {
            "messageId": message_id,
        })

        # Send run finished (only on success)
        yield create_sse_event("RUN_FINISHED", {
            "threadId": thread_id,
            "runId": run_id,
        })

    except Exception as e:
        import traceback
        print(f"[Agent] Error: {e}")
        traceback.print_exc()
        yield create_sse_event("RUN_ERROR", {
            "message": str(e),
            "code": "AGENT_ERROR",
        })


# Create FastAPI app
app = FastAPI(title="APE Strands Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
async def root():
    return {"status": "ok", "agent": "ape_assistant"}


# Info endpoint - returns available agents (REST transport)
@app.get("/info")
async def info():
    return {
        "agents": {
            "ape_assistant": {
                "id": "ape_assistant",
                "name": "APE Assistant",
                "description": "La Source APE Assistant",
            }
        },
        "version": "1.0.0",
    }


# REST transport: POST /agent/{agent_id}/run
@app.post("/agent/{agent_id}/run")
async def agent_run(agent_id: str, request: Request):
    """Handle agent run requests (REST transport)."""
    if agent_id != "ape_assistant":
        return JSONResponse({"error": f"Agent '{agent_id}' not found"}, status_code=404)

    try:
        data = await request.json()
    except json.JSONDecodeError:
        return JSONResponse({"error": "Invalid JSON"}, status_code=400)

    thread_id = data.get("threadId", str(uuid.uuid4()))
    run_id = data.get("runId", str(uuid.uuid4()))
    messages = data.get("messages", [])

    print(f"[Agent Run] thread={thread_id}, run={run_id}, messages={len(messages)}")

    return StreamingResponse(
        run_agent_stream(messages, thread_id, run_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


# REST transport: POST /agent/{agent_id}/connect
@app.post("/agent/{agent_id}/connect")
async def agent_connect(agent_id: str, request: Request):
    """Handle agent connect requests for reconnection (REST transport)."""
    if agent_id != "ape_assistant":
        return JSONResponse({"error": f"Agent '{agent_id}' not found"}, status_code=404)

    print(f"[Agent Connect] agent={agent_id}")

    # For new threads or threads with no active run, return a minimal valid SSE stream
    # CopilotKit client expects parseable SSE data, even if empty
    async def connect_stream():
        # SSE comment to ensure the stream is parseable (comments are ignored by clients)
        yield ": connected\n\n"

    return StreamingResponse(
        connect_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


# REST transport: POST /agent/{agent_id}/stop/{thread_id}
@app.post("/agent/{agent_id}/stop/{thread_id}")
async def agent_stop(agent_id: str, thread_id: str):
    """Handle agent stop requests (REST transport)."""
    if agent_id != "ape_assistant":
        return JSONResponse({"error": f"Agent '{agent_id}' not found"}, status_code=404)

    print(f"[Agent Stop] agent={agent_id}, thread={thread_id}")
    # Simple implementation - just acknowledge the stop request
    return JSONResponse({"status": "stopped", "threadId": thread_id})


# LEGACY: Single transport POST / handler (for backward compatibility)
@app.post("/")
async def handle_post(request: Request):
    """Handle CopilotKit single-transport requests (backward compatibility)."""
    try:
        data = await request.json()
    except json.JSONDecodeError:
        return JSONResponse({"error": "Invalid JSON"}, status_code=400)

    # Check if this is a CopilotKit envelope (single transport)
    method = data.get("method", "")
    body = data.get("body", data)

    # Handle info request
    if method == "info":
        return await info()

    # Handle agent/connect
    if method == "agent/connect":
        async def connect_stream():
            yield ": connected\n\n"

        return StreamingResponse(
            connect_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            }
        )

    # Handle agent/run
    if method == "agent/run":
        thread_id = body.get("threadId", str(uuid.uuid4()))
        run_id = body.get("runId", str(uuid.uuid4()))
        messages = body.get("messages", [])

        return StreamingResponse(
            run_agent_stream(messages, thread_id, run_id),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            }
        )

    # If no method, treat as direct AG-UI request
    if "threadId" in data and "messages" in data:
        thread_id = data.get("threadId", str(uuid.uuid4()))
        run_id = data.get("runId", str(uuid.uuid4()))
        messages = data.get("messages", [])

        return StreamingResponse(
            run_agent_stream(messages, thread_id, run_id),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            }
        )

    return JSONResponse({"error": "Unknown request format"}, status_code=400)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AGENT_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
