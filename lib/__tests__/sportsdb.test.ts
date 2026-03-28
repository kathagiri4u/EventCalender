import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchTeamByName, getTeamLogoUrl, getVenuePhotoUrl } from '../sportsdb'

const mockTeam = {
  idTeam: '1234',
  strTeam: 'Chicago Bears',
  strTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/bears.png',
  strStadium: 'Soldier Field',
  strStadiumThumb: 'https://www.thesportsdb.com/images/media/team/stadium/solider.jpg',
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('fetchTeamByName', () => {
  it('returns team data on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ teams: [mockTeam] }),
    } as Response)

    const team = await fetchTeamByName('Chicago Bears')
    expect(team).not.toBeNull()
    expect(team?.strTeam).toBe('Chicago Bears')
  })

  it('returns null when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response)

    const team = await fetchTeamByName('Nonexistent Team')
    expect(team).toBeNull()
  })

  it('returns null when teams is null', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ teams: null }),
    } as Response)

    const team = await fetchTeamByName('Unknown')
    expect(team).toBeNull()
  })

  it('uses proxy URL when provided', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ teams: [mockTeam] }),
    } as Response)

    await fetchTeamByName('Chicago Bears', 'http://localhost:3000')
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.stringContaining('/api/sportsdb')
    )
  })
})

describe('getTeamLogoUrl', () => {
  it('returns badge URL', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ teams: [mockTeam] }),
    } as Response)

    const url = await getTeamLogoUrl('Chicago Bears')
    expect(url).toBe(mockTeam.strTeamBadge)
  })

  it('returns undefined when team not found', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response)

    const url = await getTeamLogoUrl('Unknown')
    expect(url).toBeUndefined()
  })
})

describe('getVenuePhotoUrl', () => {
  it('returns stadium thumbnail URL', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ teams: [mockTeam] }),
    } as Response)

    const url = await getVenuePhotoUrl('Chicago Bears')
    expect(url).toBe(mockTeam.strStadiumThumb)
  })

  it('returns undefined when team not found', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response)

    const url = await getVenuePhotoUrl('Unknown')
    expect(url).toBeUndefined()
  })
})
