import { format, startOfDay, endOfDay, addDays, isWithinInterval } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import type { SportEvent } from '@/types'

const CT_TIMEZONE = 'America/Chicago'

/**
 * Format a UTC ISO 8601 date string to Central Time display.
 * e.g. "2026-03-28T19:30:00Z" → "7:30 PM CT"
 */
export function formatEventTime(isoDate: string): string {
  const utcDate = new Date(isoDate)
  const ctDate = toZonedTime(utcDate, CT_TIMEZONE)
  return format(ctDate, 'h:mm a') + ' CT'
}

/**
 * Format a UTC ISO 8601 date string to a full date in CT.
 * e.g. "2026-03-28T19:30:00Z" → "Saturday, March 28"
 */
export function formatEventDate(isoDate: string): string {
  const utcDate = new Date(isoDate)
  const ctDate = toZonedTime(utcDate, CT_TIMEZONE)
  return format(ctDate, 'EEEE, MMMM d')
}

/**
 * Format a UTC ISO 8601 date string to a short date in CT.
 * e.g. "2026-03-28T19:30:00Z" → "Mar 28"
 */
export function formatEventDateShort(isoDate: string): string {
  const utcDate = new Date(isoDate)
  const ctDate = toZonedTime(utcDate, CT_TIMEZONE)
  return format(ctDate, 'MMM d')
}

/**
 * Group a list of events by CT date string (e.g. "Saturday, March 28")
 */
export function groupEventsByDate(events: SportEvent[]): Map<string, SportEvent[]> {
  const groups = new Map<string, SportEvent[]>()
  for (const event of events) {
    const key = formatEventDate(event.date)
    const existing = groups.get(key) ?? []
    existing.push(event)
    groups.set(key, existing)
  }
  return groups
}

/**
 * Get start of today in CT
 */
export function getTodayStartCT(): Date {
  const now = new Date()
  const ctNow = toZonedTime(now, CT_TIMEZONE)
  return startOfDay(ctNow)
}

/**
 * Get end of today in CT
 */
export function getTodayEndCT(): Date {
  const now = new Date()
  const ctNow = toZonedTime(now, CT_TIMEZONE)
  return endOfDay(ctNow)
}

/**
 * Check whether a UTC ISO date string falls on today (CT)
 */
export function isToday(isoDate: string): boolean {
  const utcDate = new Date(isoDate)
  const ctDate = toZonedTime(utcDate, CT_TIMEZONE)
  const todayStart = getTodayStartCT()
  const todayEnd = getTodayEndCT()
  return isWithinInterval(ctDate, { start: todayStart, end: todayEnd })
}

/**
 * Check whether a UTC ISO date string falls within the next N days (CT)
 */
export function isWithinNextDays(isoDate: string, days: number): boolean {
  const utcDate = new Date(isoDate)
  const ctDate = toZonedTime(utcDate, CT_TIMEZONE)
  const now = toZonedTime(new Date(), CT_TIMEZONE)
  const end = endOfDay(addDays(now, days))
  return isWithinInterval(ctDate, { start: startOfDay(now), end })
}

/**
 * cn() — merge Tailwind classes, deduplicating conflicts
 * Mirrors shadcn/ui convention
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ')
}
