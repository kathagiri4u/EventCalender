import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CalendarSkeleton } from '../CalendarSkeleton'

describe('CalendarSkeleton', () => {
  it('renders loading message', () => {
    render(<CalendarSkeleton />)
    expect(screen.getByLabelText(/loading calendar/i)).toBeInTheDocument()
  })

  it('renders skeleton grid elements', () => {
    const { container } = render(<CalendarSkeleton />)
    const animatedElements = container.querySelectorAll('.animate-pulse')
    expect(animatedElements.length).toBeGreaterThan(0)
  })
})
