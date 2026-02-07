# Developer guide

Quick reference for running and working on the Vestra app.

## Quick start

```bash
cd vestra-app
npm install
cp .env.example .env   # edit and set VITE_API_URL (see below)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment

Copy `vestra-app/.env.example` to `vestra-app/.env`.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes* | API base URL (no trailing slash), e.g. `http://localhost:3000/api` |
| `VITE_USE_MSW` | No | Set to `true` to use mock API in dev |
| `VITE_ONE_CLICK_JWT` | For mainnet | 1Click API JWT from [partners.near-intents.org](https://partners.near-intents.org) |
| `VITE_NEAR_NETWORK` | No | `mainnet` (default) or `testnet` |
| `VITE_RELAYER_URL` | For gasless | Your Pagoda relayer base URL |

\* In dev with no backend, the app can fall back to same origin; set `VITE_API_URL` for payment event reporting.

## Scripts (from `vestra-app/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E tests (Playwright; run `npx playwright install` once) |

## Repo layout

| Path | Description |
|------|-------------|
| `vestra-app/` | React SPA (Vite, Tailwind, React Router). Main app and UI. |
| `vestra-app/README.md` | App stack, routes, structure, API usage. |
| `vestra-app/docs/` | Feature and integration docs (below). |
| `relayer-deploy/` | Terraform and config for relayer deployment. |
| `.github/workflows/` | CI (lint, typecheck, unit tests, E2E). |

## Docs in this folder

| Doc | Contents |
|-----|----------|
| [PAYMENT_NOTIFICATIONS.md](PAYMENT_NOTIFICATIONS.md) | Payment status events, backend contract, email/SMS/webhooks. |
| [TESTING_GASLESS.md](TESTING_GASLESS.md) | Gasless (meta tx) testing. |
| [BULK_TRANSFER_100S_RESEARCH.md](BULK_TRANSFER_100S_RESEARCH.md) | Bulk transfer research. |
| [FRONTEND_CODE_REVIEW.md](FRONTEND_CODE_REVIEW.md) | Frontend review notes. |
