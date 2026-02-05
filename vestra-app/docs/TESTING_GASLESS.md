# Building and testing gasless (NEP-366) payments

## Requirements

- **Node.js 20.19+ or 22.12+** (Vite 7 and some deps require it). Check with `node -v`.
- If you hit EACCES during `npm install`, fix cache ownership:  
  `sudo chown -R $(whoami) ~/.npm`  
  Or install with a local cache:  
  `npm install --cache ./.npm-tmp-cache`

## Build

From the `vestra-app` directory:

```bash
npm install
npm run build
```

If `tsc` fails on existing type errors (e.g. tokens type, test types), you can try bundling without type-check:

```bash
npm run build:vite
```

That runs only `vite build` (no `tsc -b`). Use after fixing or working around type errors so the app at least bundles.

---

## Is gasless optional? (Direct method fallback)

**Yes.** Gasless is optional. The app always has two paths:

1. **Gasless (meta tx)** – used only when **both** are set:
   - `VITE_RELAYER_URL` (relayer endpoint)
   - A meta-tx signer (e.g. dev signer via `VITE_DEV_META_TX_SIGNER_KEY` + `VITE_DEV_META_TX_SIGNER_ACCOUNT`, or a future wallet that supports “sign only”)

2. **Direct (user pays gas)** – used in all other cases:
   - No relayer URL, or
   - No signer available

So if you **don’t** set `VITE_RELAYER_URL` (or the relayer is down), the user always uses the **direct method**: they sign and send the transaction with their wallet and pay gas as before. There is no need for the user to “choose” – the app picks the path automatically.

When gasless **is** configured but the relay **fails** (e.g. relayer down), the Single Payment form shows an error and a **“Pay with wallet instead (you pay gas)”** button so the user can retry the same payment using the direct method without re-entering the form.

---

## How to test

### 1. Test **without** gasless (direct method)

- Do **not** set `VITE_RELAYER_URL` (or leave it empty).
- Run the app: `npm run dev`.
- Connect your NEAR wallet, go to Single Payment or Batch Manual Entry, and send a payment.
- You should be prompted by the wallet to sign and send the transaction; you pay gas. This is the normal, direct flow.

### 2. Test **with** gasless (relayer + dev signer)

You need a relayer and a way to sign the delegate action. For local testing we use the bundled relayer and a dev-only key signer.

**Step A – Run the relayer**

```bash
cd vestra-app/relayer
cp .env.example .env
# Edit .env: set RELAYER_ACCOUNT_ID and RELAYER_PRIVATE_KEY (a funded NEAR testnet account)
npm install
npm run dev
```

The relayer listens on `http://localhost:3031` (or the port in `PORT`).

**Step B – Configure the app for gasless**

In `vestra-app/.env`:

```env
VITE_RELAYER_URL=http://localhost:3031
# Dev-only: use the same account you will connect with in the wallet
VITE_DEV_META_TX_SIGNER_ACCOUNT=your-account.testnet
VITE_DEV_META_TX_SIGNER_KEY=ed25519:your_private_key_here
```

Use a **testnet** account and key. The account must have enough FT (e.g. wNEAR or USDC on NEAR) to cover the transfer; the relayer pays gas and storage deposit.

**Step C – Run the app and send a payment**

```bash
cd vestra-app
npm run dev
```

- Connect with the **same** account as `VITE_DEV_META_TX_SIGNER_ACCOUNT`.
- Go to Single Payment (or Batch Manual Entry), fill the form, and send.
- The app will use the dev signer to create a signed delegate action and POST it to the relayer. The relayer submits the transaction (you don’t sign in the wallet for this step). You should see success and the transfer should complete without you paying NEAR gas.

**Step D – Confirm it’s gasless**

- Check relayer logs: you should see a successful POST and a transaction hash.
- On-chain: the transaction is from the relayer account, but the inner actions are executed as your account (NEP-366).

### 3. Test fallback (relayer down)

- Set `VITE_RELAYER_URL` and the dev signer as above, then **stop the relayer**.
- Send a payment. The relay request will fail; the app will show an error (it does not automatically retry with the direct method in the current implementation – the user can retry after starting the relayer or after removing `VITE_RELAYER_URL` to use the direct method).

To make “direct method” available when relayer fails, you could add a retry path that catches relay errors and calls `executeIntentTransfer` instead; that would be a small follow-up.

---

## Will it work?

- **Direct method:** Yes – it’s the existing flow (wallet signs and sends; user pays gas). No new dependencies for that path.
- **Gasless path:** It will work if:
  1. **Node 20+** is used (required by Vite 7 and some deps).
  2. The relayer runs and is reachable at `VITE_RELAYER_URL`.
  3. The relayer account is funded with NEAR (for gas + any storage deposit).
  4. You have a valid signer (dev signer with correct account + key, or a wallet that supports sign-only).
  5. Your NEAR network (mainnet/testnet) matches the relayer and 1Click config.

The code follows NEP-366 and the same patterns as the [SurgeCode near-relay-example](https://github.com/SurgeCode/near-relay-example) and NEAR docs. Remaining risks are environment-specific: wrong env vars, relayer underfunded, or API differences in your exact `@near-js` versions. If the build passes and the relayer starts, the next step is to run the flow once on testnet and confirm the transaction on an explorer.
