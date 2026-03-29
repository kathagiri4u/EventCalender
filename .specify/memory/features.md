# Project Structure & Features

---

## Project Structure

```
/
├── app/
│   ├── layout.tsx                  # Root layout — nav, footer, global providers
│   ├── page.tsx                    # Home page — hero banner + this week + featured
│   ├── calendar/
│   │   └── page.tsx                # Full monthly calendar view
│   ├── schedule/
│   │   └── page.tsx                # List view of all upcoming events with filters
│   ├── sport/
│   │   └── [sport]/
│   │       └── page.tsx            # Sport-specific page (e.g. /sport/nfl)
│   └── api/
│       ├── espn/route.ts           # Proxy for ESPN API calls
│       └── sportsdb/route.ts       # Proxy for TheSportsDB calls
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Top nav with sport tabs + search
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroBanner.tsx          # Rotating spotlight for top upcoming events
│   │   ├── TodaysGames.tsx         # Today's schedule strip
│   │   ├── FeaturedEvents.tsx      # Highlighted major/championship games
│   │   └── SportsSummary.tsx       # Quick card per sport with next game
│   ├── calendar/
│   │   ├── SportsCalendar.tsx      # FullCalendar wrapper with sports events
│   │   └── EventPopover.tsx        # Click popover with full event details
│   ├── schedule/
│   │   ├── EventList.tsx           # Scrollable list of events grouped by date
│   │   ├── EventCard.tsx           # Individual event card (teams, time, venue)
│   │   └── MajorEventBadge.tsx     # Badge component for highlighted major games
│   └── filters/
│       ├── SportFilter.tsx         # Filter by sport (NFL, NBA, MLB, etc.)
│       ├── LeagueFilter.tsx        # Filter by league within a sport
│       └── SearchBar.tsx           # Live search for team or event name
├── lib/
│   ├── espn.ts                     # ESPN API client functions + TypeScript types
│   ├── sportsdb.ts                 # TheSportsDB API client + types
│   ├── major-events.ts             # Logic to flag games as "major" (championships etc.)
│   └── utils.ts                    # Shared date helpers, formatting functions
├── store/
│   └── useFilters.ts               # Zustand store: selected sports, leagues, search query
├── types/
│   └── index.ts                    # Shared TS interfaces: SportEvent, Team, League, etc.
└── public/
    └── logos/                      # Sport league logos (fallback if API logos unavailable)
```

---

## Features

### Home Page
- **Hero Banner**: Rotating spotlight of 3–5 major upcoming events (championship games,
  rivalry matchups, big fights). Shows team names/logos, date, time, network/venue.
  Auto-advances every 6 seconds. Has manual prev/next arrows.
- **Today's Games Strip**: A horizontal scrollable strip of all games happening today.
- **Featured Major Events**: A grid of specially flagged games — Super Bowl, NBA Finals,
  Champions League Final, March Madness, etc. — with a "MAJOR EVENT" badge overlay.
- **This Week at a Glance**: A timeline list of the next 7 days' most important matchups,
  grouped by day.
- **Sport Quick-Nav**: Icon pills at the top for NFL, NBA, MLB, NHL, Soccer, UFC, Golf,
  NASCAR. Clicking jumps to that sport's section or page.

---

### Calendar Page (`/calendar`)
- Full monthly calendar powered by **FullCalendar**.
- Each event shown as a colored chip on the calendar day (color = sport).
- Hovering shows a tooltip with team names and time.
- Clicking opens a popover with full details: teams, logos, date/time, venue, TV network,
  league, and a "Major Event" flag if applicable.
- Previous/Next month navigation. "Today" button.
- Legend at the top showing the color → sport mapping.
- On mobile, collapses to agenda/list view automatically.

---

### Schedule Page (`/schedule`)
- Full list of upcoming events, paginated (25 per page).
- Events grouped by date (e.g., "Monday, March 31").
- Each event card shows: sport icon, team A vs team B with logos, date/time, league,
  venue, TV network, and a "MAJOR" badge if flagged.
- **Filters panel** (left sidebar on desktop, collapsible on mobile):
  - Sport: All | NFL | NBA | MLB | NHL | MLS | Soccer | NCAA | UFC | Golf | NASCAR
  - League: dynamically populated based on selected sport
  - Date range: This Week | This Month | Custom picker
  - Show Major Events Only: toggle switch
- **Search bar**: live search by team name, event name, or venue (debounced 300ms)
- **Sort**: Soonest first (default) | Latest first

---

### Sport-Specific Pages (`/sport/nfl`, `/sport/nba`, etc.)
- Same as schedule page but pre-filtered for that sport.
- Hero image or banner specific to that sport.
- Shows the sport's current standings summary card (top 3 teams).
- Lists all upcoming games for that sport.

---

### Major Event Detection Logic (`lib/major-events.ts`)
A game is flagged as a **Major Event** if any of the following are true:
- Event name contains keywords: "Super Bowl", "Finals", "Championship", "World Series",
  "Stanley Cup", "World Cup", "Daytona 500", "Masters", "March Madness", "Playoff",
  "Wild Card", "Divisional Round", "Conference Championship", "UFC", "PPV"
- The event is a rivalry game (both teams are in a predefined rivalry pairs list)
- The event is marked as a postseason game in the API response
- The event has a viewership/importance flag from the API

