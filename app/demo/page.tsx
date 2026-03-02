"use client";

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Calendar, Check, Clock, MapPin, Shuffle } from 'lucide-react';

/* ==========================================
   FAKE GAME DATA
   ========================================== */

const GAME = {
  id: 1,
  team1: { name: 'Duke', seed: 2, logo: '😈', color: '#003087' },
  team2: { name: 'UNC', seed: 3, logo: '🐏', color: '#7BAFD4' },
  round: 'Sweet 16',
  date: 'Thursday, March 19, 2026',
  time: '2:00 PM ET',
  tipoff: new Date('2026-03-19T14:00:00-04:00'),
  duration: 3, // hours
  location: 'Madison Square Garden',
  network: 'CBS',
};

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
   STEP 1: GAME SELECTION
   ========================================== */

function GameCard({ game, selected, onSelect }: { game: typeof GAME; selected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer transition-all duration-200 ${
        selected
          ? 'ring-2 ring-[var(--led-amber)] shadow-[0_0_30px_rgba(255,150,0,0.3)]'
          : 'hover:ring-1 hover:ring-white/20'
      }`}
    >
      <div className="bg-gradient-to-b from-[#1a1a1e] to-[#111115] rounded-lg overflow-hidden">
        {/* Round badge */}
        <div className="bg-[var(--led-amber)] text-black text-xs font-bold py-1 px-3 text-center uppercase tracking-wider">
          {game.round}
        </div>

        {/* Teams */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            {/* Team 1 */}
            <div className="flex items-center gap-3">
              <span className="text-4xl">{game.team1.logo}</span>
              <div>
                <div className="text-xs text-zinc-500">#{game.team1.seed} seed</div>
                <div className="text-xl font-bold font-[var(--font-oswald)]">{game.team1.name}</div>
              </div>
            </div>

            <div className="text-2xl font-bold text-zinc-600">VS</div>

            {/* Team 2 */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-zinc-500">#{game.team2.seed} seed</div>
                <div className="text-xl font-bold font-[var(--font-oswald)]">{game.team2.name}</div>
              </div>
              <span className="text-4xl">{game.team2.logo}</span>
            </div>
          </div>

          {/* Game details */}
          <div className="border-t border-zinc-800 pt-4 mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Calendar className="w-4 h-4" />
              {game.date}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Clock className="w-4 h-4" />
              {game.time} • ~{game.duration} hours
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <MapPin className="w-4 h-4" />
              {game.location}
            </div>
          </div>
        </div>

        {/* Selection indicator */}
        {selected && (
          <div className="bg-[var(--led-amber)]/10 border-t border-[var(--led-amber)]/30 py-2 px-4 flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-[var(--led-amber)]" />
            <span className="text-[var(--led-amber)] text-sm font-semibold">Selected</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   ALIBI HELPERS
   ========================================== */

function getRandomAlibi(): string {
  return ALIBI_OPTIONS[Math.floor(Math.random() * ALIBI_OPTIONS.length)].name;
}

function getAlibiDescription(alibiName: string, customDescription?: string): string {
  // If user provided a custom description, use that
  if (customDescription && customDescription.trim()) {
    return `${customDescription.trim()}\n\nLink to meeting: ${YOUTUBE_TV_REFERRAL}`;
  }

  // Otherwise try to match a preset alibi
  const match = ALIBI_OPTIONS.find(a => a.name === alibiName);
  if (match) {
    return `${match.description}\n\nLink to meeting: ${YOUTUBE_TV_REFERRAL}`;
  }

  // Fallback for custom alibis with no description
  return `Please review relevant materials before the meeting. Come prepared with updates on your workstreams.\n\nLink to meeting: ${YOUTUBE_TV_REFERRAL}`;
}

/* ==========================================
   STEP 3: PREVIEW & GENERATE
   ========================================== */

function CalendarPreview({ game, alibi }: { game: typeof GAME; alibi: string }) {
  const endTime = new Date(game.tipoff.getTime() + game.duration * 60 * 60 * 1000);
  const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md mx-auto">
      {/* Calendar header */}
      <div className="bg-gray-100 px-4 py-3 border-b flex items-center justify-between">
        <span className="font-semibold text-gray-900">Calendar Preview</span>
        <span className="text-sm text-gray-500">{game.date}</span>
      </div>

      {/* Calendar content */}
      <div className="p-4">
        <div className="flex gap-4">
          <div className="text-xs text-gray-400 w-16 text-right pt-1">
            {formatTime(game.tipoff)}
          </div>
          <div className="flex-1">
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
              <div className="font-semibold text-blue-900">{alibi}</div>
              <div className="text-sm text-blue-700 mt-1">Conference Room B</div>
              <div className="text-xs text-blue-600 mt-2">
                {formatTime(game.tipoff)} - {formatTime(endTime)}
              </div>
            </div>
          </div>
        </div>

        {/* What it's really for */}
        <div className="mt-4 p-3 bg-gradient-to-r from-[var(--led-amber)]/10 to-transparent border border-[var(--led-amber)]/20 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Actually blocking time for:</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg">{game.team1.logo}</span>
            <span className="font-bold text-[var(--led-amber)]">{game.team1.name} vs {game.team2.name}</span>
            <span className="text-lg">{game.team2.logo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   CALENDAR URL GENERATORS
   ========================================== */

function getGoogleCalendarUrl(game: typeof GAME, alibi: string, customDescription?: string): string {
  const start = game.tipoff;
  const end = new Date(start.getTime() + game.duration * 60 * 60 * 1000);

  // Google Calendar uses this format: YYYYMMDDTHHmmssZ
  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: alibi,
    dates: `${formatDate(start)}/${formatDate(end)}`,
    details: getAlibiDescription(alibi, customDescription),
    location: 'Conference Room B',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function getOutlookCalendarUrl(game: typeof GAME, alibi: string, customDescription?: string): string {
  const start = game.tipoff;
  const end = new Date(start.getTime() + game.duration * 60 * 60 * 1000);

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: alibi,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: getAlibiDescription(alibi, customDescription),
    location: 'Conference Room B',
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/* ==========================================
   MAIN DEMO PAGE
   ========================================== */

export default function DemoPage() {
  const [step, setStep] = useState(1);
  const [selectedGame, setSelectedGame] = useState<typeof GAME | null>(null);
  const [alibi, setAlibi] = useState('');
  const [description, setDescription] = useState('');
  const [added, setAdded] = useState(false);

  const handleRandomize = () => {
    const randomAlibi = ALIBI_OPTIONS[Math.floor(Math.random() * ALIBI_OPTIONS.length)];
    setAlibi(randomAlibi.name);
    setDescription(randomAlibi.description);
  };

  const handleAddToGoogle = () => {
    if (selectedGame && alibi) {
      window.open(getGoogleCalendarUrl(selectedGame, alibi, description), '_blank');
      setAdded(true);
    }
  };

  const handleAddToOutlook = () => {
    if (selectedGame && alibi) {
      window.open(getOutlookCalendarUrl(selectedGame, alibi, description), '_blank');
      setAdded(true);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedGame(null);
    setAlibi('');
    setDescription('');
    setAdded(false);
  };

  return (
    <>
      {/* Background */}
      <div className="arena-bg"></div>
      <div className="arena-vignette"></div>

      <main className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <a href="/" className="inline-block mb-4 text-zinc-500 hover:text-white text-sm">
              ← Back to Home
            </a>
            <h1 className="text-3xl md:text-4xl font-bold font-[var(--font-oswald)] uppercase">
              <span className="text-[var(--led-amber)] led-text">Demo:</span>{' '}
              <span className="text-white">Block a Game</span>
            </h1>
            <p className="text-zinc-500 mt-2">Try the flow with a sample Sweet 16 matchup</p>
          </div>

          {/* Progress bar */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s
                    ? 'bg-[var(--led-amber)] text-black'
                    : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 mx-1 rounded ${
                    step > s ? 'bg-[var(--led-amber)]' : 'bg-zinc-800'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Select Game */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-bold text-white mb-4 text-center font-[var(--font-oswald)] uppercase">
                Step 1: Select Your Game
              </h2>
              <p className="text-zinc-500 text-center mb-8">
                Choose the game you want to block time for
              </p>

              <div className="max-w-lg mx-auto">
                <GameCard
                  game={GAME}
                  selected={selectedGame?.id === GAME.id}
                  onSelect={() => setSelectedGame(GAME)}
                />
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => selectedGame && setStep(2)}
                  disabled={!selectedGame}
                  className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold uppercase tracking-wider transition-all ${
                    selectedGame
                      ? 'bg-[var(--led-amber)] text-black hover:bg-[var(--led-amber-glow)]'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Choose Your Alibi */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-bold text-white mb-4 text-center font-[var(--font-oswald)] uppercase">
                Step 2: Choose Your Alibi
              </h2>
              <p className="text-zinc-500 text-center mb-8">
                What should your calendar say you're doing?
              </p>

              <div className="max-w-md mx-auto space-y-4">
                {/* Meeting title input with randomizer button */}
                <div>
                  <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wider">Meeting Title</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={alibi}
                      onChange={(e) => setAlibi(e.target.value)}
                      placeholder="Enter meeting name..."
                      className="flex-1 px-4 py-3 bg-[#111115] border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--led-amber)] transition-colors"
                    />
                    <button
                      onClick={handleRandomize}
                      className="flex items-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition-colors group"
                      title="Generate Alibi"
                    >
                      <Shuffle className="w-5 h-5 group-hover:text-[var(--led-amber)] transition-colors" />
                      <span className="hidden sm:inline text-sm font-medium">Generate Alibi</span>
                    </button>
                  </div>
                </div>

                {/* Description textarea */}
                <div>
                  <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wider">
                    Description <span className="text-zinc-600">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add meeting details your boss might see..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[#111115] border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--led-amber)] transition-colors resize-none"
                  />
                  <p className="text-xs text-zinc-600 mt-1">
                    Leave blank for auto-generated corporate speak
                  </p>
                </div>

                {/* Preview of what it might look like */}
                {alibi && (
                  <div className="mt-2 p-4 bg-[#111115] border border-zinc-800 rounded-lg">
                    <div className="text-xs text-zinc-500 mb-2">Preview:</div>
                    <div className="text-white font-semibold">{alibi}</div>
                    <div className="text-sm text-zinc-400 mt-1">
                      {selectedGame?.time} • {selectedGame?.duration} hours blocked
                    </div>
                    {description && (
                      <div className="text-xs text-zinc-500 mt-2 line-clamp-2">{description}</div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wider bg-zinc-800 text-white hover:bg-zinc-700 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button
                  onClick={() => alibi.trim() && setStep(3)}
                  disabled={!alibi.trim()}
                  className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold uppercase tracking-wider transition-all ${
                    alibi.trim()
                      ? 'bg-[var(--led-amber)] text-black hover:bg-[var(--led-amber-glow)]'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preview & Add to Calendar */}
          {step === 3 && selectedGame && alibi && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-bold text-white mb-4 text-center font-[var(--font-oswald)] uppercase">
                Step 3: Add to Calendar
              </h2>
              <p className="text-zinc-500 text-center mb-8">
                Here's how it'll look — pick your calendar
              </p>

              <CalendarPreview game={selectedGame} alibi={alibi} />

              <div className="flex flex-col items-center gap-4 mt-8">
                {!added ? (
                  <>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleAddToGoogle}
                        className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-bold uppercase tracking-wider bg-white text-gray-800 hover:bg-gray-100 transition-all min-w-[200px]"
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
                        onClick={handleAddToOutlook}
                        className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-bold uppercase tracking-wider bg-[#0078D4] text-white hover:bg-[#106EBE] transition-all min-w-[200px]"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.157.154-.352.23-.584.23h-8.547v-6.959l1.6 1.229c.102.086.227.13.379.13.139 0 .262-.044.371-.13l6.781-5.163c.086-.075.152-.063.193.035.041.1.054.18.045.243zm0-2.092c.004.136-.036.242-.12.318l-.05.043-7.592 5.795-.057.043c-.108.064-.212.1-.312.1-.099 0-.206-.036-.322-.1l-1.593-1.21V6.217c0-.17.057-.314.17-.433.115-.118.253-.178.416-.178h8.877c.23 0 .424.077.58.23.158.152.234.34.003.459zm-10.086-.88H.686c-.24 0-.443.083-.608.25-.166.168-.25.37-.25.608v13.454c0 .24.084.442.25.608.165.167.368.25.608.25h13.228c.24 0 .443-.083.608-.25.166-.166.25-.368.25-.608V5.023c0-.24-.084-.442-.25-.608-.165-.167-.368-.25-.608-.25zM6.5 16.727c-2.616 0-4.735-2.18-4.735-4.868s2.119-4.868 4.735-4.868 4.735 2.18 4.735 4.868-2.119 4.868-4.735 4.868z"/>
                          <path d="M6.5 8.482c-1.8 0-3.26 1.512-3.26 3.377s1.46 3.377 3.26 3.377 3.26-1.512 3.26-3.377-1.46-3.377-3.26-3.377z"/>
                        </svg>
                        Outlook
                      </button>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" /> Change alibi
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold uppercase tracking-wider bg-green-500/20 border border-green-500/50 text-green-400">
                      <Check className="w-5 h-5" /> Calendar opened!
                    </div>
                    <p className="text-zinc-500 text-sm">
                      Complete the event in your calendar app.
                    </p>
                    <button
                      onClick={handleReset}
                      className="text-[var(--led-amber)] hover:underline mt-2"
                    >
                      Block Another Game →
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
