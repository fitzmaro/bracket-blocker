# Bracket Blocker - Operations Guide

This is your checklist for running Bracket Blocker. Read this when you come back to the project.

---

## 🚨 Before Selection Sunday (March 15, 2026)

### 1. Verify Email is Working
- [ ] Domain verified in Resend (see setup below)
- [ ] Test email sends correctly
- [ ] Check spam folder - if landing there, set up DMARC

### 2. Deploy to Vercel
```bash
vercel --prod
```
Then add these environment variables in Vercel dashboard (Settings → Environment Variables):
- `BALLDONTLIE_API_KEY` = your Ball Don't Lie key
- `RESEND_API_KEY` = your Resend key

### 3. Set Up Vercel KV (for production email storage)
1. Go to Vercel dashboard → Storage → Create Database → KV
2. Connect it to your project
3. It auto-adds the `KV_*` environment variables
4. **Ask Claude to swap the JSON storage to Vercel KV** - just say "swap subscriber storage to Vercel KV"

---

## 📅 On Selection Sunday (March 15, 2026 at 6 PM ET)

### Send the Bracket Drop Email Blast
Go to: `https://bracketblocker.com/api/admin/send-blast?secret=YOUR_SECRET`

(Claude will set this up - remind him if he hasn't)

This sends the "Bracket is LIVE!" email to all subscribers.

---

## 🏀 After Selection Sunday

The Ball Don't Lie API will have real tournament data. The bracket page will auto-populate.

If games aren't showing:
1. Check API is working: `https://bracketblocker.com/api/games?tournament=true&season=2026`
2. If empty, tournament data may not be uploaded yet - check back in a few hours

---

## 📧 Resend Domain Setup (bracketblocker.com)

### DNS Records to Add in Namecheap

You need to add these records in Namecheap DNS settings. Resend will give you the exact values.

| Type | Host | Value |
|------|------|-------|
| TXT | @ | Resend verification code |
| TXT | resend._domainkey | DKIM key from Resend |
| MX | send | feedback-smtp.us-east-1.amazonses.com (priority 10) |

### Steps:
1. Log into Resend → Domains → Add Domain → Enter `bracketblocker.com`
2. Resend shows you DNS records to add
3. Log into Namecheap → Domain List → bracketblocker.com → Advanced DNS
4. Add each record Resend shows
5. Wait 5-30 minutes for DNS to propagate
6. Click "Verify" in Resend

---

## 💰 YouTube TV Referral

Your referral link is embedded in every calendar description:
```
https://tv.youtube.com/referral/r35xtqahc7tukn
```

If you need to change it, search the codebase for `YOUTUBE_TV_REFERRAL`.

---

## 🔑 API Keys Location

All in `.env.local` (never commit this file):
```
BALLDONTLIE_API_KEY=fd36e4f1-...
RESEND_API_KEY=re_AhD9w9T3_...
```

---

## 📞 If Something Breaks

1. Check Vercel logs: `vercel logs`
2. Check if APIs are up by hitting `/api/games` and `/api/conferences`
3. Ask Claude - just paste the error message

---

## Quick Commands

```bash
# Run locally
npm run dev

# Deploy to production
vercel --prod

# Check git status
git status

# Push changes
git add -A && git commit -m "description" && git push
```
