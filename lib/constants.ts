import type { SportType } from '@/types'

export const SPORT_SLUGS: SportType[] = [
  'nfl',
  'nba',
  'mlb',
  'nhl',
  'mls',
  'soccer',
  'ncaa_football',
  'ncaa_basketball',
  'ufc',
  'golf',
  'nascar',
]

export const SPORT_LEAGUES: Record<SportType, string[]> = {
  nfl: ['NFL'],
  nba: ['NBA'],
  mlb: ['MLB'],
  nhl: ['NHL'],
  mls: ['MLS'],
  soccer: ['Premier League', 'La Liga', 'Champions League', 'World Cup'],
  ncaa_football: ['NCAA Football'],
  ncaa_basketball: ['NCAA Basketball'],
  ufc: ['UFC'],
  golf: ['PGA Tour', 'Masters', 'US Open', 'The Open Championship'],
  nascar: ['NASCAR Cup Series'],
}

export const SPORT_COLORS: Record<SportType, string> = {
  nfl: '#013369',
  nba: '#C9082A',
  mlb: '#002D72',
  nhl: '#000000',
  mls: '#00A651',
  soccer: '#00A651',
  ncaa_football: '#FF8200',
  ncaa_basketball: '#FF8200',
  ufc: '#D20A0A',
  golf: '#006747',
  nascar: '#FFD700',
}

export const SPORT_DISPLAY_NAMES: Record<SportType, string> = {
  nfl: 'NFL',
  nba: 'NBA',
  mlb: 'MLB',
  nhl: 'NHL',
  mls: 'MLS',
  soccer: 'Soccer',
  ncaa_football: 'NCAA FB',
  ncaa_basketball: 'NCAA BB',
  ufc: 'UFC',
  golf: 'Golf',
  nascar: 'NASCAR',
}

// Sports shown in the main navbar pills (others in More dropdown)
export const NAV_SPORTS: SportType[] = ['nfl', 'nba', 'mlb', 'nhl', 'soccer']

// Sports that have standings
export const STANDINGS_SPORTS: SportType[] = ['nfl', 'nba', 'mlb', 'nhl', 'mls']

// ESPN API sport/league path segments
export const ESPN_SPORT_PATHS: Partial<Record<SportType, string>> = {
  nfl: 'football/nfl',
  nba: 'basketball/nba',
  mlb: 'baseball/mlb',
  nhl: 'hockey/nhl',
  mls: 'soccer/usa.1',
  soccer: 'soccer/eng.1',
  ncaa_football: 'football/college-football',
  ncaa_basketball: 'basketball/mens-college-basketball',
  ufc: 'mma/ufc',
  golf: 'golf/pga',
  nascar: 'racing/nascar',
}
