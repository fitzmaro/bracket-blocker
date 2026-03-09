"use client";

import { useState } from 'react';
import { ChevronRight, Filter, X, Bell, Check, Calendar } from 'lucide-react';
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

// Placeholder game structure
type Game = {
  id: string;
  round: string;
  region: string;
  team1: { name: string; seed: number; conference: string } | null;
  team2: { name: string; seed: number; conference: string } | null;
  date: string | null;
  time: string | null;
  location: string | null;
  selected: boolean;
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
        selected: false,
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
        selected: false,
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
        selected: false,
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
      selected: false,
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
    selected: false,
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
    selected: false,
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
    selected: false,
  });

  return games;
}

/* ==========================================
   SELECTION SUNDAY COUNTDOWN
   ========================================== */

function SelectionSundayBanner() {
  const selectionSunday = new Date('2026-03-15T18:00:00-04:00');
  const now = new Date();
  const diff = selectionSunday.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));

  const scrollToReminder = () => {
    document.getElementById('selection-reminder')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gradient-to-r from-[var(--led-amber)]/20 via-[var(--led-amber)]/10 to-[var(--led-amber)]/20 border border-[var(--led-amber)]/30 rounded-xl p-8 mb-8">
      <div className="flex flex-col items-center text-center gap-5">
        <div>
          <div className="flex items-center gap-2 justify-center mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--led-amber)] animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-[var(--led-amber)] font-bold">
              Selection Sunday
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-[var(--font-oswald)] text-white mb-2">
            Bracket Reveal in <span className="text-[var(--led-amber)]">{days} Days</span>
          </h2>
          <p className="text-zinc-400 text-sm">
            March 15, 2026 at 6:00 PM ET • Teams & matchups will be announced
          </p>
        </div>
        <button
          onClick={scrollToReminder}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--led-amber)] hover:bg-[var(--led-amber-glow)] text-black font-bold rounded-lg transition-all uppercase tracking-wider text-sm shadow-lg hover:shadow-[0_0_20px_rgba(255,150,0,0.4)]"
        >
          <Calendar className="w-4 h-4" />
          Add Reminder to Calendar
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   EMAIL CAPTURE
   ========================================== */

function SelectionSundayReminder() {
  // Selection Sunday: March 15, 2026 at 6:00 PM ET
  const eventTitle = "NCAA Tournament Bracket is LIVE - Block Your Calendar!";
  const eventDescription = `The 2026 NCAA Tournament bracket has been announced!

Go to Bracket Blocker now to block your calendar before your boss schedules meetings during the games:
https://bracketblocker.com/bracket

First games tip off Thursday. Don't wait!`;

  const startDate = "20260315T180000";  // 6:00 PM ET
  const endDate = "20260315T183000";    // 6:30 PM (30 min reminder)

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(eventDescription)}&ctz=America/New_York`;

  const outlookUrl = `https://outlook.live.com/calendar/0/action/compose?subject=${encodeURIComponent(eventTitle)}&body=${encodeURIComponent(eventDescription)}&startdt=2026-03-15T18:00:00-04:00&enddt=2026-03-15T18:30:00-04:00`;

  return (
    <div className="bg-[var(--arena-panel)] border border-white/10 rounded-xl p-8">
      <div className="max-w-xl mx-auto text-center">
        <Bell className="w-10 h-10 text-[var(--led-amber)] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2 font-[var(--font-oswald)] uppercase">
          Don't Miss Selection Sunday
        </h3>
        <p className="text-zinc-400 mb-2">
          March 15, 2026 at 6:00 PM ET
        </p>
        <p className="text-zinc-500 text-sm mb-6">
          Add a reminder to your calendar. When the bracket drops, you'll be ready to block your schedule.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[var(--led-amber)] hover:bg-[var(--led-amber-glow)] text-black font-bold rounded-lg transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Google Calendar
          </a>
          <a
            href={outlookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-lg transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Outlook
          </a>
        </div>

        <p className="text-xs text-zinc-600 mt-4">
          You'll get a calendar reminder when the bracket is announced.
        </p>
      </div>
    </div>
  );
}

/* ==========================================
   PLACEHOLDER GAME CARD
   ========================================== */

function PlaceholderGameCard({ game, onClick }: { game: Game; onClick: () => void }) {
  const isAvailable = game.team1 !== null && game.team2 !== null;

  return (
    <div
      onClick={isAvailable ? onClick : undefined}
      className={`relative p-4 rounded-lg border transition-all ${
        isAvailable
          ? game.selected
            ? 'border-[var(--led-amber)] bg-[var(--led-amber)]/10 cursor-pointer'
            : 'border-zinc-700 bg-[#111115] hover:border-zinc-600 cursor-pointer'
          : 'border-zinc-800 bg-[#0a0a0c] cursor-not-allowed opacity-60'
      }`}
    >
      {/* Teams */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
              {game.team1?.seed || '?'}
            </span>
            <span className={`text-sm font-medium ${game.team1 ? 'text-white' : 'text-zinc-600'}`}>
              {game.team1?.name || 'TBD'}
            </span>
          </div>
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
        </div>
      </div>

      {/* Game info */}
      <div className="text-xs text-zinc-500">
        {game.date} • {game.time}
      </div>

      {/* Selected indicator */}
      {game.selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--led-amber)] flex items-center justify-center">
          <Check className="w-3 h-3 text-black" />
        </div>
      )}

      {/* Coming soon overlay for TBD games */}
      {!isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0c]/90 rounded-lg">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">Selection Sunday</span>
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
          <PlaceholderGameCard
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
   MAIN BRACKET PAGE
   ========================================== */

export default function BracketPage() {
  const [games, setGames] = useState<Game[]>(generatePlaceholderBracket);
  const [activeRegion, setActiveRegion] = useState<typeof REGIONS[number] | 'All'>('All');
  const [activeRound, setActiveRound] = useState<string | 'All'>('All');

  const selectedGames = games.filter(g => g.selected);

  const toggleGameSelection = (gameId: string) => {
    setGames(prev =>
      prev.map(g =>
        g.id === gameId ? { ...g, selected: !g.selected } : g
      )
    );
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

            {/* Selected games count */}
            {selectedGames.length > 0 && (
              <Link
                href={`/checkout?games=${selectedGames.map(g => g.id).join(',')}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--led-amber)] hover:bg-[var(--led-amber-glow)] text-black font-bold rounded-lg transition-colors"
              >
                <span>{selectedGames.length} Game{selectedGames.length > 1 ? 's' : ''}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Selection Sunday Banner */}
          <SelectionSundayBanner />

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

            {/* Clear selection */}
            {selectedGames.length > 0 && (
              <button
                onClick={() => setGames(prev => prev.map(g => ({ ...g, selected: false })))}
                className="flex items-center gap-1 px-3 py-1 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
                Clear selection
              </button>
            )}
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
                    onGameClick={toggleGameSelection}
                  />
                );
              })}
            </div>
          </div>

          {/* Selection Sunday Reminder */}
          <div id="selection-reminder">
            <SelectionSundayReminder />
          </div>

          {/* Info text */}
          <p className="text-center text-zinc-600 text-sm mt-8">
            Games and times will be populated after Selection Sunday (March 15, 2026).
            <br />
            Click on games to add them to your calendar block list.
          </p>

        </div>
      </main>
    </>
  );
}
