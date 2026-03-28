import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SportFilter } from '../SportFilter'
import { useFilters, DEFAULT_FILTERS } from '@/store/useFilters'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/schedule',
}))

beforeEach(() => {
  useFilters.setState(DEFAULT_FILTERS)
})

describe('SportFilter', () => {
  it('renders All pill', () => {
    render(<SportFilter />)
    expect(screen.getByText('All')).toBeInTheDocument()
  })

  it('renders all sport pills', () => {
    render(<SportFilter />)
    expect(screen.getByText('NFL')).toBeInTheDocument()
    expect(screen.getByText('NBA')).toBeInTheDocument()
    expect(screen.getByText('NASCAR')).toBeInTheDocument()
  })

  it('clicking NFL sets selectedSport to nfl', () => {
    render(<SportFilter />)
    fireEvent.click(screen.getByText('NFL'))
    expect(useFilters.getState().selectedSport).toBe('nfl')
  })

  it('clicking All resets selectedSport', () => {
    useFilters.setState({ ...DEFAULT_FILTERS, selectedSport: 'nfl' })
    render(<SportFilter />)
    fireEvent.click(screen.getByText('All'))
    expect(useFilters.getState().selectedSport).toBe('all')
  })

  it('selecting sport resets league to all', () => {
    useFilters.setState({ ...DEFAULT_FILTERS, selectedLeague: 'Premier League' })
    render(<SportFilter />)
    fireEvent.click(screen.getByText('NBA'))
    expect(useFilters.getState().selectedLeague).toBe('all')
  })
})
