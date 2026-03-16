import { NextResponse } from 'next/server';
import { getTournamentGames } from '@/lib/mockTournament';
import { getBracketState } from '@/lib/bracketState';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tournament = searchParams.get('tournament') === 'true';

  try {
    if (tournament) {
      // Try to get live bracket state from Vercel KV first
      const bracketState = await getBracketState();

      // Use bracket state if available, otherwise fall back to initial mock data
      const games = bracketState ? bracketState.games : getTournamentGames();

      const formattedGames = games.map(game => ({
        id: game.id,
        team1: {
          id: game.id + '-t1',
          name: game.team1.name,
          abbreviation: game.team1.abbreviation,
          seed: game.team1.seed,
        },
        team2: {
          id: game.id + '-t2',
          name: game.team2.name,
          abbreviation: game.team2.abbreviation,
          seed: game.team2.seed,
        },
        date: game.date,
        time: game.time,
        location: game.location,
        status: game.status,
        score: game.score || null,
        round: game.round,
        region: game.region,
        winner: 'winner' in game ? game.winner : undefined,
      }));

      return NextResponse.json({
        success: true,
        games: formattedGames,
        count: formattedGames.length,
        lastUpdated: bracketState?.lastUpdated || null,
      });
    }

    // Non-tournament games not implemented
    return NextResponse.json({
      success: true,
      games: [],
      count: 0,
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
