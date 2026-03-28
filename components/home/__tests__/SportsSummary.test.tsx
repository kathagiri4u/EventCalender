import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SportsSummary } from '../SportsSummary'
import type { SportEvent } from '@/types'

const nflEvent: SportEvent = {
  id: '1',
  name: 'Test NFL',
  shortName: 'KC @ SF',
  sport: 'nfl',
  league: 'NFL',
  date: '2026-03-29T19:30:00.000Z',
  status: 'scheduled',
  homeTeam: { id: 'h', name: 'San Francisco 49ers', abbreviation: 'SF', logo: '' },
  awayTeam: { id: 'a', name: 'Kansas City Chiefs', abbreviation: 'KC', logo: '' },
  isMajorEvent: false,
}

describe('SportsSummary', () => {
  it('renders all sport cards', () => {
    render(<SportsSummary eventsBySport={{}} />)
    expect(screen.getByText('NFL')).toBeInTheDocument()
    expect(screen.getByText('NBA')).toBeInTheDocument()
    expect(screen.getByText('NASCAR')).toBeInTheDocument()
  })

  it('shows "No upcoming games" when sport has no event', () => {
    render(<SportsSummary eventsBySport={{}} />)
    const noGames = screen.getAllByText(/no upcoming games/i)
    expect(noGames.length).toBeGreaterThan(0)
  })

  it('shows next event details when sport has events', () => {
    render(<SportsSummary eventsBySport={{ nfl: nflEvent }} />)
    expect(screen.getByText('KC @ SF')).toBeInTheDocument()
  })

  it('renders section heading', () => {
    render(<SportsSummary eventsBySport={{}} />)
    expect(screen.getByText('Sports at a Glance')).toBeInTheDocument()
  })
})
