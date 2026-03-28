import Image from 'next/image'
import { SPORT_COLORS, SPORT_DISPLAY_NAMES } from '@/lib/constants'
import type { SportType } from '@/types'

interface SportHeroBannerProps {
  sport: SportType
}

export function SportHeroBanner({ sport }: SportHeroBannerProps) {
  const color = SPORT_COLORS[sport]
  const displayName = SPORT_DISPLAY_NAMES[sport]
  const imagePath = `/sports/${sport}.jpg`

  return (
    <div className="relative w-full h-[240px] sm:h-[320px] lg:h-[400px] overflow-hidden">
      {/* Background image with fallback gradient */}
      <Image
        src={imagePath}
        alt={`${displayName} hero image`}
        fill
        className="object-cover"
        priority
      />

      {/* Gradient overlay for readability */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${color}30 0%, rgba(10,10,15,0.85) 100%)`,
        }}
      />

      {/* Sport name */}
      <div className="absolute inset-0 flex items-end p-6 sm:p-10">
        <div>
          <h1
            className="text-4xl sm:text-6xl font-heading font-black uppercase tracking-tight"
            style={{ color }}
          >
            {displayName}
          </h1>
        </div>
      </div>
    </div>
  )
}
