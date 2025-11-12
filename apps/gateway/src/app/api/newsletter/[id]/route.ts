import { NextRequest, NextResponse } from 'next/server'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@amplify/data/resource'
import outputs from '@root/amplify_outputs.json'

// Configure Amplify for server-side API routes
Amplify.configure(outputs, { ssr: true })

const client = generateClient<Schema>()

interface RouteParams {
  params: { id: string }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    // Soft delete the newsletter
    const { data: newsletter, errors } = await client.models.Newsletter.update({
      id,
      isDeleted: true
    })

    if (errors) {
      return NextResponse.json(
        { error: 'Newsletter not found or already deleted' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: newsletter })
  } catch (error) {
    console.error('Error deleting newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to delete newsletter' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    const { data: newsletter, errors } = await client.models.Newsletter.get(
      { id },
      {
        selectionSet: [
          'id',
          'subject',
          'slug',
          'eventDate',
          'publicationDate',
          'title',
          'greetings',
          'htmlContent',
          'isDeleted',
          'contentBlocks.*'
        ]
      }
    )

    if (errors || !newsletter || newsletter.isDeleted) {
      return NextResponse.json(
        { error: 'Newsletter not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: newsletter })
  } catch (error) {
    console.error('Error fetching newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to fetch newsletter' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    const body = await request.json()

    const { data: newsletter, errors } = await client.models.Newsletter.update({
      id,
      ...body
    })

    if (errors) {
      return NextResponse.json(
        { error: 'Failed to update newsletter' },
        { status: 400 }
      )
    }

    return NextResponse.json({ data: newsletter })
  } catch (error) {
    console.error('Error updating newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to update newsletter' },
      { status: 500 }
    )
  }
}