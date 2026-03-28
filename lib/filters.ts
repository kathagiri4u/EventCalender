import { isWithinInterval, startOfDay, endOfDay, addDays } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import type { SportEvent, FilterState } from '@/types'

const CT_TZ = 'America/Chicago'

function getWeekInterval() {
  const now = toZonedTime(new Date(), CT_TZ)
  return { start: startOfDay(now), end: endOfDay(addDays(now, 7)) }
}

function getMonthInterval() {
  const now = toZonedTime(new Date(), CT_TZ)
  return { start: startOfDay(now), end: endOfDay(addDays(now, 30)) }
}

/**
 * Filter events by all active filter criteria.
 */
export function filterEvents(events: SportEvent[], state: FilterState): SportEvent[] {
  return events.filter((event) => {
    // Sport filter
    if (state.selectedSport !== 'all' && event.sport !== state.selectedSport) return false

    // League filter
    if (state.selectedLeague !== 'all' && event.league !== state.selectedLeague) return false

    // Major events toggle
    if (state.majorEventsOnly && !event.isMajorEvent) return false

    // Date range filter
    const utcDate = new Date(event.date)
    const ctDate = toZonedTime(utcDate, CT_TZ)

    if (state.dateRange === 'this_week') {
      const { start, end } = getWeekInterval()
      if (!isWithinInterval(ctDate, { start, end })) return false
    } else if (state.dateRange === 'this_month') {
      const { start, end } = getMonthInterval()
      if (!isWithinInterval(ctDate, { start, end })) return false
    } else if (state.dateRange === 'custom') {
      if (state.customDateStart) {
        const customStart = startOfDay(new Date(state.customDateStart))
        if (ctDate < customStart) return false
      }
      if (state.customDateEnd) {
        const customEnd = endOfDay(new Date(state.customDateEnd))
        if (ctDate > customEnd) return false
      }
    }

    // Search query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase()
      const searchable = [
        event.name,
        event.shortName,
        event.homeTeam.name,
        event.awayTeam.name,
        event.venue ?? '',
        event.league,
      ]
        .join(' ')
        .toLowerCase()
      if (!searchable.includes(q)) return false
    }

    return true
  })
}

/**
 * Sort events by date.
 */
export function sortEvents(events: SportEvent[], order: 'asc' | 'desc'): SportEvent[] {
  return [...events].sort((a, b) => {
    const diff = a.date.localeCompare(b.date)
    return order === 'asc' ? diff : -diff
  })
}

/**
 * Paginate a list of events (1-indexed page).
 */
export function paginateEvents(
  events: SportEvent[],
  page: number,
  perPage = 25
): { items: SportEvent[]; totalPages: number; totalItems: number } {
  const totalItems = events.length
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * perPage
  const items = events.slice(start, start + perPage)
  return { items, totalPages, totalItems }
}

/**
 * Search events by query string (searches name, team names, venue).
 */
export function searchEvents(events: SportEvent[], query: string): SportEvent[] {
  if (!query.trim()) return events
  const q = query.toLowerCase()
  return events.filter((event) => {
    const searchable = [
      event.name,
      event.shortName,
      event.homeTeam.name,
      event.awayTeam.name,
      event.venue ?? '',
    ]
      .join(' ')
      .toLowerCase()
    return searchable.includes(q)
  })
}
