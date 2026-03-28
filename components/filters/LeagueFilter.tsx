'use client'

import { useFilters } from '@/store/useFilters'
import { SPORT_LEAGUES } from '@/lib/constants'

export function LeagueFilter() {
  const { selectedSport, selectedLeague, setSelectedLeague } = useFilters()

  if (selectedSport === 'all') return null

  const leagues = SPORT_LEAGUES[selectedSport]
  if (!leagues || leagues.length <= 1) return null

  return (
    <div>
      <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">League</h3>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedLeague('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all min-h-[32px] border ${
            selectedLeague === 'all'
              ? 'bg-accent text-white border-accent'
              : 'bg-surface2 text-text-secondary border-border hover:text-text-primary'
          }`}
        >
          All
        </button>
        {leagues.map((league) => (
          <button
            key={league}
            onClick={() => setSelectedLeague(league)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all min-h-[32px] border ${
              selectedLeague === league
                ? 'bg-accent text-white border-accent'
                : 'bg-surface2 text-text-secondary border-border hover:text-text-primary'
            }`}
          >
            {league}
          </button>
        ))}
      </div>
    </div>
  )
}
