"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Shuffle, Check, Calendar, Trash2 } from 'lucide-react';

/* ==========================================
   CONSTANTS
   ========================================== */

const YOUTUBE_TV_REFERRAL = 'https://tv.youtube.com/referral/r35xtqahc7tukn';

const ALIBI_OPTIONS: { name: string; description: string }[] = [
  { name: 'Q1 Roadmap Alignment', description: 'Review quarterly objectives and align on key deliverables for the upcoming sprint cycle. Please come prepared with status updates on your workstreams.' },
  { name: 'Cross-functional Sync', description: 'Weekly touchpoint to ensure alignment across engineering, product, and design teams. We will review blockers and dependencies.' },
  { name: 'Stakeholder Update', description: 'Provide status updates on key initiatives and gather feedback from leadership. Deck attached in calendar invite.' },
  { name: '1:1 with Carol', description: 'Regular check-in to discuss project progress and professional development goals. Please add any agenda items to our shared doc.' },
  { name: 'Technical Architecture Review', description: 'Deep dive into system design decisions and infrastructure planning. Engineering leads please review the RFC beforehand.' },
  { name: 'Budget Planning Session', description: 'Q2 budget allocation review and resource planning discussion. Finance team will present updated projections.' },
  { name: 'Sprint Retrospective', description: 'Team retrospective to discuss what went well, what could be improved, and action items for next sprint.' },
  { name: 'Product Strategy Deep Dive', description: 'Review product roadmap priorities and discuss strategic initiatives for the upcoming quarter.' },
  { name: 'Quarterly Business Review', description: 'Comprehensive review of Q1 performance metrics, revenue targets, and operational KPIs.' },
  { name: 'Team Offsite Planning', description: 'Planning session for upcoming team offsite. Please come with activity suggestions and logistics preferences.' },
  { name: 'Vendor Evaluation Call', description: 'Evaluation call with potential vendor partner. Please review their proposal deck before the meeting.' },
  { name: 'Infrastructure Migration Sync', description: 'Status update on ongoing infrastructure migration. DevOps team to present timeline and risk assessment.' },
  { name: 'Customer Success Check-in', description: 'Review customer health metrics and discuss retention strategies for at-risk accounts.' },
  { name: 'Security Compliance Review', description: 'Quarterly security compliance review. Please ensure your team has completed required training modules.' },
  { name: 'Design Systems Workshop', description: 'Collaborative workshop to review and update design system components. Bring your Figma files.' },
  { name: 'Data Pipeline Discussion', description: 'Technical discussion on data pipeline architecture and ETL process improvements.' },
];

/* ==========================================
   TYPES
   ========================================== */

type GameSelection = {
  id: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  alibi: string;
  description: string;
  startTime: Date;
  duration: number;
};

/* ==========================================
   HELPERS
   ========================================== */

function getRandomAlibi(): { name: string; description: string } {
  return ALIBI_OPTIONS[Math.floor(Math.random() * ALIBI_OPTIONS.length)];
}

function getAlibiDescription(alibiName: string, customDescription?: string): string {
  if (customDescription && customDescription.trim()) {
    return `${customDescription.trim()}\n\nLink to meeting: ${YOUTUBE_TV_REFERRAL}`;
  }
  const match = ALIBI_OPTIONS.find(a => a.name === alibiName);
  if (match) {
    return `${match.description}\n\nLink to meeting: ${YOUTUBE_TV_REFERRAL}`;
  }
  return `Please review relevant materials before the meeting. Come prepared with updates on your workstreams.\n\nLink to meeting: ${YOUTUBE_TV_REFERRAL}`;
}

function getGoogleCalendarUrl(game: GameSelection): string {
  const start = game.startTime;
  const end = new Date(start.getTime() + game.duration * 60 * 60 * 1000);
  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: game.alibi,
    dates: `${formatDate(start)}/${formatDate(end)}`,
    details: getAlibiDescription(game.alibi, game.description),
    location: 'Conference Room B',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function getOutlookCalendarUrl(game: GameSelection): string {
  const start = game.startTime;
  const end = new Date(start.getTime() + game.duration * 60 * 60 * 1000);

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: game.alibi,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: getAlibiDescription(game.alibi, game.description),
    location: 'Conference Room B',
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/* ==========================================
   GAME ROW COMPONENT
   ========================================== */

function GameRow({
  game,
  onUpdateAlibi,
  onUpdateDescription,
  onRandomize,
  onRemove
}: {
  game: GameSelection;
  onUpdateAlibi: (alibi: string) => void;
  onUpdateDescription: (desc: string) => void;
  onRandomize: () => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#111115] border border-zinc-800 rounded-lg overflow-hidden">
      {/* Main row */}
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Game info */}
          <div className="flex-shrink-0 md:w-48">
            <div className="text-white font-semibold">{game.team1} vs {game.team2}</div>
            <div className="text-xs text-zinc-500">{game.date} • {game.time}</div>
          </div>

          {/* Alibi input */}
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={game.alibi}
              onChange={(e) => onUpdateAlibi(e.target.value)}
              placeholder="Enter meeting name..."
              className="flex-1 px-3 py-2 bg-[#0a0a0c] border border-zinc-700 rounded text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[var(--led-amber)]"
            />
            <button
              onClick={onRandomize}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 hover:text-[var(--led-amber)] transition-colors"
              title="Generate Alibi"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-zinc-500 hover:text-white transition-colors"
            >
              {expanded ? 'Hide' : 'Edit'} description
            </button>
            <button
              onClick={onRemove}
              className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
              title="Remove game"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded description */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800 pt-4">
          <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wider">
            Custom Description (optional)
          </label>
          <textarea
            value={game.description}
            onChange={(e) => onUpdateDescription(e.target.value)}
            placeholder="Add meeting details your boss might see..."
            rows={2}
            className="w-full px-3 py-2 bg-[#0a0a0c] border border-zinc-700 rounded text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[var(--led-amber)] resize-none"
          />
          <p className="text-xs text-zinc-600 mt-1">
            Leave blank for auto-generated corporate speak
          </p>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   MAIN CHECKOUT PAGE
   ========================================== */

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [games, setGames] = useState<GameSelection[]>([]);
  const [added, setAdded] = useState(false);
  const [calendarType, setCalendarType] = useState<'google' | 'outlook' | null>(null);

  // Parse game IDs from URL and create placeholder games
  // In production, this would fetch real game data from the API
  useEffect(() => {
    const gameIds = searchParams.get('games')?.split(',') || [];

    // For now, create placeholder games
    // After Selection Sunday, this will fetch real data
    const placeholderGames: GameSelection[] = gameIds.map((id, index) => ({
      id,
      team1: 'Team A',
      team2: 'Team B',
      date: 'March 20, 2026',
      time: '2:00 PM ET',
      alibi: '',
      description: '',
      startTime: new Date('2026-03-20T14:00:00-04:00'),
      duration: 3,
    }));

    setGames(placeholderGames);
  }, [searchParams]);

  const handleUpdateAlibi = (gameId: string, alibi: string) => {
    setGames(prev => prev.map(g =>
      g.id === gameId ? { ...g, alibi } : g
    ));
  };

  const handleUpdateDescription = (gameId: string, description: string) => {
    setGames(prev => prev.map(g =>
      g.id === gameId ? { ...g, description } : g
    ));
  };

  const handleRandomize = (gameId: string) => {
    const random = getRandomAlibi();
    setGames(prev => prev.map(g =>
      g.id === gameId ? { ...g, alibi: random.name, description: random.description } : g
    ));
  };

  const handleRandomizeAll = () => {
    setGames(prev => prev.map(g => {
      const random = getRandomAlibi();
      return { ...g, alibi: random.name, description: random.description };
    }));
  };

  const handleRemove = (gameId: string) => {
    setGames(prev => prev.filter(g => g.id !== gameId));
  };

  const handleAddToCalendar = (type: 'google' | 'outlook') => {
    setCalendarType(type);

    // Open each game in a new tab
    games.forEach((game, index) => {
      if (game.alibi) {
        setTimeout(() => {
          const url = type === 'google'
            ? getGoogleCalendarUrl(game)
            : getOutlookCalendarUrl(game);
          window.open(url, '_blank');
        }, index * 500); // Stagger to avoid popup blockers
      }
    });

    setAdded(true);
  };

  const allHaveAlibis = games.every(g => g.alibi.trim());
  const validGames = games.filter(g => g.alibi.trim());

  // Show empty state if no games
  if (games.length === 0) {
    return (
      <>
        <div className="arena-bg"></div>
        <div className="arena-vignette"></div>
        <main className="relative z-10 min-h-screen flex items-center justify-center py-8 px-4">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2 font-[var(--font-oswald)]">No Games Selected</h1>
            <p className="text-zinc-500 mb-6">Head back to the bracket and pick some games to block.</p>
            <Link
              href="/bracket"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--led-amber)] hover:bg-[var(--led-amber-glow)] text-black font-bold rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Bracket
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="arena-bg"></div>
      <div className="arena-vignette"></div>

      <main className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <Link href="/bracket" className="text-zinc-500 hover:text-white text-sm mb-2 inline-block">
              ← Back to Bracket
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold font-[var(--font-oswald)] uppercase">
              <span className="text-[var(--led-amber)] led-text">Block</span>{' '}
              <span className="text-white">{games.length} Game{games.length > 1 ? 's' : ''}</span>
            </h1>
            <p className="text-zinc-500 mt-2">
              Choose alibis for each game. Your boss will see these meeting names.
            </p>
          </div>

          {/* Bulk actions */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-500">
              {validGames.length} of {games.length} games ready
            </span>
            <button
              onClick={handleRandomizeAll}
              className="flex items-center gap-2 text-sm text-[var(--led-amber)] hover:underline"
            >
              <Shuffle className="w-4 h-4" />
              Randomize all alibis
            </button>
          </div>

          {/* Game list */}
          <div className="space-y-3 mb-8">
            {games.map(game => (
              <GameRow
                key={game.id}
                game={game}
                onUpdateAlibi={(alibi) => handleUpdateAlibi(game.id, alibi)}
                onUpdateDescription={(desc) => handleUpdateDescription(game.id, desc)}
                onRandomize={() => handleRandomize(game.id)}
                onRemove={() => handleRemove(game.id)}
              />
            ))}
          </div>

          {/* Add to calendar */}
          {!added ? (
            <div className="bg-[var(--arena-panel)] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 font-[var(--font-oswald)] uppercase text-center">
                Add to Calendar
              </h2>

              {!allHaveAlibis && (
                <p className="text-center text-yellow-500/80 text-sm mb-4">
                  Some games don't have alibis yet. Only games with alibis will be added.
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => handleAddToCalendar('google')}
                  disabled={validGames.length === 0}
                  className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-bold uppercase tracking-wider bg-white text-gray-800 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google Calendar
                </button>
                <button
                  onClick={() => handleAddToCalendar('outlook')}
                  disabled={validGames.length === 0}
                  className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-bold uppercase tracking-wider bg-[#0078D4] text-white hover:bg-[#106EBE] transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.157.154-.352.23-.584.23h-8.547v-6.959l1.6 1.229c.102.086.227.13.379.13.139 0 .262-.044.371-.13l6.781-5.163c.086-.075.152-.063.193.035.041.1.054.18.045.243zm0-2.092c.004.136-.036.242-.12.318l-.05.043-7.592 5.795-.057.043c-.108.064-.212.1-.312.1-.099 0-.206-.036-.322-.1l-1.593-1.21V6.217c0-.17.057-.314.17-.433.115-.118.253-.178.416-.178h8.877c.23 0 .424.077.58.23.158.152.234.34.003.459zm-10.086-.88H.686c-.24 0-.443.083-.608.25-.166.168-.25.37-.25.608v13.454c0 .24.084.442.25.608.165.167.368.25.608.25h13.228c.24 0 .443-.083.608-.25.166-.166.25-.368.25-.608V5.023c0-.24-.084-.442-.25-.608-.165-.167-.368-.25-.608-.25zM6.5 16.727c-2.616 0-4.735-2.18-4.735-4.868s2.119-4.868 4.735-4.868 4.735 2.18 4.735 4.868-2.119 4.868-4.735 4.868z"/>
                    <path d="M6.5 8.482c-1.8 0-3.26 1.512-3.26 3.377s1.46 3.377 3.26 3.377 3.26-1.512 3.26-3.377-1.46-3.377-3.26-3.377z"/>
                  </svg>
                  Outlook
                </button>
              </div>

              <p className="text-center text-xs text-zinc-600 mt-4">
                {validGames.length > 1
                  ? `${validGames.length} calendar events will open in new tabs`
                  : 'Calendar event will open in a new tab'
                }
              </p>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-[var(--font-oswald)]">
                Calendar{validGames.length > 1 ? 's' : ''} Opened!
              </h3>
              <p className="text-zinc-400 mb-6">
                Complete the event{validGames.length > 1 ? 's' : ''} in {calendarType === 'google' ? 'Google Calendar' : 'Outlook'}.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/bracket"
                  className="text-[var(--led-amber)] hover:underline"
                >
                  ← Block more games
                </Link>
                <Link
                  href="/"
                  className="text-zinc-500 hover:text-white"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
