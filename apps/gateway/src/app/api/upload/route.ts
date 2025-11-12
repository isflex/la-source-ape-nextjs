import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'
import outputs from '@root/amplify_outputs.json'

// Disable Next.js body parser to handle streaming ourselves
export const runtime = 'nodejs'

// Create S3 client lazily to reduce initial compilation time
let s3Client: any = null

async function getS3ClientWithCognito(idToken: string) {
  const { S3Client } = await import('@aws-sdk/client-s3')
  const { fromCognitoIdentityPool } = await import('@aws-sdk/credential-provider-cognito-identity')
  const { CognitoIdentityClient } = await import('@aws-sdk/client-cognito-identity')

  console.log('S3 Client Debug (Cognito):', {
    region: outputs?.auth?.aws_region || 'eu-west-3',
    identityPoolId: outputs?.auth?.identity_pool_id,
    userPoolId: outputs?.auth?.user_pool_id,
    bucketName: outputs?.storage?.bucket_name
  })

  // Create Cognito Identity client
  const cognitoIdentity = new CognitoIdentityClient({
    region: outputs?.auth?.aws_region || 'eu-west-3'
  })

  // Use Cognito Identity Pool with authenticated user credentials
  const client = new S3Client({
    region: outputs?.storage?.aws_region || outputs?.auth?.aws_region || 'eu-west-3',
    credentials: fromCognitoIdentityPool({
      client: cognitoIdentity,
      identityPoolId: outputs?.auth?.identity_pool_id || '',
      logins: {
        [`cognito-idp.${outputs?.auth?.aws_region}.amazonaws.com/${outputs?.auth?.user_pool_id}`]: idToken
      }
    })
  })

  console.log('✅ S3 Client configured with Cognito Identity Pool authentication')
  return client
}

// Maximum file size (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]

/**
 * Verify admin authentication and return Cognito ID token
 */
async function verifyAdminAuth(request: NextRequest): Promise<{ isAuthenticated: boolean; idToken?: string }> {
  try {
    // Get Authorization header with Bearer token (Cognito ID token)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { isAuthenticated: false }
    }

    const idToken = authHeader.substring(7) // Remove "Bearer " prefix

    // Verify the Cognito JWT token
    const { CognitoJwtVerifier } = await import('aws-jwt-verify')

    const verifier = CognitoJwtVerifier.create({
      userPoolId: outputs?.auth?.user_pool_id || '',
      tokenUse: 'id', // Use ID token for user identity
      clientId: outputs?.auth?.user_pool_client_id || ''
    })

    const payload = await verifier.verify(idToken)
    console.log('✅ Admin authenticated via Cognito:', {
      userId: payload.sub,
      email: payload.email
    })

    return { isAuthenticated: true, idToken }

  } catch (error) {
    console.error('❌ Cognito auth verification failed:', error)
    return { isAuthenticated: false }
  }
}

/**
 * Generate a unique S3 key for uploaded files
 */
function generateS3Key(filename: string): string {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 15)
  const fileExtension = filename.split('.').pop() || 'png'
  // Use newsletter-images/ path which requires authenticated access
  return `newsletter-images/${timestamp}-${randomId}.${fileExtension}`
}

/**
 * Create a true streaming parser for multipart data
 */
function createStreamingMultipartParser(boundary: string) {
  let buffer = Buffer.alloc(0)
  let state: 'boundary' | 'headers' | 'data' = 'boundary'
  let filename = ''
  let contentType = ''
  let fileDataChunks: Buffer[] = []
  let headerBuffer = ''

  const boundaryBuffer = Buffer.from(`--${boundary}`)
  const endBoundaryBuffer = Buffer.from(`--${boundary}--`)

  return {
    push: (chunk: Buffer): boolean => {
      buffer = Buffer.concat([buffer, chunk])

      while (buffer.length > 0) {
        if (state === 'boundary') {
          const boundaryIndex = buffer.indexOf(boundaryBuffer)
          if (boundaryIndex === -1) break

          buffer = buffer.slice(boundaryIndex + boundaryBuffer.length)
          if (buffer.length >= 2 && buffer[0] === 0x0d && buffer[1] === 0x0a) {
            buffer = buffer.slice(2)
          }
          state = 'headers'
          continue
        }

        if (state === 'headers') {
          const headerEndIndex = buffer.indexOf('\r\n\r\n')
          if (headerEndIndex === -1) break

          headerBuffer += buffer.slice(0, headerEndIndex).toString()
          buffer = buffer.slice(headerEndIndex + 4)

          // Parse headers
          const lines = headerBuffer.split('\r\n')
          for (const line of lines) {
            if (line.includes('filename=')) {
              const filenameMatch = line.match(/filename="([^"]+)"/)
              if (filenameMatch) filename = filenameMatch[1]
            }
            if (line.includes('Content-Type:')) {
              contentType = line.split('Content-Type:')[1].trim()
            }
          }

          state = 'data'
          continue
        }

        if (state === 'data') {
          // Look for next boundary
          const nextBoundaryIndex = buffer.indexOf(boundaryBuffer)
          if (nextBoundaryIndex === -1) {
            // No boundary found, store all data except some safety margin
            if (buffer.length > boundaryBuffer.length + 10) {
              const safeLength = buffer.length - (boundaryBuffer.length + 10)
              fileDataChunks.push(buffer.slice(0, safeLength))
              buffer = buffer.slice(safeLength)
            }
            break
          } else {
            // Found boundary, extract file data
            let fileData = buffer.slice(0, nextBoundaryIndex)
            // Remove trailing CRLF
            if (fileData.length >= 2 &&
                fileData[fileData.length - 2] === 0x0d &&
                fileData[fileData.length - 1] === 0x0a) {
              fileData = fileData.slice(0, -2)
            }
            fileDataChunks.push(fileData)

            // Check if this is the end boundary
            if (buffer.indexOf(endBoundaryBuffer) === nextBoundaryIndex) {
              return true // End of multipart data
            }

            buffer = buffer.slice(nextBoundaryIndex)
            state = 'boundary'
            continue
          }
        }
      }
      return false
    },

    getResult: () => ({
      file: Buffer.concat(fileDataChunks),
      filename,
      contentType: contentType || 'application/octet-stream'
    })
  }
}

/**
 * Parse multipart form data from stream with true streaming
 */
async function parseMultipartStream(request: NextRequest): Promise<{ file: Buffer, filename: string, contentType: string } | null> {
  const contentTypeHeader = request.headers.get('content-type')
  if (!contentTypeHeader || !contentTypeHeader.includes('multipart/form-data')) {
    return null
  }

  // Extract boundary from content-type header
  const boundaryMatch = contentTypeHeader.match(/boundary=(.+)$/)
  if (!boundaryMatch) return null

  const boundary = boundaryMatch[1]
  const reader = request.body?.getReader()
  if (!reader) return null

  const parser = createStreamingMultipartParser(boundary)
  let done = false

  // Process stream chunk by chunk
  while (!done) {
    const { value, done: streamDone } = await reader.read()
    done = streamDone

    if (value) {
      const isComplete = parser.push(Buffer.from(value))
      if (isComplete) break
    }
  }

  return parser.getResult()
}

/**
 * Create a streaming upload to S3 from file buffer
 */
async function streamUploadToS3(
  fileBuffer: Buffer,
  s3Key: string,
  bucketName: string,
  contentType: string,
  originalFilename: string,
  idToken: string
): Promise<any> {
  // Create readable stream from buffer
  const stream = Readable.from(fileBuffer)

  // Dynamically import Upload for better compilation performance
  const { Upload } = await import('@aws-sdk/lib-storage')
  const client = await getS3ClientWithCognito(idToken)

  // Use S3 multipart upload with streaming
  const upload = new Upload({
    client,
    params: {
      Bucket: bucketName,
      Key: s3Key,
      Body: stream,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000', // 1 year cache
      Metadata: {
        'original-filename': originalFilename,
        'upload-source': 'admin-api-stream',
        'uploaded-by': 'admin-user',
        'upload-timestamp': Date.now().toString(),
      }
    }
  })

  return await upload.done()
}

/**
 * POST /api/upload
 * Handle server-side streaming file upload to S3 for authenticated admins
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication and get Cognito ID token
    const authResult = await verifyAdminAuth(request)
    if (!authResult.isAuthenticated || !authResult.idToken) {
      return NextResponse.json(
        { error: 'Unauthorized - Valid Cognito ID token required' },
        { status: 401 }
      )
    }

    // Get bucket name from Amplify outputs
    const bucketName = outputs?.storage?.bucket_name
    if (!bucketName) {
      console.error('S3 bucket not configured in Amplify outputs')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Parse multipart form data from stream
    const parsedData = await parseMultipartStream(request)
    if (!parsedData) {
      return NextResponse.json(
        { error: 'No file provided or invalid multipart data' },
        { status: 400 }
      )
    }

    const { file: fileBuffer, filename, contentType } = parsedData

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.map(t => t.split('/')[1]).join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (fileBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Generate S3 key
    const s3Key = generateS3Key(filename)

    console.log('Admin streaming upload to S3:', {
      key: s3Key,
      size: fileBuffer.length,
      type: contentType,
      bucket: bucketName
    })

    // Stream upload to S3 using Cognito authenticated credentials
    const uploadResult = await streamUploadToS3(
      fileBuffer,
      s3Key,
      bucketName,
      contentType,
      filename,
      authResult.idToken
    )

    console.log('Streaming upload successful:', {
      key: s3Key,
      etag: uploadResult.ETag,
      location: uploadResult.Location
    })

    // Return S3 metadata for client-side form integration
    const responseData = {
      success: true,
      s3Key,
      s3Bucket: bucketName,
      originalFilename: filename,
      mimeType: contentType,
      fileSize: fileBuffer.length,
      uploadedAt: new Date().toISOString(),
      previewPath: s3Key
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Streaming upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/upload
 * Delete a file from S3 for authenticated admins
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication and get Cognito ID token
    const authResult = await verifyAdminAuth(request)
    if (!authResult.isAuthenticated || !authResult.idToken) {
      return NextResponse.json(
        { error: 'Unauthorized - Valid Cognito ID token required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const s3Key = searchParams.get('key')

    if (!s3Key) {
      return NextResponse.json(
        { error: 'S3 key is required' },
        { status: 400 }
      )
    }

    // Validate that key is in allowed path
    if (!s3Key.startsWith('newsletter-images/')) {
      return NextResponse.json(
        { error: 'Invalid S3 key path' },
        { status: 400 }
      )
    }

    const bucketName = outputs?.storage?.bucket_name
    if (!bucketName) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    console.log('Admin delete from S3:', { key: s3Key, bucket: bucketName })

    // Delete from S3 using Cognito authenticated credentials
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3')
    const client = await getS3ClientWithCognito(authResult.idToken)

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: s3Key
    })

    await client.send(deleteCommand)
    console.log('Delete successful:', { key: s3Key })

    return NextResponse.json({ success: true, deletedKey: s3Key })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Delete failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}