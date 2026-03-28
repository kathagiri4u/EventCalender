# Contract: API Routes

---

## POST /api/revalidate

Triggers Next.js on-demand ISR revalidation. Called by GitHub Actions cron after writing `schedule.json`.

**Auth**: `x-revalidate-token` header must match `process.env.REVALIDATE_SECRET`.

**Request**:
```
POST /api/revalidate
x-revalidate-token: <secret>
```

**Response — 200 OK**:
```json
{ "revalidated": true, "at": "2026-03-28T12:01:00.000Z" }
```

**Response — 401 Unauthorized**:
```json
{ "error": "Unauthorized" }
```

---

## GET /api/espn

Proxy for ESPN Public API. Used only by the cron script (`scripts/fetch-schedule.ts`) — never called client-side.

**Query params**:
- `sport` — e.g. `football/nfl`, `basketball/nba`
- `dates` — e.g. `20260101-20260301`

**Proxies to**: `https://site.api.espn.com/apis/site/v2/sports/{sport}/scoreboard?dates={dates}`

**Response**: Pass-through JSON from ESPN.

---

## GET /api/sportsdb

Proxy for TheSportsDB API. Used only by the cron script for team logos and venue photos.

**Query params**:
- `endpoint` — the TheSportsDB path, e.g. `searchteams.php?t=Bills`

**Proxies to**: `https://www.thesportsdb.com/api/v1/json/3/{endpoint}`

**Response**: Pass-through JSON from TheSportsDB.

---

## Note

These API routes are **cron-only**. No page or component calls them at runtime. All schedule data is pre-fetched into `/data/schedule.json`.
