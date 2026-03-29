import type { SportEvent, SportType, Team, EventStatus } from '@/types'
import { ESPN_SPORT_PATHS } from '@/lib/constants'

// ESPN scoreboard API response shapes (simplified to what we actually use)
interface EspnTeam {
  id: string
  displayName: string
  abbreviation: string
  logos?: { href: string }[]
  records?: { summary: string }[]
  color?: string
}

interface EspnCompetitor {
  homeAway: 'home' | 'away'
  team: EspnTeam
}

interface EspnCompetition {
  competitors: EspnCompetitor[]
  venue?: { fullName: string }
  broadcasts?: { names: string[] }[]
  status?: {
    type?: {
      state?: string
      completed?: boolean
      name?: string
    }
  }
}

interface EspnEvent {
  id: string
  name: string
  shortName: string
  date: string
  competitions: EspnCompetition[]
  notes?: { headline: string }[]
}

interface EspnScoreboardResponse {
  events?: EspnEvent[]
}

function mapStatus(competition: EspnCompetition): EventStatus {
  const state = competition.status?.type?.state
  const completed = competition.status?.type?.completed
  const name = competition.status?.type?.name?.toLowerCase() ?? ''

  if (completed) return 'final'
  if (name.includes('cancel')) return 'cancelled'
  if (name.includes('postpone')) return 'postponed'
  if (state === 'in') return 'in_progress'
  return 'scheduled'
}

function mapTeam(espnTeam: EspnTeam): Team {
  return {
    id: espnTeam.id,
    name: espnTeam.displayName,
    abbreviation: espnTeam.abbreviation,
    logo: espnTeam.logos?.[0]?.href ?? '',
    record: espnTeam.records?.[0]?.summary,
    color: espnTeam.color ? `#${espnTeam.color}` : undefined,
  }
}

function getNetwork(competition: EspnCompetition): string | undefined {
  const names = competition.broadcasts?.[0]?.names
  return names && names.length > 0 ? names.join(', ') : undefined
}

export function adaptEspnResponse(
  response: EspnScoreboardResponse,
  sport: SportType,
  league: string
): SportEvent[] {
  if (!response.events) return []

  return response.events
    .map((event): SportEvent | null => {
      const competition = event.competitions[0]
      if (!competition) return null

      const home = competition.competitors.find((c) => c.homeAway === 'home')
      const away = competition.competitors.find((c) => c.homeAway === 'away')

      if (!home || !away) return null

      return {
        id: event.id,
        name: event.name,
        shortName: event.shortName,
        sport,
        league,
        date: event.date,
        status: mapStatus(competition),
        homeTeam: mapTeam(home.team),
        awayTeam: mapTeam(away.team),
        venue: competition.venue?.fullName,
        network: getNetwork(competition),
        isMajorEvent: false, // set by fetch script using isMajorEvent()
        notes: event.notes?.[0]?.headline,
      }
    })
    .filter((e): e is SportEvent => e !== null)
}

/**
 * Fetch ESPN scoreboard for a given sport path and date range.
 * Used by the cron script — proxied through /api/espn to avoid CORS.
 */
export async function fetchEspnScoreboard(
  sportPath: string,
  dateRange: string,
  baseUrl = ''
): Promise<EspnScoreboardResponse> {
  const url = `${baseUrl}/api/espn?sport=${encodeURIComponent(sportPath)}&dates=${encodeURIComponent(dateRange)}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`ESPN API error ${res.status} for ${sportPath}`)
  }
  return res.json() as Promise<EspnScoreboardResponse>
}

/**
 * Get the ESPN sport path for a given SportType.
 */
export function getEspnPath(sport: SportType): string | undefined {
  return ESPN_SPORT_PATHS[sport]
}
