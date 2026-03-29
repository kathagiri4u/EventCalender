'use client'

import { useFilters } from '@/store/useFilters'
import { ArrowUpDown } from 'lucide-react'

export function SortToggle() {
  const { sortOrder, setSortOrder } = useFilters()

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown size={14} className="text-text-muted flex-shrink-0" />
      <div className="flex gap-1">
        <button
          onClick={() => setSortOrder('asc')}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all min-h-[28px] border ${
            sortOrder === 'asc'
              ? 'bg-accent text-white border-accent'
              : 'bg-surface2 text-text-secondary border-border hover:text-text-primary'
          }`}
        >
          Soonest First
        </button>
        <button
          onClick={() => setSortOrder('desc')}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all min-h-[28px] border ${
            sortOrder === 'desc'
              ? 'bg-accent text-white border-accent'
              : 'bg-surface2 text-text-secondary border-border hover:text-text-primary'
          }`}
        >
          Latest First
        </button>
      </div>
    </div>
  )
}
