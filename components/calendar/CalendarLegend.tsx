import { SPORT_SLUGS, SPORT_COLORS, SPORT_DISPLAY_NAMES } from '@/lib/constants'

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-2 mb-4" aria-label="Sport color legend">
      {SPORT_SLUGS.map((sport) => (
        <div key={sport} className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: SPORT_COLORS[sport] }}
            aria-hidden="true"
          />
          <span className="text-xs text-text-secondary">{SPORT_DISPLAY_NAMES[sport]}</span>
        </div>
      ))}
    </div>
  )
}
