import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { EventPopover } from '../EventPopover'
import type { SportEvent } from '@/types'

type OnDragEndFn = (_e: unknown, _info: { offset: { x: number; y: number } }) => void
let capturedOnDragEnd: OnDragEndFn | undefined

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, drag: _drag, onDragEnd, ...props }: React.HTMLAttributes<HTMLDivElement> & {
      drag?: string
      onDragEnd?: OnDragEndFn
    }) => {
      capturedOnDragEnd = onDragEnd
      return <div {...props}>{children}</div>
    },
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

  it('calls onClose when dragged down more than 60px', () => {
    const onClose = vi.fn()
    render(<EventPopover event={mockEvent} onClose={onClose} />)
    act(() => {
      capturedOnDragEnd?.(null, { offset: { x: 0, y: 100 } })
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when dragged down less than 60px', () => {
    const onClose = vi.fn()
    render(<EventPopover event={mockEvent} onClose={onClose} />)
    act(() => {
      capturedOnDragEnd?.(null, { offset: { x: 0, y: 30 } })
    })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders MAJOR badge when isMajorEvent', () => {
    render(<EventPopover event={{ ...mockEvent, isMajorEvent: true }} onClose={vi.fn()} />)
    expect(screen.getByText('MAJOR')).toBeInTheDocument()
  })

  it('has dialog role for accessibility', () => {
    render(<EventPopover event={mockEvent} onClose={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders team logos when provided', () => {
    const event = {
      ...mockEvent,
      homeTeam: { ...mockEvent.homeTeam, logo: 'https://example.com/sf.png' },
      awayTeam: { ...mockEvent.awayTeam, logo: 'https://example.com/kc.png' },
    }
    render(<EventPopover event={event} onClose={vi.fn()} />)
    const imgs = screen.getAllByRole('img')
    expect(imgs.some((img) => img.getAttribute('src') === 'https://example.com/sf.png')).toBe(true)
  })

  it('renders team records when provided', () => {
    const event = {
      ...mockEvent,
      homeTeam: { ...mockEvent.homeTeam, record: '12-5' },
      awayTeam: { ...mockEvent.awayTeam, record: '10-7' },
    }
    render(<EventPopover event={event} onClose={vi.fn()} />)
    expect(screen.getByText('12-5')).toBeInTheDocument()
    expect(screen.getByText('10-7')).toBeInTheDocument()
  })
})
