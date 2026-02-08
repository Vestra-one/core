# Vestra API

Backend for **session (auth)**, **contacts**, and **account preferences**. Only the account that created a session can access their own data.

## How access is enforced

- **Session:** Frontend calls `POST /auth/session` with `{ accountId }` (after wallet connect). Backend creates a session and returns a **token**. The client sends `Authorization: Bearer <token>` on every request.
- **Account-scoped routes** (`/accounts/me/contacts`, `/accounts/me/preferences`): The API **ignores** `X-Account-Id` for authorization. It validates the Bearer token, looks up the session, and uses the **accountId stored with that token**. So you can only see or change data for the account that owns the session.
- **Result:** A random caller cannot access another account’s details with “a single call”—they would need a valid token for that account, which only that account can obtain by creating a session (after proving control of the wallet in the frontend).

For stronger guarantees in production, have `POST /auth/session` verify that the client controls the given NEAR account (e.g. signed message or RPC check) before issuing a token.

## Run

```bash
npm install
npm run dev
```

Listens on `http://0.0.0.0:3032` by default. Set `PORT` to override.

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | — | Health check |
| POST | `/auth/session` | — | Create session; body `{ accountId }` → returns `{ token, expiresAt }` |
| POST | `/auth/sign-out` | — | Invalidate session; body `{ token }` |
| GET | `/accounts/me/contacts` | Bearer | List contacts |
| POST | `/accounts/me/contacts` | Bearer | Create contact |
| PATCH | `/accounts/me/contacts/:id` | Bearer | Update contact |
| DELETE | `/accounts/me/contacts/:id` | Bearer | Delete contact |
| GET | `/accounts/me/preferences` | Bearer | Get preferences |
| PATCH | `/accounts/me/preferences` | Bearer | Update preferences (partial) |

All `/accounts/me/*` routes require `Authorization: Bearer <token>`; the account is derived from the session, not from any header.

## Frontend

In `vestra-app`, set `VITE_API_URL=http://localhost:3032` (no trailing slash). The app already calls `createSession(accountId)` and sends the token via `useApi()`; with the URL pointing here, auth and data both go to this API.

## Data

Sessions, contacts, and preferences are stored **in-memory**; data is lost on restart. Replace the store with a DB (e.g. SQLite, Postgres) for persistence.
