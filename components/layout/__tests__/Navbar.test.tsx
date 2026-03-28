import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navbar } from '../Navbar'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    aside: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <aside {...props}>{children}</aside>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('Navbar', () => {
  it('renders the logo link', () => {
    render(<Navbar />)
    expect(screen.getByText('SportsCal')).toBeInTheDocument()
  })

  it('renders nav sport pills on desktop', () => {
    render(<Navbar />)
    // NAV_SPORTS = nfl, nba, mlb, nhl, soccer
    expect(screen.getAllByText('NFL').length).toBeGreaterThan(0)
    expect(screen.getAllByText('NBA').length).toBeGreaterThan(0)
  })

  it('renders Calendar and Schedule links', () => {
    render(<Navbar />)
    expect(screen.getByText('Calendar')).toBeInTheDocument()
    expect(screen.getByText('Schedule')).toBeInTheDocument()
  })

  it('opens mobile drawer on hamburger click', () => {
    render(<Navbar />)
    const menuButton = screen.getByLabelText('Open menu')
    fireEvent.click(menuButton)
    // Drawer should be open — look for close button
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument()
  })
})
