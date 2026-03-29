import Link from 'next/link'
import { formatEventTime, formatEventDate } from '@/lib/utils'
import { SPORT_SLUGS, SPORT_COLORS, SPORT_DISPLAY_NAMES } from '@/lib/constants'
import type { SportEvent, SportType } from '@/types'

interface SportsSummaryProps {
  eventsBySport: Partial<Record<SportType, SportEvent>>
}

export function SportsSummary({ eventsBySport }: SportsSummaryProps) {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-heading font-bold text-text-primary mb-5">Sports at a Glance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {SPORT_SLUGS.map((sport) => (
          <SportCard
            key={sport}
            sport={sport}
            nextEvent={eventsBySport[sport]}
          />
        ))}
      </div>
    </section>
  )
}

function SportCard({ sport, nextEvent }: { sport: SportType; nextEvent?: SportEvent }) {
  const color = SPORT_COLORS[sport]

  return (
    <Link
      href={`/sport/${sport}`}
      className="block bg-surface border border-border rounded-xl p-4 hover:border-accent/40 transition-all"
      style={{ borderLeftWidth: '3px', borderLeftColor: color }}
    >
      <h3
        className="text-sm font-heading font-bold uppercase tracking-wider mb-2"
        style={{ color }}
      >
        {SPORT_DISPLAY_NAMES[sport]}
      </h3>
      {nextEvent ? (
        <>
          <p className="text-sm text-text-primary font-medium line-clamp-2 leading-snug">
            {nextEvent.shortName}
          </p>
          <p className="text-xs text-text-muted mt-1">{formatEventDate(nextEvent.date)}</p>
          <p className="text-xs text-text-secondary">{formatEventTime(nextEvent.date)}</p>
        </>
      ) : (
        <p className="text-xs text-text-muted">No upcoming games</p>
      )}
    </Link>
  )
}
