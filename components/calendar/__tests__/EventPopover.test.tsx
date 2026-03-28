import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EventPopover } from '../EventPopover'
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

const mockEvent: SportEvent = {
  id: '1',
  name: 'Kansas City Chiefs at San Francisco 49ers',
  shortName: 'KC @ SF',
  sport: 'nfl',
  league: 'NFL',
  date: '2026-03-28T23:30:00.000Z',
  status: 'scheduled',
  homeTeam: { id: 'sf', name: 'San Francisco 49ers', abbreviation: 'SF', logo: '' },
  awayTeam: { id: 'kc', name: 'Kansas City Chiefs', abbreviation: 'KC', logo: '' },
  venue: "Levi's Stadium",
  network: 'FOX',
  isMajorEvent: false,
  notes: 'Playoff game',
}

describe('EventPopover', () => {
  it('renders nothing when event is null', () => {
    const { container } = render(<EventPopover event={null} onClose={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders event details when event provided', () => {
    render(<EventPopover event={mockEvent} onClose={vi.fn()} />)
    expect(screen.getByText('San Francisco 49ers')).toBeInTheDocument()
    expect(screen.getByText('Kansas City Chiefs')).toBeInTheDocument()
  })

  it('renders venue and network', () => {
    render(<EventPopover event={mockEvent} onClose={vi.fn()} />)
    expect(screen.getByText("Levi's Stadium")).toBeInTheDocument()
    expect(screen.getByText('FOX')).toBeInTheDocument()
  })

  it('renders notes', () => {
    render(<EventPopover event={mockEvent} onClose={vi.fn()} />)
    expect(screen.getByText('Playoff game')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<EventPopover event={mockEvent} onClose={onClose} />)
    fireEvent.click(screen.getByLabelText('Close event details'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop clicked', () => {
    const onClose = vi.fn()
    render(<EventPopover event={mockEvent} onClose={onClose} />)
    const backdrop = document.querySelector('[aria-hidden="true"]')
    if (backdrop) fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape pressed', () => {
    const onClose = vi.fn()
    render(<EventPopover event={mockEvent} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders MAJOR badge when isMajorEvent', () => {
    render(<EventPopover event={{ ...mockEvent, isMajorEvent: true }} onClose={vi.fn()} />)
    expect(screen.getByText('MAJOR')).toBeInTheDocument()
  })

  it('has dialog role for accessibility', () => {
    render(<EventPopover event={mockEvent} onClose={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
