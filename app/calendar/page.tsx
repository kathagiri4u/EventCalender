import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SportsCalendar } from '@/components/calendar/SportsCalendar'
import { CalendarSkeleton } from '@/components/calendar/CalendarSkeleton'
import { getSchedule } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Monthly sports calendar view — all upcoming events at a glance.',
}

export default function CalendarPage() {
  const { events } = getSchedule()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
        Sports Calendar
      </h1>
      <p className="text-text-secondary mb-6">
        All upcoming events — click any game for details.
      </p>

      <Suspense fallback={<CalendarSkeleton />}>
        <SportsCalendar events={events} />
      </Suspense>
    </div>
  )
}
