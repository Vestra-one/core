# Vestra App

React + TypeScript (TSX) app for Vestra — global crypto payroll. Built with Vite, Tailwind CSS v4, and React Router.

## Stack

- **React 19** + **TypeScript** (TSX)
- **Vite 7** — dev server and build
- **Tailwind CSS v4** — design tokens and utilities
- **React Router 7** — client-side routing
- **TanStack Query (React Query)** — server state and caching
- **React Hook Form** + **Zod** — forms and validation (see `src/lib/schemas.ts`, `src/hooks/useFormWithZod.ts`)
- **MSW** — mock API in dev when `VITE_USE_MSW=true`

## Design tokens

Defined in `src/index.css` via `@theme` and CSS variables:

- `--color-primary`: `#5b2bee`
- `--color-background-dark`, `--color-surface-dark`, `--color-border-dark`, etc.

## Environment

Copy `.env.example` to `.env` and set:

- **`VITE_API_URL`** — API base URL (no trailing slash), e.g. `http://localhost:3000/api`
- **`VITE_USE_MSW`** (optional) — set to `true` to use MSW mock API in development instead of a real backend

## Scripts

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run preview    # preview production build
npm run lint       # ESLint
npm run test       # unit tests (Vitest)
npm run test:ui    # Vitest UI
npm run test:e2e   # E2E tests (Playwright; run `npx playwright install` once)
```

## Routes

| Path | Screen |
|------|--------|
| `/` | Landing page (hero, Transaction Hub, features, CTA, footer) |
| `/dashboard` | Dashboard (treasury, quick actions, recent activities, activity details panel) |
| `/onboarding` | Company onboarding — Notification Setup (Step 3 of 4) |
| `/payments/bulk` | Payments — Bulk CSV Upload (upload zone, parsed rows, batch summary, processing toast) |
| `/payments/manual` | Payments — New Manual Entry (batch table, payment summary) |
| `/payments/manual-invoice` | Payments — Manual Entry after invoice upload (toast + parsed row badge) |
| `/payments/scheduled` | Payments — Scheduled tab (stats, table, Create New Schedule modal) |

## Structure

```
src/
  components/
    layout/     # Logo, Sidebar, AppHeader
    ui/         # Icon, Button
  layouts/
    DashboardLayout.tsx   # Sidebar + header + outlet
  pages/        # One page per route
  lib/
    constants.ts  # ROUTES, APP_NAME, PRIMARY_COLOR
    api.ts        # API client (base URL from VITE_API_URL)
    schemas.ts    # Zod schemas for forms
  hooks/
    useFormWithZod.ts  # useForm + zodResolver wrapper
  mocks/
    handlers.ts   # MSW handlers
    browser.ts    # MSW worker for dev
  test/
    setup.ts      # Vitest + Testing Library setup
  index.css       # Tailwind + theme + custom scrollbar
  App.tsx         # Router config
  main.tsx
```

## API and state

- **API client**: `src/lib/api.ts` — `api.get()`, `api.post()`, etc. Base URL from `VITE_API_URL`. Use in components or custom hooks; pair with React Query for server state.
- **Server state**: Use `@tanstack/react-query` (e.g. `useQuery`, `useMutation`) in pages or hooks; wrap fetches with the `api` client.
- **Forms**: Use `useFormWithZod(schema, options)` from `src/hooks/useFormWithZod.ts` with schemas from `src/lib/schemas.ts`.
