'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { FilterState, SportType, DateRangeOption } from '@/types'

export const DEFAULT_FILTERS: FilterState = {
  selectedSport: 'all',
  selectedLeague: 'all',
  dateRange: 'this_week',
  majorEventsOnly: false,
  searchQuery: '',
  sortOrder: 'asc',
}

interface FiltersStore extends FilterState {
  setSelectedSport: (sport: SportType | 'all') => void
  setSelectedLeague: (league: string | 'all') => void
  setDateRange: (range: DateRangeOption) => void
  setCustomDateStart: (date: string | undefined) => void
  setCustomDateEnd: (date: string | undefined) => void
  setMajorEventsOnly: (value: boolean) => void
  setSearchQuery: (query: string) => void
  setSortOrder: (order: 'asc' | 'desc') => void
  resetFilters: () => void
}

export const useFilters = create<FiltersStore>()(
  persist(
    (set) => ({
      ...DEFAULT_FILTERS,

      setSelectedSport: (sport) =>
        set({ selectedSport: sport, selectedLeague: 'all' }),

      setSelectedLeague: (league) =>
        set({ selectedLeague: league }),

      setDateRange: (range) =>
        set({ dateRange: range }),

      setCustomDateStart: (date) =>
        set({ customDateStart: date }),

      setCustomDateEnd: (date) =>
        set({ customDateEnd: date }),

      setMajorEventsOnly: (value) =>
        set({ majorEventsOnly: value }),

      setSearchQuery: (query) =>
        set({ searchQuery: query }),

      setSortOrder: (order) =>
        set({ sortOrder: order }),

      resetFilters: () =>
        set(DEFAULT_FILTERS),
    }),
    {
      name: 'event-calendar-filters',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
