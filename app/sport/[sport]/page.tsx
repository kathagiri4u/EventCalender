import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SportHeroBanner } from '@/components/sport/SportHeroBanner'
import { StandingsCard } from '@/components/sport/StandingsCard'
import { SportEventList } from '@/components/sport/SportEventList'
import { getEventsBySport, getStandings } from '@/lib/data'
import { SPORT_SLUGS, SPORT_DISPLAY_NAMES } from '@/lib/constants'
import type { SportType } from '@/types'

interface Props {
  params: { sport: string }
}

export function generateStaticParams() {
  return SPORT_SLUGS.map((sport) => ({ sport }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sport = params.sport as SportType
  if (!SPORT_SLUGS.includes(sport)) return {}
  return {
    title: SPORT_DISPLAY_NAMES[sport],
    description: `${SPORT_DISPLAY_NAMES[sport]} schedule, standings, and upcoming games.`,
  }
}

export default function SportPage({ params }: Props) {
  const sport = params.sport as SportType

  if (!SPORT_SLUGS.includes(sport)) {
    notFound()
  }

  const events = getEventsBySport(sport)
  const { standings } = getStandings()
  const sportStandings = standings.find((s) => s.sport === sport)

  return (
    <div>
      {/* Hero banner */}
      <SportHeroBanner sport={sport} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main: events list */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">
              Upcoming {SPORT_DISPLAY_NAMES[sport]} Games
            </h2>
            <SportEventList events={events} />
          </div>

          {/* Sidebar: standings */}
          {sportStandings && (
            <div className="w-full lg:w-72 flex-shrink-0">
              <StandingsCard sport={sport} standings={sportStandings} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
