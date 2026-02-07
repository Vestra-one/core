# Vestra NEP-366 Relayer (optional standalone)

Standalone HTTP relayer for NEP-366 meta transactions. **The Vestra app uses [pagoda-relayer-rs](https://github.com/near/pagoda-relayer-rs) in production** and does not connect to this server. This Node server is optional (e.g. for other clients or custom tooling that expect a raw byte-array `/relay` API).

Accepts a serialized `SignedDelegateAction` (as JSON array of bytes), wraps it in a transaction signed by the relayer account, and submits to NEAR. The relayer pays gas.

## Setup

1. Copy `.env.example` to `.env` and set:
   - `RELAYER_ACCOUNT_ID` – NEAR account that will pay gas
   - `RELAYER_PRIVATE_KEY` – Full-access key (ed25519:...)
   - `NEAR_NETWORK` – `mainnet` or `testnet`

2. Fund the relayer account with enough NEAR for gas (and any storage deposit the meta tx attaches).

3. Install and run:

   ```bash
   npm install
   npm run dev
   ```

   Server listens on `http://0.0.0.0:3031` by default.

## API

- **POST /relay**  
  Body: JSON array of bytes (borsh-serialized `SignedDelegateAction`), e.g. `[1,2,3,...]`, or `{ signed_delegate_action: "<base64>" }`.  
  Response: `{ txHash, data }` (NEAR outcome).

## Production (Vestra app)

The app sends to **Pagoda relayer** only: body `{ borsh_signed_delegate_action: number[] }`. Set `VITE_RELAYER_URL` to your Pagoda relayer base URL and provide `signDelegateActionForMetaTx` via `WalletProvider` (e.g. from FastAuth or a wallet that supports sign-only).
