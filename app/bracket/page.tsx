"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, RefreshCw } from 'lucide-react';
import Link from 'next/link';

/* ==========================================
   BRACKET DATA STRUCTURE (TEMPLATE)
   After Selection Sunday, this gets populated
   from the Ball Don't Lie API
   ========================================== */

const REGIONS = ['East', 'West', 'South', 'Midwest'] as const;

const ROUNDS = [
  { name: 'Round of 64', shortName: 'R64', gamesPerRegion: 8 },
  { name: 'Round of 32', shortName: 'R32', gamesPerRegion: 4 },
  { name: 'Sweet 16', shortName: 'S16', gamesPerRegion: 2 },
  { name: 'Elite 8', shortName: 'E8', gamesPerRegion: 1 },
  { name: 'Final Four', shortName: 'F4', gamesPerRegion: 0.5 },
  { name: 'Championship', shortName: 'CHIP', gamesPerRegion: 0.25 },
];

// Game structure
type Game = {
  id: string;
  round: string;
  region: string;
  team1: { name: string; seed: number; conference: string; score?: number } | null;
  team2: { name: string; seed: number; conference: string; score?: number } | null;
  date: string | null;
  time: string | null;
  location: string | null;
  status: 'scheduled' | 'in_progress' | 'final';
};

// Generate placeholder games for the bracket
function generatePlaceholderBracket(): Game[] {
  const games: Game[] = [];
  let gameId = 1;

  REGIONS.forEach(region => {
    // Round of 64: 8 games per region
    for (let i = 0; i < 8; i++) {
      games.push({
        id: `game-${gameId++}`,
        round: 'Round of 64',
        region,
        team1: null,
        team2: null,
        date: 'March 20-21',
        time: 'TBD',
        location: 'TBD',
        status: 'scheduled',
      });
    }
    // Round of 32: 4 games per region
    for (let i = 0; i < 4; i++) {
      games.push({
        id: `game-${gameId++}`,
        round: 'Round of 32',
        region,
        team1: null,
        team2: null,
        date: 'March 22-23',
        time: 'TBD',
        location: 'TBD',
        status: 'scheduled',
      });
    }
    // Sweet 16: 2 games per region
    for (let i = 0; i < 2; i++) {
      games.push({
        id: `game-${gameId++}`,
        round: 'Sweet 16',
        region,
        team1: null,
        team2: null,
        date: 'March 27-28',
        time: 'TBD',
        location: 'TBD',
        status: 'scheduled',
      });
    }
    // Elite 8: 1 game per region
    games.push({
      id: `game-${gameId++}`,
      round: 'Elite 8',
      region,
      team1: null,
      team2: null,
      date: 'March 29-30',
      time: 'TBD',
      location: 'TBD',
      status: 'scheduled',
    });
  });

  // Final Four: 2 games
  games.push({
    id: `game-${gameId++}`,
    round: 'Final Four',
    region: 'National',
    team1: null,
    team2: null,
    date: 'April 4',
    time: 'TBD',
    location: 'San Antonio, TX',
    status: 'scheduled',
  });
  games.push({
    id: `game-${gameId++}`,
    round: 'Final Four',
    region: 'National',
    team1: null,
    team2: null,
    date: 'April 4',
    time: 'TBD',
    location: 'San Antonio, TX',
    status: 'scheduled',
  });

  // Championship
  games.push({
    id: `game-${gameId++}`,
    round: 'Championship',
    region: 'National',
    team1: null,
    team2: null,
    date: 'April 6',
    time: 'TBD',
    location: 'San Antonio, TX',
    status: 'scheduled',
  });

  return games;
}

/* ==========================================
   LIVE BANNER
   ========================================== */

function LiveBanner({ isLoading, lastUpdated, onRefresh, gameCount }: {
  isLoading: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
  gameCount: number;
}) {
  return (
    <div className="bg-gradient-to-r from-green-500/20 via-green-500/10 to-green-500/20 border border-green-500/30 rounded-xl p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-lg font-bold text-green-400 uppercase tracking-wider font-[var(--font-oswald)]">
              Bracket is LIVE!
            </span>
          </div>
          <span className="text-sm text-zinc-400">
            {gameCount} games
          </span>
          {lastUpdated && (
            <span className="text-xs text-zinc-500 hidden sm:inline">
              • Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}


/* ==========================================
   PLACEHOLDER GAME CARD
   ========================================== */

function GameCard({ game, onClick }: { game: Game; onClick: () => void }) {
  const hasTeams = game.team1 !== null && game.team2 !== null;
  const teamsKnown = hasTeams && game.team1?.name !== 'TBD' && game.team2?.name !== 'TBD';
  const isAvailable = hasTeams && teamsKnown;
  const isGameOver = game.status === 'final';
  const isLive = game.status === 'in_progress';
  const canClick = isAvailable && !isGameOver;

  return (
    <div
      onClick={canClick ? onClick : undefined}
      className={`relative p-4 rounded-lg border transition-all ${
        isGameOver
          ? 'border-zinc-800 bg-[#0a0a0c] opacity-60 cursor-not-allowed'
          : isAvailable
            ? 'border-zinc-700 bg-[#111115] hover:border-[var(--led-amber)] hover:bg-[var(--led-amber)]/5 cursor-pointer'
            : 'border-zinc-800 bg-[#0a0a0c] cursor-not-allowed opacity-60'
      }`}
    >
      {/* Status badge */}
      {isLive && (
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/20 border border-red-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-[10px] text-red-400 font-bold uppercase">Live</span>
        </div>
      )}
      {isGameOver && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-zinc-700">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Final</span>
        </div>
      )}

      {/* Teams */}
      <div className={`space-y-2 mb-3 ${isLive || isGameOver ? 'mt-6' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
              {game.team1?.seed || '?'}
            </span>
            <span className={`text-sm font-medium ${game.team1 ? 'text-white' : 'text-zinc-600'}`}>
              {game.team1?.name || 'TBD'}
            </span>
          </div>
          {(isLive || isGameOver) && game.team1?.score !== undefined && (
            <span className="text-sm font-bold text-white">{game.team1.score}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
              {game.team2?.seed || '?'}
            </span>
            <span className={`text-sm font-medium ${game.team2 ? 'text-white' : 'text-zinc-600'}`}>
              {game.team2?.name || 'TBD'}
            </span>
          </div>
          {(isLive || isGameOver) && game.team2?.score !== undefined && (
            <span className="text-sm font-bold text-white">{game.team2.score}</span>
          )}
        </div>
      </div>

      {/* Game info */}
      <div className="text-xs text-zinc-500">
        {isGameOver ? 'Game Over' : `${game.date} • ${game.time}`}
      </div>

      {/* Coming soon overlay for TBD games */}
      {!isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0c]/90 rounded-lg">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">Awaiting Results</span>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   ROUND COLUMN
   ========================================== */

function RoundColumn({ roundName, games, onGameClick }: {
  roundName: string;
  games: Game[];
  onGameClick: (gameId: string) => void;
}) {
  return (
    <div className="min-w-[200px]">
      <h3 className="text-center text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 font-[var(--font-oswald)]">
        {roundName}
      </h3>
      <div className="space-y-3">
        {games.map(game => (
          <GameCard
            key={game.id}
            game={game}
            onClick={() => onGameClick(game.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   API RESPONSE TYPE
   ========================================== */

type APIGame = {
  id: string;
  team1: { id: string; name: string; abbreviation: string; seed: number };
  team2: { id: string; name: string; abbreviation: string; seed: number };
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'in_progress' | 'final';
  score: { team1: number; team2: number } | null;
  round: string;
  region: string;
};

/* ==========================================
   MAIN BRACKET PAGE
   ========================================== */

export default function BracketPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>(generatePlaceholderBracket);
  const [activeRegion, setActiveRegion] = useState<typeof REGIONS[number] | 'All'>('All');
  const [activeRound, setActiveRound] = useState<string | 'All'>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch games from API
  const fetchGames = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/games?tournament=true&season=2026');
      const data = await res.json();

      if (data.success && data.games && data.games.length > 0) {
        // Transform API games to our format
        const transformedGames: Game[] = data.games.map((apiGame: APIGame) => ({
          id: apiGame.id,
          round: apiGame.round,
          region: apiGame.region,
          team1: {
            name: apiGame.team1.name,
            seed: apiGame.team1.seed,
            conference: '',
            score: apiGame.score?.team1,
          },
          team2: {
            name: apiGame.team2.name,
            seed: apiGame.team2.seed,
            conference: '',
            score: apiGame.score?.team2,
          },
          date: apiGame.date,
          time: apiGame.time,
          location: apiGame.location,
          status: apiGame.status,
        }));

        setGames(transformedGames);
      }
      // If no games returned, keep showing placeholder

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching games:', error);
      // Keep showing placeholder on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch games on mount and auto-refresh every 5 minutes
  useEffect(() => {
    fetchGames();

    const interval = setInterval(fetchGames, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchGames]);

  
  const handleGameClick = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game || !game.team1 || !game.team2) return;

    // Navigate to checkout with game data
    const params = new URLSearchParams({
      id: game.id,
      team1: game.team1.name,
      team2: game.team2.name,
      date: game.date || '',
      time: game.time || '',
    });
    router.push(`/checkout?${params.toString()}`);
  };

  // Filter games by region and round
  const filteredGames = games.filter(g => {
    if (activeRegion !== 'All' && g.region !== activeRegion && g.region !== 'National') return false;
    if (activeRound !== 'All' && g.round !== activeRound) return false;
    return true;
  });

  // Group by round for display
  const gamesByRound = ROUNDS.reduce((acc, round) => {
    acc[round.name] = filteredGames.filter(g => g.round === round.name);
    return acc;
  }, {} as Record<string, Game[]>);

  return (
    <>
      {/* Background */}
      <div className="arena-bg"></div>
      <div className="arena-vignette"></div>

      <main className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link href="/" className="text-zinc-500 hover:text-white text-sm mb-2 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold font-[var(--font-oswald)] uppercase">
                <span className="text-[var(--led-amber)] led-text">2026</span>{' '}
                <span className="text-white">Tournament Bracket</span>
              </h1>
            </div>

                      </div>

          {/* Live Banner */}
          <LiveBanner
            isLoading={isLoading}
            lastUpdated={lastUpdated}
            onRefresh={fetchGames}
            gameCount={games.filter(g => g.team1 !== null).length}
          />

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            {/* Region filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-500" />
              <span className="text-sm text-zinc-500">Region:</span>
              <div className="flex gap-1">
                {['All', ...REGIONS].map(region => (
                  <button
                    key={region}
                    onClick={() => setActiveRegion(region as typeof activeRegion)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      activeRegion === region
                        ? 'bg-[var(--led-amber)] text-black'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Round filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-500">Round:</span>
              <select
                value={activeRound}
                onChange={(e) => setActiveRound(e.target.value)}
                className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 text-sm border-none focus:outline-none focus:ring-1 focus:ring-[var(--led-amber)]"
              >
                <option value="All">All Rounds</option>
                {ROUNDS.map(round => (
                  <option key={round.name} value={round.name}>{round.name}</option>
                ))}
              </select>
            </div>

                      </div>

          {/* Bracket Grid */}
          <div className="overflow-x-auto pb-4 mb-12">
            <div className="flex gap-6 min-w-max">
              {ROUNDS.map(round => {
                const roundGames = gamesByRound[round.name] || [];
                if (roundGames.length === 0) return null;
                return (
                  <RoundColumn
                    key={round.name}
                    roundName={round.name}
                    games={roundGames}
                    onGameClick={handleGameClick}
                  />
                );
              })}
            </div>
          </div>

          {/* Info text */}
          <p className="text-center text-zinc-600 text-sm mt-8">
            Click on games to add them to your calendar block list.
            <br />
            <span className="text-zinc-500">Page auto-refreshes every few minutes.</span>
          </p>

        </div>
      </main>
    </>
  );
}
