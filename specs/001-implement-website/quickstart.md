# Developer Quickstart

---

## Prerequisites

- Node.js 20+
- pnpm 9+
- A Vercel account (free tier)
- A GitHub repository

---

## 1. Install dependencies

```bash
pnpm install
```

---

## 2. Environment variables

Create `.env.local` at the project root:

```bash
# Required for on-demand ISR revalidation (keep secret)
REVALIDATE_SECRET=your-random-secret-string
```

No ESPN or TheSportsDB API keys required — both are public/free.

---

## 3. Seed initial schedule data

Before running the dev server, generate `data/schedule.json` locally:

```bash
pnpm run fetch-schedule
```

This runs the same script the GitHub Actions cron uses. Fetches the next 60 days of events from ESPN and writes `/data/schedule.json` and `/data/standings.json`.

---

## 4. Start the dev server

```bash
pnpm dev
```

Visit `http://localhost:3000`.

---

## 5. Run tests

```bash
pnpm test:unit          # vitest unit + integration
pnpm test:unit --watch  # watch mode
pnpm test --coverage    # full coverage report
pnpm playwright test    # E2E tests (requires pnpm build first)
```

---

## 6. Build for production

```bash
pnpm build
pnpm start
```

---

## 7. Deploy to Vercel

```bash
vercel --prod
```

Set the following environment variable in Vercel dashboard:
- `REVALIDATE_SECRET` — same value as `.env.local`

---

## 8. Set up the cron job

In your GitHub repository:

1. Add these repository secrets:
   - `REVALIDATE_SECRET` — same value as above
   - `VERCEL_REVALIDATE_URL` — your Vercel deployment URL + `/api/revalidate` (e.g. `https://your-app.vercel.app/api/revalidate`)

2. The workflow at `.github/workflows/fetch-schedule.yml` runs automatically at 6 AM and 6 PM CT.

---

## Key scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm fetch-schedule` | Manually seed schedule data |
| `pnpm test:unit` | Unit + integration tests |
| `pnpm test:e2e` | Playwright E2E tests |
| `pnpm test --coverage` | Full coverage report |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
