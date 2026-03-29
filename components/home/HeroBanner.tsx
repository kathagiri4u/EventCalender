'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatEventTime, formatEventDate } from '@/lib/utils'
import { SPORT_COLORS, SPORT_DISPLAY_NAMES } from '@/lib/constants'
import { MajorEventBadge } from '@/components/schedule/MajorEventBadge'
import type { SportEvent } from '@/types'

export const heroBannerVariants = {
  enter: (d: number) => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? '-60%' : '60%', opacity: 0 }),
}

interface HeroBannerProps {
  events: SportEvent[]
}

export function HeroBanner({ events }: HeroBannerProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const count = events.length
  const event = events[index]

  const go = useCallback(
    (dir: number) => {
      setDirection(dir)
      setIndex((prev) => (prev + dir + count) % count)
    },
    [count]
  )

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (count <= 1) return
    const id = setInterval(() => go(1), 6000)
    return () => clearInterval(id)
  }, [count, go])

  if (!event) return null

  const sportColor = SPORT_COLORS[event.sport]

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: '340px' }}>
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-20 transition-colors duration-700"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${sportColor}, transparent 70%)` }}
      />

      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={event.id}
          custom={direction}
          variants={heroBannerVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1)
            else if (info.offset.x > 60) go(-1)
          }}
          className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:py-14 cursor-grab active:cursor-grabbing"
        >
          {/* Sport + badges */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded"
              style={{ backgroundColor: `${sportColor}30`, color: sportColor }}
            >
              {SPORT_DISPLAY_NAMES[event.sport]}
            </span>
            {event.isMajorEvent && <MajorEventBadge sport={event.sport} />}
          </div>

          {/* Teams */}
          <div className="flex items-center justify-center gap-4 sm:gap-8">
            {/* Away team */}
            <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
              {event.awayTeam.logo ? (
                <Image
                  src={event.awayTeam.logo}
                  alt={event.awayTeam.name}
                  width={72}
                  height={72}
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center text-xl font-heading font-bold">
                  {event.awayTeam.abbreviation}
                </div>
              )}
              <span className="text-center font-heading font-bold text-base sm:text-xl truncate w-full text-center">
                {event.awayTeam.name}
              </span>
              {event.awayTeam.record && (
                <span className="text-xs text-text-muted">{event.awayTeam.record}</span>
              )}
            </div>

            {/* VS */}
            <div className="flex-shrink-0 text-center">
              <span className="text-3xl sm:text-5xl font-heading font-black text-text-muted">
                VS
              </span>
            </div>

            {/* Home team */}
            <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
              {event.homeTeam.logo ? (
                <Image
                  src={event.homeTeam.logo}
                  alt={event.homeTeam.name}
                  width={72}
                  height={72}
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center text-xl font-heading font-bold">
                  {event.homeTeam.abbreviation}
                </div>
              )}
              <span className="text-center font-heading font-bold text-base sm:text-xl truncate w-full text-center">
                {event.homeTeam.name}
              </span>
              {event.homeTeam.record && (
                <span className="text-xs text-text-muted">{event.homeTeam.record}</span>
              )}
            </div>
          </div>

          {/* Event info */}
          <div className="mt-6 text-center space-y-1">
            <p className="text-sm text-text-secondary">{formatEventDate(event.date)}</p>
            <p className="text-lg font-semibold text-text-primary">{formatEventTime(event.date)}</p>
            {event.venue && <p className="text-sm text-text-muted">{event.venue}</p>}
            {event.network && (
              <p className="text-xs text-text-muted uppercase tracking-wider">{event.network}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev/Next arrows */}
      {count > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous event"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-surface/60 hover:bg-surface transition-colors text-text-secondary hover:text-text-primary"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next event"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-surface/60 hover:bg-surface transition-colors text-text-secondary hover:text-text-primary"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }}
                aria-label={`Go to event ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === index ? 'w-4 bg-accent' : 'bg-text-muted'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
