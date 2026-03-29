import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CalendarLegend } from '../CalendarLegend'

describe('CalendarLegend', () => {
  it('renders legend with sport color labels', () => {
    render(<CalendarLegend />)
    expect(screen.getByLabelText(/legend/i)).toBeInTheDocument()
  })

  it('renders NFL sport label', () => {
    render(<CalendarLegend />)
    expect(screen.getByText('NFL')).toBeInTheDocument()
  })

  it('renders all 11 sports', () => {
    render(<CalendarLegend />)
    expect(screen.getByText('NASCAR')).toBeInTheDocument()
    expect(screen.getByText('Golf')).toBeInTheDocument()
    expect(screen.getByText('UFC')).toBeInTheDocument()
  })
})
