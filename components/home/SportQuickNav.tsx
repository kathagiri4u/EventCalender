import Link from 'next/link'
import { SPORT_SLUGS, SPORT_COLORS, SPORT_DISPLAY_NAMES } from '@/lib/constants'

export function SportQuickNav() {
  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8">
      <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
        Browse by Sport
      </h2>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {SPORT_SLUGS.map((sport) => {
          const color = SPORT_COLORS[sport]
          return (
            <Link
              key={sport}
              href={`/sport/${sport}`}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 min-h-[40px] flex items-center"
              style={{
                backgroundColor: `${color}20`,
                color,
                border: `1px solid ${color}40`,
              }}
            >
              {SPORT_DISPLAY_NAMES[sport]}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
