#!/usr/bin/env python3
"""
Deploy APE Strands Agent to Amazon Bedrock AgentCore Runtime

This script creates or updates an AgentCore runtime for the APE agent.
It requires the Docker image to be built and pushed to ECR first.

Prerequisites:
1. AWS credentials configured (AWS_PROFILE or IAM role)
2. Docker image pushed to ECR
3. IAM role for AgentCore runtime

Usage:
    # Set environment variables if not defined in .env files
    export AWS_REGION=eu-west-3
    export FLEX_AWS_ORG_ID=123456789012
    export FLEX_ECR_REPOSITORY=ape-strands-agent
    export FLEX_AGENT_RUNTIME_ROLE_ARN=arn:aws:iam::123456789012:role/AgentRuntimeRoleThingyName

    # Deploy
    dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- python deploy_agent.py

Environment Variables:
    AWS_REGION: AWS region (default: eu-west-3)
    FLEX_AWS_ORG_ID: AWS account ID (required)
    FLEX_ECR_REPOSITORY: ECR repository name (default: ape-strands-agent)
    IMAGE_TAG: Docker image tag (default: latest)
    AGENT_RUNTIME_NAME: AgentCore runtime name (default: ape-assistant)
    FLEX_AGENT_RUNTIME_ROLE_ARN: IAM role ARN for AgentCore (required)
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


def deploy_agent():
    """Deploy or update the AgentCore runtime."""
    # Configuration from environment
    aws_region = get_env_var("AWS_REGION", "eu-west-3")
    aws_account_id = get_env_var("FLEX_AWS_ORG_ID")
    ecr_repository = get_env_var("FLEX_ECR_REPOSITORY", "ape-strands-agent")
    image_tag = get_env_var("IMAGE_TAG", "latest")
    agent_runtime_name = get_env_var("AGENT_RUNTIME_NAME", "ape-assistant")
    role_arn = get_env_var("FLEX_AGENT_RUNTIME_ROLE_ARN")

    # Construct ECR image URI
    container_uri = f"{aws_account_id}.dkr.ecr.{aws_region}.amazonaws.com/{ecr_repository}:{image_tag}"

    print(f"Deploying agent to AgentCore...")
    print(f"  Region: {aws_region}")
    print(f"  Runtime name: {agent_runtime_name}")
    print(f"  Container URI: {container_uri}")
    print(f"  Role ARN: {role_arn}")

    # Create AgentCore control client
    client = boto3.client("bedrock-agentcore-control", region_name=aws_region)

    # Check if runtime already exists
    try:
        existing = client.get_agent_runtime(agentRuntimeName=agent_runtime_name)
        print(f"\nExisting runtime found: {existing['agentRuntimeArn']}")
        print(f"  Status: {existing['status']}")

        # Update existing runtime
        print("\nUpdating agent runtime...")
        response = client.update_agent_runtime(
            agentRuntimeName=agent_runtime_name,
            agentRuntimeArtifact={
                "containerConfiguration": {"containerUri": container_uri}
            },
        )
        print(f"Agent runtime updated successfully!")
        print(f"  ARN: {response['agentRuntimeArn']}")
        print(f"  Status: {response['status']}")

    except client.exceptions.ResourceNotFoundException:
        # Create new runtime
        print("\nCreating new agent runtime...")
        response = client.create_agent_runtime(
            agentRuntimeName=agent_runtime_name,
            agentRuntimeArtifact={
                "containerConfiguration": {"containerUri": container_uri}
            },
            networkConfiguration={"networkMode": "PUBLIC"},
            roleArn=role_arn,
        )
        print(f"Agent runtime created successfully!")
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
    print(f"\nNote: You'll need to configure Cognito authentication for production use.")
    print(f"Run: agentcore identity setup-cognito")


def main():
    """Main entry point."""
    print("=" * 60)
    print("APE Strands Agent - AgentCore Deployment")
    print("=" * 60)
    deploy_agent()


if __name__ == "__main__":
    main()
