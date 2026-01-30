# Vestra

**Vestra** is global crypto payroll — intent-based payroll on NEAR. This repo contains the Vestra web app and its tooling.

## Repo layout

| Path | Description |
|------|-------------|
| `vestra-app/` | React + TypeScript SPA (Vite, Tailwind v4, React Router). **Source of truth** for UI and flows. |
| `.github/workflows/` | CI (lint, typecheck, unit tests, E2E). |

## Quick start

1. **Install and run the app**
   ```bash
   cd vestra-app
   npm install
   cp .env.example .env   # edit .env and set VITE_API_URL (see vestra-app/README.md)
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173).

2. **Scripts (from `vestra-app/`)**
   - `npm run dev` — dev server
   - `npm run build` — production build
   - `npm run lint` — ESLint
   - `npm run test` — unit tests (Vitest)
   - `npm run test:e2e` — E2E tests (Playwright; run `npx playwright install` once)

## Environment

- **App env** lives in `vestra-app/`. Copy `vestra-app/.env.example` to `vestra-app/.env` and set `VITE_API_URL` (and optionally `VITE_USE_MSW=true` for mock API in dev). See `vestra-app/README.md` for details.

## CI

On push/PR to `main`, GitHub Actions runs:

- Lint and typecheck
- Unit tests
- E2E tests (Playwright against dev server)

Workflow file: [.github/workflows/ci.yml](.github/workflows/ci.yml).
