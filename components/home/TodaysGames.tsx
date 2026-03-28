import Link from 'next/link'
import { formatEventTime } from '@/lib/utils'
import { SPORT_COLORS, SPORT_DISPLAY_NAMES } from '@/lib/constants'
import type { SportEvent } from '@/types'

interface TodaysGamesProps {
  events: SportEvent[]
}

export function TodaysGames({ events }: TodaysGamesProps) {
  if (events.length === 0) {
    return (
      <section className="py-6 px-4">
        <h2 className="text-lg font-heading font-bold text-text-primary mb-3">Today&apos;s Games</h2>
        <p className="text-sm text-text-muted">No games today — check back soon</p>
      </section>
    )
  }

  return (
    <section className="py-6">
      <div className="px-4 sm:px-6 lg:px-8 mb-3">
        <h2 className="text-lg font-heading font-bold text-text-primary">Today&apos;s Games</h2>
      </div>
      <div
        className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {events.map((event) => (
          <TodaysGameChip key={event.id} event={event} />
        ))}
      </div>
    </section>
  )
}

function TodaysGameChip({ event }: { event: SportEvent }) {
  const color = SPORT_COLORS[event.sport]
  return (
    <Link
      href={`/sport/${event.sport}`}
      className="flex-shrink-0 bg-surface border border-border rounded-xl px-4 py-3 hover:border-accent/40 transition-all min-h-[48px] min-w-[200px]"
      style={{ scrollSnapAlign: 'start', borderLeftWidth: '3px', borderLeftColor: color }}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span
          className="text-xs font-bold uppercase"
          style={{ color }}
        >
          {SPORT_DISPLAY_NAMES[event.sport]}
        </span>
        <span className="text-xs text-text-muted">{formatEventTime(event.date)}</span>
      </div>
      <p className="text-sm font-medium text-text-primary line-clamp-1">{event.shortName}</p>
    </Link>
  )
}
