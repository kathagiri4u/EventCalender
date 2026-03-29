# Contract: /data/schedule.json

Written by the GitHub Actions cron job. Read at build time by Next.js static generation.

---

## Schema

```json
{
  "lastUpdated": "2026-03-28T12:00:00.000Z",
  "fetchedThrough": "2026-05-27",
  "events": [
    {
      "id": "401547417",
      "name": "Kansas City Chiefs at Buffalo Bills",
      "shortName": "KC @ BUF",
      "sport": "nfl",
      "league": "NFL",
      "date": "2026-01-19T21:00:00Z",
      "status": "scheduled",
      "homeTeam": {
        "id": "2",
        "name": "Buffalo Bills",
        "abbreviation": "BUF",
        "logo": "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png",
        "record": "13-4",
        "color": "#00338D"
      },
      "awayTeam": {
        "id": "12",
        "name": "Kansas City Chiefs",
        "abbreviation": "KC",
        "logo": "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png",
        "record": "15-2",
        "color": "#E31837"
      },
      "venue": "Highmark Stadium",
      "network": "CBS",
      "isMajorEvent": true,
      "notes": "Divisional Round"
    }
  ]
}
```

---

## Rules

- `date` is always UTC ISO 8601 — the UI converts to CT before display
- `events` sorted ascending by `date`
- `isMajorEvent` is computed by `lib/major-events.ts` during the cron fetch, not at render time
- `logo` URLs use ESPN CDN — fallback to team initials avatar if loading fails
- `record` is optional — omit if not available from ESPN response
- Maximum lookback: today. No past events stored. Window: next 60 days.
