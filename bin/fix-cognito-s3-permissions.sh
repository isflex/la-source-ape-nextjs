#!/bin/bash

# Fix IAM permissions by attaching policy to the ACTUAL Cognito Identity Pool role
# This script targets the role that's actually being used in the error messages

echo "🔧 Fixing Cognito Identity Pool S3 permissions for the actual role being used..."

# The actual role name from the error message
ACTUAL_ROLE_NAME="$FLEX_AWS_SIGNUP_ROLE_ARN"
BUCKET_NAME="$FLEX_AWS_STORAGE_BUCKET_NAME"
POLICY_ARN="arn:aws:iam::${FLEX_AWS_ORG_ID}:policy/NewsletterS3AccessPolicy"

echo "📝 Configuration:"
echo "  Actual Role Name: $ACTUAL_ROLE_NAME"
echo "  S3 Bucket: $BUCKET_NAME"
echo "  Policy ARN: $POLICY_ARN"
echo "  AWS Region: $AWS_REGION"
echo "  AWS Profile: $AWS_PROFILE"
echo ""

# Check if the actual role exists
echo "👤 Verifying actual role exists..."
aws iam get-role \
    --role-name "$ACTUAL_ROLE_NAME" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    --query 'Role.{RoleName:RoleName,CreateDate:CreateDate}' \
    --output table

if [ $? -ne 0 ]; then
    echo "❌ Actual Cognito role not found: $ACTUAL_ROLE_NAME"
    echo "This might be a permission issue or the role name has changed."
    exit 1
fi

# Attach the Newsletter S3 policy to the actual role
echo ""
echo "🔗 Attaching Newsletter S3 policy to actual Cognito role..."
aws iam attach-role-policy \
    --role-name "$ACTUAL_ROLE_NAME" \
    --policy-arn "$POLICY_ARN" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE"

if [ $? -eq 0 ]; then
    echo "✅ Policy attached successfully!"
else
    echo "⚠️  Policy attachment failed or policy already attached"
fi

# Verify the policy is now attached
echo ""
echo "🔍 Verifying policy attachment..."
aws iam list-attached-role-policies \
    --role-name "$ACTUAL_ROLE_NAME" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    --query 'AttachedPolicies[?contains(PolicyName, `Newsletter`)]' \
    --output table

# Show all attached policies for reference
echo ""
echo "📋 All attached policies for actual Cognito role:"
aws iam list-attached-role-policies \
    --role-name "$ACTUAL_ROLE_NAME" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    --query 'AttachedPolicies' \
    --output table

echo ""
echo "✅ Configuration complete for actual Cognito role!"
echo ""
echo "The role that was actually being used in the error:"
echo "  🎯 $ACTUAL_ROLE_NAME"
echo ""
echo "Should now have access to:"
echo "  📦 S3 Bucket: $BUCKET_NAME"
echo "  📁 Path: newsletter-images/*"
echo "  🔧 Actions: GetObject, PutObject, DeleteObject, ListBucket"
echo ""
echo "Next steps:"
echo "  1. Test image upload in newsletter form"
echo "  2. Check browser console for any remaining errors"
echo "  3. Verify images appear in S3 bucket"
