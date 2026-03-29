# EventCalendar — Project Constitution

> This file is the entry point for the EventCalendar specification.
> Claude must follow all linked documents precisely when generating or modifying any code.

---

## Project Overview

**EventCalendar** is a modern, fast, and visually rich sports events web application.
It aggregates and displays upcoming schedules and highlights for all major
sports leagues including NFL, NBA, MLB, NHL, MLS, NCAA, Soccer (international),
UFC/Boxing, Golf, and NASCAR.

Users can browse events by month on a full calendar, filter by sport or league,
search for teams or events, and see major matchups (championships, playoffs, rivalries,
international events) highlighted with special visual treatment.

---

## Goals

- Be the single destination to track ALL major upcoming sports events
- Highlight blockbuster games (championships, finals, playoffs, rivalries) prominently
- Provide a clean, fast calendar and list view with sport/league filters
- Be fully open-source, free to host, and easy to maintain

---

## Context

This website is for a **sports bar in Austin, Texas**.

---

## Performance Constraints

These are product requirements, not suggestions:

- Lighthouse score: **90+ on Performance, Accessibility, Best Practices, SEO**
- Use React Suspense + skeleton loaders for all async data sections
- Lazy load calendar and off-screen sections
- Paginate schedule list: **25 events per page**
- All pages are **statically generated** — no ESPN API calls per user request (see `data-and-api.md`)

---

## Out of Scope for v1

- User accounts / personalization / favorite teams
- Push notifications or reminders
- Fantasy sports integration
- Betting odds or spreads
- Video highlights or streams
- Native mobile app

---

## Specification Index

| File | Contents |
|------|----------|
| [features.md](features.md) | Project structure, all page & feature specs |
| [data-and-api.md](data-and-api.md) | Sports & leagues covered, data constraints |
| [design-system.md](design-system.md) | Color palette, sport colors, typography, theme |
| [navigation.md](navigation.md) | Nav behavior, full responsive design spec (all breakpoints) |

---

## Where to Find Everything Else

| Topic | Location |
|-------|----------|
| Tech stack, API endpoints, deployment, getting started | `README.md` |
| SOLID principles, testing strategy, CI, PR checklist | `CONTRIBUTING.md` |
| TypeScript interfaces | `types/index.ts` |
| ESPN API client | `lib/espn.ts` |
| TheSportsDB client | `lib/sportsdb.ts` |

---

## Review & Maintenance

All contributors must periodically review the constitution during major refactors.
Maintain a small set of canonical tests that exercise cross-cutting concerns
(major event detection, calendar rendering, filter interactions).

---

*Constitution version: 4.0 | Project: EventCalendar | Last updated: 2026-03-28*
