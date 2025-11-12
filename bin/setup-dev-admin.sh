#!/bin/bash

# Setup development admin user in Amplify sandbox
# Only runs in development mode and when amplify_outputs.json exists

set -e

# Check if we're in development mode
if [ "$FLEX_MODE" != "development" ]; then
  echo "ℹ️  Skipping admin setup (not in development mode)"
  exit 0
fi

# Check if amplify_outputs.json exists
AMPLIFY_OUTPUTS="apps/gateway/amplify_outputs.json"
if [ ! -f "$AMPLIFY_OUTPUTS" ]; then
  echo "ℹ️  Skipping admin setup (amplify_outputs.json not found)"
  exit 0
fi

# Extract configuration from amplify_outputs.json
USER_POOL_ID=$(cat "$AMPLIFY_OUTPUTS" | grep -o '"user_pool_id": "[^"]*"' | cut -d'"' -f4 | head -1)
USER_POOL_CLIENT_ID=$(cat "$AMPLIFY_OUTPUTS" | grep -o '"user_pool_client_id": "[^"]*"' | cut -d'"' -f4 | head -1)
AWS_REGION=$(cat "$AMPLIFY_OUTPUTS" | grep -o '"aws_region": "[^"]*"' | cut -d'"' -f4 | head -1)

if [ -z "$USER_POOL_ID" ] || [ -z "$USER_POOL_CLIENT_ID" ] || [ -z "$AWS_REGION" ]; then
  echo "❌ Could not extract Cognito configuration from amplify_outputs.json"
  exit 1
fi

# Get admin credentials from decrypted environment variables
ADMIN_EMAIL="$FLEX_ADMIN_USERNAME"
ADMIN_PASSWORD="$FLEX_ADMIN_PASSWORD"

if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ]; then
  echo "❌ Admin credentials not found in environment variables"
  echo "   Required: FLEX_ADMIN_USERNAME and FLEX_ADMIN_PASSWORD"
  exit 1
fi

echo "🔧 Setting up admin user in sandbox Cognito User Pool..."
echo "   User Pool ID: $USER_POOL_ID"
echo "   Region: $AWS_REGION"
echo "   Admin Email: $ADMIN_EMAIL"

# Check if user already exists
if aws cognito-idp admin-get-user \
  --user-pool-id "$USER_POOL_ID" \
  --username "$ADMIN_EMAIL" \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" >/dev/null 2>&1; then
  echo "✅ Admin user already exists"
else
  echo "👤 Creating admin user..."

  # Create the user
  aws cognito-idp admin-create-user \
    --user-pool-id "$USER_POOL_ID" \
    --username "$ADMIN_EMAIL" \
    --user-attributes Name=email,Value="$ADMIN_EMAIL" Name=email_verified,Value=true \
    --temporary-password "TempPass123!" \
    --message-action SUPPRESS \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION"

  # Set permanent password
  aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL_ID" \
    --username "$ADMIN_EMAIL" \
    --password "$ADMIN_PASSWORD" \
    --permanent \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION"

  echo "✅ Admin user created and password set"
fi

echo "🎉 Development admin setup complete!"
echo "   Email: $ADMIN_EMAIL"