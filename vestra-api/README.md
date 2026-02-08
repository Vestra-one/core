# Vestra API

Backend for **contacts** and **account preferences** (email, SMS, webhook). Data is scoped by `X-Account-Id`; session is left as-is (handled by the frontend / existing auth).

## Run

```bash
npm install
npm run dev
```

Listens on `http://0.0.0.0:3032` by default. Set `PORT` to override.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/accounts/me/contacts` | List contacts (requires `X-Account-Id`) |
| POST | `/accounts/me/contacts` | Create contact |
| PATCH | `/accounts/me/contacts/:id` | Update contact |
| DELETE | `/accounts/me/contacts/:id` | Delete contact |
| GET | `/accounts/me/preferences` | Get preferences |
| PATCH | `/accounts/me/preferences` | Update preferences (partial) |

All `/accounts/me/*` routes require the `X-Account-Id` header (NEAR account ID). The frontend sends this via `useApi()` when a wallet is connected.

## Frontend

In `vestra-app`, set `VITE_API_URL=http://localhost:3032` (no trailing slash) to use this API. Without it (or with `VITE_USE_MSW=true`), the app uses MSW handlers that mirror these endpoints.

## Data

Storage is **in-memory**; data is lost on restart. Replace `src/store.ts` with a DB (e.g. SQLite, Postgres) for persistence.
