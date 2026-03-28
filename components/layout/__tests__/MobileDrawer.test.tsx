import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileDrawer } from '../MobileDrawer'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

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

describe('MobileDrawer', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<MobileDrawer open={false} onClose={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders when open', () => {
    render(<MobileDrawer open={true} onClose={vi.fn()} />)
    expect(screen.getByRole('complementary', { name: /navigation menu/i })).toBeInTheDocument()
  })

  it('shows all sport links when open', () => {
    render(<MobileDrawer open={true} onClose={vi.fn()} />)
    expect(screen.getByText('NFL')).toBeInTheDocument()
    expect(screen.getByText('NBA')).toBeInTheDocument()
    expect(screen.getByText('Golf')).toBeInTheDocument()
    expect(screen.getByText('NASCAR')).toBeInTheDocument()
  })

  it('calls onClose when X button clicked', () => {
    const onClose = vi.fn()
    render(<MobileDrawer open={true} onClose={onClose} />)
    fireEvent.click(screen.getByLabelText('Close menu'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop clicked', () => {
    const onClose = vi.fn()
    render(<MobileDrawer open={true} onClose={onClose} />)
    // Backdrop is first child
    const backdrop = document.querySelector('[aria-hidden="true"]')
    if (backdrop) fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows Calendar and Schedule links', () => {
    render(<MobileDrawer open={true} onClose={vi.fn()} />)
    expect(screen.getByText('Calendar')).toBeInTheDocument()
    expect(screen.getByText('Schedule')).toBeInTheDocument()
  })
})
