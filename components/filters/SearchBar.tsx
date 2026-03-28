'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useFilters } from '@/store/useFilters'

interface SearchBarProps {
  mobile?: boolean
  expanded?: boolean
  onClose?: () => void
}

export function SearchBar({ mobile = false, expanded = false, onClose }: SearchBarProps) {
  const router = useRouter()
  const { searchQuery, setSearchQuery } = useFilters()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [mobileExpanded, setMobileExpanded] = useState(expanded)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mobileExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [mobileExpanded])

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMobileExpanded(false)
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileExpanded(false)
        setLocalQuery('')
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSearchQuery(localQuery)
    router.push('/schedule')
    onClose?.()
  }

  function handleClear() {
    setLocalQuery('')
    setSearchQuery('')
    inputRef.current?.focus()
  }

  // Mobile: icon button that expands
  if (mobile && !mobileExpanded) {
    return (
      <button
        onClick={() => setMobileExpanded(true)}
        aria-label="Search"
        className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface2 transition-colors"
      >
        <Search size={20} />
      </button>
    )
  }

  return (
    <div ref={containerRef} className={mobile ? 'w-full' : 'relative'}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-3 text-text-muted pointer-events-none"
        />
        <input
          ref={inputRef}
          type="search"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search games, teams, venues…"
          className={[
            'bg-surface2 border border-border rounded-full',
            'pl-9 pr-8 py-1.5 text-sm text-text-primary placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent',
            'transition-all',
            mobile ? 'w-full' : 'w-48 focus:w-64',
          ].join(' ')}
        />
        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-2.5 text-text-muted hover:text-text-primary"
          >
            <X size={14} />
          </button>
        )}
      </form>
    </div>
  )
}
