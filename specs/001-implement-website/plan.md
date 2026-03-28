# Implementation Plan: EventCalendar Website

**Branch**: `001-implement-website` | **Date**: 2026-03-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-implement-website/spec.md`

---

## Summary

Build the EventCalendar website for a sports bar in Austin, TX — a statically generated Next.js 14 (App Router) application displaying upcoming sports schedules across 9 major leagues. Schedule data is fetched by a GitHub Actions cron job (twice daily) and written to `/data/schedule.json`; all pages are pre-rendered from that file with zero ESPN API calls per user request. Key pages: Home, Calendar (FullCalendar), Schedule (filtered list), and Sport-specific pages.

---

## Technical Context

**Language/Version**: TypeScript 5 / Node.js 20
**Primary Dependencies**: Next.js 14 (App Router), React 18, Tailwind CSS v3, shadcn/ui, TanStack Query v5, FullCalendar, Framer Motion, Zustand, date-fns + date-fns-tz, pnpm
**Storage**: `/data/schedule.json` + `/data/standings.json` — static files, cron-refreshed; no database
**Testing**: vitest + @testing-library/react (unit/integration), Playwright (E2E)
**Target Platform**: Vercel (free tier), modern web browsers
**Project Type**: web-application (Next.js SSG)
**Performance Goals**: Lighthouse 90+ on Performance, Accessibility, Best Practices, SEO
**Constraints**: Fully static pages; all times in CT (America/Chicago); dark mode only; mobile-first
**Scale/Scope**: Single sports bar website, Austin TX, moderate public traffic

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design — all gates still pass.*

| Rule | Source | Status |
|------|--------|--------|
| All pages statically generated — no ESPN calls per user request | constitution.md | ✅ Static JSON + on-demand ISR |
| All event times in CT, labeled explicitly (e.g. `7:30 PM CT`) | data-and-api.md | ✅ date-fns-tz `America/Chicago` |
| Lighthouse 90+ (Performance, A11y, Best Practices, SEO) | constitution.md | ✅ SSG + skeleton loaders + lazy load |
| Paginate schedule list at 25 events/page | constitution.md | ✅ EventList pagination |
| Mobile-first responsive design, 7 breakpoints | navigation.md | ✅ Tailwind mobile-first |
| Dark mode only — no toggle | design-system.md | ✅ No theme switcher |
| Live scores not implemented | features.md | ✅ Removed from scope |
| 100% test coverage | CONTRIBUTING.md | ✅ vitest thresholds + Playwright |

No gate violations.

---

## Project Structure

### Documentation (this feature)

```
specs/001-implement-website/
├── plan.md               # This file
├── spec.md               # Feature specification
├── research.md           # Phase 0: all unknowns resolved
├── data-model.md         # Phase 1: types, filter state, JSON schemas
├── quickstart.md         # Phase 1: developer setup guide
├── contracts/
│   ├── schedule-json.md  # /data/schedule.json schema
│   ├── api-routes.md     # API proxy route contracts
│   └── cron-workflow.md  # GitHub Actions cron contract
└── tasks.md              # Phase 2 output (speckit.tasks — not yet created)
```

### Source Code

```
/
├── app/
│   ├── layout.tsx                  # Root layout: Navbar, Footer, providers
│   ├── page.tsx                    # Home: Hero, TodaysGames, FeaturedEvents, ThisWeek
│   ├── calendar/page.tsx           # FullCalendar monthly view
│   ├── schedule/page.tsx           # Filterable paginated event list
│   ├── sport/[sport]/page.tsx      # Sport page (nfl|nba|mlb|nhl|soccer|ncaa|ufc|golf|nascar)
│   └── api/
│       ├── revalidate/route.ts     # ISR revalidation endpoint (cron-triggered)
│       ├── espn/route.ts           # ESPN proxy (cron-only)
│       └── sportsdb/route.ts       # TheSportsDB proxy (cron-only)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroBanner.tsx
│   │   ├── TodaysGames.tsx
│   │   ├── FeaturedEvents.tsx
│   │   └── SportsSummary.tsx
│   ├── calendar/
│   │   ├── SportsCalendar.tsx      # dynamic import, ssr: false
│   │   └── EventPopover.tsx
│   ├── schedule/
│   │   ├── EventList.tsx
│   │   ├── EventCard.tsx
│   │   └── MajorEventBadge.tsx
│   └── filters/
│       ├── SportFilter.tsx
│       ├── LeagueFilter.tsx
│       └── SearchBar.tsx
├── lib/
│   ├── espn.ts                     # ESPN adapter: raw response → SportEvent[]
│   ├── sportsdb.ts                 # TheSportsDB adapter
│   ├── major-events.ts             # isMajorEvent() + RIVALRY_PAIRS
│   └── utils.ts                    # formatEventTime() (CT), date helpers
├── store/
│   └── useFilters.ts               # Zustand filter state + sessionStorage persist
├── types/
│   └── index.ts                    # SportEvent, Team, SportType, FilterState, etc.
├── data/
│   ├── schedule.json               # Cron output — all events next 60 days
│   └── standings.json              # Cron output — top 3 per sport
├── scripts/
│   └── fetch-schedule.ts           # Cron script: fetch ESPN → write data/*.json
├── public/
│   └── sports/                     # Hero images: nfl.jpg, nba.jpg, etc.
├── .github/
│   └── workflows/
│       └── fetch-schedule.yml      # GitHub Actions cron
└── .env.local                      # REVALIDATE_SECRET
```

**Structure Decision**: Single Next.js 14 App Router project. No backend/frontend split — API routes are cron-only proxies, not user-facing endpoints.

---

## Complexity Tracking

No constitution violations requiring justification.
