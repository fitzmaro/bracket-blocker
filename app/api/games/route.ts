import { NextResponse } from 'next/server';
import { getTournamentGames, getGames, formatGameDateTime, inferTournamentRound } from '@/lib/balldontlie';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get('season') || '2026';
  const tournament = searchParams.get('tournament') === 'true';

  try {
    let games;

    if (tournament) {
      // Get March Madness tournament games
      games = await getTournamentGames(parseInt(season));
    } else {
      // Get games by date range or team
      const startDate = searchParams.get('start_date') || undefined;
      const endDate = searchParams.get('end_date') || undefined;
      const teamIds = searchParams.get('team_ids')?.split(',').map(Number) || undefined;

      games = await getGames({
        season: parseInt(season),
        startDate,
        endDate,
        teamIds,
      });
    }

    // Format games for frontend consumption
    const formattedGames = games.map(game => {
      const { date, time } = formatGameDateTime(game);
      return {
        id: game.id,
        team1: {
          id: game.home_team.id,
          name: game.home_team.name,
          abbreviation: game.home_team.abbreviation,
          conference: game.home_team.conference?.name || 'Unknown',
        },
        team2: {
          id: game.visitor_team.id,
          name: game.visitor_team.name,
          abbreviation: game.visitor_team.abbreviation,
          conference: game.visitor_team.conference?.name || 'Unknown',
        },
        date,
        time,
        dateRaw: game.date,
        status: game.status,
        score: game.status === 'final' ? {
          home: game.home_team_score,
          visitor: game.visitor_team_score,
        } : null,
        round: game.round || inferTournamentRound(game.date),
        postseason: game.postseason || false,
      };
    });

    return NextResponse.json({
      success: true,
      games: formattedGames,
      count: formattedGames.length,
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
