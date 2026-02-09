# Invoice upload

The app parses PDF invoices to pre-fill **three fields** on **New Payment** and **Bulk Upload** (batch) pages:

1. **Recipient chain**
2. **Recipient address**
3. **Amount** (with token denom, e.g. 1000 USDC)

Use **Upload Invoice** on either form to select a PDF; the backend extracts these fields and fills the form(s). Invoice PDFs can be any layout—we parse these three fields from the text.

## Where it appears

- **New Payment** (`/payments/manual`): "Upload Invoice" next to the recipient label. Parsing fills recipient, amount, token, and **destination chain** from the first line.
- **Bulk Upload** (`/payments/bulk`): "Upload Invoice" in the Batch Manual Entry header. Parsed lines are appended as new rows with **recipient chain**, recipient address, and amount (with token).

## Expected PDF content

The parser extracts:

- **Recipient chain**: A supported chain name (e.g. Ethereum, Polygon, Arbitrum, NEAR, Base, Solana). Can appear as a label like "Recipient chain: Ethereum" or anywhere near the address.
- **Recipient address**: EVM (`0x` + 40 hex) or NEAR (`*.near`, `*.testnet`).
- **Amount**: A number with optional decimals, optionally followed by a token (e.g. 1000 USDC, 1.5 ETH, 500 MATIC).

Text can be in any layout; the parser pairs addresses with nearby chain names and amounts.

## Sample PDF

A sample invoice PDF shows the exact three fields:

- **File**: `vestra-app/public/sample-invoice.pdf`
- **In app**: Use the "Sample PDF" link next to "Upload Invoice" on New Payment or Bulk Upload to download it.

The sample includes labeled lines: Recipient chain, Recipient address, Amount (with token). To regenerate:

```bash
cd vestra-app && npm run generate-sample-invoice
```

## API

- **Endpoint**: `POST /invoice/parse` (authenticated).
- **Body**: `multipart/form-data` with field `file` (PDF, max 10MB).
- **Response**: `{ lines: [{ chain?, address, amount, currency, description? }] }`.

`chain` is the display name (e.g. "Ethereum"); the frontend maps it to a chain ID. `currency` is the token symbol (e.g. "USDC").

See `vestra-api/src/routes/invoice.ts` for extraction logic.
