# Feature Specification: EventCalendar Website

**Branch**: `001-implement-website` | **Date**: 2026-03-28

---

## Overview

Build the EventCalendar website for a sports bar in Austin, Texas — a statically generated Next.js 14 application that aggregates upcoming sports schedules across all major leagues. Schedule data is fetched by a background cron job and stored as static JSON; pages are pre-rendered with zero API calls per user request.

---

## Pages

### Home (`/`)
- Hero Banner: rotating spotlight of 3–5 major upcoming events, auto-advances every 6s, swipeable
- Today's Games Strip: horizontal scrollable strip of today's games
- Featured Major Events: grid of championship/playoff games with MAJOR badge
- This Week at a Glance: next 7 days' key matchups grouped by day
- Sport Quick-Nav: icon pills linking to sport-specific pages

### Calendar (`/calendar`)
- FullCalendar monthly grid with colored event chips per sport
- Mobile: agenda list view by default, togglable to month view with dot indicators
- Tablet: month grid, up to 2 chips per day + "N more"
- Desktop: full grid + 280px right sidebar for selected day detail
- Click → popover with full event details

### Schedule (`/schedule`)
- Paginated list (25/page), events grouped by date
- Filters: sport, league, date range (this week / this month / custom), major events only toggle
- Live search by team/event/venue, debounced 300ms
- Sort: soonest first (default) | latest first
- Mobile: filters in full-screen bottom sheet drawer
- Desktop: sticky 240px left sidebar

### Sport Pages (`/sport/[sport]`)
- Pre-filtered schedule for that sport
- Sport-specific hero banner
- Standings summary (top 3 teams)
- Valid slugs: `nfl`, `nba`, `mlb`, `nhl`, `soccer`, `ncaa`, `ufc`, `golf`, `nascar`

---

## Data

- Source: ESPN Public API (primary), TheSportsDB (logos/venues)
- Fetched by GitHub Actions cron — twice daily at 6 AM and 6 PM CT
- Stored in `/data/schedule.json`
- Pages statically generated from that file — no ESPN calls per user request
- All times displayed in **Central Time (CT)**, labeled explicitly (e.g. `7:30 PM CT`)

---

## Major Event Detection

A game is flagged MAJOR if any of:
- Name contains: "Super Bowl", "Finals", "Championship", "World Series", "Stanley Cup", "World Cup", "Daytona 500", "Masters", "March Madness", "Playoff", "Wild Card", "Divisional Round", "Conference Championship", "UFC", "PPV"
- Both teams appear in the predefined rivalry pairs list
- API marks it as postseason

---

## Design

- Dark mode only — background `#0A0A0F`, surface `#13131A`
- Sport colors per league (see `design-system.md`)
- Glassmorphism cards: `backdrop-blur-sm bg-white/5`
- Major event cards: `shadow-[0_0_20px_rgba(255,100,0,0.3)]`
- Fonts: Syne (headings), Inter (body)
- Mobile-first, 7 breakpoints (320px → 1536px)

---

## Out of Scope (v1)

User accounts, push notifications, fantasy sports, betting odds, video, native app.
