# Bracket Blocker - Session Status

Last updated: March 2, 2026

## What's Done ✅

### Website
- **Live at**: https://bracketblocker.com
- **Hosted on**: Vercel
- **Repo**: https://github.com/fitzmaro/bracket-blocker
- **Domain**: bracketblocker.com via Namecheap, DNS pointing to Vercel (A records → 76.76.21.21)

### Pages Built
- `/` - Landing page with jumbotron, countdown to tournament
- `/bracket` - Bracket view with Selection Sunday countdown, email capture, game selection (placeholder until March 15)
- `/checkout` - Multi-game alibi assignment, Google Calendar / Outlook buttons
- `/demo` - Demo flow with fake Duke vs UNC game

### Email - Receiving (Testing)
- **hello@bracketblocker.com** forwards to Gmail via ImprovMX
- MX records verified: `mx1.improvmx.com` (10), `mx2.improvmx.com` (20)
- SPF record added: `v=spf1 include:spf.improvmx.com ~all`
- Test after DNS propagation (initial test bounced due to DNS cache)

### API Keys (in Vercel)
- `BALLDONTLIE_API_KEY` - for NCAA tournament data
- `RESEND_API_KEY` - for transactional emails

---

## What's Done (Email) ✅

### Resend Domain - VERIFIED
- `bracketblocker.com` verified in Resend
- Can send transactional emails from `notifications@bracketblocker.com`

### Gmail "Send mail as" - Ready to Set Up
Once ImprovMX forwarding is confirmed working:
1. In Gmail → Settings → Accounts → "Send mail as" → Add another email
2. Email: `hello@bracketblocker.com`
3. Uncheck "Treat as alias"
4. SMTP Server: `smtp.resend.com`
5. Port: `587`
6. Username: `resend`
7. Password: `re_AhD9w9T3_2XtDGZhcDk14xyAqyR3GMxwm` (Resend API key)

---

## What's Left Before Selection Sunday (March 15)

### Must Do
- [x] Fix Resend domain verification - DONE
- [x] Update code to send from `notifications@bracketblocker.com` - DONE
- [ ] Build admin endpoint for sending bracket drop email blast
- [ ] Swap local JSON subscriber storage to Vercel KV
- [ ] Confirm ImprovMX email forwarding is working

### Nice to Have
- [ ] Test email deliverability (currently going to spam - new domain)
- [ ] Add more alibi options

---

## Key Files

```
app/
├── page.tsx              # Home/landing
├── bracket/page.tsx      # Bracket selection + email capture
├── checkout/page.tsx     # Alibi assignment + calendar buttons
├── demo/page.tsx         # Demo flow
├── api/
│   ├── subscribe/route.ts    # Email subscription endpoint
│   ├── games/route.ts        # Ball Don't Lie API wrapper
│   ├── conferences/route.ts
│   └── teams/route.ts
lib/
├── balldontlie.ts        # NCAA API functions
├── email.ts              # Resend email functions
└── subscribers.ts        # Subscriber storage (currently JSON, swap to KV)
```

---

## Credentials Location

**Local** (`.env.local` - not committed):
```
BALLDONTLIE_API_KEY=fd36e4f1-11ff-44db-83e5-6e7434a6c2bd
RESEND_API_KEY=re_AhD9w9T3_2XtDGZhcDk14xyAqyR3GMxwm
```

**Production** (Vercel dashboard → Settings → Environment Variables):
Same keys added there.

---

## Quick Commands

```bash
# Run locally
cd ~/projects/bracket-blocker
npm run dev

# Deploy
vercel --prod

# Check DNS
dig bracketblocker.com A +short
dig TXT resend._domainkey.bracketblocker.com +short
```

---

## Links

- Vercel dashboard: https://vercel.com/fitzmaro-gmailcoms-projects/bracket-blocker
- Resend dashboard: https://resend.com/domains
- Namecheap DNS: Domain List → bracketblocker.com → Advanced DNS
- GitHub repo: https://github.com/fitzmaro/bracket-blocker
