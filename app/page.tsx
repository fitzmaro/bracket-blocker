"use client";

import { useState, useEffect } from 'react';
import { ChevronRight, Calendar, Shield, Check, Play } from 'lucide-react';
import Link from 'next/link';

/* ==========================================
   COUNTDOWN
   ========================================== */

function CountdownDigit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="countdown-digit w-14 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 flex items-center justify-center">
        <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--led-amber)] led-text font-[var(--font-oswald)] tabular-nums">
          {value}
        </span>
      </div>
      <span className="text-[9px] md:text-[10px] text-zinc-500 mt-2 uppercase tracking-widest font-[var(--font-oswald)]">
        {label}
      </span>
    </div>
  );
}

function Countdown() {
  const [time, setTime] = useState({ d: '--', h: '--', m: '--', s: '--' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date('2026-03-19T12:00:00-04:00').getTime();

    const tick = () => {
      const diff = target - Date.now();
      if (diff > 0) {
        setTime({
          d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
          h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
          m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
          s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
        });
      }
    };

    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      <CountdownDigit value={time.d} label="Days" />
      <span className="text-xl sm:text-2xl md:text-4xl text-[var(--led-amber)] led-text font-bold mb-5">:</span>
      <CountdownDigit value={time.h} label="Hours" />
      <span className="text-xl sm:text-2xl md:text-4xl text-[var(--led-amber)] led-text font-bold mb-5">:</span>
      <CountdownDigit value={time.m} label="Min" />
      <span className="text-xl sm:text-2xl md:text-4xl text-[var(--led-amber)] led-text font-bold mb-5 hidden sm:block">:</span>
      <div className="hidden sm:block">
        <CountdownDigit value={time.s} label="Sec" />
      </div>
    </div>
  );
}

/* ==========================================
   AD PANEL
   ========================================== */

function AdPanel({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`hidden lg:block ad-panel-wrapper ${side === 'left' ? 'mr-4 lg:mr-6' : 'ml-4 lg:ml-6'}`}>
      <div className={`ad-panel ${side === 'left' ? 'ad-panel-left' : 'ad-panel-right'} p-2 w-32 lg:w-36 xl:w-44`}>
        <div className="ad-panel-screen h-[360px] lg:h-[420px] xl:h-[480px] flex flex-col items-center justify-center text-center p-4 relative scanlines">
          <span className="text-[9px] uppercase tracking-widest text-zinc-600 mb-4">Sponsored</span>
          <span className="text-lg xl:text-xl text-zinc-400 font-[var(--font-oswald)] uppercase mb-1">Your Ad</span>
          <span className="text-xl xl:text-2xl text-[var(--led-amber)] led-text font-[var(--font-oswald)] font-bold uppercase mb-6">Here</span>
          <p className="text-[9px] text-zinc-600 mb-4 leading-relaxed">Reach 100k+ basketball fans</p>
          <button className="text-[9px] uppercase tracking-widest text-[var(--led-amber)] opacity-70 hover:opacity-100 transition-opacity">
            Advertise →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   MAIN PAGE
   ========================================== */

export default function Home() {
  return (
    <>
      {/* Background */}
      <div className="arena-bg"></div>
      <div className="arena-vignette"></div>

      <main className="relative z-10 min-h-screen">

        {/* ===== HERO SECTION ===== */}
        <section className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="flex items-center justify-center w-full max-w-[1600px]">

            <AdPanel side="left" />

            {/* Jumbotron */}
            <div className="w-full max-w-3xl xl:max-w-4xl jumbotron-wrapper">
              <div className="jumbotron-3d animate-float">
                {/* Hanging cables */}
                <div className="hidden md:flex justify-center gap-32 xl:gap-40 mb-0">
                  <div className="w-1 h-16 xl:h-20 bg-gradient-to-b from-zinc-600 to-zinc-800 rounded-full shadow-lg"></div>
                  <div className="w-1 h-16 xl:h-20 bg-gradient-to-b from-zinc-600 to-zinc-800 rounded-full shadow-lg"></div>
                </div>

                <div className="jumbotron-outer">
                  <div className="jumbotron-bezel">
                    <div className="jumbotron-screen scanlines dot-matrix screen-glow px-6 py-8 md:px-10 md:py-12 xl:px-12 xl:py-14">

                      {/* Live badge */}
                      <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-[var(--led-red)]/30">
                          <span className="w-2 h-2 rounded-full bg-[var(--led-red)] animate-pulse-glow"></span>
                          <span className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--led-red)] font-bold font-[var(--font-oswald)]">
                            Live • March Madness 2026
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h1 className="text-center mb-6">
                        <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-[var(--led-amber)] led-text animate-flicker font-[var(--font-oswald)]">
                          Bracket
                        </span>
                        <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wide text-[var(--led-white)] led-text-white font-[var(--font-oswald)] -mt-1 md:-mt-2">
                          Blocker
                        </span>
                      </h1>

                      {/* Tagline */}
                      <p className="text-center text-sm md:text-base text-zinc-300 mb-10 max-w-lg mx-auto font-[var(--font-inter)]">
                        Generate fake work calendar invites for March Madness games.
                        <span className="block text-zinc-500 text-xs md:text-sm mt-1 uppercase tracking-wider">
                          Your boss will never know.
                        </span>
                      </p>

                      {/* Countdown */}
                      <div className="mb-10">
                        <p className="text-center text-[10px] uppercase tracking-widest text-zinc-500 mb-4 font-[var(--font-oswald)]">
                          Tournament Starts In
                        </p>
                        <Countdown />
                      </div>

                      {/* CTA */}
                      <div className="flex flex-col items-center">
                        <Link href="/bracket" className="btn-glow px-8 md:px-12 py-4 flex items-center gap-2 cursor-pointer">
                          <span className="text-lg md:text-xl font-bold uppercase tracking-wider text-[var(--led-amber)] led-text font-[var(--font-oswald)]">
                            Build Your Bracket
                          </span>
                          <ChevronRight className="w-5 h-5 text-[var(--led-amber)]" />
                        </Link>
                        <span className="text-[10px] md:text-xs text-zinc-600 mt-3 uppercase tracking-widest">
                          Free • No signup needed
                        </span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Bottom vents */}
                <div className="flex justify-center gap-1 mt-3 opacity-40">
                  {[...Array(18)].map((_, i) => (
                    <div key={i} className="w-1 h-3 md:h-5 bg-black rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>

            <AdPanel side="right" />

          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-24 px-4 bg-[var(--arena-dark)] border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight font-[var(--font-oswald)]">
              <span className="text-white">How It </span>
              <span className="text-[var(--led-amber)]">Works</span>
            </h2>
            <p className="text-center text-zinc-500 mb-16 text-sm">
              Three steps to basketball freedom during work hours.
            </p>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                { num: '01', icon: Shield, title: 'Pick Your Games', desc: 'Select your favorite teams, conferences, or specific matchups you refuse to miss.' },
                { num: '02', icon: Calendar, title: 'Choose Your Cover', desc: 'Pick from boring meeting templates like "Q1 Synergy Sync" or write your own.' },
                { num: '03', icon: Check, title: 'Block Your Calendar', desc: 'Get calendar invites that sync directly to Google Calendar or Outlook.' },
              ].map((item) => (
                <div key={item.num} className="feature-card p-8 relative group">
                  <div className="absolute -top-4 left-6 w-10 h-10 rounded-lg bg-[var(--arena-black)] border border-white/10 flex items-center justify-center">
                    <span className="text-[var(--led-amber)] font-bold font-[var(--font-oswald)]">{item.num}</span>
                  </div>
                  <item.icon className="w-8 h-8 text-zinc-500 mb-6 mt-2 group-hover:text-[var(--led-amber)] transition-colors" />
                  <h3 className="text-xl font-bold uppercase tracking-wide mb-3 font-[var(--font-oswald)] text-white">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-[var(--font-inter)]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PREVIEW SECTION ===== */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 uppercase tracking-tight font-[var(--font-oswald)]">
                <span className="text-white">The </span>
                <span className="text-[var(--led-amber)]">Perfect Crime</span>
              </h2>
              <p className="text-zinc-400 mb-8 leading-relaxed font-[var(--font-inter)]">
                Your calendar says "Enterprise Architecture Review." Your screen says UNC vs Duke.
                We provide the legitimate-looking cover stories so you can enjoy the madness.
              </p>
              <ul className="space-y-4">
                {['Authentic corporate jargon', 'Realistic duration times', 'Automatic follow-ups when your team wins'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300 font-[var(--font-inter)]">
                    <Play className="w-4 h-4 text-[var(--led-amber)] fill-[var(--led-amber)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Calendar mockup */}
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--led-amber)]/20 blur-[80px] rounded-full"></div>
              <div className="calendar-preview p-6 relative rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <span className="font-bold text-lg text-gray-900">Calendar</span>
                  <span className="text-gray-400 text-sm">March 19, 2026</span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-4 opacity-40">
                    <span className="text-xs text-gray-400 font-mono w-14 text-right pt-3">1:00 PM</span>
                    <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                      <div className="h-2 w-24 bg-gray-300 rounded mb-2"></div>
                      <div className="h-2 w-32 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex gap-4 relative">
                    <span className="text-xs text-gray-400 font-mono w-14 text-right pt-3">2:00 PM</span>
                    <div className="flex-1 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-md">
                      <div className="font-semibold text-blue-900">Q1 Roadmap Alignment</div>
                      <div className="text-xs text-blue-600 mt-1">Conference Room B • Mandatory</div>
                    </div>
                    <div className="absolute -right-3 -top-3 bg-[var(--led-amber)] text-black font-bold text-xs px-3 py-1.5 rounded-lg shadow-lg rotate-6 animate-pulse">
                      Actually: Duke vs UNC
                    </div>
                  </div>
                  <div className="flex gap-4 opacity-40">
                    <span className="text-xs text-gray-400 font-mono w-14 text-right pt-3">5:00 PM</span>
                    <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                      <div className="h-2 w-20 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="py-20 px-4 bg-[var(--arena-frame)] border-t border-black/50 relative">
          <div className="absolute inset-0 bg-scanlines opacity-5 pointer-events-none"></div>
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 uppercase font-[var(--font-oswald)]">
              <span className="text-white led-text-white">Ready to </span>
              <span className="text-[var(--led-amber)] led-text">Block</span>
              <span className="text-white led-text-white"> Your Bracket?</span>
            </h2>
            <Link href="/bracket" className="inline-block bg-[var(--led-amber)] hover:bg-[var(--led-amber-glow)] text-black font-bold text-lg md:text-xl px-10 py-4 rounded-lg uppercase tracking-wider font-[var(--font-oswald)] transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,150,0,0.5)] cursor-pointer">
              Start Now
            </Link>
            <p className="mt-8 text-zinc-500 text-sm">
              © 2026 Bracket Blocker. Not affiliated with the NCAA.
            </p>
          </div>
        </section>

      </main>
    </>
  );
}
