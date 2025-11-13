import { defineBackend } from '@aws-amplify/backend';
// import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
// import { Bucket } from 'aws-cdk-lib/aws-s3';
import { auth } from './auth/resource';
import { data } from './data/resource';
// import { imageBase64Converter } from './functions/image-base64-converter/resource';

const backend = defineBackend({
  auth,
  data,
  // imageBase64Converter,
});

// // Reference existing S3 bucket instead of creating a new one
// const existingBucketName = process.env.FLEX_AWS_STORAGE_BUCKET_NAME!;
// const existingBucketRegion = process.env.AWS_REGION || 'eu-west-3';

// const customBucketStack = backend.createStack('existing-bucket-stack');
// const existingBucket = Bucket.fromBucketAttributes(customBucketStack, 'ExistingStorageBucket', {
//   bucketName: existingBucketName,
//   region: existingBucketRegion
// });

// // Configure storage with existing bucket
// backend.addOutput({
//   storage: {
//     aws_region: existingBucketRegion,
//     bucket_name: existingBucketName,
//   }
// });

// // Configure Lambda function with S3 permissions and environment variables
// backend.imageBase64Converter.resources.lambda.addToRolePolicy(
//   new PolicyStatement({
//     effect: Effect.ALLOW,
//     actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
//     resources: [`${existingBucket.bucketArn}/*`],
//   })
// );

// // Set the storage bucket name as environment variable for Lambda
// backend.imageBase64Converter.addEnvironment(
//   'FLEX_AWS_STORAGE_BUCKET_NAME',
//   existingBucketName
// );
