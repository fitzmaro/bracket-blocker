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

### Email - Receiving ✅
- **hello@bracketblocker.com** forwards to Gmail via Namecheap Email Forwarding
- Working and tested

### API Keys (in Vercel)
- `BALLDONTLIE_API_KEY` - for NCAA tournament data
- `RESEND_API_KEY` - for transactional emails

---

## What's Stuck ⚠️

### Email - Sending from Gmail
**Goal**: Send emails FROM hello@bracketblocker.com using Gmail "Send mail as"

**Problem**: Resend requires MX record for `send.bracketblocker.com` subdomain to verify domain, but Namecheap hides MX record option when "Email Forwarding" is enabled.

**Current Resend status**: `bracketblocker.com` added but NOT verified (waiting on MX record)

**Solution to try**:
1. In Namecheap, switch Mail Settings from "Email Forwarding" to "Custom MX"
2. Add MX record: Host = `send`, Value = `feedback-smtp.us-east-1.amazonses.com`, Priority = 10
3. Click Verify in Resend
4. Test if email forwarding still works (send email to hello@bracketblocker.com)
5. If forwarding breaks, need to add Namecheap forwarding MX records manually

**Resend DNS records needed** (TXT records already added):
- ✅ TXT `resend._domainkey` - DKIM key (added)
- ✅ TXT `send` - SPF record (added)
- ❌ MX `send` - `feedback-smtp.us-east-1.amazonses.com` priority 10 (blocked)

**Once Resend verifies**, set up Gmail "Send mail as":
- SMTP Server: `smtp.resend.com`
- Port: `587`
- Username: `resend`
- Password: Resend API key
- Email: `hello@bracketblocker.com`

---

## What's Left Before Selection Sunday (March 15)

### Must Do
- [ ] Fix Resend domain verification (MX record issue above)
- [ ] Update code to send from `notifications@bracketblocker.com` (not contact subdomain)
- [ ] Build admin endpoint for sending bracket drop email blast
- [ ] Swap local JSON subscriber storage to Vercel KV

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
