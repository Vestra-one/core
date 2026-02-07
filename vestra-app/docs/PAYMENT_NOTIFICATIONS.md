# Payment status notifications (email, SMS, webhooks)

## Where the user is updated with payment status

Payment status is determined in the **intent transfer flow** after the deposit transaction is submitted to 1Click:

1. **Single payment** (`SinglePaymentForm`): After `executeIntentTransfer` or `executeIntentTransferViaRelayer` returns, the UI sets step to `success` or `error` and shows a **tracking** section (transaction hash, deposit address, status).
2. **Batch payments** (`BatchManualEntry`): Each row gets a result; the UI shows per-row success/failure. Batch-level notification reporting can be added by calling `reportPaymentStatus` for each completed row when a backend is available.

The **single integration point** for downstream notifications (email, SMS, webhooks) is `reportPaymentStatus()` in `src/lib/paymentEvents.ts`. It is called from the UI **whenever a payment reaches a known status** (success or failure), so a backend can persist the event and trigger notifications.

## Frontend → backend contract

When `VITE_API_URL` is set, the app sends a **fire-and-forget** POST for each payment status event:

- **Endpoint:** `POST {VITE_API_URL}/api/payments/events`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON matching `PaymentStatusPayload` (see below).

No auth is sent by default; the backend can require `Authorization` or `X-Account-Id` and expose a session flow if needed.

### Payload shape (`PaymentStatusPayload`)

| Field | Type | Description |
|-------|------|--------------|
| `senderAccountId` | string | NEAR account that initiated the transfer |
| `recipient` | string | Destination chain address (EVM 0x..., NEAR, etc.) |
| `amount` | string | Human-readable amount (e.g. `"100.50"`) |
| `destinationAssetId` | string | 1Click destination asset ID (chain/token) |
| `txHash` | string | NEAR transaction hash (deposit tx) |
| `depositAddress` | string | 1Click deposit address (NEAR account) |
| `depositMemo` | string | 1Click deposit memo (for status polling) |
| `status` | string | 1Click execution status: `SUCCESS`, `PROCESSING`, `PENDING_DEPOSIT`, `KNOWN_DEPOSIT_TX`, or error codes |
| `occurredAt` | string | ISO timestamp when the status was determined |
| `originSymbol` | string? | Origin token symbol (e.g. `USDC`, `wNEAR`) |
| `chainId` | string? | Destination chain id for display |

Use `txHash` + `depositMemo` (and optionally `senderAccountId`) for idempotency: deduplicate events so the same payment does not trigger multiple emails or webhook calls.

## Backend responsibilities (mail, SMS, webhooks)

1. **Persist the event**  
   Store each payload (e.g. in DB or queue) for history and idempotency. Optionally expose a “Payment history” API so the app can show past payments.

2. **Email**  
   - Send a confirmation to the sender (e.g. “Payment of X USDC to 0x… completed”).  
   - Optionally send to the recipient if you have an email mapping (e.g. from contacts or KYC).

3. **SMS**  
   - Same as email: sender confirmation and optional recipient notification, using a provider (e.g. Twilio, SNS).  
   - Map `senderAccountId` or wallet to a phone number via your user store.

4. **Webhooks**  
   - For each event, call configured webhook URLs (e.g. Slack, internal CRM, accounting).  
   - Payload can be the same JSON or a normalized shape.  
   - Use retries and backoff; do not block the main request.

## Example backend handler (pseudo)

```text
POST /api/payments/events
  → Validate body (e.g. required fields, shape)
  → Idempotency: if (txHash, depositMemo) already processed → 200 OK
  → Persist event
  → Enqueue or spawn:
      - Send email (sender + optional recipient)
      - Send SMS (if phone available)
      - POST to configured webhook URLs
  → Return 202 Accepted or 200 OK
```

## Tracking in the UI

- **Success / error screens** now show a **Tracking** card when a transfer result is available:
  - **Status** badge (Completed, Processing, Pending, or raw status)
  - **Transaction** link (NearBlocks explorer) and copy button
  - **Deposit address** (truncated) and copy button
- This uses the same `lastTransferResult` that is sent to `reportPaymentStatus`, so backend and UI stay aligned.

## Optional: same-origin API

If the app and API are served from the same origin, set `VITE_API_URL` to that origin (e.g. `https://app.example.com`) so `reportPaymentStatus` POSTs to `/api/payments/events` on the same host. The backend then implements the handler and notification logic above.
