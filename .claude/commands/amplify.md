# AWS Amplify Sandbox

Deploy to AWS Amplify sandbox environment for development testing.

## Instructions

1. Ensure AWS credentials are configured (AWS CLI or environment variables)

2. Navigate to the gateway app directory:
   ```bash
   cd apps/gateway
   ```

3. Run the Amplify sandbox:
   ```bash
   pnpm ampx sandbox --once
   ```

4. Wait for the deployment to complete

5. Note the sandbox URL and resources created

## Prerequisites

- AWS CLI configured with appropriate profile
- AWS credentials with Amplify permissions
- The project must be compiled first

## Notes

- Sandbox creates temporary AWS resources for testing
- Resources are automatically cleaned up after inactivity
- Check `apps/gateway/amplify/` for backend definitions
