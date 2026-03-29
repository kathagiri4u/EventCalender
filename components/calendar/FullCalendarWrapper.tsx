'use client'

import { useState, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg } from '@fullcalendar/core'
import { SPORT_COLORS } from '@/lib/constants'
import { EventPopover } from './EventPopover'
import type { SportEvent } from '@/types'

interface FullCalendarWrapperProps {
  events: SportEvent[]
  initialView?: string
  dayMaxEvents?: number
}

function toCalendarEvents(events: SportEvent[]) {
  return events.map((e) => ({
    id: e.id,
    title: e.shortName,
    start: e.date,
    backgroundColor: SPORT_COLORS[e.sport],
    borderColor: SPORT_COLORS[e.sport],
    textColor: '#ffffff',
    extendedProps: { event: e },
  }))
}

export default function FullCalendarWrapper({
  events,
  initialView = 'dayGridMonth',
  dayMaxEvents = 10,
}: FullCalendarWrapperProps) {
  const [selectedEvent, setSelectedEvent] = useState<SportEvent | null>(null)

  const handleEventClick = useCallback((arg: EventClickArg) => {
    const event = arg.event.extendedProps.event as SportEvent
    setSelectedEvent(event)
  }, [])

  return (
    <div className="fc-dark">
      <style>{`
        .fc-dark .fc-scrollgrid { border-color: #2A2A3A; }
        .fc-dark .fc-day { background-color: #13131A; }
        .fc-dark .fc-day-other { background-color: #0A0A0F; }
        .fc-dark .fc-col-header-cell { background-color: #1C1C28; color: #9090A8; }
        .fc-dark .fc-daygrid-day-number { color: #F0F0F5; }
        .fc-dark .fc-event { cursor: pointer; font-size: 11px; border-radius: 3px; }
        .fc-dark .fc-toolbar-title { color: #F0F0F5; font-family: var(--font-syne, sans-serif); }
        .fc-dark .fc-button { background-color: #1C1C28; border-color: #2A2A3A; color: #9090A8; }
        .fc-dark .fc-button:hover { background-color: #2A2A3A; }
        .fc-dark .fc-button-active { background-color: #FF6B35 !important; border-color: #FF6B35 !important; color: #fff !important; }
        .fc-dark .fc-list-event { background-color: #13131A; }
        .fc-dark .fc-list-day-cushion { background-color: #1C1C28; color: #9090A8; }
        .fc-dark td, .fc-dark th { border-color: #2A2A3A; }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
        initialView={initialView}
        events={toCalendarEvents(events)}
        eventClick={handleEventClick}
        dayMaxEvents={dayMaxEvents}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,listWeek',
        }}
        height="auto"
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
      />

      <EventPopover event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}
