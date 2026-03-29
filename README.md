# EventCalender

A full-featured sports event calendar built with Next.js 14, showing live schedules across 9 major sports — all powered by the ESPN public API with zero per-request API calls.

## Features

- **Multi-sport support** — NFL, NBA, MLB, NHL, Soccer, Golf, Tennis, MMA, and College Football
- **Hero Banner** — Auto-rotating featured events with swipe/drag support and dot navigation
- **Today's Games** — Quick-glance grid of all events happening today
- **Schedule page** — Filterable, sortable, paginated full event list
- **Interactive Calendar** — FullCalendar monthly and list views with event popovers
- **Sport pages** — Dedicated page per sport with hero banner, standings, and event list
- **Smart filters** — Filter by sport, league, date range (this week / this month / custom), major events, and free-text search
- **Major event detection** — Automatically flags playoffs, finals, championships, and rivalry games
- **Static-first architecture** — All data pre-built at deploy time; ESPN fetch runs on a cron schedule
- **Dark mode** — Dark-only UI with sport-specific accent colours
- **All times in CT** — Every event time displayed in Central Time

## Tech Stack

| Area | Library |
|------|---------|
| Framework | Next.js 14 (App Router, SSG) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v3, shadcn/ui, class-variance-authority |
| Animation | Framer Motion |
| Calendar | FullCalendar |
| Data fetching | TanStack Query v5 |
| State | Zustand + sessionStorage persistence |
| Date handling | date-fns, date-fns-tz |
| Data source | ESPN public API |
| Testing | Vitest, @testing-library/react (100% coverage) |
| Package manager | pnpm |

## Project Structure

```
app/                          # Next.js App Router pages
  page.tsx                    # Home: Hero, Today's Games, Featured Events, This Week
  calendar/page.tsx           # FullCalendar monthly/list view
  schedule/page.tsx           # Filterable paginated event list
  sport/[sport]/page.tsx      # Sport-specific page (9 slugs)
  api/revalidate/route.ts     # ISR revalidation endpoint
  api/espn/route.ts           # ESPN data proxy
components/
  layout/                     # Navbar, MobileDrawer, MoreDropdown, Footer
  filters/                    # SportFilter, LeagueFilter, DateRangeFilter, SearchBar
  home/                       # HeroBanner, TodaysGames, FeaturedEvents, ThisWeek
  calendar/                   # SportsCalendar, FullCalendarWrapper, EventPopover
  schedule/                   # EventCard, EventList, MajorEventBadge
  sport/                      # SportHeroBanner, StandingsCard, SportEventList
lib/
  constants.ts                # Sport slugs, colours, leagues, ESPN paths
  utils.ts                    # formatEventTime() (CT), formatEventDate(), cn()
  major-events.ts             # isMajorEvent(), rivalry detection, major keywords
  espn.ts                     # ESPN API adapter: raw response → SportEvent[]
  data.ts                     # Build-time data loaders
  filters.ts                  # filterEvents(), sortEvents(), paginateEvents()
store/
  useFilters.ts               # Zustand filter state
data/
  schedule.json               # Cron output — events for the next 60 days
  standings.json              # Cron output — top standings per sport
scripts/
  fetch-schedule.ts           # Fetches ESPN data and writes data/*.json
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/kathagiri4u/EventCalender.git
cd EventCalender

# Install dependencies
pnpm install
```

### Seed data

The app renders from a static `data/schedule.json` file. Run this once before starting the dev server or building:

```bash
pnpm fetch-schedule
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
pnpm build
pnpm start
```

## Available Commands

```bash
pnpm dev              # Start development server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint
pnpm test             # Run unit tests
pnpm test:coverage    # Run tests with coverage report
pnpm fetch-schedule   # Fetch latest ESPN data into data/schedule.json
```

## How Data Works

1. A GitHub Actions cron job runs `pnpm fetch-schedule` twice daily
2. The script calls the ESPN public API for all 9 sports and writes `data/schedule.json`
3. Next.js reads this file at build time — no ESPN calls happen per user request
4. ISR revalidation is available via `POST /api/revalidate` with a `REVALIDATE_SECRET` header

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REVALIDATE_SECRET` | Optional | Secret for the `/api/revalidate` ISR endpoint |

## Testing

The project maintains 100% test coverage across all metrics (statements, branches, functions, lines).

```bash
pnpm test             # Run all tests
pnpm test:coverage    # Run with coverage report
```

## CI

GitHub Actions runs on every push to `main` / `master` / `001-*` branches:

1. `pnpm lint`
2. `pnpm tsc --noEmit`
3. `pnpm build`
4. `pnpm test:coverage`

## Deployment

The app can be deployed to any platform that supports Next.js:

- **Vercel** — zero-config deployment recommended
- **Netlify**, **Railway**, **Render** — supported via standard Next.js adapter
- **Self-hosted** — `pnpm build && pnpm start`

Set up the `fetch-schedule` cron to run before each build to keep event data current.
