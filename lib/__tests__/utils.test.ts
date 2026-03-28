import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  formatEventTime,
  formatEventDate,
  formatEventDateShort,
  groupEventsByDate,
  isToday,
  isWithinNextDays,
  cn,
} from '../utils'
import type { SportEvent } from '@/types'

// Fixed UTC date: 2026-03-28T19:30:00Z = 2:30 PM CT (UTC-5 CDT)
const UTC_DATE = '2026-03-28T19:30:00.000Z'

function makeEvent(overrides: Partial<SportEvent> = {}): SportEvent {
  return {
    id: '1',
    name: 'Test Game',
    shortName: 'TST @ TST',
    sport: 'nfl',
    league: 'NFL',
    date: UTC_DATE,
    status: 'scheduled',
    homeTeam: { id: 'h1', name: 'Home Team', abbreviation: 'HME', logo: '' },
    awayTeam: { id: 'a1', name: 'Away Team', abbreviation: 'AWY', logo: '' },
    isMajorEvent: false,
    ...overrides,
  }
}

describe('formatEventTime', () => {
  it('converts UTC time to CT with label', () => {
    // 19:30 UTC = 14:30 CT (CDT = UTC-5 in March)
    const result = formatEventTime(UTC_DATE)
    expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM) CT/)
    expect(result).toContain('CT')
  })

  it('handles midnight UTC', () => {
    const result = formatEventTime('2026-03-28T00:00:00.000Z')
    expect(result).toContain('CT')
  })
})

describe('formatEventDate', () => {
  it('returns full day + date in CT', () => {
    const result = formatEventDate(UTC_DATE)
    // 2026-03-28 is a Saturday
    expect(result).toBe('Saturday, March 28')
  })
})

describe('formatEventDateShort', () => {
  it('returns short month + day', () => {
    const result = formatEventDateShort(UTC_DATE)
    expect(result).toBe('Mar 28')
  })
})

describe('groupEventsByDate', () => {
  it('groups events by CT date string', () => {
    const events = [
      makeEvent({ date: '2026-03-28T19:30:00.000Z' }),
      makeEvent({ id: '2', date: '2026-03-28T22:00:00.000Z' }),
      makeEvent({ id: '3', date: '2026-03-29T19:30:00.000Z' }),
    ]
    const groups = groupEventsByDate(events)
    expect(groups.size).toBe(2)
    const keys = Array.from(groups.keys())
    expect(keys[0]).toBe('Saturday, March 28')
    expect(keys[1]).toBe('Sunday, March 29')
    expect(groups.get('Saturday, March 28')).toHaveLength(2)
    expect(groups.get('Sunday, March 29')).toHaveLength(1)
  })

  it('returns empty map for empty array', () => {
    expect(groupEventsByDate([])).toEqual(new Map())
  })
})

describe('isToday', () => {
  beforeEach(() => {
    // Mock Date to 2026-03-28T20:00:00Z (3 PM CT)
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-28T20:00:00.000Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns true for an event today', () => {
    expect(isToday('2026-03-28T19:30:00.000Z')).toBe(true)
  })

  it('returns false for tomorrow', () => {
    expect(isToday('2026-03-29T19:30:00.000Z')).toBe(false)
  })

  it('returns false for yesterday', () => {
    expect(isToday('2026-03-27T19:30:00.000Z')).toBe(false)
  })
})

describe('isWithinNextDays', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-28T20:00:00.000Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns true for event within next 7 days', () => {
    expect(isWithinNextDays('2026-04-02T19:30:00.000Z', 7)).toBe(true)
  })

  it('returns false for event beyond next 7 days', () => {
    expect(isWithinNextDays('2026-04-06T19:30:00.000Z', 7)).toBe(false)
  })

  it('returns true for today', () => {
    expect(isWithinNextDays('2026-03-28T23:00:00.000Z', 7)).toBe(true)
  })
})

describe('cn', () => {
  it('joins class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('filters out falsy values', () => {
    expect(cn('foo', null, undefined, false, 'bar')).toBe('foo bar')
  })

  it('handles empty input', () => {
    expect(cn()).toBe('')
  })
})
