# Research: EventCalendar Website

**Phase 0 output** — all NEEDS CLARIFICATION items resolved.

---

## 1. CT Time Conversion

**Decision**: Use `date-fns-tz` with timezone `America/Chicago`.

**Rationale**: `date-fns-tz` integrates cleanly with `date-fns` (already in stack). The `America/Chicago` IANA timezone handles CST/CDT transitions automatically — no manual offset management.

**Implementation**:
```ts
import { toZonedTime, format } from 'date-fns-tz'
const CT_TZ = 'America/Chicago'

export function formatEventTime(isoDate: string): string {
  const zoned = toZonedTime(new Date(isoDate), CT_TZ)
  return format(zoned, 'h:mm a zzz', { timeZone: CT_TZ }) // → "7:30 PM CT"
}
```

**Alternatives considered**: `Intl.DateTimeFormat` — native but verbose; `luxon` — heavier dependency not already in stack.

---

## 2. Vercel On-Demand ISR Revalidation from GitHub Actions

**Decision**: Use Next.js on-demand revalidation via a protected API route (`/api/revalidate`), called by the GitHub Actions cron after writing `schedule.json`.

**Rationale**: Vercel's on-demand ISR (`res.revalidate()` / `revalidatePath()`) lets the cron trigger a rebuild of only the affected pages without a full redeploy. Faster and free-tier compatible.

**Implementation**:
```ts
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
export async function POST(req: Request) {
  const token = req.headers.get('x-revalidate-token')
  if (token !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  revalidatePath('/', 'layout') // revalidates all pages
  return Response.json({ revalidated: true })
}
```

GitHub Actions step after writing schedule.json:
```yaml
- name: Trigger revalidation
  run: |
    curl -X POST ${{ secrets.VERCEL_REVALIDATE_URL }} \
      -H "x-revalidate-token: ${{ secrets.REVALIDATE_SECRET }}"
```

**Alternatives considered**: Full `vercel --prod` redeploy — slower (full rebuild); Vercel Deploy Hooks — simpler but triggers full rebuild, not path-specific.

---

## 3. Rivalry Pairs List

**Decision**: Hardcode ~20 high-profile rivalry pairs in `lib/major-events.ts` as a `Set` of sorted team ID pairs.

**Rationale**: Rivalry designation is stable and editorial — it doesn't change from an API. Hardcoding keeps it simple, testable, and under version control.

**Initial list** (by ESPN team IDs, to be confirmed against ESPN scoreboard responses):

```ts
// Format: `${Math.min(idA,idB)}-${Math.max(idA,idB)}`
export const RIVALRY_PAIRS = new Set([
  // NFL
  'new-england-patriots-new-york-jets',
  'dallas-cowboys-washington-commanders',
  'green-bay-packers-chicago-bears',
  'san-francisco-49ers-dallas-cowboys',
  // NBA
  'los-angeles-lakers-boston-celtics',
  'los-angeles-lakers-golden-state-warriors',
  'chicago-bulls-detroit-pistons',
  // MLB
  'new-york-yankees-boston-red-sox',
  'los-angeles-dodgers-san-francisco-giants',
  'chicago-cubs-st-louis-cardinals',
  // NHL
  'montreal-canadiens-toronto-maple-leafs',
  'boston-bruins-montreal-canadiens',
  'detroit-red-wings-chicago-blackhawks',
  // Soccer
  'manchester-united-manchester-city',
  'real-madrid-fc-barcelona',
  'los-angeles-galaxy-lafc',
])
```

Teams matched using normalized lowercase slugs from ESPN `team.abbreviation` or `team.name`.

**Alternatives considered**: API-driven rivalry flag — ESPN doesn't expose this; user-configurable list — out of scope for v1.

---

## 4. Sport Hero Images

**Decision**: Static assets in `/public/sports/{slug}.jpg` — one hero image per sport, sourced from free stock (Unsplash/Pexels) and committed to the repo.

**Rationale**: Sport hero images don't change. Static assets in `/public` are served by Vercel CDN with zero cost. No API dependency.

**Files needed**:
```
public/sports/nfl.jpg
public/sports/nba.jpg
public/sports/mlb.jpg
public/sports/nhl.jpg
public/sports/soccer.jpg
public/sports/ncaa.jpg
public/sports/ufc.jpg
public/sports/golf.jpg
public/sports/nascar.jpg
```

**Alternatives considered**: TheSportsDB league banners — inconsistent quality and size; dynamic images from ESPN — no stable hero image endpoint.

---

## 5. Standings Data

**Decision**: Fetch standings from ESPN standings endpoints during the cron job alongside schedule data. Store in `/data/standings.json`.

**ESPN standings endpoints**:
```
NFL:     /football/nfl/standings
NBA:     /basketball/nba/standings
MLB:     /baseball/mlb/standings
NHL:     /hockey/nhl/standings
MLS:     /soccer/usa.1/standings
```

Only top 3 teams per conference/division are stored. UFC, Golf, NASCAR standings not applicable — those sport pages skip the standings card.

**Rationale**: Same cron job, same static pattern as schedule data. No user-request API calls.

---

## 6. FullCalendar + Next.js 14 App Router Compatibility

**Decision**: Use `@fullcalendar/react` with dynamic import (`next/dynamic`, `ssr: false`) to avoid SSR hydration issues.

**Rationale**: FullCalendar uses browser APIs not available during SSR. Dynamic import with `ssr: false` is the standard pattern for this in Next.js App Router.

**Implementation**:
```ts
// components/calendar/SportsCalendar.tsx
const FullCalendarComponent = dynamic(
  () => import('./FullCalendarWrapper'),
  { ssr: false, loading: () => <CalendarSkeleton /> }
)
```

**Alternatives considered**: `'use client'` alone — insufficient, still causes hydration mismatch; server-rendering the calendar — not supported by FullCalendar.

---

## 7. schedule.json Cron — GitHub Actions Setup

**Decision**: GitHub Actions workflow on `schedule` event, runs at `0 6,18 * * *` UTC-6 (approx 6 AM/PM CT). Uses a Node.js script to fetch ESPN data and write JSON.

**Note on UTC offset**: GitHub Actions cron uses UTC. CT is UTC-6 (CST) / UTC-5 (CDT). Use `0 12,0 * * *` UTC to approximate 6 AM/6 PM CST, accepting ±1h drift during DST.

**Alternatives considered**: Vercel Cron (Pro feature) — not on free tier; external cron service — unnecessary complexity.
