# Vestra App

React + TypeScript (TSX) app for Vestra — global crypto payroll. Built with Vite, Tailwind CSS v4, and React Router.

## Stack

- **React 19** + **TypeScript** (TSX)
- **Vite 7** — dev server and build
- **Tailwind CSS v4** — design tokens and utilities
- **React Router 7** — client-side routing

## Design tokens

Defined in `src/index.css` via `@theme` and CSS variables:

- `--color-primary`: `#5b2bee`
- `--color-background-dark`, `--color-surface-dark`, `--color-border-dark`, etc.

## Scripts

```bash
npm install
npm run dev    # http://localhost:5173
npm run build
npm run preview # preview production build
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
    constants.ts # ROUTES, APP_NAME, PRIMARY_COLOR
  index.css     # Tailwind + theme + custom scrollbar
  App.tsx       # Router config
  main.tsx
```

## Adding features

- **State**: Add React Query or Zustand for server/global state.
- **Forms**: Use React Hook Form + Zod for validation.
- **API**: Call your backend from page components or custom hooks.
