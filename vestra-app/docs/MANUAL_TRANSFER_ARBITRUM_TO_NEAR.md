# Manual USDC Transfer: Arbitrum → NEAR (1Click / NEAR Intents, Mainnet)

This guide walks you through transferring **USDC from Arbitrum** to a **NEAR address** using the NEAR Intents 1Click API on **mainnet**.

**Base URL:** `https://1click.chaindefuser.com`

Replace only **`YOUR_JWT`** with your real JWT (and in Step 2/4/5 the recipient/refund/deposit/tx values with your real ones). All other values in the examples are valid identifiers you can use as-is for testing.

---

## Prerequisites

- **1Click JWT** – Request at [partners.near-intents.org](https://partners.near-intents.org).
- **Arbitrum wallet** with USDC and ETH for gas.
- **NEAR account** to receive (e.g. `yourname.near`).

---

## Endpoints with exact example values

### 1. GET /v0/tokens – list supported tokens (get asset IDs)

Returns all supported tokens; use it to confirm asset IDs or pick a different destination (e.g. USDC on NEAR).

```bash
curl -s -X GET "https://1click.chaindefuser.com/v0/tokens" \
  -H "Authorization: Bearer YOUR_JWT" | jq .
```

**Example response (extract):** look for `blockchain: "arb"` + `symbol: "USDC"` for origin, and `blockchain: "near"` + `symbol: "USDC"` or `"wNEAR"` for destination. Use their `assetId` in the quote below if different from the examples.

---

### 2. POST /v0/quote – get deposit address (Arbitrum) and amount to send

**URL:** `https://1click.chaindefuser.com/v0/quote`  
**Method:** `POST`  
**Headers:** `Authorization: Bearer YOUR_JWT`, `Content-Type: application/json`

**Example body (exact values):**

| Field | Example value | Meaning |
|-------|----------------|--------|
| `originAsset` | `nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near` | USDC on Arbitrum |
| `destinationAsset` | `nep141:wrap.near` | Receive wNEAR on NEAR (or use USDC on NEAR assetId from /tokens) |
| `amount` | `1000000` | 1 USDC (6 decimals) |
| `recipient` | `alice.near` | NEAR account that receives |
| `refundTo` | `0x742d35Cc6634C0532925a3b844Bc454e4438f44e` | Arbitrum address for refunds |
| `deadline` | `2026-02-01T15:00:00.000Z` | Quote valid until this time (use a time ~1 hour from now in real use) |

**Copy-paste curl (replace `YOUR_JWT`, and optionally recipient/refundTo/deadline):**

```bash
curl -s -X POST "https://1click.chaindefuser.com/v0/quote" \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "dry": false,
    "swapType": "EXACT_INPUT",
    "slippageTolerance": 100,
    "originAsset": "nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near",
    "depositType": "ORIGIN_CHAIN",
    "destinationAsset": "nep141:wrap.near",
    "amount": "1000000",
    "refundTo": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "refundType": "ORIGIN_CHAIN",
    "recipient": "alice.near",
    "recipientType": "DESTINATION_CHAIN",
    "deadline": "2026-02-01T15:00:00.000Z",
    "quoteWaitingTimeMs": 0
  }' | jq .
```

**From the response use:**
- `quote.depositAddress` – Arbitrum address (0x...) to send USDC to
- `quote.amountIn` – amount to send (smallest units)
- `quote.depositMemo` – if present, use in Step 4 and 5

---

### 3. Send USDC on Arbitrum (your wallet)

In MetaMask (Arbitrum One), send **USDC** to the **`depositAddress`** from Step 2, amount = **`amountIn`** from the quote. Copy the **Arbitrum transaction hash** after confirmation.

---

### 4. POST /v0/deposit/submit – notify 1Click of your deposit

**URL:** `https://1click.chaindefuser.com/v0/deposit/submit`  
**Method:** `POST`  
**Headers:** `Authorization: Bearer YOUR_JWT`, `Content-Type: application/json`

**Example body (replace with your quote response and real tx hash):**

| Field | Example value |
|-------|----------------|
| `txHash` | `0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234` |
| `depositAddress` | `0x1234567890123456789012345678901234567890` |
| `memo` | *(only if quote included depositMemo)* |

**Copy-paste curl (no memo):**

```bash
curl -s -X POST "https://1click.chaindefuser.com/v0/deposit/submit" \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "txHash": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234",
    "depositAddress": "0x1234567890123456789012345678901234567890"
  }' | jq .
```

**Copy-paste curl (with memo – use when quote returned depositMemo):**

```bash
curl -s -X POST "https://1click.chaindefuser.com/v0/deposit/submit" \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "txHash": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234",
    "depositAddress": "0x1234567890123456789012345678901234567890",
    "memo": "PASTE_DEPOSIT_MEMO_FROM_QUOTE_HERE"
  }' | jq .
```

Use the **actual** `depositAddress` and `txHash` from your quote and Arbitrum tx. Do **not** send `nearSenderAccount` for Arbitrum-origin.

---

### 5. GET /v0/status – check execution status

**URL (no memo):**  
`https://1click.chaindefuser.com/v0/status?depositAddress=0x1234567890123456789012345678901234567890`

**URL (with memo):**  
`https://1click.chaindefuser.com/v0/status?depositAddress=0x1234567890123456789012345678901234567890&depositMemo=PASTE_DEPOSIT_MEMO_FROM_QUOTE_HERE`

**Copy-paste curl (no memo):**

```bash
curl -s -X GET "https://1click.chaindefuser.com/v0/status?depositAddress=0x1234567890123456789012345678901234567890" \
  -H "Authorization: Bearer YOUR_JWT" | jq .
```

**Copy-paste curl (with memo):**

```bash
curl -s -X GET "https://1click.chaindefuser.com/v0/status?depositAddress=0x1234567890123456789012345678901234567890&depositMemo=PASTE_DEPOSIT_MEMO_FROM_QUOTE_HERE" \
  -H "Authorization: Bearer YOUR_JWT" | jq .
```

Replace `depositAddress` (and `depositMemo` if used) with the **exact** values from your Step 2 quote response. Poll until `status` is `SUCCESS`, `REFUNDED`, or `FAILED`.

---

## Summary checklist

| Step | Endpoint | Action |
|------|----------|--------|
| 1 | `GET https://1click.chaindefuser.com/v0/tokens` | Get asset IDs; confirm USDC Arbitrum / wNEAR or USDC NEAR. |
| 2 | `POST https://1click.chaindefuser.com/v0/quote` | Get `depositAddress`, `amountIn`, `depositMemo`, `deadline`. |
| 3 | (Wallet) | Send USDC on Arbitrum to `depositAddress`, amount `amountIn`; copy tx hash. |
| 4 | `POST https://1click.chaindefuser.com/v0/deposit/submit` | Send `txHash`, `depositAddress`, and optional `memo`. |
| 5 | `GET https://1click.chaindefuser.com/v0/status?depositAddress=...` | Poll until status is SUCCESS / REFUNDED / FAILED. |

---

## Quick reference – all endpoints (exact URLs)

| Method | URL | Purpose |
|--------|-----|--------|
| GET | `https://1click.chaindefuser.com/v0/tokens` | List supported tokens (asset IDs, decimals). |
| POST | `https://1click.chaindefuser.com/v0/quote` | Get quote and deposit address (body: see Step 2). |
| POST | `https://1click.chaindefuser.com/v0/deposit/submit` | Submit deposit tx hash (body: txHash, depositAddress, optional memo). |
| GET | `https://1click.chaindefuser.com/v0/status?depositAddress=<0x...>[&depositMemo=<memo>]` | Get execution status. |

All requests (except some token lists) require header: **`Authorization: Bearer YOUR_JWT`**.

---

## Notes

- **Mainnet:** Base URL `https://1click.chaindefuser.com` is mainnet.
- **Refunds:** Go to `refundTo` on Arbitrum if the swap fails or times out.
- **Deadline:** Use a real deadline ~1 hour in the future when you run the quote (e.g. `date -u -d '+1 hour' +%Y-%m-%dT%H:%M:%S.000Z` on Linux).
- **Docs:** [1Click API](https://docs.near-intents.org/near-intents/integration/distribution-channels/1click-api).
