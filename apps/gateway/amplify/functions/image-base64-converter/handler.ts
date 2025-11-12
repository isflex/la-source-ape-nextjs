import { Handler } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client
const s3Client = new S3Client({});

interface LambdaEvent {
  pathParameters: {
    s3Key: string;
  };
  queryStringParameters?: {
    bucket?: string;
  };
}

interface LambdaResponse {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Headers': string;
    'Cache-Control'?: string;
  };
  body: string;
}

export const handler: Handler<LambdaEvent, LambdaResponse> = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  };

  try {
    // Get S3 key from path parameters
    const s3Key = event.pathParameters?.s3Key;
    if (!s3Key) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'S3 key is required' }),
      };
    }

    // Decode the S3 key (it may be URL encoded)
    const decodedS3Key = decodeURIComponent(s3Key);

    // Get bucket from query parameters or environment
    const bucketName = event.queryStringParameters?.bucket;
    if (!bucketName) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'S3 bucket name not configured' }),
      };
    }

    console.log('Fetching from S3:', { bucket: bucketName, key: decodedS3Key });

    // Get object from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: decodedS3Key,
    });

    const s3Response = await s3Client.send(getObjectCommand);

    if (!s3Response.Body) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'File not found in S3' }),
      };
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    const reader = s3Response.Body.transformToWebStream().getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    // Combine all chunks into a single buffer
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const buffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }

    // Convert to base64
    const base64String = Buffer.from(buffer).toString('base64');

    // Get content type
    const contentType = s3Response.ContentType || 'application/octet-stream';
    const mimeType = contentType.split(';')[0]; // Remove charset if present

    // Return response with caching headers
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
      body: JSON.stringify({
        base64: base64String,
        mimeType: mimeType,
        contentType: contentType,
        size: buffer.length,
        s3Key: decodedS3Key,
        bucket: bucketName,
      }),
    };

  } catch (error) {
    console.error('Error processing request:', error);

    let errorMessage = 'Internal server error';
    let statusCode = 500;

    // Handle specific AWS errors
    if (error instanceof Error) {
      if (error.name === 'NoSuchKey' || error.message.includes('NoSuchKey')) {
        errorMessage = 'File not found';
        statusCode = 404;
      } else if (error.name === 'AccessDenied') {
        errorMessage = 'Access denied';
        statusCode = 403;
      } else {
        errorMessage = error.message;
      }
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({
        error: errorMessage,
        s3Key: event.pathParameters?.s3Key,
      }),
    };
  }
};
