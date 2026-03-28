import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeaturedEvents } from '../FeaturedEvents'
import type { SportEvent } from '@/types'

const makeEvent = (id: string): SportEvent => ({
  id,
  name: `Event ${id}`,
  shortName: `E${id}`,
  sport: 'nfl',
  league: 'NFL',
  date: '2026-03-28T19:30:00.000Z',
  status: 'scheduled',
  homeTeam: { id: 'h', name: 'Home Team', abbreviation: 'HME', logo: '' },
  awayTeam: { id: 'a', name: 'Away Team', abbreviation: 'AWY', logo: '' },
  isMajorEvent: true,
})

describe('FeaturedEvents', () => {
  it('renders nothing when no events', () => {
    const { container } = render(<FeaturedEvents events={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders section heading', () => {
    render(<FeaturedEvents events={[makeEvent('1')]} />)
    expect(screen.getByText('Featured Events')).toBeInTheDocument()
  })

  it('renders See all link', () => {
    render(<FeaturedEvents events={[makeEvent('1')]} />)
    expect(screen.getByText('See all →')).toBeInTheDocument()
  })

  it('renders all provided events', () => {
    const events = [makeEvent('1'), makeEvent('2'), makeEvent('3')]
    render(<FeaturedEvents events={events} />)
    // Each event has team names rendered in EventCard
    expect(screen.getAllByText('Home Team')).toHaveLength(3)
  })
})
