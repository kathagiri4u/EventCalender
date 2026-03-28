export type SportType =
  | 'nfl'
  | 'nba'
  | 'mlb'
  | 'nhl'
  | 'mls'
  | 'soccer'
  | 'ncaa_football'
  | 'ncaa_basketball'
  | 'ufc'
  | 'golf'
  | 'nascar'

export type EventStatus = 'scheduled' | 'in_progress' | 'final' | 'cancelled' | 'postponed'

export interface Team {
  id: string
  name: string
  abbreviation: string
  logo: string
  record?: string
  color?: string
}

export interface SportEvent {
  id: string
  name: string
  shortName: string
  sport: SportType
  league: string
  date: string // ISO 8601 UTC — always convert to CT before display
  status: EventStatus
  homeTeam: Team
  awayTeam: Team
  venue?: string
  network?: string
  isMajorEvent: boolean
  notes?: string
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
  lastUpdated: string
  entries: StandingsEntry[]
}

export interface ScheduleData {
  lastUpdated: string
  fetchedThrough: string
  events: SportEvent[]
}

export interface StandingsData {
  lastUpdated: string
  standings: SportStandings[]
}

export type DateRangeOption = 'this_week' | 'this_month' | 'custom'

export interface FilterState {
  selectedSport: SportType | 'all'
  selectedLeague: string | 'all'
  dateRange: DateRangeOption
  customDateStart?: string
  customDateEnd?: string
  majorEventsOnly: boolean
  searchQuery: string
  sortOrder: 'asc' | 'desc'
}
