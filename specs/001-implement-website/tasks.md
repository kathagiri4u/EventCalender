# Tasks: EventCalendar Website

**Input**: Design documents from `/specs/001-implement-website/`
**Branch**: `001-implement-website`

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story this task belongs to (US1–US5)
- Tests included — 100% coverage is a hard requirement per `CONTRIBUTING.md`

---

## Phase 1: Setup

**Purpose**: Initialize the project with all tooling configured.

- [X] T001 Initialize Next.js 14 App Router project with pnpm + TypeScript 5 at repo root
- [X] T002 [P] Install and configure Tailwind CSS v3 + shadcn/ui + Lucide React
- [X] T003 [P] Install remaining dependencies: TanStack Query v5, FullCalendar, Framer Motion, Zustand, date-fns, date-fns-tz
- [X] T004 [P] Configure ESLint + Prettier with project rules
- [X] T005 [P] Configure vitest + @testing-library/react with 100% coverage thresholds in `vitest.config.ts`
- [X] T006 [P] Configure Playwright in `playwright.config.ts` with viewport presets (320, 375, 768, 1024, 1280, 1536)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Data layer, types, and infrastructure that ALL user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T007 Create `types/index.ts` — `SportEvent`, `Team`, `SportType`, `EventStatus`, `StandingsEntry`, `SportStandings`, `FilterState`, `DateRangeOption` per `data-model.md`
- [X] T008 [P] Create `lib/constants.ts` — `SPORT_LEAGUES` mapping, `SPORT_COLORS` hex map, `SPORT_SLUGS` array
- [X] T009 [P] Implement `lib/utils.ts` — `formatEventTime(isoDate)` → `"7:30 PM CT"` using `date-fns-tz` + `America/Chicago`, `formatEventDate()`, `groupEventsByDate()`
- [X] T010 [P] Implement `lib/major-events.ts` — `MAJOR_KEYWORDS` array, `RIVALRY_PAIRS` Set (normalized slug pairs), `isMajorEvent(event: SportEvent): boolean`
- [X] T011 Implement `lib/espn.ts` — `EspnClient` interface + default implementation, ESPN scoreboard response → `SportEvent[]` adapter covering all 9 sports
- [X] T012 [P] Implement `lib/sportsdb.ts` — `SportsDbClient` interface + default implementation, team logo + venue photo fetchers
- [X] T013 Create `scripts/fetch-schedule.ts` — fetch all sports in parallel, normalise via `lib/espn.ts`, flag majors via `lib/major-events.ts`, write `data/schedule.json` and `data/standings.json` atomically (write temp → rename)
- [X] T014 Create `app/api/revalidate/route.ts` — POST handler, `x-revalidate-token` auth against `REVALIDATE_SECRET`, calls `revalidatePath('/', 'layout')`, returns `{ revalidated: true, at: <ISO> }`
- [X] T015 [P] Create `app/api/espn/route.ts` — GET proxy to ESPN Public API (used by cron only)
- [X] T016 [P] Create `app/api/sportsdb/route.ts` — GET proxy to TheSportsDB (used by cron only)
- [X] T017 Create `.github/workflows/fetch-schedule.yml` — cron `'0 12,0 * * *'` UTC + `workflow_dispatch`; steps: checkout → setup Node 20 + pnpm → install → fetch-schedule → commit data files if changed → POST to `/api/revalidate`
- [X] T018 Create `store/useFilters.ts` — Zustand store with `FilterState`, `DEFAULT_FILTERS`, full getters + setters, `sessionStorage` persistence under key `event-calendar-filters`
- [X] T019 Add unit tests for `lib/utils.ts`, `lib/major-events.ts`, `lib/constants.ts`, `lib/espn.ts`, `lib/sportsdb.ts`, `store/useFilters.ts` in `lib/__tests__/` and `store/__tests__/`

**Checkpoint**: Data layer complete — all user story work can now begin.

---

## Phase 3: User Story 1 — Navigation & Layout (Priority: P1)

**Goal**: A functional site shell with responsive Navbar and Footer at all breakpoints.

**Independent Test**: Visit any route — Navbar renders correctly at 320px/768px/1280px, mobile drawer opens/closes with animation, Footer renders 1/2/4 column layout responsively.

- [X] T020 [US1] Create `components/layout/Navbar.tsx` — desktop: Logo + sport pills (NFL NBA MLB NHL Soccer More▾) + inline Search + Calendar + Schedule links; assembles sub-components below
- [X] T021 [P] [US1] Create `components/layout/MobileDrawer.tsx` — `position: fixed`, `z-index: 50`, slides in from LEFT via Framer Motion, all 9 sports as tappable rows, Search bar at top, Calendar + Schedule at bottom, backdrop overlay tap-to-close, X close button
- [X] T022 [P] [US1] Create `components/layout/MoreDropdown.tsx` — click-triggered dropdown (not hover) for overflow sports on tablet, touch-compatible
- [X] T023 [P] [US1] Create `components/filters/SearchBar.tsx` — desktop: inline expanded; tablet/mobile: expands full-width below navbar on 🔍 tap; results dropdown max-height `60vh` scrollable; Escape/outside click to dismiss
- [X] T024 [P] [US1] Create `components/layout/Footer.tsx` — 4 columns desktop (About, Sports, Quick Links, Social) / 2 tablet / 1 mobile stacked; copyright, sport links, GitHub link
- [X] T025 [US1] Create `app/layout.tsx` — root layout wiring Navbar + Footer, TanStack Query `QueryClientProvider`, Syne + Inter Google Fonts via `next/font/google`, global dark background `#0A0A0F`
- [X] T026 [P] [US1] Add unit tests for Navbar, MobileDrawer, Footer, SearchBar in `components/layout/__tests__/`
- [X] T027 [P] [US1] Add Playwright E2E test: nav at 320px/768px/1280px, drawer open/close, search expand/dismiss in `tests/e2e/navigation.spec.ts`

**Checkpoint**: Site shell renders at all breakpoints. All pages inheriting this layout are unblocked.

---

## Phase 4: User Story 2 — Home Page (Priority: P1)

**Goal**: Fully functional home page — Hero Banner, Today's Games, Featured Events, This Week, Sport Quick-Nav.

**Independent Test**: Visit `/` — Hero Banner cycles through 3+ events every 6s, swipe gesture works on mobile, Today's Games strip scrolls horizontally, Featured Events grid adapts 1→4 columns.

- [X] T028 [US2] Create `lib/data.ts` — `getSchedule()`, `getStandings()`, `getTodaysEvents()`, `getUpcomingEvents(days: number)`, `getMajorEvents()` — all read from `data/schedule.json` and `data/standings.json` at build time
- [X] T029 [US2] Create `components/home/HeroBanner.tsx` — 3–5 major events, auto-advances 6s, Framer Motion `drag="x"` swipe, prev/next arrows; mobile: logos stacked + arrows below card; desktop: side-by-side logos + "VS" separator + arrows on edges; background gradient overlay
- [X] T030 [P] [US2] Create `components/home/TodaysGames.tsx` — `overflow-x-auto scroll-smooth snap-x snap-mandatory`, each item `snap-start min-h-[48px]`; empty state: "No games today — check back soon"
- [X] T031 [P] [US2] Create `components/home/FeaturedEvents.tsx` — `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`, MAJOR badge overlay, glassmorphism `backdrop-blur-sm bg-white/5`, glowing border `shadow-[0_0_20px_rgba(255,100,0,0.3)]`
- [X] T032 [P] [US2] Create `components/home/SportsSummary.tsx` — one card per sport showing next upcoming game, sport color left-border accent, links to `/sport/[slug]`; `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`
- [X] T033 [P] [US2] Create `components/home/ThisWeek.tsx` — next 7 days grouped by "Monday, March 31" headings, top matchups per day with EventCard
- [X] T034 [P] [US2] Create `components/home/SportQuickNav.tsx` — icon pills for 9 sports using Lucide icons, links to `/sport/[slug]`, horizontal scroll on mobile
- [X] T035 [P] [US2] Create `components/schedule/EventCard.tsx` — responsive wireframe per `navigation.md`: sport badge + MAJOR badge, team logos (`next/image` with fallback initials avatar), team names, `formatEventTime()` CT time, venue, network; `min-h-[48px]` mobile touch target
- [X] T036 [P] [US2] Create `components/schedule/MajorEventBadge.tsx` — "MAJOR" badge with sport-accent color
- [X] T037 [US2] Create `app/page.tsx` — static page calling `lib/data.ts` at build time, React Suspense + skeleton loaders wrapping each section
- [X] T038 [P] [US2] Add unit tests for all home components + `lib/data.ts` in `components/home/__tests__/` and `lib/__tests__/`
- [X] T039 [P] [US2] Add Playwright E2E test: home loads, hero cycles, swipe gesture, Today's Games strip in `tests/e2e/home.spec.ts`

**Checkpoint**: Home page fully functional — site is usable as MVP.

---

## Phase 5: User Story 3 — Calendar Page (Priority: P2)

**Goal**: FullCalendar monthly view with sport-colored event chips, click popover, and mobile agenda view.

**Independent Test**: Visit `/calendar` — events render as colored chips, clicking a chip opens popover showing CT time + venue, mobile shows agenda list by default with toggle to month view.

- [X] T040 [US3] Install `@fullcalendar/react` `@fullcalendar/daygrid` `@fullcalendar/list` `@fullcalendar/interaction` via pnpm
- [X] T041 [US3] Create `components/calendar/FullCalendarWrapper.tsx` — FullCalendar configured with daygrid + list views, events mapped from `SportEvent[]` with sport color, click handler; this is the inner component loaded dynamically
- [X] T042 [US3] Create `components/calendar/SportsCalendar.tsx` — `next/dynamic(() => import('./FullCalendarWrapper'), { ssr: false, loading: () => <CalendarSkeleton /> })`; mobile: `initialView='listWeek'` + toggle button; tablet: `dayMaxEvents: 2`; desktop: `dayMaxEvents: 10` + 280px right sidebar
- [X] T043 [P] [US3] Create `components/calendar/EventPopover.tsx` — full details: team logos, names, CT time, venue, network, league, MAJOR flag; mobile = bottom sheet (`position: fixed` bottom-0, max-height 80vh, swipe-down to dismiss via Framer Motion); desktop = inline popover
- [X] T044 [P] [US3] Create `components/calendar/CalendarLegend.tsx` — colored pill per sport from `SPORT_COLORS`, rendered above calendar grid
- [X] T045 [P] [US3] Create `components/calendar/CalendarSkeleton.tsx` — skeleton placeholder (grid of grey rectangles) shown while FullCalendar dynamic import loads
- [X] T046 [US3] Create `app/calendar/page.tsx` — reads `schedule.json` at build time, transforms to FullCalendar event format, renders `SportsCalendar` wrapped in Suspense
- [X] T047 [P] [US3] Add unit tests for EventPopover, CalendarLegend, CalendarSkeleton in `components/calendar/__tests__/`
- [X] T048 [P] [US3] Add Playwright E2E test: calendar renders chips, chip click opens popover, mobile list/month toggle in `tests/e2e/calendar.spec.ts`

**Checkpoint**: Calendar page independently functional and testable.

---

## Phase 6: User Story 4 — Schedule Page (Priority: P2)

**Goal**: Paginated, filterable, searchable event list with responsive filter panel.

**Independent Test**: Visit `/schedule` — 25 events per page, sport filter narrows results, search debounces 300ms, mobile filters open in bottom sheet with Apply/Reset, active filter count badge shows.

- [X] T049 [US4] Create `lib/filters.ts` — `filterEvents(events, state: FilterState): SportEvent[]`, `sortEvents()`, `paginateEvents(events, page, perPage=25)`, `searchEvents(events, query)` (searches name, team names, venue)
- [X] T050 [US4] Create `components/schedule/EventList.tsx` — events grouped under "Monday, March 31" date headings, 25/page, prev/next pagination controls, empty state when no results
- [X] T051 [P] [US4] Create `components/filters/SportFilter.tsx` — All + 9 sport pills, updates `useFilters` store `selectedSport`; resets `selectedLeague` to `'all'` on sport change
- [X] T052 [P] [US4] Create `components/filters/LeagueFilter.tsx` — dynamically populated from `SPORT_LEAGUES[selectedSport]`, hidden when `selectedSport === 'all'`
- [X] T053 [P] [US4] Create `components/filters/DateRangeFilter.tsx` — "This Week" | "This Month" | "Custom" pills; custom shows date range picker (shadcn Calendar popover)
- [X] T054 [P] [US4] Create `components/filters/MajorEventsToggle.tsx` — shadcn Switch, updates `useFilters` store `majorEventsOnly`
- [X] T055 [P] [US4] Create `components/filters/SortToggle.tsx` — "Soonest First" | "Latest First" toggle, updates `sortOrder`
- [X] T056 [US4] Create `components/filters/FiltersPanel.tsx` — desktop: sticky left sidebar 240px; tablet: horizontal scrollable pill row above list; mobile: "⚙ Filters (N)" button → full-screen bottom sheet drawer, Apply + Reset pinned to bottom; assembles T051–T055
- [X] T057 [US4] Create `app/schedule/page.tsx` — reads `schedule.json` at build time, renders `FiltersPanel` + `EventList`; filter state from Zustand (client component island pattern)
- [X] T058 [P] [US4] Add unit tests for `lib/filters.ts`, `EventList`, `FiltersPanel`, all filter sub-components in `lib/__tests__/` and `components/schedule/__tests__/`
- [X] T059 [P] [US4] Add Playwright E2E test: schedule loads, filter by NFL, search "Chiefs", paginate, mobile filter drawer in `tests/e2e/schedule.spec.ts`

**Checkpoint**: Schedule page independently functional with full filter system.

---

## Phase 7: User Story 5 — Sport-Specific Pages (Priority: P3)

**Goal**: Per-sport page with hero image, standings card (top 3), and pre-filtered event list.

**Independent Test**: Visit `/sport/nfl` — NFL hero image renders, standings card shows top 3 NFL teams, event list shows only NFL games.

- [X] T060 [P] [US5] Add sport hero images to `public/sports/` — source from Unsplash/Pexels (free license): `nfl.jpg`, `nba.jpg`, `mlb.jpg`, `nhl.jpg`, `soccer.jpg`, `ncaa.jpg`, `ufc.jpg`, `golf.jpg`, `nascar.jpg`
- [X] T061 [US5] Create `components/sport/SportHeroBanner.tsx` — `next/image` `object-cover` `w-full h-[240px] sm:h-[320px] lg:h-[480px]`, sport name + gradient overlay; reads from `/public/sports/{slug}.jpg`
- [X] T062 [P] [US5] Create `components/sport/StandingsCard.tsx` — top 3 entries: rank + team logo + name + W-L record; only rendered for NFL/NBA/MLB/NHL/MLS (not UFC/Golf/NASCAR); reads from `data/standings.json`
- [X] T063 [US5] Create `app/sport/[sport]/page.tsx` — `generateStaticParams()` returning all 9 slugs, reads `schedule.json` + `standings.json` at build time, filters events by sport, renders `SportHeroBanner` + `StandingsCard` + `EventList` (pre-filtered, no filter panel)
- [X] T064 [P] [US5] Add unit tests for `SportHeroBanner`, `StandingsCard` in `components/sport/__tests__/`
- [X] T065 [P] [US5] Add Playwright E2E test: `/sport/nfl` loads hero + standings + NFL-only events; `/sport/ufc` hides standings in `tests/e2e/sport-pages.spec.ts`

**Checkpoint**: All 9 sport pages statically generated and independently testable.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Performance, CI, viewport compliance, and final hardening.

- [X] T066 [P] Run Playwright viewport compliance test across all 7 widths (320/375/414/768/1024/1280/1536px) — assert no horizontal scroll, no overflow, no truncated text in `tests/e2e/responsive.spec.ts`
- [X] T067 [P] Audit and add React Suspense skeleton loaders to any async section missing them (schedule filters, sport pages, calendar)
- [X] T068 [P] Lazy-load `SportsCalendar` and off-screen home sections (`ThisWeek`, `SportsSummary`) using `next/dynamic`
- [X] T069 Run Lighthouse CI — assert 90+ on Performance, Accessibility, Best Practices, SEO for `/`, `/calendar`, `/schedule`, `/sport/nfl`
- [X] T070 [P] Add `husky` pre-commit hook running `pnpm test:unit:changed` in `package.json`
- [X] T071 [P] Create `.github/workflows/ci.yml` — `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm build` → `pnpm test --coverage` → `pnpm coverage:check`
- [X] T072 Update `CLAUDE.md` with final project structure and pnpm commands replacing npm defaults

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS all user stories**
- **Phase 3 (US1 Layout)**: Depends on Phase 2 — must complete before US2–US5 (all pages need the shell)
- **Phase 4 (US2 Home)**: Depends on Phase 3 — needs layout shell + `lib/data.ts`
- **Phase 5 (US3 Calendar)**: Depends on Phase 3 — can run in parallel with US2, US4, US5
- **Phase 6 (US4 Schedule)**: Depends on Phase 3 — can run in parallel with US3, US5
- **Phase 7 (US5 Sport Pages)**: Depends on Phase 3 — can run in parallel with US3, US4
- **Phase 8 (Polish)**: Depends on all desired stories complete

### User Story Dependencies

```
Phase 1 (Setup)
     ↓
Phase 2 (Foundational: types, data layer, cron, API routes, store)
     ↓
Phase 3 (US1: Layout shell — Navbar + Footer)
     ↓
  ┌──┴──────────────┬────────────────┐
  ↓                 ↓                ↓
Phase 4 (US2)   Phase 5 (US3)   Phase 6 (US4)
Home Page       Calendar        Schedule
  └──┬──────────────┴────────────────┘
     ↓
Phase 7 (US5: Sport Pages)
     ↓
Phase 8 (Polish)
```

### Parallel Opportunities Per Phase

```bash
# Phase 2 — run in parallel:
T008 lib/constants.ts  |  T009 lib/utils.ts  |  T010 lib/major-events.ts
T012 lib/sportsdb.ts   |  T015 api/espn       |  T016 api/sportsdb

# Phase 3 (US1) — run in parallel after T020:
T021 MobileDrawer  |  T022 MoreDropdown  |  T023 SearchBar  |  T024 Footer

# Phase 4 (US2) — run in parallel after T028 lib/data.ts:
T030 TodaysGames  |  T031 FeaturedEvents  |  T032 SportsSummary
T033 ThisWeek     |  T034 SportQuickNav   |  T035 EventCard

# Phase 5 (US3) — run in parallel after T041:
T043 EventPopover  |  T044 CalendarLegend  |  T045 CalendarSkeleton

# Phase 6 (US4) — run in parallel after T049 lib/filters.ts:
T051 SportFilter  |  T052 LeagueFilter  |  T053 DateRangeFilter
T054 MajorEventsToggle  |  T055 SortToggle
```

---

## Implementation Strategy

### MVP (Home page live, cron running)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 Layout
4. Complete Phase 4: US2 Home Page
5. **STOP and validate** — run `pnpm build`, verify Lighthouse, deploy to Vercel
6. Site is live with a working home page and cron feeding data

### Incremental delivery after MVP

- Add US3 Calendar → deploy
- Add US4 Schedule → deploy
- Add US5 Sport Pages → deploy
- Polish phase → production-ready

---

## Notes

- Tests are mandatory — 100% coverage required per `CONTRIBUTING.md`
- All times passed to any component must be UTC ISO 8601; `formatEventTime()` handles CT display
- `data/schedule.json` must exist before `pnpm build` — run `pnpm fetch-schedule` first (see `quickstart.md`)
- `[P]` = safe to run concurrently (different files, no shared state dependencies)
- Commit after each checkpoint to keep history clean
