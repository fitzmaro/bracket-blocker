import { NextResponse } from 'next/server';
import { getTeams } from '@/lib/balldontlie';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conferenceId = searchParams.get('conference_id');

  try {
    const teams = await getTeams(conferenceId ? parseInt(conferenceId) : undefined);

    return NextResponse.json({
      success: true,
      teams: teams.map(t => ({
        id: t.id,
        name: t.name,
        abbreviation: t.abbreviation,
        conference: t.conference?.name || 'Unknown',
        conferenceId: t.conference_id,
      })),
      count: teams.length,
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}
