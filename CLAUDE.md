# Bracket Blocker

Generate fake work calendar invites for March Madness games. Block your calendar without your boss knowing.

## What It Does

1. Users view the NCAA tournament bracket
2. Select games they want to watch (by team, conference, or individual game)
3. Choose "alibis" (fake meeting names like "Q1 Roadmap Alignment")
4. One-click add to Google Calendar or Outlook
5. All calendar descriptions include YouTube TV referral link

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 (new `@import "tailwindcss"` format)
- **Fonts**: Oswald (display), Inter (body)
- **API**: Ball Don't Lie NCAAB API (https://ncaab.balldontlie.io)
- **Calendar**: Google Calendar URL API, Outlook deeplink API

## Key Files

```
app/
├── page.tsx          # Home - Jumbotron landing page with countdown
├── bracket/page.tsx  # Bracket view - Select games to block
├── checkout/page.tsx # Assign alibis to selected games, add to calendar
├── demo/page.tsx     # Demo flow with fake Duke vs UNC game
├── globals.css       # LED glow effects, jumbotron styling, arena theme
├── api/
│   ├── games/route.ts       # Fetch tournament games from Ball Don't Lie
│   ├── conferences/route.ts # Fetch conferences
│   └── teams/route.ts       # Fetch teams
lib/
└── balldontlie.ts    # Ball Don't Lie API wrapper
```

## Design

"Jumbotron" aesthetic - user feels like they're in a basketball arena looking at the scoreboard.

- Dark arena background with vignette
- Amber/orange LED glow effects (`--led-amber: #FF9500`)
- 3D perspective on jumbotron with CSS transforms
- Side ad panels for monetization
- Scanlines and dot-matrix effects on screens

## API Configuration

Ball Don't Lie API key is in `.env.local`:
```
BALLDONTLIE_API_KEY=fd36e4f1-11ff-44db-83e5-6e7434a6c2bd
```

Key endpoints:
- `GET /api/games?tournament=true&season=2026` - Tournament games
- `GET /api/conferences` - List conferences
- `GET /api/teams?conference_id=X` - Teams by conference

## Monetization

1. **YouTube TV referral link** embedded in every calendar description:
   `https://tv.youtube.com/referral/r35xtqahc7tukn`

2. **Side ad panels** on landing page (visible on lg+ screens)

## Important Dates

- **Selection Sunday**: March 15, 2026 - Bracket revealed
- **First Four**: March 19-20, 2026
- **Tournament Start**: March 21, 2026
- **Championship**: April 6, 2026

## Commands

```bash
npm run dev    # Start dev server at localhost:3000
npm run build  # Production build
npm run start  # Start production server
```

## Status

- [x] Landing page with jumbotron design
- [x] Demo flow (fake game → alibi → calendar)
- [x] Bracket page template (placeholder for Selection Sunday)
- [x] Email capture for Selection Sunday notifications
- [x] Checkout flow for multiple games
- [x] Ball Don't Lie API integration
- [ ] Real tournament data (waiting for Selection Sunday)
- [ ] Email notification system
- [ ] Auto-follow-up when team advances
