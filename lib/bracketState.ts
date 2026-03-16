import { kv } from '@vercel/kv';
import { TOURNAMENT_2026, TournamentGame } from './mockTournament';

const BRACKET_KEY = 'bracket-blocker:bracket-2026';

export type BracketGame = TournamentGame & {
  winner?: 'team1' | 'team2';
};

export type BracketState = {
  games: BracketGame[];
  lastUpdated: string;
};

// Initialize bracket with the base tournament data
export async function initializeBracket(): Promise<BracketState> {
  const existing = await getBracketState();
  if (existing) return existing;

  const state: BracketState = {
    games: TOURNAMENT_2026.map(g => ({ ...g })),
    lastUpdated: new Date().toISOString(),
  };

  await kv.set(BRACKET_KEY, state);
  return state;
}

// Get current bracket state
export async function getBracketState(): Promise<BracketState | null> {
  return kv.get<BracketState>(BRACKET_KEY);
}

// Update bracket state
export async function updateBracketState(state: BracketState): Promise<void> {
  state.lastUpdated = new Date().toISOString();
  await kv.set(BRACKET_KEY, state);
}

// Mark a game as complete and advance winner
export async function completeGame(
  gameId: string,
  winner: 'team1' | 'team2',
  score: { team1: number; team2: number }
): Promise<BracketState> {
  const state = await getBracketState();
  if (!state) throw new Error('Bracket not initialized');

  const game = state.games.find(g => g.id === gameId);
  if (!game) throw new Error(`Game ${gameId} not found`);

  // Update the game
  game.status = 'final';
  game.score = score;
  game.winner = winner;

  // Find and update the next round game
  advanceWinner(state, game);

  await updateBracketState(state);
  return state;
}

// Advance winner to next round
function advanceWinner(state: BracketState, completedGame: BracketGame) {
  const winningTeam = completedGame.winner === 'team1'
    ? completedGame.team1
    : completedGame.team2;

  // Determine next round
  const roundOrder = ['Round of 64', 'Round of 32', 'Sweet 16', 'Elite 8', 'Final Four', 'Championship'];
  const currentRoundIndex = roundOrder.indexOf(completedGame.round);
  if (currentRoundIndex === -1 || currentRoundIndex >= roundOrder.length - 1) return;

  const nextRound = roundOrder[currentRoundIndex + 1];

  // Find the corresponding next-round game
  // Games are paired: e1+e2 -> e32-1, e3+e4 -> e32-2, etc.
  const nextGame = findNextRoundGame(state, completedGame, nextRound);
  if (!nextGame) return;

  // Determine which slot (team1 or team2) the winner goes into
  const slot = getNextRoundSlot(completedGame.id);
  if (slot === 'team1') {
    nextGame.team1 = winningTeam;
  } else {
    nextGame.team2 = winningTeam;
  }
}

// Map game IDs to their next round game
function findNextRoundGame(state: BracketState, game: BracketGame, nextRound: string): BracketGame | undefined {
  const region = game.region;

  // Round of 64 -> Round of 32 mapping
  const r64ToR32: Record<string, string> = {
    'e1': 'e32-1', 'e2': 'e32-1',
    'e3': 'e32-2', 'e4': 'e32-2',
    'e5': 'e32-3', 'e6': 'e32-3',
    'e7': 'e32-4', 'e8': 'e32-4',
    'w1': 'w32-1', 'w2': 'w32-1',
    'w3': 'w32-2', 'w4': 'w32-2',
    'w5': 'w32-3', 'w6': 'w32-3',
    'w7': 'w32-4', 'w8': 'w32-4',
    's1': 's32-1', 's2': 's32-1',
    's3': 's32-2', 's4': 's32-2',
    's5': 's32-3', 's6': 's32-3',
    's7': 's32-4', 's8': 's32-4',
    'm1': 'm32-1', 'm2': 'm32-1',
    'm3': 'm32-2', 'm4': 'm32-2',
    'm5': 'm32-3', 'm6': 'm32-3',
    'm7': 'm32-4', 'm8': 'm32-4',
  };

  // Round of 32 -> Sweet 16 mapping
  const r32ToS16: Record<string, string> = {
    'e32-1': 'e16-1', 'e32-2': 'e16-1',
    'e32-3': 'e16-2', 'e32-4': 'e16-2',
    'w32-1': 'w16-1', 'w32-2': 'w16-1',
    'w32-3': 'w16-2', 'w32-4': 'w16-2',
    's32-1': 's16-1', 's32-2': 's16-1',
    's32-3': 's16-2', 's32-4': 's16-2',
    'm32-1': 'm16-1', 'm32-2': 'm16-1',
    'm32-3': 'm16-2', 'm32-4': 'm16-2',
  };

  // Sweet 16 -> Elite 8 mapping
  const s16ToE8: Record<string, string> = {
    'e16-1': 'e8-e', 'e16-2': 'e8-e',
    'w16-1': 'e8-w', 'w16-2': 'e8-w',
    's16-1': 'e8-s', 's16-2': 'e8-s',
    'm16-1': 'e8-m', 'm16-2': 'e8-m',
  };

  // Elite 8 -> Final Four mapping
  const e8ToFF: Record<string, string> = {
    'e8-e': 'ff-1', 'e8-w': 'ff-1',
    'e8-s': 'ff-2', 'e8-m': 'ff-2',
  };

  // Final Four -> Championship
  const ffToChip: Record<string, string> = {
    'ff-1': 'chip', 'ff-2': 'chip',
  };

  let nextGameId: string | undefined;

  if (game.round === 'Round of 64') {
    nextGameId = r64ToR32[game.id];
  } else if (game.round === 'Round of 32') {
    nextGameId = r32ToS16[game.id];
  } else if (game.round === 'Sweet 16') {
    nextGameId = s16ToE8[game.id];
  } else if (game.round === 'Elite 8') {
    nextGameId = e8ToFF[game.id];
  } else if (game.round === 'Final Four') {
    nextGameId = ffToChip[game.id];
  }

  if (!nextGameId) return undefined;
  return state.games.find(g => g.id === nextGameId);
}

// Determine if winner goes to team1 or team2 slot in next round
function getNextRoundSlot(gameId: string): 'team1' | 'team2' {
  // Odd-numbered games (e1, e3, e5...) go to team1 slot
  // Even-numbered games (e2, e4, e6...) go to team2 slot
  const team1Games = [
    'e1', 'e3', 'e5', 'e7',
    'w1', 'w3', 'w5', 'w7',
    's1', 's3', 's5', 's7',
    'm1', 'm3', 'm5', 'm7',
    'e32-1', 'e32-3', 'w32-1', 'w32-3',
    's32-1', 's32-3', 'm32-1', 'm32-3',
    'e16-1', 'w16-1', 's16-1', 'm16-1',
    'e8-e', 'e8-s',
    'ff-1',
  ];

  return team1Games.includes(gameId) ? 'team1' : 'team2';
}

// Reset bracket to initial state (for testing)
export async function resetBracket(): Promise<BracketState> {
  await kv.del(BRACKET_KEY);
  return initializeBracket();
}
