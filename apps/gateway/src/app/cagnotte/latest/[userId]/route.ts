import { NextRequest, NextResponse } from 'next/server';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { getCurrentConfig } from '@src/utils/amplify/configureAmplifyWithPortDetection';
import { debug } from '@flexiness/domain-utils';

// Configure Amplify for server-side API routes
Amplify.configure(getCurrentConfig(), { ssr: true });

const client = generateClient<Schema>();

type JackpotFormData = Schema['JackpotForm']['type'];

/**
 * Dynamic redirect route for Stripe Connect business_profile.url
 * Redirects to user's latest/active cagnotte or fallback info page
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const host = request.headers.get('host') || '';
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const baseUrl = `${protocol}://${host}`;

  try {
    // Query user's cagnottes
    const { data: cagnottes } = await client.models.JackpotForm.list({
      filter: { owner: { eq: userId } }
    });

    if (cagnottes && cagnottes.length > 0) {
      // Sort: ACTIVE first, then by createdAt descending
      const sorted = [...cagnottes].sort((a: JackpotFormData, b: JackpotFormData) => {
        // Prioritize ACTIVE status
        if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
        if (b.status === 'ACTIVE' && a.status !== 'ACTIVE') return 1;
        // If both same status, sort by createdAt (newest first)
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });

      const latest = sorted[0];
      if (latest.slug) {
        return NextResponse.redirect(`${baseUrl}/cagnotte/${latest.slug}/`);
      }
    }

    // Fallback: No cagnotte found - redirect to static info page
    return NextResponse.redirect(`${baseUrl}/cagnotte/info/`);

  } catch (error) {
    debug.error('Error fetching user cagnottes:', error);
    // Fallback on error
    return NextResponse.redirect(`${baseUrl}/cagnotte/info/`);
  }
}
