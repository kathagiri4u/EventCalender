'use client'

import { useState } from 'react'
import { EventList } from '@/components/schedule/EventList'
import { paginateEvents } from '@/lib/filters'
import type { SportEvent } from '@/types'

interface SportEventListProps {
  events: SportEvent[]
}

export function SportEventList({ events }: SportEventListProps) {
  const [page, setPage] = useState(1)
  const { items, totalPages, totalItems } = paginateEvents(events, page)

  return (
    <EventList
      events={items}
      page={page}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={setPage}
    />
  )
}
