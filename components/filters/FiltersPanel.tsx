'use client'

import { useState } from 'react'
import { Settings2, X } from 'lucide-react'
import { SportFilter } from './SportFilter'
import { LeagueFilter } from './LeagueFilter'
import { DateRangeFilter } from './DateRangeFilter'
import { MajorEventsToggle } from './MajorEventsToggle'
import { SortToggle } from './SortToggle'
import { useFilters } from '@/store/useFilters'

function countActiveFilters(filters: ReturnType<typeof useFilters.getState>): number {
  let count = 0
  if (filters.selectedSport !== 'all') count++
  if (filters.selectedLeague !== 'all') count++
  if (filters.dateRange !== 'this_week') count++
  if (filters.majorEventsOnly) count++
  if (filters.searchQuery) count++
  return count
}

function FilterContent({ onClose }: { onClose?: () => void }) {
  const filters = useFilters()
  return (
    <div className="flex flex-col gap-5">
      <SportFilter />
      <LeagueFilter />
      <DateRangeFilter />
      <MajorEventsToggle />
      <SortToggle />

      {onClose && (
        <div className="flex gap-2 pt-2 border-t border-border">
          <button
            onClick={() => { filters.resetFilters(); onClose() }}
            className="flex-1 py-2.5 rounded-lg border border-border text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}

export function FiltersPanel() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const filters = useFilters()
  const activeCount = countActiveFilters(filters)

  return (
    <>
      {/* Desktop: sticky left sidebar */}
      <aside className="hidden lg:block w-60 flex-shrink-0">
        <div className="sticky top-24 bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-text-primary">Filters</h2>
            {activeCount > 0 && (
              <button
                onClick={filters.resetFilters}
                className="text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                Reset all
              </button>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Tablet: horizontal pill row */}
      <div className="hidden sm:flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-4">
        <SportFilter />
        <SortToggle />
      </div>

      {/* Mobile: filter button + bottom sheet */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <Settings2 size={15} />
          Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile bottom sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSheetOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-text-primary">Filters</h2>
              <button
                onClick={() => setSheetOpen(false)}
                aria-label="Close filters"
                className="p-1.5 rounded-full text-text-muted hover:text-text-primary hover:bg-surface2 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <FilterContent onClose={() => setSheetOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
