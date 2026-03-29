import { describe, it, expect } from 'vitest'
import { isMajorEvent, RIVALRY_PAIRS, MAJOR_KEYWORDS } from '../major-events'
import type { SportEvent } from '@/types'

function makeEvent(overrides: Partial<SportEvent> = {}): SportEvent {
  return {
    id: '1',
    name: 'Test Game',
    shortName: 'TST @ TST',
    sport: 'nfl',
    league: 'NFL',
    date: '2026-03-28T19:30:00.000Z',
    status: 'scheduled',
    homeTeam: { id: 'h1', name: 'Generic Home', abbreviation: 'HME', logo: '' },
    awayTeam: { id: 'a1', name: 'Generic Away', abbreviation: 'AWY', logo: '' },
    isMajorEvent: false,
    ...overrides,
  }
}

describe('isMajorEvent', () => {
  it('returns true for Super Bowl in name', () => {
    const event = makeEvent({ name: 'Super Bowl LX' })
    expect(isMajorEvent(event)).toBe(true)
  })

  it('returns true for playoff in notes', () => {
    const event = makeEvent({ notes: 'NFL Playoff Wild Card Round' })
    expect(isMajorEvent(event)).toBe(true)
  })

  it('returns true for championship in name', () => {
    const event = makeEvent({ name: 'NBA Finals Game 1' })
    expect(isMajorEvent(event)).toBe(true)
  })

  it('returns true for known rivalry (GB vs CHI)', () => {
    const event = makeEvent({
      homeTeam: { id: 'gb', name: 'Green Bay Packers', abbreviation: 'GB', logo: '' },
      awayTeam: { id: 'chi', name: 'Chicago Bears', abbreviation: 'CHI', logo: '' },
    })
    expect(isMajorEvent(event)).toBe(true)
  })

  it('returns true for rivalry regardless of home/away order', () => {
    const event = makeEvent({
      homeTeam: { id: 'chi', name: 'Chicago Bears', abbreviation: 'CHI', logo: '' },
      awayTeam: { id: 'gb', name: 'Green Bay Packers', abbreviation: 'GB', logo: '' },
    })
    expect(isMajorEvent(event)).toBe(true)
  })

  it('returns true for Lakers vs Celtics rivalry', () => {
    const event = makeEvent({
      sport: 'nba',
      homeTeam: { id: 'lal', name: 'Los Angeles Lakers', abbreviation: 'LAL', logo: '' },
      awayTeam: { id: 'bos', name: 'Boston Celtics', abbreviation: 'BOS', logo: '' },
    })
    expect(isMajorEvent(event)).toBe(true)
  })

  it('returns false for regular season non-rivalry game', () => {
    const event = makeEvent({
      name: 'Miami Dolphins at Buffalo Bills',
      homeTeam: { id: 'buf', name: 'Buffalo Bills', abbreviation: 'BUF', logo: '' },
      awayTeam: { id: 'mia', name: 'Miami Dolphins', abbreviation: 'MIA', logo: '' },
    })
    expect(isMajorEvent(event)).toBe(false)
  })

  it('returns true for World Series', () => {
    const event = makeEvent({ sport: 'mlb', name: 'World Series Game 7', notes: 'Game 7' })
    expect(isMajorEvent(event)).toBe(true)
  })

  it('returns true for Daytona 500', () => {
    const event = makeEvent({ sport: 'nascar', name: 'Daytona 500' })
    expect(isMajorEvent(event)).toBe(true)
  })
})

describe('MAJOR_KEYWORDS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(MAJOR_KEYWORDS)).toBe(true)
    expect(MAJOR_KEYWORDS.length).toBeGreaterThan(0)
  })

  it('contains super bowl', () => {
    expect(MAJOR_KEYWORDS).toContain('super bowl')
  })
})

describe('RIVALRY_PAIRS', () => {
  it('is a Set', () => {
    expect(RIVALRY_PAIRS instanceof Set).toBe(true)
  })

  it('contains known rivalry', () => {
    expect(RIVALRY_PAIRS.has('chicago-bears-green-bay-packers')).toBe(true)
  })
})
