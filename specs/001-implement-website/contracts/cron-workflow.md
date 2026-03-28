# Contract: GitHub Actions Cron Workflow

**File**: `.github/workflows/fetch-schedule.yml`

---

## Trigger

```yaml
on:
  schedule:
    - cron: '0 12 * * *'   # ~6 AM CT (UTC-6 CST)
    - cron: '0 0 * * *'    # ~6 PM CT (UTC-6 CST)
  workflow_dispatch:         # allow manual run
```

Note: During CDT (UTC-5), runs at 7 AM/PM CT. Acceptable drift.

---

## Steps

```
1. Checkout repo
2. Setup Node.js 20 + pnpm
3. Install dependencies (pnpm install --frozen-lockfile)
4. Run fetch script (pnpm run fetch-schedule)
   → writes /data/schedule.json
   → writes /data/standings.json
5. Commit and push data files (if changed)
6. POST to /api/revalidate to trigger ISR
```

---

## Required Secrets

| Secret | Purpose |
|--------|---------|
| `REVALIDATE_SECRET` | Auth token for `/api/revalidate` |
| `VERCEL_REVALIDATE_URL` | Full URL to `/api/revalidate` on production |

---

## Fetch Script Contract (`scripts/fetch-schedule.ts`)

Input: none (reads ESPN endpoints from `lib/espn.ts`)

Output:
- `/data/schedule.json` — all events for next 60 days, all sports
- `/data/standings.json` — top 3 standings for applicable sports

Behavior:
- Fetches all sports in parallel
- Normalises ESPN response to `SportEvent[]` using `lib/espn.ts` adapter
- Flags major events using `lib/major-events.ts`
- Converts no timestamps — stores raw UTC from ESPN, UI handles CT conversion
- Writes atomically (write to temp file, then rename)
- Exits non-zero on ESPN API failure so the cron is marked failed in GitHub Actions
