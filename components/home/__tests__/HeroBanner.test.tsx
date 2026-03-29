import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { HeroBanner, heroBannerVariants } from '../HeroBanner'
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

describe('heroBannerVariants', () => {
  it('enter returns positive x for forward direction', () => {
    expect(heroBannerVariants.enter(1)).toEqual({ x: '60%', opacity: 0 })
  })

  it('enter returns negative x for backward direction', () => {
    expect(heroBannerVariants.enter(-1)).toEqual({ x: '-60%', opacity: 0 })
  })

  it('exit returns negative x for forward direction', () => {
    expect(heroBannerVariants.exit(1)).toEqual({ x: '-60%', opacity: 0 })
  })

  it('exit returns positive x for backward direction', () => {
    expect(heroBannerVariants.exit(-1)).toEqual({ x: '60%', opacity: 0 })
  })
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

  it('navigates to previous event on prev arrow click', () => {
    render(<HeroBanner events={[makeEvent('1'), makeEvent('2')]} />)
    fireEvent.click(screen.getByLabelText('Next event'))
    expect(screen.getByText('Home 2')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Previous event'))
    expect(screen.getByText('Home 1')).toBeInTheDocument()
  })

  it('navigates via dot buttons', () => {
    render(<HeroBanner events={[makeEvent('1'), makeEvent('2'), makeEvent('3')]} />)
    const dots = screen.getAllByLabelText(/Go to event/i)
    fireEvent.click(dots[2])
    expect(screen.getByText('Home 3')).toBeInTheDocument()
  })

  it('shows MAJOR badge for major events', () => {
    render(<HeroBanner events={[{ ...makeEvent('1'), isMajorEvent: true }]} />)
    expect(screen.getByText('MAJOR')).toBeInTheDocument()
  })

  it('renders team abbreviation avatar when no logo', () => {
    render(<HeroBanner events={[makeEvent('1')]} />)
    expect(screen.getByText('HME')).toBeInTheDocument()
    expect(screen.getByText('AWY')).toBeInTheDocument()
  })

  it('renders team logo image when logo is provided', () => {
    const event = {
      ...makeEvent('1'),
      homeTeam: { id: 'h', name: 'Home 1', abbreviation: 'HME', logo: 'https://example.com/home.png' },
      awayTeam: { id: 'a', name: 'Away 1', abbreviation: 'AWY', logo: 'https://example.com/away.png' },
    }
    render(<HeroBanner events={[event]} />)
    const imgs = screen.getAllByRole('img')
    expect(imgs.some((img) => img.getAttribute('src') === 'https://example.com/home.png')).toBe(true)
    expect(imgs.some((img) => img.getAttribute('src') === 'https://example.com/away.png')).toBe(true)
  })

  it('advances to next event on left swipe (drag left > 60px)', () => {
    render(<HeroBanner events={[makeEvent('1'), makeEvent('2')]} />)
    act(() => {
      capturedOnDragEnd?.(null, { offset: { x: -100, y: 0 } })
    })
    expect(screen.getByText('Home 2')).toBeInTheDocument()
  })

  it('goes to previous event on right swipe (drag right > 60px)', () => {
    render(<HeroBanner events={[makeEvent('1'), makeEvent('2')]} />)
    fireEvent.click(screen.getByLabelText('Next event'))
    act(() => {
      capturedOnDragEnd?.(null, { offset: { x: 100, y: 0 } })
    })
    expect(screen.getByText('Home 1')).toBeInTheDocument()
  })

  it('does not change event on small drag', () => {
    render(<HeroBanner events={[makeEvent('1'), makeEvent('2')]} />)
    act(() => {
      capturedOnDragEnd?.(null, { offset: { x: -30, y: 0 } })
    })
    expect(screen.getByText('Home 1')).toBeInTheDocument()
  })

  it('shows venue when provided', () => {
    const event = { ...makeEvent('1'), venue: 'Arrowhead Stadium' }
    render(<HeroBanner events={[event]} />)
    expect(screen.getByText('Arrowhead Stadium')).toBeInTheDocument()
  })

  it('shows network when provided', () => {
    const event = { ...makeEvent('1'), network: 'ESPN' }
    render(<HeroBanner events={[event]} />)
    expect(screen.getByText('ESPN')).toBeInTheDocument()
  })

  it('shows team records when provided', () => {
    const event = {
      ...makeEvent('1'),
      homeTeam: { ...makeEvent('1').homeTeam, record: '10-5' },
      awayTeam: { ...makeEvent('1').awayTeam, record: '8-7' },
    }
    render(<HeroBanner events={[event]} />)
    expect(screen.getByText('10-5')).toBeInTheDocument()
    expect(screen.getByText('8-7')).toBeInTheDocument()
  })

  it('auto-advances to next event after 6 seconds', () => {
    vi.useFakeTimers()
    render(<HeroBanner events={[makeEvent('1'), makeEvent('2')]} />)
    expect(screen.getByText('Home 1')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(6000) })
    expect(screen.getByText('Home 2')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('clears interval on unmount', () => {
    vi.useFakeTimers()
    const { unmount } = render(<HeroBanner events={[makeEvent('1'), makeEvent('2')]} />)
    unmount()
    vi.useRealTimers()
  })

  it('navigates backward via dot at lower index', () => {
    render(<HeroBanner events={[makeEvent('1'), makeEvent('2'), makeEvent('3')]} />)
    // Advance to event 3
    fireEvent.click(screen.getByLabelText('Next event'))
    fireEvent.click(screen.getByLabelText('Next event'))
    expect(screen.getByText('Home 3')).toBeInTheDocument()
    // Click dot 0 (i=0 < index=2 → direction=-1)
    const dots = screen.getAllByLabelText(/Go to event/i)
    fireEvent.click(dots[0])
    expect(screen.getByText('Home 1')).toBeInTheDocument()
  })
})
