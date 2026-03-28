import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '../SearchBar'
import { useFilters } from '@/store/useFilters'
import { DEFAULT_FILTERS } from '@/store/useFilters'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
}))

beforeEach(() => {
  useFilters.setState(DEFAULT_FILTERS)
  mockPush.mockClear()
})

describe('SearchBar (desktop)', () => {
  it('renders input field', () => {
    render(<SearchBar />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('updates input on type', () => {
    render(<SearchBar />)
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'chiefs' } })
    expect((input as HTMLInputElement).value).toBe('chiefs')
  })

  it('shows clear button when input has value', () => {
    render(<SearchBar />)
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'test' } })
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('clears input when clear button clicked', () => {
    render(<SearchBar />)
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.click(screen.getByLabelText('Clear search'))
    expect((input as HTMLInputElement).value).toBe('')
  })

  it('navigates to /schedule on form submit', () => {
    render(<SearchBar />)
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'chiefs' } })
    fireEvent.submit(input.closest('form')!)
    expect(mockPush).toHaveBeenCalledWith('/schedule')
  })
})

describe('SearchBar (mobile)', () => {
  it('renders icon button when mobile and not expanded', () => {
    render(<SearchBar mobile />)
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument()
  })

  it('expands input on icon click', () => {
    render(<SearchBar mobile />)
    fireEvent.click(screen.getByLabelText('Search'))
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('renders expanded when expanded=true prop', () => {
    render(<SearchBar mobile expanded />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })
})
