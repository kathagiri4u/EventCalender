'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatEventTime, formatEventDate } from '@/lib/utils'
import { SPORT_COLORS, SPORT_DISPLAY_NAMES } from '@/lib/constants'
import { MajorEventBadge } from '@/components/schedule/MajorEventBadge'
import type { SportEvent } from '@/types'

interface EventPopoverProps {
  event: SportEvent | null
  onClose: () => void
}

export function EventPopover({ event, onClose }: EventPopoverProps) {
  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      /* v8 ignore next */
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {event && (
        <>
          {/* Backdrop */}
          <motion.div
            key="popover-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
            aria-hidden="true"
          />

          {/* Bottom sheet (mobile) / centered panel (desktop) */}
          <motion.div
            key="popover-panel"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 60) onClose()
            }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md sm:rounded-2xl sm:border"
            role="dialog"
            aria-label={`Event details: ${event.name}`}
          >
            {/* Drag handle (mobile) */}
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4 sm:hidden" />

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close event details"
              className="absolute top-4 right-4 p-1.5 rounded-full text-text-muted hover:text-text-primary hover:bg-surface2 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Sport + badges */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{
                  color: SPORT_COLORS[event.sport],
                  backgroundColor: `${SPORT_COLORS[event.sport]}20`,
                }}
              >
                {SPORT_DISPLAY_NAMES[event.sport]} · {event.league}
              </span>
              {event.isMajorEvent && <MajorEventBadge sport={event.sport} />}
            </div>

            {/* Teams */}
            <div className="flex items-center gap-4 mb-4">
              <TeamDisplay team={event.awayTeam} label="Away" />
              <span className="text-lg font-bold text-text-muted flex-shrink-0">@</span>
              <TeamDisplay team={event.homeTeam} label="Home" />
            </div>

            {/* Details */}
            <div className="space-y-1.5 text-sm">
              <p className="text-text-primary font-medium">{formatEventDate(event.date)}</p>
              <p className="text-text-primary">{formatEventTime(event.date)}</p>
              {event.venue && <p className="text-text-secondary">{event.venue}</p>}
              {event.network && (
                <p className="text-text-muted uppercase tracking-wide text-xs">{event.network}</p>
              )}
              {event.notes && (
                <p className="text-accent text-xs font-medium mt-2">{event.notes}</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function TeamDisplay({
  team,
  label,
}: {
  team: { name: string; abbreviation: string; logo: string; record?: string }
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
      {team.logo ? (
        <Image
          src={team.logo}
          alt={team.name}
          width={48}
          height={48}
          className="object-contain"
          unoptimized
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-surface2 flex items-center justify-center font-bold text-sm">
          {team.abbreviation}
        </div>
      )}
      <span className="text-sm font-medium text-center leading-tight line-clamp-2">{team.name}</span>
      {team.record && <span className="text-xs text-text-muted">{team.record}</span>}
      <span className="text-xs text-text-muted">{label}</span>
    </div>
  )
}
