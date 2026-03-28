import { readFileSync } from 'fs'
import { join } from 'path'
import type { ScheduleData, StandingsData, SportEvent, SportType } from '@/types'
import { isToday, isWithinNextDays } from '@/lib/utils'

function loadSchedule(): ScheduleData {
  const filePath = join(process.cwd(), 'data', 'schedule.json')
  const raw = readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as ScheduleData
}

function loadStandings(): StandingsData {
  const filePath = join(process.cwd(), 'data', 'standings.json')
  const raw = readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as StandingsData
}

/**
 * Get all events from schedule.json (build-time read).
 */
export function getSchedule(): ScheduleData {
  return loadSchedule()
}

/**
 * Get standings data from standings.json (build-time read).
 */
export function getStandings(): StandingsData {
  return loadStandings()
}

/**
 * Get events for today (CT).
 */
export function getTodaysEvents(): SportEvent[] {
  const { events } = loadSchedule()
  return events.filter((e) => isToday(e.date))
}

/**
 * Get upcoming events within the next N days (CT).
 */
export function getUpcomingEvents(days: number): SportEvent[] {
  const { events } = loadSchedule()
  return events.filter((e) => isWithinNextDays(e.date, days))
}

/**
 * Get major events only.
 */
export function getMajorEvents(limit?: number): SportEvent[] {
  const { events } = loadSchedule()
  const major = events.filter((e) => e.isMajorEvent)
  return limit !== undefined ? major.slice(0, limit) : major
}

/**
 * Get events filtered by sport.
 */
export function getEventsBySport(sport: SportType): SportEvent[] {
  const { events } = loadSchedule()
  return events.filter((e) => e.sport === sport)
}
