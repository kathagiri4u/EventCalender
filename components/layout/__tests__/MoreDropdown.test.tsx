import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MoreDropdown } from '../MoreDropdown'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

describe('MoreDropdown', () => {
  it('renders the More button', () => {
    render(<MoreDropdown />)
    expect(screen.getByText('More')).toBeInTheDocument()
  })

  it('dropdown is hidden by default', () => {
    render(<MoreDropdown />)
    expect(screen.queryByRole('link', { name: /golf/i })).not.toBeInTheDocument()
  })

  it('opens dropdown on button click', () => {
    render(<MoreDropdown />)
    fireEvent.click(screen.getByText('More'))
    expect(screen.getByRole('link', { name: /golf/i })).toBeInTheDocument()
  })

  it('closes dropdown on second button click', () => {
    render(<MoreDropdown />)
    fireEvent.click(screen.getByText('More'))
    fireEvent.click(screen.getByText('More'))
    expect(screen.queryByRole('link', { name: /golf/i })).not.toBeInTheDocument()
  })

  it('closes on Escape key', () => {
    render(<MoreDropdown />)
    fireEvent.click(screen.getByText('More'))
    expect(screen.getByRole('link', { name: /golf/i })).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('link', { name: /golf/i })).not.toBeInTheDocument()
  })

  it('closes on outside click', () => {
    render(<MoreDropdown />)
    fireEvent.click(screen.getByText('More'))
    expect(screen.getByRole('link', { name: /golf/i })).toBeInTheDocument()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('link', { name: /golf/i })).not.toBeInTheDocument()
  })

  it('closes when a sport link is clicked', () => {
    render(<MoreDropdown />)
    fireEvent.click(screen.getByText('More'))
    const link = screen.getByRole('link', { name: /golf/i })
    fireEvent.click(link)
    expect(screen.queryByRole('link', { name: /golf/i })).not.toBeInTheDocument()
  })

  it('sets aria-expanded correctly', () => {
    render(<MoreDropdown />)
    const button = screen.getByText('More').closest('button')!
    expect(button).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('does not close on mousedown inside the dropdown', () => {
    render(<MoreDropdown />)
    fireEvent.click(screen.getByText('More'))
    // Fire mousedown on the More button itself (inside the ref)
    const button = screen.getByText('More').closest('button')!
    fireEvent.mouseDown(button)
    expect(screen.getByRole('link', { name: /golf/i })).toBeInTheDocument()
  })

  it('does not close on non-Escape key', () => {
    render(<MoreDropdown />)
    fireEvent.click(screen.getByText('More'))
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(screen.getByRole('link', { name: /golf/i })).toBeInTheDocument()
  })
})
