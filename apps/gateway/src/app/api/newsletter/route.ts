import { NextRequest, NextResponse } from 'next/server'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@amplify/data/resource'
import outputs from '@root/amplify_outputs.json'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Configure Amplify for server-side API routes
Amplify.configure(outputs, { ssr: true })

const client = generateClient<Schema>()

// Configure S3 client for server-side uploads
const s3Client = new S3Client({
  region: outputs?.storage?.aws_region || process.env.AWS_REGION || 'eu-west-3',
})

// Logo management configuration
const LOGO_CONTENT_BLOCK_ID = 'NEWSLETTER_LOGO_HEADER'
const LOGO_FILE_PATH = path.join(process.cwd(), 'public', 'assets', 'img', 'newsletter', 'presentation', 'logo_ape_900x175.png')

/**
 * Ensures the shared newsletter logo exists in S3 and has a ContentBlock record
 * Returns the base64 encoded logo for email use
 */
async function ensureNewsletterLogo(): Promise<string> {
  try {
    // Check if logo ContentBlock already exists
    const { data: existingLogo } = await client.models.ContentBlock.get({
      id: LOGO_CONTENT_BLOCK_ID
    })

    // Check if logo file has changed (compare file hash)
    const logoFileBuffer = fs.readFileSync(LOGO_FILE_PATH)
    const logoFileHash = crypto.createHash('md5').update(logoFileBuffer).digest('hex')

    if (existingLogo && existingLogo.path === logoFileHash) {
      console.log('Logo ContentBlock exists and file unchanged, calling Lambda for base64...')

      // Logo exists and file hasn't changed, get base64 from Lambda
      if (existingLogo.s3Key) {
        const lambdaUrl = `${process.env.LAMBDA_BASE_URL}/image-base64/${encodeURIComponent(existingLogo.s3Key)}`
        const response = await fetch(lambdaUrl)

        if (response.ok) {
          const { base64 } = await response.json()
          return base64
        }
      }
    }

    console.log('Creating/updating newsletter logo...')

    // Read logo file and calculate hash
    const logoFileName = path.basename(LOGO_FILE_PATH)
    const logoS3Key = `newsletter-images/logo-${logoFileHash}.png`

    // Upload logo file to S3 using server-side SDK
    const bucketName = outputs?.storage?.bucket_name
    if (!bucketName) {
      throw new Error('S3 bucket not configured in Amplify outputs')
    }

    console.log(`Uploading logo to S3: ${bucketName}/${logoS3Key}`)

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: logoS3Key,
      Body: logoFileBuffer,
      ContentType: 'image/png',
      CacheControl: 'public, max-age=31536000', // 1 year cache
      Metadata: {
        'original-filename': logoFileName,
        'upload-source': 'newsletter-api',
        'file-hash': logoFileHash,
      }
    })

    await s3Client.send(uploadCommand)
    console.log(`Logo uploaded successfully to S3: ${logoS3Key}`)

    // Create or update ContentBlock record
    const logoContentBlock = {
      id: LOGO_CONTENT_BLOCK_ID,
      newsletterId: 'SHARED', // Special newsletter ID for shared assets
      order: -1, // Special order for logo
      type: 'CENTRED_IMAGE' as Schema['EContentBlockType']['type'],
      s3Key: logoS3Key,
      s3Bucket: bucketName,
      originalFilename: logoFileName,
      mimeType: 'image/png',
      fileSize: logoFileBuffer.length,
      subtitle: 'Newsletter Logo',
      path: logoFileHash, // Store hash for change detection
    }

    if (existingLogo) {
      await client.models.ContentBlock.update(logoContentBlock)
    } else {
      await client.models.ContentBlock.create(logoContentBlock)
    }

    // Get base64 from Lambda function for email use
    const lambdaUrl = `${process.env.LAMBDA_BASE_URL}/image-base64/${encodeURIComponent(logoS3Key)}`
    const lambdaResponse = await fetch(lambdaUrl)

    if (lambdaResponse.ok) {
      const { base64 } = await lambdaResponse.json()
      return base64
    } else {
      console.warn('Lambda function not available, falling back to direct base64')
      return logoFileBuffer.toString('base64')
    }

  } catch (error) {
    console.error('Error ensuring newsletter logo:', error)

    // Fallback: read file and return base64 directly
    try {
      const logoFileBuffer = fs.readFileSync(LOGO_FILE_PATH)
      return logoFileBuffer.toString('base64')
    } catch (fallbackError) {
      console.error('Fallback logo read failed:', fallbackError)
      throw new Error('Logo not available')
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const logoRequest = searchParams.get('logo')

    // Handle logo base64 request
    if (logoRequest === 'base64') {
      try {
        const logoBase64 = await ensureNewsletterLogo()
        return NextResponse.json({
          base64: logoBase64,
          mimeType: 'image/png'
        })
      } catch (error) {
        console.error('Error getting newsletter logo:', error)
        return NextResponse.json(
          { error: 'Failed to get newsletter logo' },
          { status: 500 }
        )
      }
    }

    // Default: return newsletters list for public display
    const { data: newsletters } = await client.models.Newsletter.list({
      filter: {
        isDeleted: { eq: false }
      }
    })

    return NextResponse.json({ data: newsletters })
  } catch (error) {
    console.error('Error fetching newsletters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch newsletters' },
      { status: 500 }
    )
  }
}

// Newsletter creation is now handled client-side via Amplify AppSync
// This API route focuses on public display, logo management, and testing utilities
export async function DELETE() {
  try {
    // Test cleanup endpoint for Cypress tests
    const { data: testNewsletters } = await client.models.Newsletter.list({
      filter: {
        subject: { contains: 'Test' }
      }
    })

    if (testNewsletters) {
      for (const newsletter of testNewsletters) {
        await client.models.Newsletter.update({
          id: newsletter.id,
          isDeleted: true
        })
      }
    }

    return NextResponse.json({ message: 'Test data cleaned up' })
  } catch (error) {
    console.error('Error cleaning up test data:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup test data' },
      { status: 500 }
    )
  }
}
