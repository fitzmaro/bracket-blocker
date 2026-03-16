import { NextRequest, NextResponse } from 'next/server';
import { getBracketState, initializeBracket, updateBracketState, BracketGame } from '@/lib/bracketState';

const API_KEY = process.env.BALLDONTLIE_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;

// This endpoint is called by Vercel Cron every 15 minutes during tournament
export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get or initialize bracket state
    let state = await getBracketState();
    if (!state) {
      state = await initializeBracket();
    }

    // Find games that are in progress (not final, have real teams)
    const pendingGames = state.games.filter(g =>
      g.status !== 'final' &&
      g.team1.name !== 'TBD' &&
      g.team2.name !== 'TBD'
    );

    if (pendingGames.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending games to check',
        lastUpdated: state.lastUpdated,
      });
    }

    // Fetch game results from Ball Don't Lie
    const updatedGames: string[] = [];

    for (const game of pendingGames) {
      const result = await checkGameResult(game);
      if (result) {
        // Game is complete, update bracket
        game.status = 'final';
        game.score = result.score;
        game.winner = result.winner;

        // Advance winner to next round
        advanceWinnerInState(state, game);
        updatedGames.push(`${game.team1.name} vs ${game.team2.name}`);
      }
    }

    if (updatedGames.length > 0) {
      await updateBracketState(state);
    }

    return NextResponse.json({
      success: true,
      message: updatedGames.length > 0
        ? `Updated ${updatedGames.length} games`
        : 'No completed games found',
      updatedGames,
      lastUpdated: state.lastUpdated,
    });
  } catch (error) {
    console.error('Cron update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update bracket' },
      { status: 500 }
    );
  }
}

// Check Ball Don't Lie API for game result
async function checkGameResult(game: BracketGame): Promise<{
  winner: 'team1' | 'team2';
  score: { team1: number; team2: number };
} | null> {
  if (!API_KEY) return null;

  try {
    // Search for the game by team names and approximate date
    // Ball Don't Lie doesn't have a direct "tournament" endpoint,
    // so we search by teams during tournament dates
    const team1Search = encodeURIComponent(game.team1.name);
    const team2Search = encodeURIComponent(game.team2.name);

    // Get games for both teams in March 2026
    const url = `https://api.balldontlie.io/ncaab/v1/games?seasons[]=2026&start_date=2026-03-15&end_date=2026-04-10`;

    const response = await fetch(url, {
      headers: { 'Authorization': API_KEY },
    });

    if (!response.ok) return null;

    const data = await response.json();

    // Find a game matching both teams
    for (const apiGame of data.data || []) {
      const homeTeam = apiGame.home_team?.name?.toLowerCase() || '';
      const visitorTeam = apiGame.visitor_team?.name?.toLowerCase() || '';
      const t1 = game.team1.name.toLowerCase();
      const t2 = game.team2.name.toLowerCase();

      const isMatch = (
        (homeTeam.includes(t1) || t1.includes(homeTeam)) &&
        (visitorTeam.includes(t2) || t2.includes(visitorTeam))
      ) || (
        (homeTeam.includes(t2) || t2.includes(homeTeam)) &&
        (visitorTeam.includes(t1) || t1.includes(visitorTeam))
      );

      if (isMatch && apiGame.status === 'post') {
        // Game is complete
        const homeScore = apiGame.home_score || 0;
        const visitorScore = apiGame.away_score || 0;

        // Determine which team is team1/team2 in our bracket
        const team1IsHome = homeTeam.includes(t1) || t1.includes(homeTeam);

        const score = {
          team1: team1IsHome ? homeScore : visitorScore,
          team2: team1IsHome ? visitorScore : homeScore,
        };

        const winner: 'team1' | 'team2' = score.team1 > score.team2 ? 'team1' : 'team2';

        return { winner, score };
      }
    }

    return null;
  } catch (error) {
    console.error('Error checking game result:', error);
    return null;
  }
}

// Advance winner to next round (duplicated logic for this endpoint)
function advanceWinnerInState(state: { games: BracketGame[] }, completedGame: BracketGame) {
  const winningTeam = completedGame.winner === 'team1'
    ? completedGame.team1
    : completedGame.team2;

  const roundOrder = ['Round of 64', 'Round of 32', 'Sweet 16', 'Elite 8', 'Final Four', 'Championship'];
  const currentRoundIndex = roundOrder.indexOf(completedGame.round);
  if (currentRoundIndex === -1 || currentRoundIndex >= roundOrder.length - 1) return;

  // Mapping tables
  const nextGameMap: Record<string, string> = {
    // R64 -> R32
    'e1': 'e32-1', 'e2': 'e32-1', 'e3': 'e32-2', 'e4': 'e32-2',
    'e5': 'e32-3', 'e6': 'e32-3', 'e7': 'e32-4', 'e8': 'e32-4',
    'w1': 'w32-1', 'w2': 'w32-1', 'w3': 'w32-2', 'w4': 'w32-2',
    'w5': 'w32-3', 'w6': 'w32-3', 'w7': 'w32-4', 'w8': 'w32-4',
    's1': 's32-1', 's2': 's32-1', 's3': 's32-2', 's4': 's32-2',
    's5': 's32-3', 's6': 's32-3', 's7': 's32-4', 's8': 's32-4',
    'm1': 'm32-1', 'm2': 'm32-1', 'm3': 'm32-2', 'm4': 'm32-2',
    'm5': 'm32-3', 'm6': 'm32-3', 'm7': 'm32-4', 'm8': 'm32-4',
    // R32 -> S16
    'e32-1': 'e16-1', 'e32-2': 'e16-1', 'e32-3': 'e16-2', 'e32-4': 'e16-2',
    'w32-1': 'w16-1', 'w32-2': 'w16-1', 'w32-3': 'w16-2', 'w32-4': 'w16-2',
    's32-1': 's16-1', 's32-2': 's16-1', 's32-3': 's16-2', 's32-4': 's16-2',
    'm32-1': 'm16-1', 'm32-2': 'm16-1', 'm32-3': 'm16-2', 'm32-4': 'm16-2',
    // S16 -> E8
    'e16-1': 'e8-e', 'e16-2': 'e8-e',
    'w16-1': 'e8-w', 'w16-2': 'e8-w',
    's16-1': 'e8-s', 's16-2': 'e8-s',
    'm16-1': 'e8-m', 'm16-2': 'e8-m',
    // E8 -> FF
    'e8-e': 'ff-1', 'e8-w': 'ff-1',
    'e8-s': 'ff-2', 'e8-m': 'ff-2',
    // FF -> Chip
    'ff-1': 'chip', 'ff-2': 'chip',
  };

  const team1Slots = [
    'e1', 'e3', 'e5', 'e7', 'w1', 'w3', 'w5', 'w7',
    's1', 's3', 's5', 's7', 'm1', 'm3', 'm5', 'm7',
    'e32-1', 'e32-3', 'w32-1', 'w32-3', 's32-1', 's32-3', 'm32-1', 'm32-3',
    'e16-1', 'w16-1', 's16-1', 'm16-1',
    'e8-e', 'e8-s', 'ff-1',
  ];

  const nextGameId = nextGameMap[completedGame.id];
  if (!nextGameId) return;

  const nextGame = state.games.find(g => g.id === nextGameId);
  if (!nextGame) return;

  const slot = team1Slots.includes(completedGame.id) ? 'team1' : 'team2';
  if (slot === 'team1') {
    nextGame.team1 = winningTeam;
  } else {
    nextGame.team2 = winningTeam;
  }
}
