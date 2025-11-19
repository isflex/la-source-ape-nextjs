#!/bin/bash

# Update Cognito User Pool Client with complete configuration
# Sets BOTH explicit auth flows AND OAuth flows with all required attributes

echo "🔧 Updating User Pool client with complete configuration..."

aws cognito-idp update-user-pool-client \
    --user-pool-id $FLEX_AWS_COGNITO_USER_POOL_ID \
    --client-id $FLEX_AWS_COGNITO_USER_POOL_APP_CLIENT_ID \
    --region $AWS_REGION \
    --profile $AWS_PROFILE \
    --explicit-auth-flows \
        "ALLOW_USER_SRP_AUTH" \
        "ALLOW_USER_PASSWORD_AUTH" \
        "ALLOW_ADMIN_USER_PASSWORD_AUTH" \
        "ALLOW_REFRESH_TOKEN_AUTH" \
    --allowed-o-auth-flows "code" \
    --allowed-o-auth-flows-user-pool-client \
    --allowed-o-auth-scopes \
        "aws.cognito.signin.user.admin" \
        "email" \
        "openid" \
        "phone" \
        "profile" \
    --read-attributes \
        "email" \
        "family_name" \
        "given_name" \
        "phone_number" \
    --write-attributes \
        "address" \
        "birthdate" \
        "email" \
        "family_name" \
        "gender" \
        "given_name" \
        "locale" \
        "middle_name" \
        "name" \
        "nickname" \
        "phone_number" \
        "picture" \
        "preferred_username" \
        "profile" \
        "updated_at" \
        "website" \
        "zoneinfo" \
    --supported-identity-providers \
        "COGNITO" \
        "Google" \
    --callback-urls \
        "http://localhost:3000/" \
        "http://localhost:3000/web-app/" \
        "http://localhost:3001/" \
        "http://localhost:4009/" \
        "https://after-school.flexiness.com/" \
        "https://after-school.flexiness.com:4009/" \
        "https://ape.ecolelasource.org/" \
        "https://ape.ecolelasource.org/web-app/" \
        "https://ape.ecolelasource.org:9898/" \
        "https://ape.ecolelasource.org:9898/web-app/" \
        "https://apelasource.org/" \
        "https://apelasource.org/web-app/" \
        "https://local.flexiness.com:4009/" \
        "https://main.d1cftsvc5q8k92.amplifyapp.com/" \
        "https://main.d1cftsvc5q8k92.amplifyapp.com/web-app/" \
        "https://main.d2hx7qu8b35esn.amplifyapp.com/" \
        "https://main.d2hx7qu8b35esn.amplifyapp.com/web-app/" \
        "https://main.d2hx7qu8b35esn.amplifyapp.com:9898/" \
        "https://main.d2hx7qu8b35esn.amplifyapp.com:9898/web-app/" \
        "https://web-app.ecolelasource.org/" \
        "https://web-app.ecolelasource.org:4009/" \
    --logout-urls \
        "http://localhost:3000/" \
        "http://localhost:3000/web-app/" \
        "http://localhost:3001/" \
        "http://localhost:4009/" \
        "https://after-school.flexiness.com/" \
        "https://after-school.flexiness.com:4009/" \
        "https://ape.ecolelasource.org/" \
        "https://ape.ecolelasource.org/web-app/" \
        "https://ape.ecolelasource.org:9898/" \
        "https://ape.ecolelasource.org:9898/web-app/" \
        "https://apelasource.org/" \
        "https://apelasource.org/web-app/" \
        "https://local.flexiness.com:4009/" \
        "https://main.d1cftsvc5q8k92.amplifyapp.com/" \
        "https://main.d1cftsvc5q8k92.amplifyapp.com/web-app/" \
        "https://main.d2hx7qu8b35esn.amplifyapp.com/" \
        "https://main.d2hx7qu8b35esn.amplifyapp.com/web-app/" \
        "https://main.d2hx7qu8b35esn.amplifyapp.com:9898/" \
        "https://main.d2hx7qu8b35esn.amplifyapp.com:9898/web-app/" \
        "https://web-app.ecolelasource.org/" \
        "https://web-app.ecolelasource.org:4009/"

echo ""
echo "✅ User Pool client updated successfully!"
echo ""
echo "Configuration includes:"
echo "  ✅ ExplicitAuthFlows (for server-side admin auth)"
echo "  ✅ OAuth flows (for existing Amplify integration)"
echo "  ✅ Read/Write attributes"
echo "  ✅ Supported identity providers"
echo "  ✅ Callback/Logout URLs"
echo ""
echo "Verifying complete configuration..."

aws cognito-idp describe-user-pool-client \
    --user-pool-id $FLEX_AWS_COGNITO_USER_POOL_ID \
    --client-id $FLEX_AWS_COGNITO_USER_POOL_APP_CLIENT_ID \
    --region $AWS_REGION \
    --profile $AWS_PROFILE \
    --query 'UserPoolClient.{
        ExplicitAuthFlows:ExplicitAuthFlows,
        AllowedOAuthFlows:AllowedOAuthFlows,
        AllowedOAuthFlowsUserPoolClient:AllowedOAuthFlowsUserPoolClient,
        AllowedOAuthScopes:AllowedOAuthScopes,
        ReadAttributes:ReadAttributes,
        WriteAttributes:WriteAttributes,
        SupportedIdentityProviders:SupportedIdentityProviders,
        CallbackURLsCount:length(CallbackURLs),
        LogoutURLsCount:length(LogoutURLs)
    }'