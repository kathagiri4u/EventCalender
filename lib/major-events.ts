import type { SportEvent } from '@/types'

export const MAJOR_KEYWORDS = [
  'super bowl',
  'nfc championship',
  'afc championship',
  'nfl playoffs',
  'divisional round',
  'wild card',
  'nba finals',
  'nba playoffs',
  'conference finals',
  'world series',
  'alcs',
  'nlcs',
  'alds',
  'nlds',
  'stanley cup',
  'nhl playoffs',
  'conference final',
  'ufc',
  'masters',
  'us open',
  'british open',
  'the open championship',
  'pga championship',
  'ryder cup',
  'daytona 500',
  'world cup',
  'champions league',
  'el clásico',
  'ncaa tournament',
  'march madness',
  'final four',
  'college football playoff',
  'rose bowl',
  'sugar bowl',
  'fiesta bowl',
  'orange bowl',
  'cotton bowl',
  'game 7',
  'game 6',
  'playoff',
  'postseason',
  'championship',
  'title',
]

/**
 * Normalized rivalry slug pairs — `${slugA}-${slugB}` (alphabetical order).
 * Using a Set for O(1) lookup.
 */
export const RIVALRY_PAIRS = new Set([
  // NFL
  'chicago-bears-green-bay-packers',
  'dallas-cowboys-philadelphia-eagles',
  'new-england-patriots-new-york-jets',
  'pittsburgh-steelers-baltimore-ravens',
  'san-francisco-49ers-seattle-seahawks',
  'kansas-city-chiefs-las-vegas-raiders',
  // NBA
  'boston-celtics-los-angeles-lakers',
  'chicago-bulls-detroit-pistons',
  'golden-state-warriors-los-angeles-clippers',
  'miami-heat-new-york-knicks',
  // MLB
  'boston-red-sox-new-york-yankees',
  'chicago-cubs-st-louis-cardinals',
  'los-angeles-dodgers-san-francisco-giants',
  // NHL
  'boston-bruins-montreal-canadiens',
  'chicago-blackhawks-detroit-red-wings',
  'colorado-avalanche-detroit-red-wings',
  // Soccer
  'manchester-city-manchester-united',
  'arsenal-fc-tottenham-hotspur',
  'fc-barcelona-real-madrid',
])

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function makeRivalryKey(teamA: string, teamB: string): string {
  const slugs = [toSlug(teamA), toSlug(teamB)].sort()
  return slugs.join('-')
}

/**
 * Determine whether a SportEvent qualifies as a "major" event.
 * True if any of:
 *   1. The event name/notes contains a major keyword
 *   2. The two teams form a known rivalry pair
 *   3. The event status is 'scheduled' but notes indicate postseason
 */
export function isMajorEvent(event: SportEvent): boolean {
  const searchText = [
    event.name,
    event.shortName,
    event.notes ?? '',
    event.league,
  ]
    .join(' ')
    .toLowerCase()

  for (const keyword of MAJOR_KEYWORDS) {
    if (searchText.includes(keyword)) return true
  }

  const rivalryKey = makeRivalryKey(event.homeTeam.name, event.awayTeam.name)
  if (RIVALRY_PAIRS.has(rivalryKey)) return true

  return false
}
