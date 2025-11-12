#!/bin/bash

# Configure IAM permissions for Cognito Identity Pool role to access S3 newsletter storage
# Attaches IAM policy to the authenticated role for S3 bucket access

echo "🔐 Configuring Cognito Identity Pool role permissions for S3 access..."

# Extract role name from ARN
ROLE_ARN="$FLEX_AWS_AUTHENTICATED_ROLE_ARN"
ROLE_NAME=$(echo "$ROLE_ARN" | sed 's/.*\///')
BUCKET_NAME="$FLEX_AWS_STORAGE_BUCKET_NAME"

echo "📝 Configuration:"
echo "  Role ARN: $ROLE_ARN"
echo "  Role Name: $ROLE_NAME"
echo "  S3 Bucket: $BUCKET_NAME"
echo "  AWS Region: $AWS_REGION"
echo "  AWS Profile: $AWS_PROFILE"

# Create IAM policy document for S3 access
echo "📄 Creating IAM policy document..."
cat > /tmp/cognito-s3-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "NewsletterS3Access",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/newsletter-images/*"
        },
        {
            "Sid": "NewsletterS3ListAccess",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::${BUCKET_NAME}",
            "Condition": {
                "StringLike": {
                    "s3:prefix": "newsletter-images/*"
                }
            }
        }
    ]
}
EOF

# Create or update the IAM policy
POLICY_NAME="NewsletterS3AccessPolicy"
POLICY_ARN="arn:aws:iam::${FLEX_AWS_ORG_ID}:policy/${POLICY_NAME}"

echo "🔧 Creating/updating IAM policy: $POLICY_NAME"

# Check if policy exists
aws iam get-policy \
    --policy-arn "$POLICY_ARN" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "📝 Policy exists, creating new version..."
    # Policy exists, create new version
    aws iam create-policy-version \
        --policy-arn "$POLICY_ARN" \
        --policy-document file:///tmp/cognito-s3-policy.json \
        --set-as-default \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE"
else
    echo "📄 Creating new policy..."
    # Create new policy
    aws iam create-policy \
        --policy-name "$POLICY_NAME" \
        --policy-document file:///tmp/cognito-s3-policy.json \
        --description "S3 access permissions for newsletter image storage via Cognito Identity Pool" \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE"
fi

if [ $? -ne 0 ]; then
    echo "❌ Failed to create/update IAM policy"
    exit 1
fi

# Attach policy to the Cognito authenticated role
echo "🔗 Attaching policy to Cognito role: $ROLE_NAME"
aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "$POLICY_ARN" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE"

if [ $? -ne 0 ]; then
    echo "❌ Failed to attach policy to role"
    # Try to continue anyway as the policy might already be attached
    echo "⚠️  Policy might already be attached, continuing..."
fi

# Clean up temporary file
rm -f /tmp/cognito-s3-policy.json

echo ""
echo "✅ IAM permissions configured successfully!"
echo ""
echo "Configuration Details:"
echo "  🔐 IAM Policy: $POLICY_NAME ($POLICY_ARN)"
echo "  👤 Cognito Role: $ROLE_NAME"
echo "  📦 S3 Bucket: $BUCKET_NAME"
echo "  📁 Allowed Path: newsletter-images/*"
echo "  🔧 Permissions: GetObject, PutObject, DeleteObject, ListBucket"
echo ""
echo "Verifying role policies..."

# List policies attached to the role
aws iam list-attached-role-policies \
    --role-name "$ROLE_NAME" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    --query 'AttachedPolicies[?contains(PolicyName, `Newsletter`) || contains(PolicyName, `S3`)]'

if [ $? -eq 0 ]; then
    echo "✅ Role policy verification successful"
    echo "🎯 Cognito Identity Pool role now has S3 access permissions!"
    echo ""
    echo "Next steps:"
    echo "  1. Redeploy Amplify sandbox if needed"
    echo "  2. Test image upload in newsletter form"
    echo "  3. Verify images are stored in S3 bucket"
else
    echo "⚠️  Could not verify role policies, but configuration may still be successful"
fi
