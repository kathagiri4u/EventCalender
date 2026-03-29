# Sports & Leagues Coverage

---

## Sports & Leagues Covered

| Sport            | Leagues / Events                                              | Color Code |
|------------------|---------------------------------------------------------------|------------|
| NFL              | Regular Season, Playoffs, Super Bowl                         | 🔴 #D00000  |
| NBA              | Regular Season, Playoffs, NBA Finals                         | 🔵 #1D428A  |
| MLB              | Regular Season, Playoffs, World Series                       | 🟤 #002D72  |
| NHL              | Regular Season, Playoffs, Stanley Cup Finals                 | ⚫ #111111  |
| MLS / Soccer     | MLS, Premier League, La Liga, Champions League, World Cup    | 🟢 #00A650  |
| NCAA             | College Football, College Basketball (March Madness)         | 🟠 #FF6B00  |
| UFC / Boxing     | UFC Fight Nights, PPV Events, Major Boxing Bouts             | 🟡 #D4AF37  |
| Golf             | PGA Tour, Masters, US Open, The Open Championship            | 🌿 #3A7D44  |
| NASCAR           | Cup Series, Daytona 500, Playoffs                            | ⚡ #FFD700  |

> API endpoint details live in `README.md` and inline in `lib/espn.ts` / `lib/sportsdb.ts`.

---

## Time Zone

All event times are displayed in **Central Time (CT)** — Austin, Texas.
Never display times in UTC or user local time. Always convert and label explicitly (e.g. `7:30 PM CT`).

---

## Data Strategy

### Schedule data — static, cron-refreshed

Game schedules are pre-scheduled and known days/weeks in advance. They are **not** fetched on user requests.

A background cron job runs **twice daily (6 AM and 6 PM CT)** via GitHub Actions:
1. Fetches the next 60 days of schedules from ESPN for all covered sports
2. Writes the result to `/data/schedule.json` in the repo
3. Triggers a Vercel on-demand revalidation to rebuild affected pages

Pages are statically generated from `/data/schedule.json` — zero ESPN API calls per user request.

```
Cron (6 AM + 6 PM CT)
  → fetch ESPN schedules (next 60 days, all sports)
  → write /data/schedule.json
  → POST to Vercel revalidation webhook
```

This means the site works even if ESPN's API is temporarily unavailable.

### Filter state

Persisted to `sessionStorage` via Zustand — survives page navigation within a session, cleared on tab close.
