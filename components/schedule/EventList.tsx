import { EventCard } from './EventCard'
import { groupEventsByDate } from '@/lib/utils'
import type { SportEvent } from '@/types'

interface EventListProps {
  events: SportEvent[]
  page: number
  totalPages: number
  totalItems: number
  onPageChange: (_page: number) => void
}

export function EventList({ events, page, totalPages, totalItems, onPageChange }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-muted text-lg">No events match your filters.</p>
        <p className="text-text-muted text-sm mt-2">Try adjusting the sport or date range.</p>
      </div>
    )
  }

  const grouped = groupEventsByDate(events)

  return (
    <div>
      {/* Total count */}
      <p className="text-sm text-text-muted mb-4">
        {totalItems} event{totalItems !== 1 ? 's' : ''} found
      </p>

      {/* Grouped events */}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-2 mt-10"
          aria-label="Schedule pagination"
        >
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[40px]"
          >
            ← Prev
          </button>

          <span className="text-sm text-text-secondary">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[40px]"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  )
}
