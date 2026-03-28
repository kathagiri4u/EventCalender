import { describe, it, expect } from 'vitest'
import {
  SPORT_SLUGS,
  SPORT_LEAGUES,
  SPORT_COLORS,
  SPORT_DISPLAY_NAMES,
  NAV_SPORTS,
  STANDINGS_SPORTS,
  ESPN_SPORT_PATHS,
} from '../constants'

describe('SPORT_SLUGS', () => {
  it('contains all 11 sport types', () => {
    expect(SPORT_SLUGS).toHaveLength(11)
  })

  it('includes nfl, nba, mlb, nhl', () => {
    expect(SPORT_SLUGS).toContain('nfl')
    expect(SPORT_SLUGS).toContain('nba')
    expect(SPORT_SLUGS).toContain('mlb')
    expect(SPORT_SLUGS).toContain('nhl')
  })
})

describe('SPORT_LEAGUES', () => {
  it('has an entry for every sport slug', () => {
    for (const sport of SPORT_SLUGS) {
      expect(SPORT_LEAGUES[sport]).toBeDefined()
      expect(SPORT_LEAGUES[sport].length).toBeGreaterThan(0)
    }
  })

  it('maps nfl to NFL', () => {
    expect(SPORT_LEAGUES['nfl']).toContain('NFL')
  })
})

describe('SPORT_COLORS', () => {
  it('has a color for every sport slug', () => {
    for (const sport of SPORT_SLUGS) {
      expect(SPORT_COLORS[sport]).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })
})

describe('SPORT_DISPLAY_NAMES', () => {
  it('has a display name for every sport slug', () => {
    for (const sport of SPORT_SLUGS) {
      expect(typeof SPORT_DISPLAY_NAMES[sport]).toBe('string')
      expect(SPORT_DISPLAY_NAMES[sport].length).toBeGreaterThan(0)
    }
  })
})

describe('NAV_SPORTS', () => {
  it('is a subset of SPORT_SLUGS', () => {
    for (const sport of NAV_SPORTS) {
      expect(SPORT_SLUGS).toContain(sport)
    }
  })
})

describe('STANDINGS_SPORTS', () => {
  it('only contains sports with standings', () => {
    expect(STANDINGS_SPORTS).toContain('nfl')
    expect(STANDINGS_SPORTS).toContain('nba')
    expect(STANDINGS_SPORTS).not.toContain('ufc')
    expect(STANDINGS_SPORTS).not.toContain('golf')
    expect(STANDINGS_SPORTS).not.toContain('nascar')
  })
})

describe('ESPN_SPORT_PATHS', () => {
  it('has a path for major sports', () => {
    expect(ESPN_SPORT_PATHS['nfl']).toBe('football/nfl')
    expect(ESPN_SPORT_PATHS['nba']).toBe('basketball/nba')
    expect(ESPN_SPORT_PATHS['mlb']).toBe('baseball/mlb')
  })
})
