import { NextRequest, NextResponse } from 'next/server';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

const client = generateClient<Schema>();

// GET /api/piscine - List all piscine forms
export async function GET(request: NextRequest) {
  try {
    const { data: forms, errors } = await client.models.PiscineForm.list();

    if (errors) {
      console.error('Error fetching piscine forms:', errors);
      return NextResponse.json(
        { error: 'Failed to fetch piscine forms' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: forms || []
    });

  } catch (error) {
    console.error('Error in GET /api/piscine:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/piscine - Create a new piscine form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      slug,
      dayOfWeek,
      startTime,
      endTime,
      schoolLevel,
      teacherName,
      owner,
      selectedDates
    } = body;

    // Validate required fields
    if (!title || !slug || !dayOfWeek || !startTime || !endTime || !schoolLevel || !teacherName || !owner) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the piscine form
    const { data: piscineForm, errors: formErrors } = await client.models.PiscineForm.create({
      title,
      slug,
      dayOfWeek: dayOfWeek as Schema['EDayOfWeek']['type'],
      startTime,
      endTime,
      schoolLevel: schoolLevel as Schema['ESchoolLevel']['type'],
      teacherName,
      owner
    });

    if (formErrors || !piscineForm) {
      console.error('Error creating piscine form:', formErrors);
      return NextResponse.json(
        { error: 'Failed to create piscine form' },
        { status: 500 }
      );
    }

    // Create date slots if provided
    if (selectedDates && Array.isArray(selectedDates)) {
      const dateSlotPromises = selectedDates.map(async (dateString: string, index: number) => {
        const { data: dateSlot, errors } = await client.models.PiscineDateSlot.create({
          selectedDate: dateString,
          order: index,
          piscineFormId: piscineForm.id
        });

        if (errors) {
          console.error('Error creating date slot:', errors);
        }

        return dateSlot;
      });

      await Promise.all(dateSlotPromises);
    }

    return NextResponse.json({
      success: true,
      data: piscineForm
    });

  } catch (error) {
    console.error('Error in POST /api/piscine:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}