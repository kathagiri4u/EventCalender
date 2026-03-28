#!/usr/bin/env tsx
/**
 * Cron script: Fetch ESPN schedules for all sports and write data files.
 * Run: pnpm fetch-schedule
 *
 * Outputs:
 *   /data/schedule.json  — all events for next 60 days
 *   /data/standings.json — top 3 standings for applicable sports
 */

import { writeFileSync, renameSync } from 'fs'
import { join } from 'path'
import { format, addDays } from 'date-fns'
import { adaptEspnResponse, getEspnPath } from '../lib/espn'
import { isMajorEvent } from '../lib/major-events'
import { SPORT_SLUGS, SPORT_LEAGUES, STANDINGS_SPORTS, ESPN_SPORT_PATHS } from '../lib/constants'
import type { SportType, SportEvent, ScheduleData, StandingsData, SportStandings } from '../types'

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports'
const DATA_DIR = join(process.cwd(), 'data')

function getDateRange(): string {
  const today = new Date()
  const end = addDays(today, 60)
  const fmt = (d: Date) => format(d, 'yyyyMMdd')
  return `${fmt(today)}-${fmt(end)}`
}

async function fetchSportEvents(sport: SportType): Promise<SportEvent[]> {
  const path = getEspnPath(sport)
  if (!path) return []

  const dateRange = getDateRange()
  const url = `${ESPN_BASE}/${path}/scoreboard?dates=${dateRange}&limit=100`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`ESPN returned ${res.status} for ${sport}, skipping`)
      return []
    }
    const data = await res.json()
    const league = SPORT_LEAGUES[sport][0] ?? sport.toUpperCase()
    const events = adaptEspnResponse(data, sport, league)

    // Flag major events
    return events.map((e) => ({ ...e, isMajorEvent: isMajorEvent(e) }))
  } catch (err) {
    console.error(`Failed to fetch ${sport}:`, err)
    throw err // re-throw so cron is marked failed
  }
}

async function fetchStandings(sport: SportType): Promise<SportStandings | null> {
  const path = ESPN_SPORT_PATHS[sport]
  if (!path) return null

  const url = `${ESPN_BASE}/${path}/standings`

  try {
    const res = await fetch(url)
    if (!res.ok) return null

    const data = await res.json()
    const children = data?.children?.[0]?.standings?.entries ?? []

    const entries = children.slice(0, 3).map(
      (entry: {
        team?: { id?: string; displayName?: string; abbreviation?: string; logos?: { href: string }[] }
        stats?: { name: string; value: number }[]
      }, idx: number) => {
        const wins = entry.stats?.find((s) => s.name === 'wins')?.value ?? 0
        const losses = entry.stats?.find((s) => s.name === 'losses')?.value ?? 0
        const ties = entry.stats?.find((s) => s.name === 'ties')?.value
        return {
          rank: idx + 1,
          team: {
            id: entry.team?.id ?? '',
            name: entry.team?.displayName ?? '',
            abbreviation: entry.team?.abbreviation ?? '',
            logo: entry.team?.logos?.[0]?.href ?? '',
          },
          wins,
          losses,
          ...(ties !== undefined ? { ties } : {}),
        }
      }
    )

    return {
      sport,
      lastUpdated: new Date().toISOString(),
      entries,
    }
  } catch {
    return null
  }
}

function atomicWrite(filePath: string, content: string): void {
  const tmp = `${filePath}.tmp`
  writeFileSync(tmp, content, 'utf-8')
  renameSync(tmp, filePath)
}

async function main() {
  console.log('Fetching schedules for all sports...')

  // Fetch all sports in parallel
  const eventResults = await Promise.allSettled(SPORT_SLUGS.map(fetchSportEvents))

  const allEvents: SportEvent[] = []
  let hasError = false

  for (let i = 0; i < eventResults.length; i++) {
    const result = eventResults[i]
    const sport = SPORT_SLUGS[i]
    if (result.status === 'fulfilled') {
      allEvents.push(...result.value)
      console.log(`  ✓ ${sport}: ${result.value.length} events`)
    } else {
      console.error(`  ✗ ${sport}: ${result.reason}`)
      hasError = true
    }
  }

  // Sort events by date ascending
  allEvents.sort((a, b) => a.date.localeCompare(b.date))

  const fetchedThrough = format(addDays(new Date(), 60), "yyyy-MM-dd'T'HH:mm:ss'Z'")

  const scheduleData: ScheduleData = {
    lastUpdated: new Date().toISOString(),
    fetchedThrough,
    events: allEvents,
  }

  atomicWrite(join(DATA_DIR, 'schedule.json'), JSON.stringify(scheduleData, null, 2))
  console.log(`\nWrote ${allEvents.length} total events to data/schedule.json`)

  // Fetch standings in parallel
  const standingsResults = await Promise.allSettled(STANDINGS_SPORTS.map(fetchStandings))
  const standings: SportStandings[] = []

  for (const result of standingsResults) {
    if (result.status === 'fulfilled' && result.value) {
      standings.push(result.value)
    }
  }

  const standingsData: StandingsData = {
    lastUpdated: new Date().toISOString(),
    standings,
  }

  atomicWrite(join(DATA_DIR, 'standings.json'), JSON.stringify(standingsData, null, 2))
  console.log(`Wrote standings for ${standings.length} sports to data/standings.json`)

  if (hasError) {
    console.error('\nOne or more sports failed to fetch — marking cron as failed')
    process.exit(1)
  }

  console.log('\nDone!')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
