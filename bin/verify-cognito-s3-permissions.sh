#!/bin/bash

# Verify IAM permissions for Cognito Identity Pool role S3 access
# Checks if the role has the necessary policies attached

echo "🔍 Verifying Cognito Identity Pool S3 permissions..."

# Extract role name from ARN
ROLE_ARN="$FLEX_AWS_AUTHENTICATED_ROLE_ARN"
ROLE_NAME=$(echo "$ROLE_ARN" | sed 's/.*\///')
BUCKET_NAME="$FLEX_AWS_STORAGE_BUCKET_NAME"

echo "📝 Checking configuration:"
echo "  Role ARN: $ROLE_ARN"
echo "  Role Name: $ROLE_NAME"
echo "  S3 Bucket: $BUCKET_NAME"
echo ""

# Check if role exists
echo "👤 Verifying role exists..."
aws iam get-role \
    --role-name "$ROLE_NAME" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    --query 'Role.{RoleName:RoleName,CreateDate:CreateDate}' \
    --output table

if [ $? -ne 0 ]; then
    echo "❌ Role not found: $ROLE_NAME"
    exit 1
fi

# List all attached policies
echo ""
echo "🔗 Attached managed policies:"
aws iam list-attached-role-policies \
    --role-name "$ROLE_NAME" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    --query 'AttachedPolicies' \
    --output table

# List inline policies
echo ""
echo "📄 Inline policies:"
aws iam list-role-policies \
    --role-name "$ROLE_NAME" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    --query 'PolicyNames' \
    --output table

# Check specifically for Newsletter S3 policy
POLICY_ARN="arn:aws:iam::${FLEX_AWS_ORG_ID}:policy/NewsletterS3AccessPolicy"
echo ""
echo "🎯 Checking for Newsletter S3 policy attachment..."
aws iam list-attached-role-policies \
    --role-name "$ROLE_NAME" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    --query "AttachedPolicies[?PolicyArn=='$POLICY_ARN']" \
    --output table

if [ $? -eq 0 ]; then
    echo "✅ Newsletter S3 policy check completed"
else
    echo "⚠️  Could not verify Newsletter S3 policy attachment"
fi

# Get policy details if it exists
echo ""
echo "📋 Newsletter S3 policy details:"
aws iam get-policy \
    --policy-arn "$POLICY_ARN" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    --query 'Policy.{PolicyName:PolicyName,CreateDate:CreateDate,UpdateDate:UpdateDate}' \
    --output table 2>/dev/null

# Get policy version
echo ""
echo "📖 Policy document (latest version):"
POLICY_VERSION=$(aws iam get-policy \
    --policy-arn "$POLICY_ARN" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    --query 'Policy.DefaultVersionId' \
    --output text 2>/dev/null)

if [ "$POLICY_VERSION" != "" ] && [ "$POLICY_VERSION" != "None" ]; then
    aws iam get-policy-version \
        --policy-arn "$POLICY_ARN" \
        --version-id "$POLICY_VERSION" \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE" \
        --query 'PolicyVersion.Document' \
        --output json
else
    echo "❌ Could not retrieve policy version"
fi

echo ""
echo "🧪 Testing S3 permissions simulation..."
echo "Note: This uses IAM policy simulation to check theoretical access"

# Simulate S3 actions
aws iam simulate-principal-policy \
    --policy-source-arn "$ROLE_ARN" \
    --action-names "s3:PutObject" "s3:GetObject" "s3:DeleteObject" "s3:ListBucket" \
    --resource-arns \
        "arn:aws:s3:::${BUCKET_NAME}/newsletter-images/test.png" \
        "arn:aws:s3:::${BUCKET_NAME}" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    --query 'EvaluationResults[*].{Action:ActionName,Resource:ResourceName,Decision:EvalDecision}' \
    --output table

echo ""
echo "🔍 Verification complete!"
echo ""
echo "If permissions are missing:"
echo "  1. Run: ./bin/configure-cognito-s3-permissions.sh"
echo "  2. Wait 1-2 minutes for AWS propagation"
echo "  3. Test upload again"
echo ""
echo "If permissions show as 'allowed' but uploads still fail:"
echo "  - Check if bucket policy conflicts with IAM permissions"
echo "  - Verify bucket name matches exactly: $BUCKET_NAME"
echo "  - Check Cognito Identity Pool trust relationships"
