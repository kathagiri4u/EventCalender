'use client'

import Link from 'next/link'
import { X, Calendar, List } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPORT_SLUGS, SPORT_DISPLAY_NAMES, SPORT_COLORS } from '@/lib/constants'
import { SearchBar } from '@/components/filters/SearchBar'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-surface flex flex-col shadow-2xl"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <Link
                href="/"
                onClick={onClose}
                className="text-xl font-heading font-bold text-accent"
              >
                SportsCal
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-border">
              <SearchBar mobile expanded onClose={onClose} />
            </div>

            {/* Sports list */}
            <nav className="flex-1 overflow-y-auto py-2">
              {SPORT_SLUGS.map((sport) => (
                <Link
                  key={sport}
                  href={`/sport/${sport}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-surface2 transition-colors min-h-[48px]"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: SPORT_COLORS[sport] }}
                  />
                  <span className="font-medium">{SPORT_DISPLAY_NAMES[sport]}</span>
                </Link>
              ))}
            </nav>

            {/* Bottom links */}
            <div className="border-t border-border px-4 py-4 flex flex-col gap-1">
              <Link
                href="/calendar"
                onClick={onClose}
                className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface2 transition-colors min-h-[48px]"
              >
                <Calendar size={18} />
                <span className="font-medium">Calendar</span>
              </Link>
              <Link
                href="/schedule"
                onClick={onClose}
                className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface2 transition-colors min-h-[48px]"
              >
                <List size={18} />
                <span className="font-medium">Schedule</span>
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
