import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { filterEvents, sortEvents, paginateEvents, searchEvents } from '../filters'
import type { SportEvent, FilterState } from '@/types'
import { DEFAULT_FILTERS } from '@/store/useFilters'

function makeEvent(overrides: Partial<SportEvent> = {}): SportEvent {
  return {
    id: '1',
    name: 'Test Game',
    shortName: 'TST @ TST',
    sport: 'nfl',
    league: 'NFL',
    date: '2026-03-28T19:30:00.000Z',
    status: 'scheduled',
    homeTeam: { id: 'h', name: 'Home Team', abbreviation: 'HME', logo: '' },
    awayTeam: { id: 'a', name: 'Away Team', abbreviation: 'AWY', logo: '' },
    isMajorEvent: false,
    ...overrides,
  }
}

const BASE_FILTERS: FilterState = { ...DEFAULT_FILTERS, dateRange: 'custom' }

describe('filterEvents', () => {
  it('returns all events when no filters active (custom range, no bounds)', () => {
    const events = [makeEvent({ id: '1' }), makeEvent({ id: '2' })]
    const result = filterEvents(events, BASE_FILTERS)
    expect(result).toHaveLength(2)
  })

  it('filters by sport', () => {
    const events = [
      makeEvent({ id: '1', sport: 'nfl' }),
      makeEvent({ id: '2', sport: 'nba' }),
    ]
    const filters: FilterState = { ...BASE_FILTERS, selectedSport: 'nfl' }
    expect(filterEvents(events, filters)).toHaveLength(1)
    expect(filterEvents(events, filters)[0].sport).toBe('nfl')
  })

  it('filters by league', () => {
    const events = [
      makeEvent({ id: '1', sport: 'soccer', league: 'Premier League' }),
      makeEvent({ id: '2', sport: 'soccer', league: 'La Liga' }),
    ]
    const filters: FilterState = { ...BASE_FILTERS, selectedSport: 'soccer', selectedLeague: 'Premier League' }
    expect(filterEvents(events, filters)).toHaveLength(1)
  })

  it('filters major events only', () => {
    const events = [
      makeEvent({ id: '1', isMajorEvent: true }),
      makeEvent({ id: '2', isMajorEvent: false }),
    ]
    const filters: FilterState = { ...BASE_FILTERS, majorEventsOnly: true }
    expect(filterEvents(events, filters)).toHaveLength(1)
    expect(filterEvents(events, filters)[0].isMajorEvent).toBe(true)
  })

  it('filters by search query on event name', () => {
    const events = [
      makeEvent({ id: '1', name: 'Kansas City Chiefs at SF 49ers' }),
      makeEvent({ id: '2', name: 'Lakers vs Celtics' }),
    ]
    const filters: FilterState = { ...BASE_FILTERS, searchQuery: 'chiefs' }
    expect(filterEvents(events, filters)).toHaveLength(1)
    expect(filterEvents(events, filters)[0].name).toContain('Chiefs')
  })

  it('filters by search query on team name', () => {
    const events = [
      makeEvent({ id: '1', homeTeam: { id: 'kc', name: 'Kansas City Chiefs', abbreviation: 'KC', logo: '' } }),
      makeEvent({ id: '2', homeTeam: { id: 'sf', name: 'San Francisco 49ers', abbreviation: 'SF', logo: '' } }),
    ]
    const filters: FilterState = { ...BASE_FILTERS, searchQuery: 'san francisco' }
    expect(filterEvents(events, filters)).toHaveLength(1)
  })

  it('filters by custom date start', () => {
    const events = [
      makeEvent({ id: '1', date: '2026-03-28T19:30:00.000Z' }),
      makeEvent({ id: '2', date: '2026-03-25T19:30:00.000Z' }),
    ]
    const filters: FilterState = { ...BASE_FILTERS, customDateStart: '2026-03-27' }
    const result = filterEvents(events, filters)
    expect(result.every((e) => e.date >= '2026-03-27')).toBe(true)
  })

  it('returns all for empty search query', () => {
    const events = [makeEvent({ id: '1' }), makeEvent({ id: '2' })]
    const filters: FilterState = { ...BASE_FILTERS, searchQuery: '' }
    expect(filterEvents(events, filters)).toHaveLength(2)
  })
})

describe('filterEvents — this_week date range', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-28T12:00:00.000Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('includes events within the next 7 days', () => {
    const events = [
      makeEvent({ id: '1', date: '2026-03-28T19:30:00.000Z' }), // today
      makeEvent({ id: '2', date: '2026-04-04T19:30:00.000Z' }), // 7 days later
      makeEvent({ id: '3', date: '2026-04-06T19:30:00.000Z' }), // 9 days later
    ]
    const filters: FilterState = { ...BASE_FILTERS, dateRange: 'this_week' }
    const result = filterEvents(events, filters)
    expect(result.length).toBeLessThanOrEqual(2)
  })
})

describe('sortEvents', () => {
  const events = [
    makeEvent({ id: '1', date: '2026-03-29T19:30:00.000Z' }),
    makeEvent({ id: '2', date: '2026-03-28T19:30:00.000Z' }),
    makeEvent({ id: '3', date: '2026-03-30T19:30:00.000Z' }),
  ]

  it('sorts asc (soonest first)', () => {
    const sorted = sortEvents(events, 'asc')
    expect(sorted[0].id).toBe('2')
    expect(sorted[2].id).toBe('3')
  })

  it('sorts desc (latest first)', () => {
    const sorted = sortEvents(events, 'desc')
    expect(sorted[0].id).toBe('3')
    expect(sorted[2].id).toBe('2')
  })

  it('does not mutate input array', () => {
    const original = [...events]
    sortEvents(events, 'desc')
    expect(events).toEqual(original)
  })
})

describe('paginateEvents', () => {
  const events = Array.from({ length: 60 }, (_, i) =>
    makeEvent({ id: String(i + 1), date: `2026-03-${String(i + 1).padStart(2, '0')}T19:00:00.000Z` })
  )

  it('returns first 25 on page 1', () => {
    const { items, totalPages, totalItems } = paginateEvents(events, 1)
    expect(items).toHaveLength(25)
    expect(totalPages).toBe(3)
    expect(totalItems).toBe(60)
  })

  it('returns correct items on page 2', () => {
    const { items } = paginateEvents(events, 2)
    expect(items).toHaveLength(25)
    expect(items[0].id).toBe('26')
  })

  it('returns remaining items on last page', () => {
    const { items } = paginateEvents(events, 3)
    expect(items).toHaveLength(10)
  })

  it('clamps page to valid range', () => {
    const { items } = paginateEvents(events, 99)
    expect(items.length).toBeGreaterThan(0)
  })

  it('handles empty array', () => {
    const { items, totalPages, totalItems } = paginateEvents([], 1)
    expect(items).toHaveLength(0)
    expect(totalPages).toBe(1)
    expect(totalItems).toBe(0)
  })

  it('uses custom perPage', () => {
    const { items, totalPages } = paginateEvents(events, 1, 10)
    expect(items).toHaveLength(10)
    expect(totalPages).toBe(6)
  })
})

describe('searchEvents', () => {
  const events = [
    makeEvent({ id: '1', name: 'Kansas City Chiefs at SF 49ers', venue: 'Levi Stadium' }),
    makeEvent({
      id: '2',
      name: 'Lakers vs Celtics',
      homeTeam: { id: 'bos', name: 'Boston Celtics', abbreviation: 'BOS', logo: '' },
    }),
  ]

  it('returns all events for empty query', () => {
    expect(searchEvents(events, '')).toHaveLength(2)
  })

  it('matches on event name', () => {
    expect(searchEvents(events, 'chiefs')).toHaveLength(1)
  })

  it('matches on venue', () => {
    expect(searchEvents(events, 'levi')).toHaveLength(1)
  })

  it('matches case-insensitive', () => {
    expect(searchEvents(events, 'CELTICS')).toHaveLength(1)
  })

  it('returns empty for no match', () => {
    expect(searchEvents(events, 'zzz_no_match')).toHaveLength(0)
  })
})
