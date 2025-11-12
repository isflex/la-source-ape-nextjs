import { NextRequest, NextResponse } from 'next/server';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { PiscineCandidatSchema } from '@src/lib/piscine-helpers';
import { z } from 'zod';

const client = generateClient<Schema>();

// GET /api/piscine/[id]/candidats - Get all candidats for a piscine form
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get candidats for this piscine form
    const { data: candidats, errors } = await client.models.PiscineCandidat.list({
      filter: { piscineFormId: { eq: id } }
    });

    if (errors) {
      console.error('Error fetching candidats:', errors);
      return NextResponse.json(
        { error: 'Failed to fetch candidats' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: candidats || []
    });

  } catch (error) {
    console.error('Error in GET /api/piscine/[id]/candidats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/piscine/[id]/candidats - Create a new candidat for a piscine form
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: piscineFormId } = params;
    const body = await request.json();

    // Validate the candidat data with Zod
    try {
      const validatedData = PiscineCandidatSchema.parse({
        ...body,
        piscineFormId
      });

      // Create the candidat
      const { data: candidat, errors } = await client.models.PiscineCandidat.create({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        nameOfChild: validatedData.nameOfChild,
        piscineDateSlotId: validatedData.piscineDateSlotId,
        piscineFormId: validatedData.piscineFormId,
        order: validatedData.order || 0
      });

      if (errors || !candidat) {
        console.error('Error creating candidat:', errors);
        return NextResponse.json(
          { error: 'Failed to create candidat' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: candidat
      });

    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: validationError.errors.map(err => `${err.path.join('.')}: ${err.message}`)
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

  } catch (error) {
    console.error('Error in POST /api/piscine/[id]/candidats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/piscine/[id]/candidats - Update candidat order (for reordering)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { candidats } = body; // Array of { id, order } objects

    if (!Array.isArray(candidats)) {
      return NextResponse.json(
        { error: 'candidats must be an array' },
        { status: 400 }
      );
    }

    // Update order for each candidat
    const updatePromises = candidats.map(({ id, order }: { id: string; order: number }) =>
      client.models.PiscineCandidat.update({ id, order })
    );

    const results = await Promise.all(updatePromises);

    // Check for errors
    const errors = results.filter(result => result.errors).map(result => result.errors);
    if (errors.length > 0) {
      console.error('Error updating candidat orders:', errors);
      return NextResponse.json(
        { error: 'Failed to update some candidat orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Candidat orders updated successfully'
    });

  } catch (error) {
    console.error('Error in PUT /api/piscine/[id]/candidats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/piscine/[id]/candidats - Delete a specific candidat
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const candidatId = url.searchParams.get('candidatId');

    if (!candidatId) {
      return NextResponse.json(
        { error: 'candidatId query parameter is required' },
        { status: 400 }
      );
    }

    // Delete the candidat
    const { data: deletedCandidat, errors } = await client.models.PiscineCandidat.delete({
      id: candidatId
    });

    if (errors) {
      console.error('Error deleting candidat:', errors);
      return NextResponse.json(
        { error: 'Failed to delete candidat' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Candidat deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/piscine/[id]/candidats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}