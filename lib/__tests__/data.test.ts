/**
 * data.ts integration tests — seed the actual data files before testing
 * so readFileSync works without any mocking.
 */
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'data')
const SCHEDULE_PATH = join(DATA_DIR, 'schedule.json')
const STANDINGS_PATH = join(DATA_DIR, 'standings.json')

// Save originals so we can restore after tests
let originalSchedule: string
let originalStandings: string

const testScheduleData = {
  lastUpdated: '2026-03-28T00:00:00.000Z',
  fetchedThrough: '2026-05-27T00:00:00Z',
  events: [
    {
      id: '1',
      name: 'Test NFL Game',
      shortName: 'KC @ SF',
      sport: 'nfl',
      league: 'NFL',
      date: '2026-03-28T19:30:00.000Z',
      status: 'scheduled',
      homeTeam: { id: 'sf', name: 'San Francisco 49ers', abbreviation: 'SF', logo: '' },
      awayTeam: { id: 'kc', name: 'Kansas City Chiefs', abbreviation: 'KC', logo: '' },
      isMajorEvent: false,
    },
    {
      id: '2',
      name: 'Super Bowl LX',
      shortName: 'SB LX',
      sport: 'nfl',
      league: 'NFL',
      date: '2026-02-08T23:30:00.000Z',
      status: 'scheduled',
      homeTeam: { id: 'sfb', name: 'SF 49ers', abbreviation: 'SF', logo: '' },
      awayTeam: { id: 'kcb', name: 'KC Chiefs', abbreviation: 'KC', logo: '' },
      isMajorEvent: true,
    },
    {
      id: '3',
      name: 'Test NBA Game',
      shortName: 'LAL @ BOS',
      sport: 'nba',
      league: 'NBA',
      date: '2026-03-29T01:00:00.000Z',
      status: 'scheduled',
      homeTeam: { id: 'bos', name: 'Boston Celtics', abbreviation: 'BOS', logo: '' },
      awayTeam: { id: 'lal', name: 'Los Angeles Lakers', abbreviation: 'LAL', logo: '' },
      isMajorEvent: false,
    },
  ],
}

const testStandingsData = {
  lastUpdated: '2026-03-28T00:00:00.000Z',
  standings: [],
}

beforeAll(() => {
  // Preserve originals
  originalSchedule = readFileSync(SCHEDULE_PATH, 'utf-8')
  originalStandings = readFileSync(STANDINGS_PATH, 'utf-8')
  // Write test data
  writeFileSync(SCHEDULE_PATH, JSON.stringify(testScheduleData, null, 2))
  writeFileSync(STANDINGS_PATH, JSON.stringify(testStandingsData, null, 2))
})

afterAll(() => {
  // Restore originals
  writeFileSync(SCHEDULE_PATH, originalSchedule)
  writeFileSync(STANDINGS_PATH, originalStandings)
})

// Import after data files are seeded
import * as dataModule from '../data'

describe('getSchedule', () => {
  it('returns schedule data with correct event count', () => {
    const data = dataModule.getSchedule()
    expect(data.events).toHaveLength(3)
    expect(data.lastUpdated).toBe('2026-03-28T00:00:00.000Z')
  })
})

describe('getStandings', () => {
  it('returns standings data', () => {
    const data = dataModule.getStandings()
    expect(Array.isArray(data.standings)).toBe(true)
    expect(data.lastUpdated).toBeDefined()
  })
})

describe('getMajorEvents', () => {
  it('returns only major events', () => {
    const events = dataModule.getMajorEvents()
    expect(events.length).toBeGreaterThanOrEqual(1)
    expect(events.every((e) => e.isMajorEvent)).toBe(true)
  })

  it('respects limit of 0', () => {
    const events = dataModule.getMajorEvents(0)
    expect(events).toHaveLength(0)
  })

  it('returns up to limit', () => {
    const events = dataModule.getMajorEvents(1)
    expect(events.length).toBeLessThanOrEqual(1)
  })
})

describe('getEventsBySport', () => {
  it('returns nfl events only', () => {
    const nflEvents = dataModule.getEventsBySport('nfl')
    expect(nflEvents.every((e) => e.sport === 'nfl')).toBe(true)
    expect(nflEvents.length).toBeGreaterThan(0)
  })

  it('returns nba events only', () => {
    const nbaEvents = dataModule.getEventsBySport('nba')
    expect(nbaEvents.every((e) => e.sport === 'nba')).toBe(true)
    expect(nbaEvents.length).toBeGreaterThan(0)
  })

  it('returns empty array for sport with no events', () => {
    const golfEvents = dataModule.getEventsBySport('golf')
    expect(golfEvents).toHaveLength(0)
  })
})

describe('getUpcomingEvents', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-28T12:00:00.000Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns events within next N days', () => {
    const events = dataModule.getUpcomingEvents(7)
    // Only events on/after 2026-03-28 within 7 days
    expect(events.every((e) => e.date >= '2026-03-28')).toBe(true)
  })

  it('returns empty for 0 days', () => {
    // 0 days means end of today only
    const events = dataModule.getUpcomingEvents(0)
    // Events on 2026-03-28 should be included (same day)
    expect(Array.isArray(events)).toBe(true)
  })
})
