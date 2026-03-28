import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StandingsCard } from '../StandingsCard'
import type { SportStandings } from '@/types'

const nflStandings: SportStandings = {
  sport: 'nfl',
  lastUpdated: '2026-03-28T00:00:00.000Z',
  entries: [
    {
      rank: 1,
      team: { id: 'kc', name: 'Kansas City Chiefs', abbreviation: 'KC', logo: '' },
      wins: 15,
      losses: 2,
    },
    {
      rank: 2,
      team: { id: 'sf', name: 'San Francisco 49ers', abbreviation: 'SF', logo: '' },
      wins: 12,
      losses: 5,
    },
    {
      rank: 3,
      team: { id: 'buf', name: 'Buffalo Bills', abbreviation: 'BUF', logo: '' },
      wins: 11,
      losses: 6,
    },
  ],
}

describe('StandingsCard', () => {
  it('renders top 3 teams', () => {
    render(<StandingsCard sport="nfl" standings={nflStandings} />)
    expect(screen.getByText('Kansas City Chiefs')).toBeInTheDocument()
    expect(screen.getByText('San Francisco 49ers')).toBeInTheDocument()
    expect(screen.getByText('Buffalo Bills')).toBeInTheDocument()
  })

  it('renders win-loss records', () => {
    render(<StandingsCard sport="nfl" standings={nflStandings} />)
    expect(screen.getByText('15-2')).toBeInTheDocument()
    expect(screen.getByText('12-5')).toBeInTheDocument()
  })

  it('renders section heading', () => {
    render(<StandingsCard sport="nfl" standings={nflStandings} />)
    expect(screen.getByText(/NFL Standings/i)).toBeInTheDocument()
  })

  it('returns null for sports without standings (UFC)', () => {
    const { container } = render(<StandingsCard sport="ufc" standings={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when standings is undefined', () => {
    const { container } = render(<StandingsCard sport="nfl" standings={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when entries is empty', () => {
    const empty = { ...nflStandings, entries: [] }
    const { container } = render(<StandingsCard sport="nfl" standings={empty} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders ties when present', () => {
    const withTies = {
      ...nflStandings,
      entries: [{ ...nflStandings.entries[0], ties: 1 }],
    }
    render(<StandingsCard sport="nfl" standings={withTies} />)
    expect(screen.getByText('15-2-1')).toBeInTheDocument()
  })

  it('renders abbreviation avatar when no logo', () => {
    render(<StandingsCard sport="nfl" standings={nflStandings} />)
    expect(screen.getByText('KC')).toBeInTheDocument()
  })
})
