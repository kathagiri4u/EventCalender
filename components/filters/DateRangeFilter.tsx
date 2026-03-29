'use client'

import { useFilters } from '@/store/useFilters'
import type { DateRangeOption } from '@/types'

const DATE_RANGE_OPTIONS: { value: DateRangeOption; label: string }[] = [
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'custom', label: 'Custom' },
]

export function DateRangeFilter() {
  const {
    dateRange,
    customDateStart,
    customDateEnd,
    setDateRange,
    setCustomDateStart,
    setCustomDateEnd,
  } = useFilters()

  return (
    <div>
      <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
        Date Range
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-2">
        {DATE_RANGE_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setDateRange(value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all min-h-[32px] border ${
              dateRange === value
                ? 'bg-accent text-white border-accent'
                : 'bg-surface2 text-text-secondary border-border hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {dateRange === 'custom' && (
        <div className="flex gap-2 mt-2">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-text-muted" htmlFor="date-start">
              From
            </label>
            <input
              id="date-start"
              type="date"
              value={customDateStart ?? ''}
              onChange={(e) => setCustomDateStart(e.target.value || undefined)}
              className="bg-surface2 border border-border rounded-lg px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-text-muted" htmlFor="date-end">
              To
            </label>
            <input
              id="date-end"
              type="date"
              value={customDateEnd ?? ''}
              onChange={(e) => setCustomDateEnd(e.target.value || undefined)}
              className="bg-surface2 border border-border rounded-lg px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>
      )}
    </div>
  )
}
