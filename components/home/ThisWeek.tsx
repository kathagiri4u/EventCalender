import { EventCard } from '@/components/schedule/EventCard'
import { groupEventsByDate } from '@/lib/utils'
import type { SportEvent } from '@/types'

interface ThisWeekProps {
  events: SportEvent[]
}

export function ThisWeek({ events }: ThisWeekProps) {
  if (events.length === 0) return null

  const grouped = groupEventsByDate(events)

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">This Week</h2>
      <div className="space-y-8">
        {Array.from(grouped.entries()).map(([date, dayEvents]) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3 border-b border-border pb-2">
              {date}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {dayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
