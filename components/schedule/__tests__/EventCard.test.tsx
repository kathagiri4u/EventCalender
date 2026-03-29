import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EventCard } from '../EventCard'
import type { SportEvent } from '@/types'

const mockEvent: SportEvent = {
  id: '1',
  name: 'Kansas City Chiefs at San Francisco 49ers',
  shortName: 'KC @ SF',
  sport: 'nfl',
  league: 'NFL',
  date: '2026-03-28T23:30:00.000Z',
  status: 'scheduled',
  homeTeam: {
    id: 'sf',
    name: 'San Francisco 49ers',
    abbreviation: 'SF',
    logo: '',
    record: '10-7',
  },
  awayTeam: {
    id: 'kc',
    name: 'Kansas City Chiefs',
    abbreviation: 'KC',
    logo: '',
    record: '15-2',
  },
  venue: "Levi's Stadium",
  network: 'FOX',
  isMajorEvent: false,
}

describe('EventCard', () => {
  it('renders team names', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('San Francisco 49ers')).toBeInTheDocument()
    expect(screen.getByText('Kansas City Chiefs')).toBeInTheDocument()
  })

  it('renders CT time with CT label', () => {
    render(<EventCard event={mockEvent} />)
    const timeEl = screen.getByText(/CT$/i)
    expect(timeEl).toBeInTheDocument()
  })

  it('renders venue', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText("Levi's Stadium")).toBeInTheDocument()
  })

  it('renders network', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('FOX')).toBeInTheDocument()
  })

  it('renders MAJOR badge when isMajorEvent', () => {
    render(<EventCard event={{ ...mockEvent, isMajorEvent: true }} />)
    expect(screen.getByText('MAJOR')).toBeInTheDocument()
  })

  it('does not render MAJOR badge for regular events', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.queryByText('MAJOR')).not.toBeInTheDocument()
  })

  it('renders abbreviation avatar when no logo', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('SF')).toBeInTheDocument()
    expect(screen.getByText('KC')).toBeInTheDocument()
  })

  it('links to sport page', () => {
    render(<EventCard event={mockEvent} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/sport/nfl')
  })

  it('renders team logo image when logo is provided', () => {
    const event = {
      ...mockEvent,
      homeTeam: { ...mockEvent.homeTeam, logo: 'https://example.com/sf.png' },
      awayTeam: { ...mockEvent.awayTeam, logo: 'https://example.com/kc.png' },
    }
    render(<EventCard event={event} />)
    const imgs = screen.getAllByRole('img')
    expect(imgs.some((img) => img.getAttribute('src') === 'https://example.com/sf.png')).toBe(true)
    expect(imgs.some((img) => img.getAttribute('src') === 'https://example.com/kc.png')).toBe(true)
  })
})
