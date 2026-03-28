import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SportHeroBanner } from '../SportHeroBanner'

describe('SportHeroBanner', () => {
  it('renders sport display name', () => {
    render(<SportHeroBanner sport="nfl" />)
    expect(screen.getByText('NFL')).toBeInTheDocument()
  })

  it('renders NBA display name', () => {
    render(<SportHeroBanner sport="nba" />)
    expect(screen.getByText('NBA')).toBeInTheDocument()
  })

  it('renders Golf display name', () => {
    render(<SportHeroBanner sport="golf" />)
    expect(screen.getByText('Golf')).toBeInTheDocument()
  })

  it('renders NASCAR display name', () => {
    render(<SportHeroBanner sport="nascar" />)
    expect(screen.getByText('NASCAR')).toBeInTheDocument()
  })

  it('renders an image element with correct alt text', () => {
    render(<SportHeroBanner sport="nfl" />)
    expect(screen.getByAltText('NFL hero image')).toBeInTheDocument()
  })
})
