'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Calendar, List, Menu } from 'lucide-react'
import { SearchBar } from '@/components/filters/SearchBar'
import { MobileDrawer } from './MobileDrawer'
import { MoreDropdown } from './MoreDropdown'
import { SPORT_DISPLAY_NAMES, NAV_SPORTS } from '@/lib/constants'

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-sm border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 text-xl font-heading font-bold text-accent"
            >
              SportsCal
            </Link>

            {/* Desktop nav: sport pills + links */}
            <div className="hidden lg:flex items-center gap-1 flex-1">
              {NAV_SPORTS.map((sport) => (
                <Link
                  key={sport}
                  href={`/sport/${sport}`}
                  className="px-3 py-1.5 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface2 transition-colors"
                >
                  {SPORT_DISPLAY_NAMES[sport]}
                </Link>
              ))}
              <MoreDropdown />
            </div>

            {/* Desktop: search + Calendar + Schedule */}
            <div className="hidden lg:flex items-center gap-2">
              <SearchBar />
              <Link
                href="/calendar"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-text-secondary hover:text-text-primary hover:bg-surface2 transition-colors"
              >
                <Calendar size={16} />
                Calendar
              </Link>
              <Link
                href="/schedule"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-text-secondary hover:text-text-primary hover:bg-surface2 transition-colors"
              >
                <List size={16} />
                Schedule
              </Link>
            </div>

            {/* Mobile: hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <SearchBar mobile />
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface2 transition-colors"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
