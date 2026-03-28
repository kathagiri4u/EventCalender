import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFilters, DEFAULT_FILTERS } from '../useFilters'

// Reset Zustand store between tests
beforeEach(() => {
  useFilters.setState(DEFAULT_FILTERS)
})

describe('useFilters', () => {
  it('initialises with DEFAULT_FILTERS', () => {
    const { result } = renderHook(() => useFilters())
    expect(result.current.selectedSport).toBe('all')
    expect(result.current.selectedLeague).toBe('all')
    expect(result.current.dateRange).toBe('this_week')
    expect(result.current.majorEventsOnly).toBe(false)
    expect(result.current.searchQuery).toBe('')
    expect(result.current.sortOrder).toBe('asc')
  })

  it('setSelectedSport updates sport and resets league', () => {
    const { result } = renderHook(() => useFilters())
    act(() => {
      result.current.setSelectedSport('nfl')
    })
    expect(result.current.selectedSport).toBe('nfl')
    expect(result.current.selectedLeague).toBe('all')
  })

  it('setSelectedSport to same value still resets league', () => {
    const { result } = renderHook(() => useFilters())
    act(() => {
      result.current.setSelectedLeague('NFL')
      result.current.setSelectedSport('nfl')
    })
    expect(result.current.selectedLeague).toBe('all')
  })

  it('setSelectedLeague updates league', () => {
    const { result } = renderHook(() => useFilters())
    act(() => {
      result.current.setSelectedLeague('NFL')
    })
    expect(result.current.selectedLeague).toBe('NFL')
  })

  it('setDateRange updates date range', () => {
    const { result } = renderHook(() => useFilters())
    act(() => {
      result.current.setDateRange('this_month')
    })
    expect(result.current.dateRange).toBe('this_month')
  })

  it('setCustomDateStart and setCustomDateEnd set custom range', () => {
    const { result } = renderHook(() => useFilters())
    act(() => {
      result.current.setDateRange('custom')
      result.current.setCustomDateStart('2026-04-01')
      result.current.setCustomDateEnd('2026-04-30')
    })
    expect(result.current.dateRange).toBe('custom')
    expect(result.current.customDateStart).toBe('2026-04-01')
    expect(result.current.customDateEnd).toBe('2026-04-30')
  })

  it('setCustomDateStart to undefined clears it', () => {
    const { result } = renderHook(() => useFilters())
    act(() => {
      result.current.setCustomDateStart(undefined)
    })
    expect(result.current.customDateStart).toBeUndefined()
  })

  it('setMajorEventsOnly updates flag', () => {
    const { result } = renderHook(() => useFilters())
    act(() => {
      result.current.setMajorEventsOnly(true)
    })
    expect(result.current.majorEventsOnly).toBe(true)
  })

  it('setSearchQuery updates query', () => {
    const { result } = renderHook(() => useFilters())
    act(() => {
      result.current.setSearchQuery('chiefs')
    })
    expect(result.current.searchQuery).toBe('chiefs')
  })

  it('setSortOrder updates order', () => {
    const { result } = renderHook(() => useFilters())
    act(() => {
      result.current.setSortOrder('desc')
    })
    expect(result.current.sortOrder).toBe('desc')
  })

  it('resetFilters restores DEFAULT_FILTERS', () => {
    const { result } = renderHook(() => useFilters())
    act(() => {
      result.current.setSelectedSport('nba')
      result.current.setSearchQuery('lakers')
      result.current.setMajorEventsOnly(true)
      result.current.resetFilters()
    })
    expect(result.current.selectedSport).toBe('all')
    expect(result.current.searchQuery).toBe('')
    expect(result.current.majorEventsOnly).toBe(false)
  })
})
