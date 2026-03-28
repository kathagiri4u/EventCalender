import Image from 'next/image'
import { STANDINGS_SPORTS, SPORT_DISPLAY_NAMES } from '@/lib/constants'
import type { SportType, SportStandings } from '@/types'

interface StandingsCardProps {
  sport: SportType
  standings: SportStandings | undefined
}

export function StandingsCard({ sport, standings }: StandingsCardProps) {
  // Only show for sports that have standings
  if (!STANDINGS_SPORTS.includes(sport)) return null
  if (!standings || standings.entries.length === 0) return null

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">
        {SPORT_DISPLAY_NAMES[sport]} Standings
      </h2>
      <div className="space-y-3">
        {standings.entries.map((entry) => (
          <div key={entry.team.id} className="flex items-center gap-3">
            <span className="text-text-muted text-sm w-4 flex-shrink-0">
              {entry.rank}
            </span>
            {entry.team.logo ? (
              <Image
                src={entry.team.logo}
                alt={entry.team.name}
                width={28}
                height={28}
                className="object-contain w-7 h-7 flex-shrink-0"
                unoptimized
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-surface2 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {entry.team.abbreviation}
              </div>
            )}
            <span className="text-sm text-text-primary flex-1 truncate">{entry.team.name}</span>
            <span className="text-xs text-text-muted flex-shrink-0">
              {entry.wins}-{entry.losses}
              {entry.ties !== undefined ? `-${entry.ties}` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
