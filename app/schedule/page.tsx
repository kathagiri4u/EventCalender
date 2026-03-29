import type { Metadata } from 'next'
import { ScheduleClient } from './ScheduleClient'
import { getSchedule } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Schedule',
  description: 'Full sports schedule — filter by sport, date, and more.',
}

export default function SchedulePage() {
  const { events } = getSchedule()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Schedule</h1>
      <p className="text-text-secondary mb-6">
        All upcoming events — filter by sport, date, and more.
      </p>
      <ScheduleClient allEvents={events} />
    </div>
  )
}
