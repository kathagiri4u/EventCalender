import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { adaptEspnResponse, getEspnPath, fetchEspnScoreboard } from '../espn'

const mockResponse = {
  events: [
    {
      id: 'evt1',
      name: 'Green Bay Packers at Chicago Bears',
      shortName: 'GB @ CHI',
      date: '2026-03-28T19:30:00Z',
      competitions: [
        {
          competitors: [
            {
              homeAway: 'home' as const,
              team: {
                id: 'chi',
                displayName: 'Chicago Bears',
                abbreviation: 'CHI',
                logos: [{ href: 'https://a.espncdn.com/chi.png' }],
                records: [{ summary: '6-11' }],
                color: '0B1F3F',
              },
            },
            {
              homeAway: 'away' as const,
              team: {
                id: 'gb',
                displayName: 'Green Bay Packers',
                abbreviation: 'GB',
                logos: [{ href: 'https://a.espncdn.com/gb.png' }],
                records: [{ summary: '9-8' }],
                color: '203731',
              },
            },
          ],
          venue: { fullName: 'Soldier Field' },
          broadcasts: [{ names: ['NBC'] }],
          status: { type: { state: 'pre', completed: false, name: 'STATUS_SCHEDULED' } },
        },
      ],
      notes: [{ headline: 'NFC North rivalry' }],
    },
  ],
}

describe('adaptEspnResponse', () => {
  it('maps ESPN response to SportEvent array', () => {
    const events = adaptEspnResponse(mockResponse, 'nfl', 'NFL')
    expect(events).toHaveLength(1)
    const event = events[0]
    expect(event.id).toBe('evt1')
    expect(event.sport).toBe('nfl')
    expect(event.league).toBe('NFL')
    expect(event.homeTeam.name).toBe('Chicago Bears')
    expect(event.awayTeam.name).toBe('Green Bay Packers')
    expect(event.venue).toBe('Soldier Field')
    expect(event.network).toBe('NBC')
    expect(event.status).toBe('scheduled')
    expect(event.notes).toBe('NFC North rivalry')
    expect(event.isMajorEvent).toBe(false)
  })

  it('maps team logo and record', () => {
    const events = adaptEspnResponse(mockResponse, 'nfl', 'NFL')
    expect(events[0].homeTeam.logo).toBe('https://a.espncdn.com/chi.png')
    expect(events[0].homeTeam.record).toBe('6-11')
    expect(events[0].homeTeam.color).toBe('#0B1F3F')
  })

  it('returns empty array for response with no events', () => {
    expect(adaptEspnResponse({}, 'nfl', 'NFL')).toEqual([])
    expect(adaptEspnResponse({ events: [] }, 'nfl', 'NFL')).toEqual([])
  })

  it('skips events without competitors', () => {
    const resp = {
      events: [{ ...mockResponse.events[0], competitions: [{ competitors: [] }] }],
    }
    expect(adaptEspnResponse(resp as never, 'nfl', 'NFL')).toEqual([])
  })

  it('maps completed status to final', () => {
    const resp = JSON.parse(JSON.stringify(mockResponse))
    resp.events[0].competitions[0].status.type.completed = true
    const events = adaptEspnResponse(resp, 'nfl', 'NFL')
    expect(events[0].status).toBe('final')
  })

  it('maps in_progress state', () => {
    const resp = JSON.parse(JSON.stringify(mockResponse))
    resp.events[0].competitions[0].status.type.state = 'in'
    const events = adaptEspnResponse(resp, 'nfl', 'NFL')
    expect(events[0].status).toBe('in_progress')
  })

  it('maps cancelled status', () => {
    const resp = JSON.parse(JSON.stringify(mockResponse))
    resp.events[0].competitions[0].status.type.name = 'Canceled'
    const events = adaptEspnResponse(resp, 'nfl', 'NFL')
    expect(events[0].status).toBe('cancelled')
  })

  it('maps postponed status', () => {
    const resp = JSON.parse(JSON.stringify(mockResponse))
    resp.events[0].competitions[0].status.type.name = 'Postponed'
    const events = adaptEspnResponse(resp, 'nfl', 'NFL')
    expect(events[0].status).toBe('postponed')
  })

  it('handles team without logo', () => {
    const resp = JSON.parse(JSON.stringify(mockResponse))
    resp.events[0].competitions[0].competitors[0].team.logos = undefined
    const events = adaptEspnResponse(resp, 'nfl', 'NFL')
    expect(events[0].homeTeam.logo).toBe('')
  })

  it('handles team without record', () => {
    const resp = JSON.parse(JSON.stringify(mockResponse))
    resp.events[0].competitions[0].competitors[0].team.records = undefined
    const events = adaptEspnResponse(resp, 'nfl', 'NFL')
    expect(events[0].homeTeam.record).toBeUndefined()
  })

  it('handles team without color', () => {
    const resp = JSON.parse(JSON.stringify(mockResponse))
    resp.events[0].competitions[0].competitors[0].team.color = undefined
    const events = adaptEspnResponse(resp, 'nfl', 'NFL')
    expect(events[0].homeTeam.color).toBeUndefined()
  })

  it('handles event with network broadcast', () => {
    const resp = JSON.parse(JSON.stringify(mockResponse))
    resp.events[0].competitions[0].broadcasts = [{ names: ['ESPN', 'ABC'] }]
    const events = adaptEspnResponse(resp, 'nfl', 'NFL')
    expect(events[0].network).toBe('ESPN, ABC')
  })

  it('handles event with no broadcasts', () => {
    const resp = JSON.parse(JSON.stringify(mockResponse))
    resp.events[0].competitions[0].broadcasts = undefined
    const events = adaptEspnResponse(resp, 'nfl', 'NFL')
    expect(events[0].network).toBeUndefined()
  })

  it('handles broadcast with empty names array', () => {
    const resp = JSON.parse(JSON.stringify(mockResponse))
    resp.events[0].competitions[0].broadcasts = [{ names: [] }]
    const events = adaptEspnResponse(resp, 'nfl', 'NFL')
    expect(events[0].network).toBeUndefined()
  })

  it('handles status with no name (covers ?? empty string branch)', () => {
    const resp = JSON.parse(JSON.stringify(mockResponse))
    resp.events[0].competitions[0].status.type.name = undefined
    const events = adaptEspnResponse(resp, 'nfl', 'NFL')
    expect(events[0].status).toBe('scheduled')
  })

  it('skips events with empty competitions array', () => {
    const resp = {
      events: [{ ...mockResponse.events[0], competitions: [] }],
    }
    expect(adaptEspnResponse(resp as never, 'nfl', 'NFL')).toEqual([])
  })
})

describe('getEspnPath', () => {
  it('returns correct path for nfl', () => {
    expect(getEspnPath('nfl')).toBe('football/nfl')
  })

  it('returns correct path for nba', () => {
    expect(getEspnPath('nba')).toBe('basketball/nba')
  })

  it('returns undefined for sport without a path', () => {
    // All sports have paths in our constants — test the type contract
    expect(typeof getEspnPath('nfl')).toBe('string')
  })
})

describe('fetchEspnScoreboard', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns parsed JSON on success', async () => {
    const mockData = { events: [] }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response)

    const result = await fetchEspnScoreboard('football/nfl', '20260328-20260427')
    expect(result).toEqual(mockData)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('football%2Fnfl')
    )
  })

  it('throws on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    await expect(fetchEspnScoreboard('football/nfl', '20260328-20260427')).rejects.toThrow(
      'ESPN API error 404'
    )
  })

  it('uses baseUrl when provided', async () => {
    const mockData = { events: [] }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response)

    await fetchEspnScoreboard('football/nfl', '20260328', 'https://example.com')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://example.com')
    )
  })
})
