# Data Model: EventCalendar Website

**Phase 1 output**

---

## Core Types (`types/index.ts`)

```ts
export type SportType =
  | 'nfl' | 'nba' | 'mlb' | 'nhl' | 'mls'
  | 'soccer' | 'ncaa_football' | 'ncaa_basketball'
  | 'ufc' | 'golf' | 'nascar'

export type EventStatus = 'scheduled' | 'in_progress' | 'final' | 'cancelled' | 'postponed'

export interface Team {
  id: string           // ESPN team ID
  name: string         // Full name e.g. "Green Bay Packers"
  abbreviation: string // e.g. "GB"
  logo: string         // URL to team logo image
  record?: string      // e.g. "8-3" (season record, if available)
  color?: string       // Primary team hex color
}

export interface SportEvent {
  id: string
  name: string         // Full event name e.g. "Green Bay Packers at Chicago Bears"
  shortName: string    // e.g. "GB @ CHI"
  sport: SportType
  league: string       // e.g. "NFL", "Premier League"
  date: string         // ISO 8601 UTC — always convert to CT before display
  status: EventStatus
  homeTeam: Team
  awayTeam: Team
  venue?: string       // e.g. "Lambeau Field"
  network?: string     // TV broadcast e.g. "ESPN", "CBS"
  isMajorEvent: boolean
  notes?: string       // e.g. "Super Bowl LVIII", "Game 7", "Playoff"
}

export interface StandingsEntry {
  team: Pick<Team, 'id' | 'name' | 'abbreviation' | 'logo'>
  wins: number
  losses: number
  ties?: number
  rank: number
}

export interface SportStandings {
  sport: SportType
  lastUpdated: string   // ISO 8601
  entries: StandingsEntry[]  // top 3 only
}
```

---

## Filter State (`store/useFilters.ts`)

```ts
export type DateRangeOption = 'this_week' | 'this_month' | 'custom'

export interface FilterState {
  selectedSport: SportType | 'all'
  selectedLeague: string | 'all'
  dateRange: DateRangeOption
  customDateStart?: string   // ISO date string
  customDateEnd?: string     // ISO date string
  majorEventsOnly: boolean
  searchQuery: string
  sortOrder: 'asc' | 'desc' // asc = soonest first
}

// Initial state
const DEFAULT_FILTERS: FilterState = {
  selectedSport: 'all',
  selectedLeague: 'all',
  dateRange: 'this_week',
  majorEventsOnly: false,
  searchQuery: '',
  sortOrder: 'asc',
}
```

Persisted to `sessionStorage` under key `event-calendar-filters`.

---

## Static Data Files

### `/data/schedule.json`

```ts
interface ScheduleData {
  lastUpdated: string        // ISO 8601 — when the cron last ran
  fetchedThrough: string     // ISO date — last date fetched (today + 60 days)
  events: SportEvent[]       // all events, sorted by date asc
}
```

### `/data/standings.json`

```ts
interface StandingsData {
  lastUpdated: string
  standings: SportStandings[]  // one entry per applicable sport
}
```

---

## State Transitions

```
EventStatus transitions (read-only, driven by ESPN API data in cron):

  scheduled ──────────→ in_progress ──→ final
      │                                   │
      └──────────→ cancelled               │
      └──────────→ postponed ─────────────┘
```

The app never writes status — it only reads what the cron job wrote to `schedule.json`.

---

## Sport → League Mapping (for LeagueFilter dynamic population)

```ts
export const SPORT_LEAGUES: Record<SportType, string[]> = {
  nfl:              ['NFL'],
  nba:              ['NBA'],
  mlb:              ['MLB'],
  nhl:              ['NHL'],
  mls:              ['MLS'],
  soccer:           ['Premier League', 'La Liga', 'Champions League', 'World Cup'],
  ncaa_football:    ['NCAA Football'],
  ncaa_basketball:  ['NCAA Basketball'],
  ufc:              ['UFC'],
  golf:             ['PGA Tour', 'Masters', 'US Open', "The Open Championship"],
  nascar:           ['NASCAR Cup Series'],
}
```
