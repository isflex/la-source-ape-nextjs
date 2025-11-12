import { NextRequest, NextResponse } from 'next/server';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

const client = generateClient<Schema>();

// GET /api/piscine/[id] - Get a specific piscine form with its date slots and candidats
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the piscine form
    const { data: piscineForm, errors: formErrors } = await client.models.PiscineForm.get({ id });

    if (formErrors || !piscineForm) {
      return NextResponse.json(
        { error: 'Piscine form not found' },
        { status: 404 }
      );
    }

    // Get date slots for this form
    const { data: dateSlots, errors: slotsErrors } = await client.models.PiscineDateSlot.list({
      filter: { piscineFormId: { eq: id } }
    });

    if (slotsErrors) {
      console.error('Error fetching date slots:', slotsErrors);
      return NextResponse.json(
        { error: 'Failed to fetch date slots' },
        { status: 500 }
      );
    }

    // Get candidats for each date slot
    const dateSlotsWithCandidats = await Promise.all(
      (dateSlots || []).map(async (slot) => {
        const { data: candidats, errors: candidatsErrors } = await client.models.PiscineCandidat.list({
          filter: { piscineDateSlotId: { eq: slot.id } }
        });

        if (candidatsErrors) {
          console.error('Error fetching candidats:', candidatsErrors);
        }

        return {
          ...slot,
          candidats: (candidats || []).sort((a, b) => (a.order || 0) - (b.order || 0))
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        ...piscineForm,
        dateSlots: dateSlotsWithCandidats.sort((a, b) => (a.order || 0) - (b.order || 0))
      }
    });

  } catch (error) {
    console.error('Error in GET /api/piscine/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/piscine/[id] - Update a piscine form
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const {
      title,
      dayOfWeek,
      startTime,
      endTime,
      schoolLevel,
      teacherName
    } = body;

    // Update the piscine form
    const { data: piscineForm, errors } = await client.models.PiscineForm.update({
      id,
      title,
      dayOfWeek: dayOfWeek as Schema['EDayOfWeek']['type'],
      startTime,
      endTime,
      schoolLevel: schoolLevel as Schema['ESchoolLevel']['type'],
      teacherName
    });

    if (errors || !piscineForm) {
      console.error('Error updating piscine form:', errors);
      return NextResponse.json(
        { error: 'Failed to update piscine form' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: piscineForm
    });

  } catch (error) {
    console.error('Error in PUT /api/piscine/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/piscine/[id] - Delete a piscine form and all its related data
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // First get all date slots for this form
    const { data: dateSlots, errors: slotsErrors } = await client.models.PiscineDateSlot.list({
      filter: { piscineFormId: { eq: id } }
    });

    if (slotsErrors) {
      console.error('Error fetching date slots for deletion:', slotsErrors);
      return NextResponse.json(
        { error: 'Failed to fetch date slots' },
        { status: 500 }
      );
    }

    // Delete all candidats for all date slots
    if (dateSlots && dateSlots.length > 0) {
      const deleteCandidatsPromises = dateSlots.map(async (slot) => {
        const { data: candidats } = await client.models.PiscineCandidat.list({
          filter: { piscineDateSlotId: { eq: slot.id } }
        });

        if (candidats && candidats.length > 0) {
          const deleteCandidatPromises = candidats.map(candidat =>
            client.models.PiscineCandidat.delete({ id: candidat.id })
          );
          await Promise.all(deleteCandidatPromises);
        }

        // Delete the date slot
        return client.models.PiscineDateSlot.delete({ id: slot.id });
      });

      await Promise.all(deleteCandidatsPromises);
    }

    // Finally delete the piscine form
    const { data: deletedForm, errors: deleteErrors } = await client.models.PiscineForm.delete({ id });

    if (deleteErrors) {
      console.error('Error deleting piscine form:', deleteErrors);
      return NextResponse.json(
        { error: 'Failed to delete piscine form' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Piscine form and all related data deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/piscine/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}