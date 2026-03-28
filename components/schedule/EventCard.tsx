import Image from 'next/image'
import Link from 'next/link'
import { formatEventTime } from '@/lib/utils'
import { SPORT_COLORS, SPORT_DISPLAY_NAMES } from '@/lib/constants'
import { MajorEventBadge } from './MajorEventBadge'
import type { SportEvent } from '@/types'

interface EventCardProps {
  event: SportEvent
}

function TeamLogo({ src, name, abbreviation }: { src: string; name: string; abbreviation: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={40}
        height={40}
        className="object-contain w-10 h-10"
        unoptimized
      />
    )
  }
  return (
    <div className="w-10 h-10 rounded-full bg-surface2 border border-border flex items-center justify-center text-xs font-bold text-text-secondary">
      {abbreviation}
    </div>
  )
}

export function EventCard({ event }: EventCardProps) {
  const sportColor = SPORT_COLORS[event.sport]

  return (
    <Link
      href={`/sport/${event.sport}`}
      className="block group"
      aria-label={`${event.name} on ${formatEventTime(event.date)}`}
    >
      <div
        className="relative bg-surface rounded-xl border border-border p-4 hover:border-accent/40 transition-all group-hover:shadow-glow"
        style={{ borderLeftWidth: '3px', borderLeftColor: sportColor }}
      >
        {/* Header: sport badge + major badge */}
        <div className="flex items-center justify-between mb-3 gap-2">
          <span
            className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ backgroundColor: `${sportColor}20`, color: sportColor }}
          >
            {SPORT_DISPLAY_NAMES[event.sport]}
          </span>
          {event.isMajorEvent && <MajorEventBadge sport={event.sport} />}
        </div>

        {/* Teams */}
        <div className="flex items-center gap-3">
          {/* Away */}
          <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <TeamLogo
              src={event.awayTeam.logo}
              name={event.awayTeam.name}
              abbreviation={event.awayTeam.abbreviation}
            />
            <span className="text-xs text-text-secondary text-center leading-tight line-clamp-2">
              {event.awayTeam.name}
            </span>
          </div>

          {/* At */}
          <div className="flex-shrink-0 text-center">
            <span className="text-xs font-bold text-text-muted">@</span>
          </div>

          {/* Home */}
          <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <TeamLogo
              src={event.homeTeam.logo}
              name={event.homeTeam.name}
              abbreviation={event.homeTeam.abbreviation}
            />
            <span className="text-xs text-text-secondary text-center leading-tight line-clamp-2">
              {event.homeTeam.name}
            </span>
          </div>
        </div>

        {/* Time + venue + network */}
        <div className="mt-3 space-y-0.5">
          <p className="text-sm font-semibold text-text-primary">{formatEventTime(event.date)}</p>
          {event.venue && (
            <p className="text-xs text-text-muted truncate">{event.venue}</p>
          )}
          {event.network && (
            <p className="text-xs text-text-muted uppercase tracking-wide">{event.network}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
