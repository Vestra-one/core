# Developer guide

Setup, environment, and scripts for the Vestra app. For app structure, routes, and API usage, see the [app README](../README.md).

---

## Quick start

```bash
cd vestra-app
npm install
cp .env.example .env   # set VITE_API_URL and optional vars (see Environment)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Environment

Copy `vestra-app/.env.example` to `vestra-app/.env`.

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | API base URL (no trailing slash). Required for payment-event reporting; in dev without a backend, app can fall back to same origin. |
| `VITE_USE_MSW` | `true` = use MSW mock API in dev. |
| `VITE_ONE_CLICK_JWT` | 1Click API JWT (mainnet). Request at [partners.near-intents.org](https://partners.near-intents.org). |
| `VITE_NEAR_NETWORK` | `mainnet` (default) or `testnet`. |
| `VITE_RELAYER_URL` | Pagoda relayer base URL for gasless (NEP-366) flows. |

---

## Scripts

From `vestra-app/`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server. |
| `npm run build` | Production build (TypeScript + Vite). |
| `npm run lint` | ESLint. |
| `npm run test` | Unit tests (Vitest). |
| `npm run test:e2e` | E2E (Playwright). Run `npx playwright install` once. |

---

## Repo layout

| Path | Description |
|------|-------------|
| `vestra-app/` | React SPA (Vite, Tailwind, React Router). |
| `vestra-app/README.md` | Stack, routes, structure, API client. |
| `vestra-app/docs/` | Feature and integration docs (this folder). |
| `relayer-deploy/` | Terraform and config for relayer. |
| `.github/workflows/` | CI: lint, typecheck, unit tests, E2E. |

---

## Docs in this folder

| Document | Contents |
|----------|----------|
| [PAYMENT_NOTIFICATIONS.md](PAYMENT_NOTIFICATIONS.md) | Payment event payload, backend contract, email/SMS/webhooks. |
| [TESTING_GASLESS.md](TESTING_GASLESS.md) | Gasless (meta tx) testing. |
| [BULK_TRANSFER_100S_RESEARCH.md](BULK_TRANSFER_100S_RESEARCH.md) | Bulk transfer research and scaling. |
| [FRONTEND_CODE_REVIEW.md](FRONTEND_CODE_REVIEW.md) | Frontend review and patterns. |
