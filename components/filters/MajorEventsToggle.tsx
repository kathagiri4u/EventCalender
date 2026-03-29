'use client'

import { useFilters } from '@/store/useFilters'

export function MajorEventsToggle() {
  const { majorEventsOnly, setMajorEventsOnly } = useFilters()

  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor="major-events-toggle"
        className="text-sm text-text-secondary cursor-pointer select-none"
      >
        Major Events Only
      </label>
      <button
        id="major-events-toggle"
        role="switch"
        aria-checked={majorEventsOnly}
        onClick={() => setMajorEventsOnly(!majorEventsOnly)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 ${
          majorEventsOnly ? 'bg-accent' : 'bg-surface2'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
            majorEventsOnly ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
