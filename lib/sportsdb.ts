const SPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/3'

interface SportsDbTeam {
  idTeam: string
  strTeam: string
  strTeamBadge?: string
  strStadium?: string
  strStadiumThumb?: string
}

interface SportsDbSearchResponse {
  teams: SportsDbTeam[] | null
}

/**
 * Fetch team data from TheSportsDB by team name.
 * Used by the cron script to enrich team logos and venue photos.
 */
export async function fetchTeamByName(
  teamName: string,
  proxyBaseUrl = ''
): Promise<SportsDbTeam | null> {
  const endpoint = `searchteams.php?t=${encodeURIComponent(teamName)}`
  const url = proxyBaseUrl
    ? `${proxyBaseUrl}/api/sportsdb?endpoint=${encodeURIComponent(endpoint)}`
    : `${SPORTSDB_BASE}/${endpoint}`

  const res = await fetch(url)
  if (!res.ok) return null

  const data = (await res.json()) as SportsDbSearchResponse
  return data.teams?.[0] ?? null
}

/**
 * Get a team logo URL from TheSportsDB.
 * Returns the badge URL or undefined if not found.
 */
export async function getTeamLogoUrl(
  teamName: string,
  proxyBaseUrl = ''
): Promise<string | undefined> {
  const team = await fetchTeamByName(teamName, proxyBaseUrl)
  return team?.strTeamBadge ?? undefined
}

/**
 * Get a venue photo URL from TheSportsDB.
 * Returns the stadium thumbnail or undefined if not found.
 */
export async function getVenuePhotoUrl(
  teamName: string,
  proxyBaseUrl = ''
): Promise<string | undefined> {
  const team = await fetchTeamByName(teamName, proxyBaseUrl)
  return team?.strStadiumThumb ?? undefined
}
