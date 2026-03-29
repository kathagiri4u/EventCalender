import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('Footer', () => {
  it('renders the brand name', () => {
    render(<Footer />)
    expect(screen.getByText('SportsCal')).toBeInTheDocument()
  })

  it('renders Austin TX location', () => {
    render(<Footer />)
    expect(screen.getByText('Austin, TX')).toBeInTheDocument()
  })

  it('renders Calendar link', () => {
    render(<Footer />)
    const calendarLinks = screen.getAllByRole('link', { name: /calendar/i })
    expect(calendarLinks.length).toBeGreaterThan(0)
  })

  it('renders Schedule link', () => {
    render(<Footer />)
    const scheduleLinks = screen.getAllByRole('link', { name: /schedule/i })
    expect(scheduleLinks.length).toBeGreaterThan(0)
  })

  it('renders copyright with year', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(year.toString()))).toBeInTheDocument()
  })

  it('renders CT timezone note', () => {
    render(<Footer />)
    expect(screen.getByText(/Central Time/i)).toBeInTheDocument()
  })

  it('renders GitHub link', () => {
    render(<Footer />)
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })
})
