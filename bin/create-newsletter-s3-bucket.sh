#!/bin/bash

# Create S3 bucket for newsletter storage with proper IAM permissions
# Sets up bucket with CORS, public access settings, and IAM policies for Cognito Identity Pool

echo "🪣 Creating S3 bucket for newsletter storage..."

# Generate unique bucket name if not provided
if [ -z "$FLEX_AWS_STORAGE_BUCKET_NAME" ]; then
    BUCKET_NAME="ape-newsletter-storage-$(date +%Y%m%d)-$(openssl rand -hex 4)"
    echo "📝 Generated bucket name: $BUCKET_NAME"
else
    BUCKET_NAME="$FLEX_AWS_STORAGE_BUCKET_NAME"
    echo "📝 Using provided bucket name: $BUCKET_NAME"
fi

# Create the S3 bucket
echo "🔨 Creating S3 bucket: $BUCKET_NAME"
aws s3api create-bucket \
    --bucket "$BUCKET_NAME" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    --create-bucket-configuration LocationConstraint="$AWS_REGION"

if [ $? -ne 0 ]; then
    echo "❌ Failed to create S3 bucket"
    exit 1
fi

# Configure bucket versioning
echo "🔄 Enabling versioning on bucket..."
aws s3api put-bucket-versioning \
    --bucket "$BUCKET_NAME" \
    --versioning-configuration Status=Enabled \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE"

# Configure public access block settings first (allow bucket policies but block ACLs)
echo "🔓 Configuring public access settings..."
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE"

# Wait a moment for settings to propagate
sleep 2

# Configure bucket CORS for web application access
echo "🌐 Configuring CORS policy..."
cat > /tmp/cors-config.json << EOF
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "AllowedOrigins": [
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:4009",
                "https://after-school.flexiness.com",
                "https://ape.ecolelasource.org",
                "https://apelasource.org",
                "https://main.d1cftsvc5q8k92.amplifyapp.com",
                "https://flexi.d2ybqei9w8j7t5.amplifyapp.com",
                "https://web-app.ecolelasource.org"
            ],
            "ExposeHeaders": ["ETag"],
            "MaxAgeSeconds": 3000
        }
    ]
}
EOF

aws s3api put-bucket-cors \
    --bucket "$BUCKET_NAME" \
    --cors-configuration file:///tmp/cors-config.json \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE"

# Configure bucket policy for Cognito Identity Pool access
echo "🔐 Configuring bucket policy for Cognito Identity Pool access..."
cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCognitoAuthenticatedAccess",
            "Effect": "Allow",
            "Principal": {
                "AWS": "$FLEX_AWS_AUTHENTICATED_ROLE_ARN"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/newsletter-images/*"
        },
        {
            "Sid": "AllowCognitoAuthenticatedList",
            "Effect": "Allow",
            "Principal": {
                "AWS": "$FLEX_AWS_AUTHENTICATED_ROLE_ARN"
            },
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}",
            "Condition": {
                "StringLike": {
                    "s3:prefix": "newsletter-images/*"
                }
            }
        },
        {
            "Sid": "AllowPublicReadAccess",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/newsletter-images/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy \
    --bucket "$BUCKET_NAME" \
    --policy file:///tmp/bucket-policy.json \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE"

# Clean up temporary files
rm -f /tmp/cors-config.json /tmp/bucket-policy.json

echo ""
echo "✅ S3 bucket created successfully!"
echo ""
echo "Bucket Details:"
echo "  📦 Name: $BUCKET_NAME"
echo "  🌍 Region: $AWS_REGION"
echo "  📁 Newsletter images path: newsletter-images/*"
echo "  🔐 Cognito authenticated role has read/write access"
echo "  🌐 Public read access enabled for newsletter images"
echo "  🔄 Versioning enabled"
echo "  🌐 CORS configured for web access"
echo ""
echo "Environment Variable:"
echo "  Add to .env file: FLEX_AWS_STORAGE_BUCKET_NAME=\"$BUCKET_NAME\""
echo ""
echo "Verifying bucket configuration..."

# Verify bucket exists and show some details
aws s3api head-bucket --bucket "$BUCKET_NAME" --region "$AWS_REGION" --profile "$AWS_PROFILE"
if [ $? -eq 0 ]; then
    echo "✅ Bucket verification successful"

    # Show bucket location
    aws s3api get-bucket-location \
        --bucket "$BUCKET_NAME" \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE" \
        --query 'LocationConstraint'

    echo "🎯 Bucket is ready for newsletter image storage!"
else
    echo "❌ Bucket verification failed"
    exit 1
fi
