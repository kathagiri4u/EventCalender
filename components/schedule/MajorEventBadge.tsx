import { SPORT_COLORS } from '@/lib/constants'
import type { SportType } from '@/types'

interface MajorEventBadgeProps {
  sport?: SportType
  className?: string
}

export function MajorEventBadge({ sport, className = '' }: MajorEventBadgeProps) {
  const color = sport ? SPORT_COLORS[sport] : '#FF6B35'

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${className}`}
      style={{ backgroundColor: `${color}30`, color }}
    >
      MAJOR
    </span>
  )
}
