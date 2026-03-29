# Navigation & Responsive Design

---

## Navigation

```
Desktop (lg+):
  [Logo]  NFL  NBA  MLB  NHL  Soccer  More ▾       🔍 Search    Calendar  Schedule

Tablet (md):
  [Logo]  NFL  NBA  MLB  Soccer  More ▾             🔍           ☰

Mobile (base → sm):
  [Logo]                                             🔍           ☰
  (full drawer slides in from left on ☰ tap)
```

### Mobile Drawer Menu
- Full-height slide-in drawer from the LEFT side
- Shows all sports as large tappable rows with sport icon + name
- Bottom of drawer: Calendar link, Schedule link
- Search bar at the top of the drawer
- Close button (X) top-right of drawer
- Backdrop overlay behind the drawer (tap to close)
- Drawer uses `position: fixed`, `z-index: 50`, smooth slide animation via Framer Motion

### Tablet Navigation
- Logo + condensed sport pills (top 4) + "More" dropdown + search icon + hamburger
- "More" dropdown opens on click (not hover) for touch compatibility

### Search Bar Behavior
- Desktop: inline expanded search field in navbar
- Tablet/Mobile: tap the 🔍 icon → search bar expands full-width below navbar
- Search results dropdown appears below the bar, max height 60vh, scrollable
- Dismiss by tapping outside or pressing Escape

---

## Responsive Design — Full Specification

This section is MANDATORY. Every component and page MUST implement all breakpoints below.

### Breakpoints

| Name         | Min Width | Tailwind Prefix | Target Devices                        |
|--------------|-----------|-----------------|---------------------------------------|
| Mobile S     | 320px     | (base)          | Small phones (iPhone SE, Galaxy A)    |
| Mobile L     | 375px     | (base)          | Standard phones (iPhone 14, Pixel 7)  |
| Tablet       | 640px     | `sm:`           | Large phones landscape, small tablets |
| Tablet L     | 768px     | `md:`           | iPad portrait, Android tablets        |
| Laptop       | 1024px    | `lg:`           | iPad landscape, small laptops         |
| Desktop      | 1280px    | `xl:`           | Standard desktops                     |
| Wide         | 1536px    | `2xl:`          | Large monitors, wide screens          |

**RULE: Design mobile-first. Base styles = mobile. Scale up with `sm:`, `md:`, `lg:`, `xl:`.**

---

### Grid System

| Section              | Mobile (base) | Tablet (md) | Desktop (lg) | Wide (xl)  |
|----------------------|---------------|-------------|--------------|------------|
| Featured Events      | 1 column      | 2 columns   | 3 columns    | 4 columns  |
| Sport Summary Cards  | 1 column      | 2 columns   | 3 columns    | 5 columns  |
| Today's Games Strip  | Horizontal scroll (snap) | Horizontal scroll | Horizontal scroll | Fixed grid |
| Schedule List        | Full width    | Full width  | Left sidebar + list | Same  |
| Sport-Specific Page  | 1 column      | 2 columns   | 3 columns    | 4 columns  |

Use Tailwind: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

---

### Hero Banner

- **Mobile**: Full viewport width. Single event shown at a time. Team logos stacked vertically.
  Text is center-aligned. Prev/next arrows are below the card (not overlapping image).
  Swipe gesture (left/right) supported for navigating between events (use Framer Motion drag).
- **Tablet**: Same as mobile but logos side-by-side. Arrows appear on sides.
- **Desktop**: Full-width cinematic banner. Background team image with gradient overlay.
  Team logos side-by-side with "VS" separator. Arrows on left/right edges of banner.

---

### Event Cards

```
Mobile:
  ┌─────────────────────────────┐
  │ [Sport Badge]    [MAJOR]│
  │  Team A Logo   vs  Team B Logo│
  │  Team A Name      Team B Name │
  │  Date • Time • League        │
  │  Venue • Network             │
  └─────────────────────────────┘

Tablet:
  ┌────────────────────────────────────┐
  │ [Sport] [League]       [MAJOR]│
  │  [Logo] Team A  XX–XX  Team B [Logo]│
  │  📅 Date  🕐 Time  📍 Venue  📺 TV  │
  └────────────────────────────────────┘

Desktop: Same as tablet but wider with more whitespace
```

- Card minimum touch target: **48px height** on mobile
- Team logo size: 32px mobile → 48px tablet → 64px desktop

---

### Calendar Page

- **Mobile (base → sm)**:
  - Show **Agenda/List view** by default (not month grid) — FullCalendar `listWeek` view
  - Toggle button at top: "List View" | "Month View"
  - Month view on mobile: show only colored dot indicators on each day (no text chips)
  - Tapping a day in month view opens a bottom sheet with that day's events
  - Bottom sheet slides up from bottom, max height 80vh, scrollable

- **Tablet (md)**:
  - Show month grid by default
  - Each day cell shows up to 2 event chips (text truncated to ~15 chars)
  - "+ N more" link if more than 2 events on a day
  - Clicking event opens a centered modal popover

- **Desktop (lg+)**:
  - Full monthly grid with event chips showing full team names where space allows
  - Sidebar on right (280px) showing selected day's events in detail
  - Event click popover appears inline

---

### Schedule Page (Filters)

- **Mobile**:
  - Filters are hidden by default behind a "⚙ Filters" button at the top
  - Tapping opens a full-screen bottom sheet drawer with all filter options
  - Large touch-friendly filter toggles (min 44px tall)
  - Apply/Reset buttons pinned to bottom of filter drawer
  - Active filter count shown as a badge on the Filters button (e.g., "Filters (2)")

- **Tablet (md)**:
  - Filters shown as a horizontal scrollable pill row above the event list
  - No sidebar — filters stay above the list

- **Desktop (lg+)**:
  - Sticky left sidebar (240px wide) with all filter options expanded
  - Event list takes remaining width

---

### Typography Scaling

| Element           | Mobile     | Tablet      | Desktop     |
|-------------------|------------|-------------|-------------|
| Page Title        | text-2xl   | text-3xl    | text-5xl    |
| Section Heading   | text-xl    | text-2xl    | text-3xl    |
| Card Title        | text-sm    | text-base   | text-lg     |
| Body / Meta       | text-xs    | text-sm     | text-sm     |
| Badge / Label     | text-xs    | text-xs     | text-xs     |

Use Tailwind responsive prefixes: `text-2xl md:text-3xl lg:text-5xl`

---

### Spacing & Padding

- Page horizontal padding: `px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16`
- Section vertical spacing: `py-8 md:py-12 lg:py-16`
- Card internal padding: `p-3 md:p-4 lg:p-5`
- Gap between grid items: `gap-3 md:gap-4 lg:gap-6`

---

### Touch & Interaction

- All tappable elements: minimum **44×44px** touch target (use `min-h-[44px] min-w-[44px]`)
- No hover-only interactions — everything accessible by tap/click
- Popovers on mobile become **bottom sheets** (slide up from bottom, not floating)
- Dropdowns on mobile become **full-width** bottom sheets
- Swipe to dismiss bottom sheets (drag down gesture)
- Horizontal scroll sections use `overflow-x-auto scroll-smooth snap-x snap-mandatory`
  with each item having `snap-start` for smooth snapping

---

### Images & Logos

- All team logos use `next/image` with responsive `sizes` prop:
  ```tsx
  sizes="(max-width: 640px) 32px, (max-width: 1024px) 48px, 64px"
  ```
- Hero banner background image: `object-cover w-full h-[240px] sm:h-[320px] lg:h-[480px]`
- Logos fall back to team initials avatar if image fails to load

---

### Footer

- **Mobile**: Single column, stacked links, centered text
- **Tablet**: 2 columns
- **Desktop**: 4 columns (About, Sports, Quick Links, Social)
- Always includes: copyright, sport links, GitHub link

---

### Viewport Testing Requirements

Claude must ensure the layout is tested and works at these exact viewport widths:
- 320px (small phone)
- 375px (iPhone 14)
- 414px (iPhone 14 Plus)
- 768px (iPad portrait)
- 1024px (iPad landscape / small laptop)
- 1280px (desktop)
- 1536px (wide monitor)

Use browser DevTools responsive mode to verify. No horizontal scroll should appear on any viewport.
No content should overflow its container. Text must never be cut off or overflow cards.
