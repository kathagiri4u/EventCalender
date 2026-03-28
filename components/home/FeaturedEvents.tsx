import Link from 'next/link'
import { EventCard } from '@/components/schedule/EventCard'
import type { SportEvent } from '@/types'

interface FeaturedEventsProps {
  events: SportEvent[]
}

export function FeaturedEvents({ events }: FeaturedEventsProps) {
  if (events.length === 0) return null

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-heading font-bold text-text-primary">Featured Events</h2>
        <Link
          href="/schedule?major=true"
          className="text-sm text-accent hover:text-accent-hover transition-colors"
        >
          See all →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {events.map((event) => (
          <div key={event.id} className="glow-border rounded-xl">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  )
}
