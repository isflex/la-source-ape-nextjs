import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect, Role, ServicePrincipal, PolicyDocument } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CfnUserPool } from 'aws-cdk-lib/aws-cognito';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { imageBase64Converter } from './functions/image-base64-converter/resource';
import { customMessage } from './functions/custom-message/resource';
import { postConfirmation } from './functions/post-confirmation/resource';

const backend = defineBackend({
  auth,
  data,
  imageBase64Converter,
  customMessage,
  postConfirmation,
});

// Reference existing S3 bucket instead of creating a new one
const existingBucketName = process.env.FLEX_AWS_STORAGE_BUCKET_NAME!;
const existingBucketRegion = process.env.AWS_REGION || 'eu-west-3';

const customBucketStack = backend.createStack('existing-bucket-stack');
const existingBucket = Bucket.fromBucketAttributes(customBucketStack, 'ExistingStorageBucket', {
  bucketName: existingBucketName,
  region: existingBucketRegion
});

// Configure storage with existing bucket
backend.addOutput({
  storage: {
    aws_region: existingBucketRegion,
    bucket_name: existingBucketName,
  }
});

// Configure Lambda function with S3 permissions and environment variables
backend.imageBase64Converter.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
    resources: [`${existingBucket.bucketArn}/*`],
  })
);

// Set the storage bucket name as environment variable for Lambda
backend.imageBase64Converter.addEnvironment(
  'FLEX_AWS_STORAGE_BUCKET_NAME',
  existingBucketName
);

// Configure PostConfirmation lambda with Cognito permissions
backend.postConfirmation.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'cognito-idp:CreateGroup',
      'cognito-idp:GetGroup',
      'cognito-idp:AdminAddUserToGroup',
      'cognito-idp:AdminGetUser',
      'cognito-idp:AdminListGroupsForUser'
    ],
    resources: [
      // Allow access to the user pool
      `arn:aws:cognito-idp:${existingBucketRegion}:*:userpool/*`
    ],
  })
);

// SMS Configuration - Disabled until SNS production access approved
// Uncomment when ready to enable SMS:
/*
const smsRole = new Role(customBucketStack, 'CognitoSMSRole', {
  assumedBy: new ServicePrincipal('cognito-idp.amazonaws.com'),
  inlinePolicies: {
    CognitoSMSPolicy: new PolicyDocument({
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'sns:Publish'
          ],
          resources: ['*']
        })
      ]
    })
  },
});

const userPool = backend.auth.resources.userPool;
const cfnUserPool = userPool.node.defaultChild as CfnUserPool;
cfnUserPool.addPropertyOverride('SmsConfiguration', {
  SnsCallerArn: smsRole.roleArn,
  ExternalId: 'cognito-sms-external-id'
});
*/
