# EventCalender Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-28

## Active Technologies

- TypeScript 5 / Node.js 20 + Next.js 14 (App Router), React 18, Tailwind CSS v3, shadcn/ui, TanStack Query v5, FullCalendar, Framer Motion, Zustand, date-fns + date-fns-tz, pnpm (001-implement-website)

## Project Structure

```text
app/                          # Next.js 14 App Router pages
  layout.tsx                  # Root layout: Navbar, Footer, QueryProvider
  page.tsx                    # Home: Hero, TodaysGames, FeaturedEvents, ThisWeek
  calendar/page.tsx           # FullCalendar monthly/list view
  schedule/page.tsx           # Filterable paginated event list
  schedule/ScheduleClient.tsx # Client island for filter/pagination state
  sport/[sport]/page.tsx      # Sport-specific page (9 slugs)
  api/revalidate/route.ts     # ISR revalidation (cron-only)
  api/espn/route.ts           # ESPN proxy (cron-only)
  api/sportsdb/route.ts       # TheSportsDB proxy (cron-only)
components/
  layout/                     # Navbar, MobileDrawer, MoreDropdown, Footer
  filters/                    # SportFilter, LeagueFilter, DateRangeFilter, etc.
  home/                       # HeroBanner, TodaysGames, FeaturedEvents, etc.
  calendar/                   # SportsCalendar, FullCalendarWrapper, EventPopover
  schedule/                   # EventCard, EventList, MajorEventBadge
  sport/                      # SportHeroBanner, StandingsCard, SportEventList
  providers/                  # QueryProvider
lib/
  constants.ts                # SPORT_SLUGS, SPORT_COLORS, SPORT_LEAGUES, ESPN paths
  utils.ts                    # formatEventTime() (CT), formatEventDate(), cn()
  major-events.ts             # isMajorEvent(), RIVALRY_PAIRS, MAJOR_KEYWORDS
  espn.ts                     # ESPN API adapter: raw → SportEvent[]
  sportsdb.ts                 # TheSportsDB team/venue fetchers
  data.ts                     # Build-time: getSchedule(), getTodaysEvents(), etc.
  filters.ts                  # filterEvents(), sortEvents(), paginateEvents()
store/
  useFilters.ts               # Zustand filter state + sessionStorage persist
types/
  index.ts                    # SportEvent, Team, SportType, FilterState, etc.
data/
  schedule.json               # Cron output — all events next 60 days
  standings.json              # Cron output — top 3 standings per sport
scripts/
  fetch-schedule.ts           # Cron: fetch ESPN → write data/*.json atomically
.github/workflows/
  fetch-schedule.yml          # Cron: twice daily + workflow_dispatch
  ci.yml                      # CI: lint → tsc → build → test:coverage
```

## Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build (requires data/ files)
pnpm test             # Run unit tests (vitest)
pnpm test:coverage    # Run tests with coverage report
pnpm test:e2e         # Run Playwright E2E tests
pnpm lint             # ESLint
pnpm fetch-schedule   # Seed data/schedule.json (run before build)
```

## Code Style

TypeScript 5 / Node.js 20: Follow standard conventions

## Key Decisions

- **All times CT**: `formatEventTime(isoDate)` → `"7:30 PM CT"` via `date-fns-tz` + `America/Chicago`
- **Static data**: `data/schedule.json` written by cron; zero ESPN calls per user request
- **Dark mode only**: `#0A0A0F` background — no theme toggle
- **FullCalendar**: `next/dynamic(() => import('./FullCalendarWrapper'), { ssr: false })`
- **Filter state**: Zustand + sessionStorage key `event-calendar-filters`
- **100% test coverage**: Hard requirement per CONTRIBUTING.md

## Recent Changes

- 001-implement-website: Full implementation — all 8 phases, 198+ unit tests, 72 tasks complete

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
