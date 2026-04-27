#!/usr/bin/env python3
"""
Create or update the APE Strands Agent runtime on Bedrock AgentCore.

Full end-to-end deployment flow (build → push → deploy → auth) lives in
agent/DEPLOYMENT.md. Run via agent/deploy.sh; env vars are injected from
env/public/.env.$FLEX_MODE by dotenvx.

Required env:
    AWS_REGION, FLEX_AWS_ORG_ID, FLEX_ECR_REPOSITORY, FLEX_AGENT_RUNTIME_NAME,
    FLEX_AGENT_RUNTIME_ROLE_ARN (role name must match *BedrockAgentCore* to
    satisfy the BedrockAgentCoreFullAccess PassRole constraint).

Optional env (enables customJWTAuthorizer — skip to leave runtime IAM-only):
    FLEX_AWS_COGNITO_USER_POOL_ID, FLEX_AWS_COGNITO_USER_POOL_APP_CLIENT_ID,
    IMAGE_TAG.
"""

import os
import sys

import boto3
from botocore.exceptions import ClientError


def get_env_var(name: str, default: str | None = None) -> str:
    """Get environment variable or raise error if required and not set."""
    value = os.getenv(name, default)
    if value is None:
        print(f"Error: Required environment variable {name} is not set")
        sys.exit(1)
    return value


def _find_runtime_by_name(client, name: str) -> dict | None:
    """Page through list_agent_runtimes and return the entry matching `name`, or None."""
    paginator = client.get_paginator("list_agent_runtimes")
    for page in paginator.paginate():
        for runtime in page.get("agentRuntimes", []):
            if runtime.get("agentRuntimeName") == name:
                return runtime
    return None


def _build_authorizer_configuration(aws_region: str) -> dict | None:
    """Build customJWTAuthorizer config if Cognito env vars are present.

    Returns None when pool id + client id are not both set — callers then
    deploy the runtime with no inbound auth (IAM/SigV4 only).
    """
    user_pool_id = os.getenv("FLEX_AWS_COGNITO_USER_POOL_ID")
    app_client_id = os.getenv("FLEX_AWS_COGNITO_USER_POOL_APP_CLIENT_ID")
    if not user_pool_id or not app_client_id:
        return None
    discovery_url = (
        f"https://cognito-idp.{aws_region}.amazonaws.com/"
        f"{user_pool_id}/.well-known/openid-configuration"
    )
    return {
        "customJWTAuthorizer": {
            "discoveryUrl": discovery_url,
            "allowedClients": [app_client_id],
        }
    }


def deploy_agent():
    """Deploy or update the AgentCore runtime."""
    # Configuration from environment
    aws_region = get_env_var("AWS_REGION", "eu-west-3")
    aws_account_id = get_env_var("FLEX_AWS_ORG_ID")
    ecr_repository = get_env_var("FLEX_ECR_REPOSITORY", "gateway-strands-agent")
    image_tag = get_env_var("IMAGE_TAG", "latest")
    agent_runtime_name = get_env_var("FLEX_AGENT_RUNTIME_NAME", "ape_assistant")
    role_arn = get_env_var("FLEX_AGENT_RUNTIME_ROLE_ARN")

    # Construct ECR image URI
    container_uri = f"{aws_account_id}.dkr.ecr.{aws_region}.amazonaws.com/{ecr_repository}:{image_tag}"

    authorizer_configuration = _build_authorizer_configuration(aws_region)

    print(f"Deploying agent to AgentCore...")
    print(f"  Region: {aws_region}")
    print(f"  Runtime name: {agent_runtime_name}")
    print(f"  Container URI: {container_uri}")
    print(f"  Role ARN: {role_arn}")
    if authorizer_configuration:
        jwt = authorizer_configuration["customJWTAuthorizer"]
        print(f"  JWT authorizer: {jwt['discoveryUrl']}")
        print(f"  Allowed clients: {jwt['allowedClients']}")
    else:
        print("  JWT authorizer: (none — IAM/SigV4-only)")

    # Create AgentCore control client
    client = boto3.client("bedrock-agentcore-control", region_name=aws_region)

    # The AgentCore API identifies existing runtimes by ID, not name, so we
    # page through list_agent_runtimes and match on agentRuntimeName.
    existing_runtime = _find_runtime_by_name(client, agent_runtime_name)

    try:
        if existing_runtime:
            runtime_id = existing_runtime["agentRuntimeId"]
            print(f"\nExisting runtime found: {existing_runtime.get('agentRuntimeArn')}")
            print(f"  Id: {runtime_id}")
            print(f"  Status: {existing_runtime.get('status')}")

            print("\nUpdating agent runtime...")
            update_kwargs = dict(
                agentRuntimeId=runtime_id,
                agentRuntimeArtifact={
                    "containerConfiguration": {"containerUri": container_uri}
                },
                networkConfiguration={"networkMode": "PUBLIC"},
                roleArn=role_arn,
            )
            if authorizer_configuration:
                update_kwargs["authorizerConfiguration"] = authorizer_configuration
            response = client.update_agent_runtime(**update_kwargs)
            print("Agent runtime updated successfully!")
            print(f"  ARN: {response['agentRuntimeArn']}")
            print(f"  Status: {response['status']}")
        else:
            print("\nNo existing runtime — creating new agent runtime...")
            create_kwargs = dict(
                agentRuntimeName=agent_runtime_name,
                agentRuntimeArtifact={
                    "containerConfiguration": {"containerUri": container_uri}
                },
                networkConfiguration={"networkMode": "PUBLIC"},
                roleArn=role_arn,
            )
            if authorizer_configuration:
                create_kwargs["authorizerConfiguration"] = authorizer_configuration
            response = client.create_agent_runtime(**create_kwargs)
            print("Agent runtime created successfully!")
            print(f"  ARN: {response['agentRuntimeArn']}")
            print(f"  Status: {response['status']}")

    except ClientError as e:
        print(f"\nError deploying agent: {e}")
        sys.exit(1)

    # Print connection information
    print(f"\n" + "=" * 60)
    print("Connection Information:")
    print("=" * 60)
    print(f"\nAgent Runtime ARN:")
    print(f"  arn:aws:bedrock-agentcore:{aws_region}:{aws_account_id}:runtime/{agent_runtime_name}")
    print(f"\nInvocation URL (for NEXT_PUBLIC_AGENT_URL):")
    print(f"  https://bedrock-agentcore.{aws_region}.amazonaws.com/runtimes/{agent_runtime_name}/invocations?accountId={aws_account_id}&qualifier=DEFAULT")
    print(f"\nKeep ?accountId=... and ?qualifier=DEFAULT in NEXT_PUBLIC_AGENT_URL — the Next proxy forwards")
    print(f"the URL verbatim. See agent/DEPLOYMENT.md for the full flow (build → push → deploy → auth).")


def main():
    """Main entry point."""
    print("=" * 60)
    print("APE Strands Agent - AgentCore Deployment")
    print("=" * 60)
    deploy_agent()


if __name__ == "__main__":
    main()
