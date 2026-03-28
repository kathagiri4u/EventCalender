'use client'

import { useState, useMemo, useEffect } from 'react'
import { FiltersPanel } from '@/components/filters/FiltersPanel'
import { EventList } from '@/components/schedule/EventList'
import { filterEvents, sortEvents, paginateEvents } from '@/lib/filters'
import { useFilters } from '@/store/useFilters'
import type { SportEvent } from '@/types'

interface ScheduleClientProps {
  allEvents: SportEvent[]
}

export function ScheduleClient({ allEvents }: ScheduleClientProps) {
  const [page, setPage] = useState(1)
  const filters = useFilters()

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setPage(1)
  }, [
    filters.selectedSport,
    filters.selectedLeague,
    filters.dateRange,
    filters.majorEventsOnly,
    filters.searchQuery,
    filters.sortOrder,
  ])

  const filtered = useMemo(() => filterEvents(allEvents, filters), [allEvents, filters])
  const sorted = useMemo(
    () => sortEvents(filtered, filters.sortOrder),
    [filtered, filters.sortOrder]
  )
  const { items, totalPages, totalItems } = useMemo(
    () => paginateEvents(sorted, page),
    [sorted, page]
  )

  return (
    <div className="flex gap-6">
      <FiltersPanel />
      <div className="flex-1 min-w-0">
        <EventList
          events={items}
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
