import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HeroBanner } from '../HeroBanner'
import type { SportEvent } from '@/types'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, drag: _drag, onDragEnd: _onDragEnd, ...props }: React.HTMLAttributes<HTMLDivElement> & {
      drag?: string
      onDragEnd?: (_e: unknown, _info: { offset: { x: number; y: number } }) => void
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const makeEvent = (id: string, sport: SportEvent['sport'] = 'nfl'): SportEvent => ({
  id,
  name: `Event ${id}`,
  shortName: `E${id}`,
  sport,
  league: 'NFL',
  date: '2026-03-28T19:30:00.000Z',
  status: 'scheduled',
  homeTeam: { id: 'h', name: `Home ${id}`, abbreviation: 'HME', logo: '' },
  awayTeam: { id: 'a', name: `Away ${id}`, abbreviation: 'AWY', logo: '' },
  isMajorEvent: false,
})

describe('HeroBanner', () => {
  it('renders nothing when no events', () => {
    const { container } = render(<HeroBanner events={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders current event team names', () => {
    render(<HeroBanner events={[makeEvent('1')]} />)
    expect(screen.getByText('Home 1')).toBeInTheDocument()
    expect(screen.getByText('Away 1')).toBeInTheDocument()
  })

  it('shows VS separator', () => {
    render(<HeroBanner events={[makeEvent('1')]} />)
    expect(screen.getByText('VS')).toBeInTheDocument()
  })

  it('shows CT time', () => {
    render(<HeroBanner events={[makeEvent('1')]} />)
    expect(screen.getByText(/CT$/i)).toBeInTheDocument()
  })

  it('renders prev/next arrows for multiple events', () => {
    render(<HeroBanner events={[makeEvent('1'), makeEvent('2'), makeEvent('3')]} />)
    expect(screen.getByLabelText('Previous event')).toBeInTheDocument()
    expect(screen.getByLabelText('Next event')).toBeInTheDocument()
  })

  it('does not render arrows for single event', () => {
    render(<HeroBanner events={[makeEvent('1')]} />)
    expect(screen.queryByLabelText('Previous event')).not.toBeInTheDocument()
  })

  it('navigates to next event on next arrow click', () => {
    render(<HeroBanner events={[makeEvent('1'), makeEvent('2')]} />)
    expect(screen.getByText('Home 1')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Next event'))
    expect(screen.getByText('Home 2')).toBeInTheDocument()
  })

  it('shows MAJOR badge for major events', () => {
    render(<HeroBanner events={[{ ...makeEvent('1'), isMajorEvent: true }]} />)
    expect(screen.getByText('MAJOR')).toBeInTheDocument()
  })
})
