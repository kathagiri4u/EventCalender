'use client'

import dynamic from 'next/dynamic'
import { CalendarSkeleton } from './CalendarSkeleton'
import { CalendarLegend } from './CalendarLegend'
import type { SportEvent } from '@/types'

// FullCalendar uses browser-only APIs — must be SSR disabled
const FullCalendarWrapper = dynamic(() => import('./FullCalendarWrapper'), {
  ssr: false,
  loading: () => <CalendarSkeleton />,
})

interface SportsCalendarProps {
  events: SportEvent[]
  isMobile?: boolean
}

export function SportsCalendar({ events, isMobile = false }: SportsCalendarProps) {
  const initialView = isMobile ? 'listWeek' : 'dayGridMonth'
  const dayMaxEvents = isMobile ? undefined : 2

  return (
    <div className="w-full">
      <CalendarLegend />
      <FullCalendarWrapper
        events={events}
        initialView={initialView}
        dayMaxEvents={dayMaxEvents}
      />
    </div>
  )
}
