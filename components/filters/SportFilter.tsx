'use client'

import { useFilters } from '@/store/useFilters'
import { SPORT_SLUGS, SPORT_DISPLAY_NAMES, SPORT_COLORS } from '@/lib/constants'
import type { SportType } from '@/types'

export function SportFilter() {
  const { selectedSport, setSelectedSport } = useFilters()

  return (
    <div>
      <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Sport</h3>
      <div className="flex flex-wrap gap-1.5">
        <FilterPill
          label="All"
          active={selectedSport === 'all'}
          onClick={() => setSelectedSport('all')}
          color="#FF6B35"
        />
        {SPORT_SLUGS.map((sport) => (
          <FilterPill
            key={sport}
            label={SPORT_DISPLAY_NAMES[sport]}
            active={selectedSport === sport}
            onClick={() => setSelectedSport(sport as SportType)}
            color={SPORT_COLORS[sport]}
          />
        ))}
      </div>
    </div>
  )
}

function FilterPill({
  label,
  active,
  onClick,
  color,
}: {
  label: string
  active: boolean
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-full text-xs font-medium transition-all min-h-[32px]"
      style={{
        backgroundColor: active ? color : `${color}15`,
        color: active ? '#fff' : color,
        border: `1px solid ${color}${active ? 'ff' : '40'}`,
      }}
    >
      {label}
    </button>
  )
}
