'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { SPORT_SLUGS, SPORT_DISPLAY_NAMES, NAV_SPORTS } from '@/lib/constants'

const MORE_SPORTS = SPORT_SLUGS.filter((s) => !NAV_SPORTS.includes(s))

export function MoreDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      /* v8 ignore next */
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface2 transition-colors"
      >
        More
        <ChevronDown
          size={14}
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-48 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-50">
          {MORE_SPORTS.map((sport) => (
            <Link
              key={sport}
              href={`/sport/${sport}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface2 transition-colors min-h-[40px]"
            >
              {SPORT_DISPLAY_NAMES[sport]}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
