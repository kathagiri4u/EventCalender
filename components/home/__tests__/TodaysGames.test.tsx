import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodaysGames } from '../TodaysGames'
import type { SportEvent } from '@/types'

const makeEvent = (overrides: Partial<SportEvent> = {}): SportEvent => ({
  id: '1',
  name: 'Test Game',
  shortName: 'TST @ TST',
  sport: 'nfl',
  league: 'NFL',
  date: '2026-03-28T19:30:00.000Z',
  status: 'scheduled',
  homeTeam: { id: 'h', name: 'Home', abbreviation: 'HME', logo: '' },
  awayTeam: { id: 'a', name: 'Away', abbreviation: 'AWY', logo: '' },
  isMajorEvent: false,
  ...overrides,
})

describe('TodaysGames', () => {
  it('renders empty state when no events', () => {
    render(<TodaysGames events={[]} />)
    expect(screen.getByText(/no games today/i)).toBeInTheDocument()
  })

  it('renders event chips when events provided', () => {
    const events = [
      makeEvent({ id: '1', shortName: 'KC @ SF' }),
      makeEvent({ id: '2', shortName: 'LAL @ BOS', sport: 'nba' }),
    ]
    render(<TodaysGames events={events} />)
    expect(screen.getByText('KC @ SF')).toBeInTheDocument()
    expect(screen.getByText('LAL @ BOS')).toBeInTheDocument()
  })

  it('renders section heading', () => {
    render(<TodaysGames events={[makeEvent()]} />)
    expect(screen.getByText("Today's Games")).toBeInTheDocument()
  })
})
