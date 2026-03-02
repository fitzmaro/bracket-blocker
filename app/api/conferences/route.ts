import { NextResponse } from 'next/server';
import { getConferences } from '@/lib/balldontlie';

export async function GET() {
  try {
    const conferences = await getConferences();

    return NextResponse.json({
      success: true,
      conferences: conferences.map(c => ({
        id: c.id,
        name: c.name,
        abbreviation: c.abbreviation,
      })),
      count: conferences.length,
    });
  } catch (error) {
    console.error('Error fetching conferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conferences' },
      { status: 500 }
    );
  }
}
