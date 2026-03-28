import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MajorEventsToggle } from '../MajorEventsToggle'
import { useFilters, DEFAULT_FILTERS } from '@/store/useFilters'

beforeEach(() => {
  useFilters.setState(DEFAULT_FILTERS)
})

describe('MajorEventsToggle', () => {
  it('renders label', () => {
    render(<MajorEventsToggle />)
    expect(screen.getByText('Major Events Only')).toBeInTheDocument()
  })

  it('is unchecked by default', () => {
    render(<MajorEventsToggle />)
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles to checked on click', () => {
    render(<MajorEventsToggle />)
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    expect(useFilters.getState().majorEventsOnly).toBe(true)
  })

  it('toggles back to unchecked on second click', () => {
    render(<MajorEventsToggle />)
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })
})
