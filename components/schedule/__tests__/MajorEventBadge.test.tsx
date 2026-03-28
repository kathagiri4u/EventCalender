import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MajorEventBadge } from '../MajorEventBadge'

describe('MajorEventBadge', () => {
  it('renders MAJOR text', () => {
    render(<MajorEventBadge />)
    expect(screen.getByText('MAJOR')).toBeInTheDocument()
  })

  it('renders with sport color for nfl', () => {
    const { container } = render(<MajorEventBadge sport="nfl" />)
    const badge = container.firstChild as HTMLElement
    expect(badge.style.color).toBeTruthy()
  })

  it('renders with default accent color when no sport', () => {
    const { container } = render(<MajorEventBadge />)
    const badge = container.firstChild as HTMLElement
    expect(badge).toBeTruthy()
  })

  it('applies additional className', () => {
    const { container } = render(<MajorEventBadge className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
