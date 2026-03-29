import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EventList } from '../EventList'
import type { SportEvent } from '@/types'

const makeEvent = (id: string, date = '2026-03-28T19:30:00.000Z'): SportEvent => ({
  id,
  name: `Event ${id}`,
  shortName: `E${id}`,
  sport: 'nfl',
  league: 'NFL',
  date,
  status: 'scheduled',
  homeTeam: { id: 'h', name: 'Home Team', abbreviation: 'HME', logo: '' },
  awayTeam: { id: 'a', name: 'Away Team', abbreviation: 'AWY', logo: '' },
  isMajorEvent: false,
})

describe('EventList', () => {
  it('renders empty state when no events', () => {
    render(
      <EventList events={[]} page={1} totalPages={1} totalItems={0} onPageChange={vi.fn()} />
    )
    expect(screen.getByText(/no events match/i)).toBeInTheDocument()
  })

  it('renders events with total count', () => {
    const events = [makeEvent('1'), makeEvent('2')]
    render(
      <EventList events={events} page={1} totalPages={1} totalItems={2} onPageChange={vi.fn()} />
    )
    expect(screen.getByText('2 events found')).toBeInTheDocument()
  })

  it('renders pagination when totalPages > 1', () => {
    render(
      <EventList
        events={[makeEvent('1')]}
        page={1}
        totalPages={3}
        totalItems={75}
        onPageChange={vi.fn()}
      />
    )
    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument()
  })

  it('does not render pagination when single page', () => {
    render(
      <EventList events={[makeEvent('1')]} page={1} totalPages={1} totalItems={1} onPageChange={vi.fn()} />
    )
    expect(screen.queryByRole('navigation', { name: /pagination/i })).not.toBeInTheDocument()
  })

  it('calls onPageChange with next page on Next click', () => {
    const onPageChange = vi.fn()
    render(
      <EventList
        events={[makeEvent('1')]}
        page={1}
        totalPages={3}
        totalItems={75}
        onPageChange={onPageChange}
      />
    )
    fireEvent.click(screen.getByText('Next →'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('disables Prev button on first page', () => {
    render(
      <EventList events={[makeEvent('1')]} page={1} totalPages={3} totalItems={75} onPageChange={vi.fn()} />
    )
    expect(screen.getByText('← Prev')).toBeDisabled()
  })

  it('disables Next button on last page', () => {
    render(
      <EventList events={[makeEvent('1')]} page={3} totalPages={3} totalItems={75} onPageChange={vi.fn()} />
    )
    expect(screen.getByText('Next →')).toBeDisabled()
  })

  it('shows singular "1 event found"', () => {
    render(
      <EventList events={[makeEvent('1')]} page={1} totalPages={1} totalItems={1} onPageChange={vi.fn()} />
    )
    expect(screen.getByText('1 event found')).toBeInTheDocument()
  })

  it('calls onPageChange with previous page on Prev click', () => {
    const onPageChange = vi.fn()
    render(
      <EventList
        events={[makeEvent('1')]}
        page={2}
        totalPages={3}
        totalItems={75}
        onPageChange={onPageChange}
      />
    )
    fireEvent.click(screen.getByText('← Prev'))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })
})
