# Wallet Connection Review & Session Features Plan

## 1. Wallet Connection Review

### Current Implementation

| Area | Implementation | Notes |
|------|----------------|-------|
| **Provider** | `WalletContext.tsx` | NEAR Wallet Selector (core + modal-ui) + MyNearWallet only. Wraps app in `main.tsx`. |
| **State** | `accountId`, `loading`, `isConnected` | Derived from selector store; subscribed via `store.observable`. |
| **Actions** | `connect()` → `modal.show()`; `disconnect()` → `wallet.signOut()` | No backend sign-out or session invalidation. |
| **Config** | `lib/near.ts` | `NEAR_NETWORK` (testnet/mainnet), `NEAR_CONTRACT_ID` (e.g. `vestra.testnet`) from env. |
| **UI** | `AppHeader`, `LandingPage` | Connect / truncated accountId / Disconnect. Header shows wallet when in dashboard. |
| **API** | `lib/api.ts` | No auth: no `Authorization` header, no `accountId`, no session token. Backend is effectively anonymous. |

### Strengths

- Clear context API (`useWallet()`), single place for selector/modal init.
- Loading state and reactive account updates via store subscription.
- Modal theme aligned (`theme: "dark"`) and contract ID passed for sign-in.

### Gaps

1. **No route protection** – Dashboard routes (`/dashboard`, `/treasury`, etc.) are reachable without a connected wallet. "Get Started Free" on landing goes straight to dashboard.
2. **No backend identity** – API client does not send wallet account or any session; backend cannot attribute requests to a user.
3. **Sidebar not wallet-aware** – Sidebar shows hardcoded "Enterprise Treasury" / "treasury.near" instead of current `accountId` from `useWallet()`.
4. **Single wallet module** – Only MyNearWallet; no Ledger, sender wallet, or other modules (may be intentional for MVP).
5. **No explicit error/retry UX** – Init failure only logs; user sees loading then empty state.
6. **Connected click behavior** – In header, clicking the account button calls `connect()` (opens modal) rather than e.g. account menu or copy; may be intentional for "switch wallet".

---

## 2. Session-Related Features Plan

"Session" here means: the period and identity under which the user is considered logged in in the app (and optionally on the backend), and features that depend on it.

### 2.1 Frontend Session (Wallet as Session)

**Goal:** Treat wallet connection as the app session: one active account per tab, consistent UX, optional persistence across reloads.

| Feature | Description | Priority |
|---------|-------------|----------|
| **Route guard** | Require `isConnected` for all dashboard routes; redirect to `/` (or `/connect`) with return URL if not connected. | P0 |
| **Return URL** | After connect on landing, redirect to `returnTo` (e.g. `/dashboard`) or default dashboard. | P1 |
| **Session in Sidebar** | Show current `accountId` (and optional network) in Sidebar instead of hardcoded treasury.near. | P0 |
| **Optional session persistence** | Rely on NEAR Wallet Selector’s own localStorage; document that "session" survives reload/tab close until user signs out or clears site data. No extra persistence layer unless product needs it. | P2 |
| **Multi-tab** | Selector state is per-tab; no shared "session invalidated" across tabs. Optional: broadcast channel or storage event to sync disconnect. | P2 |

**Implementation sketch**

- **Route guard:** Create `RequireWallet` (or `ProtectedRoute`) that uses `useWallet().isConnected`; if false, `<Navigate to="/" state={{ returnTo: location.pathname }} replace />`. Wrap dashboard route elements in it (e.g. in `routes.tsx` or inside `DashboardLayout`).
- **Return URL:** On landing, "Get Started" / post-connect redirect: read `location.state?.returnTo` or `searchParams.returnTo`, default `ROUTES.dashboard`.
- **Sidebar:** Use `useWallet()` in Sidebar; display `accountId` (truncated) and optionally network; remove hardcoded "treasury.near" for the active account.

### 2.2 Backend Session (API Identity)

**Goal:** Backend knows "who" (NEAR account) and optionally has a revocable session.

| Feature | Description | Priority |
|---------|-------------|----------|
| **Send account on API requests** | Add header (e.g. `X-Account-Id: accountId`) or `accountId` query/body where relevant. Backend must validate and bind data to account. | P0 if backend is ready |
| **Backend session / token** | Optional: after wallet connect, frontend calls e.g. `POST /auth/session` with a signed message or wallet payload; backend returns HTTP-only cookie or Bearer token and optional expiry. API client then sends cookie or `Authorization`. | P1 |
| **Session expiry and refresh** | If backend issues tokens: define TTL, refresh flow, and 401 handling (e.g. clear wallet state and redirect to connect). | P1 |
| **Sign-out propagation** | On `disconnect()`, call backend `POST /auth/sign-out` or similar so server invalidates session. | P1 |

**Implementation sketch**

- **api.ts:** Accept optional `accountId` (from `useWallet()` at call site) or a small `api.withAuth(accountId)` wrapper that adds `X-Account-Id` (and later `Authorization` if tokens exist). Central place for auth headers keeps session logic in one layer.
- **Backend session:** New endpoints and types (e.g. `POST /auth/session`, `POST /auth/sign-out`); frontend only after backend contract is defined.

### 2.3 Session UX and Safety

| Feature | Description | Priority |
|---------|-------------|----------|
| **Copy account ID** | In header or sidebar: "Copy address" for `accountId`. | P1 |
| **Account menu** | Dropdown on account button: Copy, Disconnect, maybe "Switch wallet" (already `connect()`). | P2 |
| **Idle / timeout** | Optional: after N minutes idle, show "Still there?" or auto-disconnect; depends on product policy. | P2 |
| **Clear session on disconnect** | On `disconnect()`, clear any in-memory session (e.g. cached user prefs) and invalidate backend session if implemented. | P0 when backend session exists |

### 2.4 Suggested Implementation Order

1. **Phase 1 – Frontend session**
   - Add route guard (require wallet for dashboard).
   - Use `accountId` in Sidebar; remove hardcoded treasury.near for active account.
   - Optional: return URL on connect.

2. **Phase 2 – Backend identity**
   - Add `X-Account-Id` (or agreed header) to API client when `accountId` is available; backend uses it for scoping.
   - No token yet if backend doesn’t need it.

3. **Phase 3 – Backend session (if needed)**
   - Backend: session create/invalidate endpoints and token/cookie contract.
   - Frontend: call session endpoint after connect; send token/cookie on requests; call sign-out on disconnect; handle 401.

4. **Phase 4 – Polish**
   - Copy account ID, account dropdown, optional idle timeout, multi-tab sync.

---

## 3. Files to Touch (Summary)

| Change | Files |
|--------|--------|
| Route guard | `routes.tsx`, new `RequireWallet.tsx` (or in layout) |
| Return URL | `LandingPage.tsx`, `WalletContext` or connect callback |
| Sidebar account | `Sidebar.tsx` |
| API auth | `api.ts`, call sites or `api.withAuth()` |
| Backend session | New auth API types + `WalletContext` (session create/sign-out on connect/disconnect) |
| Copy / account menu | `AppHeader.tsx` (and optionally Sidebar) |

This plan keeps the current wallet connection as the single source of truth for "session" and layers route protection, UI consistency, and backend identity on top of it without changing the NEAR Wallet Selector contract.
