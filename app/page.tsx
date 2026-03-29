import { Suspense } from 'react'
import { HeroBanner } from '@/components/home/HeroBanner'
import { TodaysGames } from '@/components/home/TodaysGames'
import { FeaturedEvents } from '@/components/home/FeaturedEvents'
import { SportsSummary } from '@/components/home/SportsSummary'
import { ThisWeek } from '@/components/home/ThisWeek'
import { SportQuickNav } from '@/components/home/SportQuickNav'
import {
  getTodaysEvents,
  getMajorEvents,
  getUpcomingEvents,
  getSchedule,
} from '@/lib/data'
import type { SportType, SportEvent } from '@/types'
import { SPORT_SLUGS } from '@/lib/constants'

function HeroBannerSkeleton() {
  return <div className="w-full bg-surface animate-pulse" style={{ minHeight: '340px' }} />
}

function SectionSkeleton() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="h-6 w-48 bg-surface rounded animate-pulse mb-5" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-surface rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const todaysEvents = getTodaysEvents()
  const majorEvents = getMajorEvents(8)
  const weekEvents = getUpcomingEvents(7)
  const { events } = getSchedule()

  // Get next upcoming event per sport for SportsSummary
  const eventsBySport: Partial<Record<SportType, SportEvent>> = {}
  for (const sport of SPORT_SLUGS) {
    const next = events.find((e) => e.sport === sport)
    if (next) eventsBySport[sport] = next
  }

  // Hero: prefer major upcoming events, fall back to any upcoming
  const heroEvents =
    majorEvents.length >= 3 ? majorEvents.slice(0, 5) : weekEvents.slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Banner */}
      <Suspense fallback={<HeroBannerSkeleton />}>
        <HeroBanner events={heroEvents} />
      </Suspense>

      {/* Sport quick-nav pills */}
      <SportQuickNav />

      {/* Today's Games strip */}
      <Suspense fallback={<div className="h-24 animate-pulse bg-surface mx-4 rounded-xl" />}>
        <TodaysGames events={todaysEvents} />
      </Suspense>

      {/* Featured (major) events */}
      {majorEvents.length > 0 && (
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturedEvents events={majorEvents.slice(0, 8)} />
        </Suspense>
      )}

      {/* This Week */}
      <Suspense fallback={<SectionSkeleton />}>
        <ThisWeek events={weekEvents} />
      </Suspense>

      {/* Sports at a Glance */}
      <Suspense fallback={<SectionSkeleton />}>
        <SportsSummary eventsBySport={eventsBySport} />
      </Suspense>
    </div>
  )
}
