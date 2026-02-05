# Vestra NEP-366 Relayer

Small HTTP relayer for NEP-366 meta transactions. Accepts a serialized `SignedDelegateAction`, wraps it in a transaction signed by the relayer account, and submits to NEAR. The relayer pays gas; the user’s actions run as if the user had sent the tx.

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
  Body: JSON array of bytes (borsh-serialized `SignedDelegateAction`), e.g. `[1,2,3,...]`.  
  Response: `{ txHash, data }` (NEAR outcome).

## App integration

In the Vestra app `.env` set:

- `VITE_RELAYER_URL=http://localhost:3031` (or your deployed relayer URL).

For **dev/testing** only, you can use a key-based signer so the app can create and sign the delegate action without a wallet that supports “sign only”:

- `VITE_DEV_META_TX_SIGNER_KEY=ed25519:...`
- `VITE_DEV_META_TX_SIGNER_ACCOUNT=your-account.testnet`

Then connect with that same account in the wallet; the app will use the relayer (gasless) for the deposit step when both relayer URL and dev signer are set.

In production, use a relayer with contract/sender whitelisting (e.g. [pagoda-relayer-rs](https://github.com/near/pagoda-relayer-rs)) and a signer that supports sign-only (e.g. FastAuth or a wallet that adds support).
