# Feature Specification: EventCalendar Website

**Branch**: `001-implement-website` | **Last updated**: 2026-04-04 | **Status**: Implemented

---

## Overview

EventCalendar is a statically generated Next.js 14 sports event website for a sports bar in Austin, Texas. It aggregates upcoming schedules across 9 major sports leagues, highlights major matchups (playoffs, championships, rivalries), and displays all times in Central Time. Schedule data is fetched by a GitHub Actions cron job twice daily and stored as static JSON — zero ESPN API calls happen per user request.

---

## Context

- **Target user**: Sports bar staff and patrons in Austin, TX
- **Hosting**: Vercel (free tier)
- **Traffic**: Moderate public traffic, single business
- **Data freshness**: Refreshed twice daily via cron; up to 12 hours stale is acceptable

---

## Tech Stack

| Area | Library / Version |
|------|-------------------|
| Framework | Next.js 14 (App Router, SSG) |
| Language | TypeScript 5 |
| Runtime | Node.js 22 |
| Styling | Tailwind CSS v3, shadcn/ui, class-variance-authority |
| Animation | Framer Motion |
| Calendar | FullCalendar (`@fullcalendar/react`, daygrid, list, interaction) |
| Data fetching | TanStack Query v5 |
| State management | Zustand + sessionStorage persistence |
| Date handling | date-fns, date-fns-tz (timezone: `America/Chicago`) |
| Data source | ESPN public API (primary), TheSportsDB (logos/venues) |
| Testing | Vitest, @testing-library/react, @vitest/coverage-v8 |
| Package manager | pnpm |
| CI | GitHub Actions (Node.js 22) |

---

## Pages

### Home (`/`)

- **Hero Banner** — Rotating spotlight of 3–5 major upcoming events
  - Auto-advances every 6 seconds
  - Manual prev/next arrow buttons
  - Swipe/drag gesture support (Framer Motion, threshold 60px)
  - Dot navigation for direct jump to any event
  - Displays: team names, logos (or abbreviation avatar fallback), VS separator, date/time in CT, venue, network, MAJOR badge
- **Today's Games Strip** — Horizontal scrollable list of all events today
- **Featured Major Events** — Grid of championship/playoff/rivalry games with MAJOR badge overlay
- **This Week at a Glance** — Key matchups for the next 7 days, grouped by day
- **Sport Quick-Nav** — Icon pills linking to each sport-specific page

### Calendar (`/calendar`)

- Full monthly calendar powered by FullCalendar (SSR disabled via `next/dynamic`)
- Each event shown as a colored chip on its date (color = sport)
- Click event → popover with full details: teams, logos, date/time CT, venue, TV network, league, MAJOR flag
- Previous/Next month navigation + Today button
- Color legend: sport → color mapping
- **Mobile**: agenda/list view by default, togglable to month view with dot indicators; tap day → bottom sheet
- **Tablet**: month grid, up to 2 chips per day + "+ N more"; click → centered modal
- **Desktop**: full grid + 280px right sidebar for selected day detail

### Schedule (`/schedule`)

- Paginated event list — 25 events per page
- Events grouped by date (e.g. "Monday, March 31")
- Each card: sport icon, team A vs team B with logos, date/time CT, league, venue, TV, MAJOR badge
- **Filters sidebar** (sticky 240px on desktop, bottom sheet on mobile, pill row on tablet):
  - Sport: All | NFL | NBA | MLB | NHL | Soccer | Golf | (and others)
  - League: dynamically populated based on selected sport
  - Date range: This Week | This Month | Custom date picker
  - Major Events Only: toggle switch
  - Active filter count badge on mobile "Filters" button
- **Search bar**: live search by team name, event name, or venue (debounced 300ms)
- **Sort**: Soonest first (default) | Latest first

### Sport Pages (`/sport/[sport]`)

- Valid slugs: `nfl`, `nba`, `mlb`, `nhl`, `soccer`, `ncaa`, `ufc`, `golf`, `nascar`
- Sport-specific hero banner with background image from `/public/sports/[sport].jpg`
- Standings summary card (top 3 teams with wins/losses)
- Full event list pre-filtered for that sport (same card layout as schedule page)
- Statically generated at build time for all 9 slugs

### API Routes (cron-only)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/espn` | GET | ESPN API proxy — called by cron only |
| `/api/sportsdb` | GET | TheSportsDB proxy — called by cron only |
| `/api/revalidate` | POST | ISR revalidation — requires `REVALIDATE_SECRET` header |

---

## Data Architecture

```
GitHub Actions Cron (6 AM + 6 PM CT)
  → scripts/fetch-schedule.ts
      → ESPN API (all 9 sports, next 60 days)
      → write /data/schedule.json (atomic)
      → write /data/standings.json (atomic)
  → POST /api/revalidate  (triggers Vercel ISR rebuild)

Build time:
  → lib/data.ts reads /data/schedule.json
  → All pages statically generated — 0 ESPN calls per user request
```

### `/data/schedule.json` shape

```ts
interface ScheduleData {
  lastUpdated: string   // ISO 8601 — when cron last ran
  fetchedThrough: string // ISO date — today + 60 days
  events: SportEvent[]  // all events sorted by date asc
}
```

### `/data/standings.json` shape

```ts
interface StandingsData {
  lastUpdated: string
  standings: SportStandings[]  // one per applicable sport, top 3 entries each
}
```

---

## Core Data Types

### `SportEvent`

```ts
interface SportEvent {
  id: string
  name: string          // "Green Bay Packers at Chicago Bears"
  shortName: string     // "GB @ CHI"
  sport: SportType
  league: string        // "NFL", "Premier League", etc.
  date: string          // ISO 8601 UTC — always convert to CT before display
  status: EventStatus   // 'scheduled' | 'in_progress' | 'final' | 'cancelled' | 'postponed'
  homeTeam: Team
  awayTeam: Team
  venue?: string
  network?: string      // TV broadcast e.g. "ESPN", "NBC"
  isMajorEvent: boolean
  notes?: string        // "Super Bowl LVIII", "Game 7", etc.
}
```

### `Team`

```ts
interface Team {
  id: string
  name: string          // "Chicago Bears"
  abbreviation: string  // "CHI"
  logo: string          // URL — falls back to abbreviation avatar if empty
  record?: string       // "8-3"
  color?: string        // Primary hex color e.g. "#0B1F3F"
}
```

### `FilterState`

```ts
interface FilterState {
  selectedSport: SportType | 'all'
  selectedLeague: string | 'all'
  dateRange: 'this_week' | 'this_month' | 'custom'
  customDateStart?: string
  customDateEnd?: string
  majorEventsOnly: boolean
  searchQuery: string
  sortOrder: 'asc' | 'desc'
}
```

Persisted to `sessionStorage` under key `event-calendar-filters`.

---

## Sports & Leagues

| Sport | Leagues | Color |
|-------|---------|-------|
| NFL | Regular Season, Playoffs, Super Bowl | `#D00000` |
| NBA | Regular Season, Playoffs, NBA Finals | `#1D428A` |
| MLB | Regular Season, Playoffs, World Series | `#002D72` |
| NHL | Regular Season, Playoffs, Stanley Cup Finals | `#1F1F1F` |
| MLS / Soccer | MLS, Premier League, La Liga, Champions League, World Cup | `#00A650` |
| NCAA | College Football, College Basketball (March Madness) | `#FF6B00` |
| UFC / Boxing | UFC Fight Nights, PPV Events, Major Boxing Bouts | `#D4AF37` |
| Golf | PGA Tour, Masters, US Open, The Open Championship | `#3A7D44` |
| NASCAR | Cup Series, Daytona 500, Playoffs | `#FFD700` |

---

## Major Event Detection (`lib/major-events.ts`)

A game is flagged `isMajorEvent: true` if **any** of the following are true:

1. Event name contains a keyword: `"Super Bowl"`, `"Finals"`, `"Championship"`, `"World Series"`, `"Stanley Cup"`, `"World Cup"`, `"Daytona 500"`, `"Masters"`, `"March Madness"`, `"Playoff"`, `"Wild Card"`, `"Divisional Round"`, `"Conference Championship"`, `"UFC"`, `"PPV"`
2. Both teams appear in a predefined `RIVALRY_PAIRS` list
3. ESPN API marks the game as postseason

---

## Filter Logic (`lib/filters.ts`)

- `filterEvents(events, state)` — applies sport, league, major-only, date range, and search query filters in sequence
- `sortEvents(events, order)` — non-mutating sort by ISO date string
- `paginateEvents(events, page, perPage=25)` — returns `{ items, totalPages, totalItems }`, page is 1-indexed and clamped
- `searchEvents(events, query)` — searches `name`, `shortName`, `homeTeam.name`, `awayTeam.name`, `venue`; case-insensitive
- Date ranges:
  - `this_week` — from now through `now + 7 days` (CT)
  - `this_month` — from now through `now + 30 days` (CT)
  - `custom` — optional `customDateStart` (start of day) and/or `customDateEnd` (end of day)

---

## Design System

### Color Palette

```
Background:   #0A0A0F   (deep dark)
Surface:      #13131A   (card background)
Surface2:     #1C1C28   (elevated card / popover)
Border:       rgba(255,255,255,0.08)
Text Primary: #F1F5F9
Text Muted:   #64748B
```

### Typography

- Headings: `Syne` (Google Fonts)
- Body: `Inter` (Google Fonts)
- Scaling: `text-2xl md:text-3xl lg:text-5xl` pattern throughout

### Theme

- Dark mode only — no toggle
- Glassmorphism cards: `backdrop-blur-sm bg-white/5`
- Major event cards: `shadow-[0_0_20px_rgba(255,100,0,0.3)]`

---

## Navigation

```
Desktop (lg+):
  [Logo]  NFL  NBA  MLB  NHL  Soccer  More ▾      🔍 Search    Calendar  Schedule

Tablet (md):
  [Logo]  NFL  NBA  MLB  Soccer  More ▾            🔍          ☰

Mobile:
  [Logo]                                            🔍          ☰
  (full-height drawer slides in from left on ☰ tap)
```

- **More dropdown** — click-triggered (not hover), shows remaining sports, closes on Escape or outside click
- **Mobile drawer** — Framer Motion slide-in, all sports as tappable rows, search bar at top, close button top-right, backdrop overlay
- **Search** — desktop: inline expanded; mobile: expands full-width below navbar; dismiss on outside click or Escape

---

## Responsive Design

| Breakpoint | Min Width | Tailwind |
|------------|-----------|---------|
| Mobile S | 320px | base |
| Mobile L | 375px | base |
| Tablet | 640px | `sm:` |
| Tablet L | 768px | `md:` |
| Laptop | 1024px | `lg:` |
| Desktop | 1280px | `xl:` |
| Wide | 1536px | `2xl:` |

**Rule**: Mobile-first. Base styles = mobile. Scale up with `sm:`, `md:`, `lg:`, `xl:`.

### Grid System

| Section | Mobile | Tablet (md) | Desktop (lg) | Wide (xl) |
|---------|--------|-------------|--------------|-----------|
| Featured Events | 1 col | 2 col | 3 col | 4 col |
| Sport Summary Cards | 1 col | 2 col | 3 col | 5 col |
| Today's Games Strip | horizontal scroll (snap) | horizontal scroll | horizontal scroll | fixed grid |
| Schedule List | full width | full width | sidebar + list | sidebar + list |

### Spacing Conventions

- Page horizontal padding: `px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16`
- Section vertical spacing: `py-8 md:py-12 lg:py-16`
- Card padding: `p-3 md:p-4 lg:p-5`
- Grid gap: `gap-3 md:gap-4 lg:gap-6`

### Touch

- All tappable elements: min `44×44px` touch target
- No hover-only interactions
- Popovers on mobile → bottom sheets
- Horizontal scroll sections: `overflow-x-auto scroll-smooth snap-x snap-mandatory`

---

## Performance Requirements

- Lighthouse: **90+** on Performance, Accessibility, Best Practices, SEO
- All pages statically generated — no runtime API calls
- FullCalendar loaded via `next/dynamic` with `ssr: false`
- Team logos: `next/image` with responsive `sizes` prop
- Pagination: 25 events per page

---

## Testing

- **Framework**: Vitest + @testing-library/react
- **Coverage threshold**: 100% on statements, branches, functions, lines (`@vitest/coverage-v8`)
- **Test count**: 255+ unit tests
- All branches covered including: drag gestures, swipe navigation, date range filters, ESPN adapter edge cases, pagination clamping, search edge cases
- CI runs `pnpm test:coverage` on every push

---

## CI Pipeline (`.github/workflows/ci.yml`)

Runs on push to `main`, `master`, `001-*` branches and on pull requests:

1. `pnpm install --frozen-lockfile`
2. `pnpm lint` (ESLint via Next.js)
3. `pnpm tsc --noEmit`
4. `pnpm build` (with `REVALIDATE_SECRET=ci-secret`)
5. `pnpm test:coverage`

Node.js 22, pnpm latest, `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true`.

---

## Cron Workflow (`.github/workflows/fetch-schedule.yml`)

- Runs twice daily at **6 AM and 6 PM CT** (`0 12,0 * * *` UTC)
- Also available via `workflow_dispatch` for manual runs
- Calls `pnpm fetch-schedule` which writes `data/schedule.json` and `data/standings.json`
- Commits updated data files back to the repo

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REVALIDATE_SECRET` | Optional | Authorization header value for `POST /api/revalidate` |

---

## Out of Scope (v1)

- User accounts / personalization / favorite teams
- Push notifications or reminders
- Fantasy sports integration
- Betting odds or spreads
- Video highlights or streams
- Native mobile app
- Live scores (schedule is static, cron-refreshed)
