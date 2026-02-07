# Relayer deploy (GCP Cloud Run)

## Image must be linux/amd64

Cloud Run runs **linux/amd64** only. If you built on Apple Silicon you get ARM64 and deploy will fail. Rebuild for amd64 and push, then re-run `terraform apply`.

**Option A – Local Docker (retry if rustup fails):**
```bash
cd /Users/ay/core/pagoda-relayer-rs
docker build --platform linux/amd64 -t us-central1-docker.pkg.dev/vestra-486607/relayer/os-relayer:latest .
docker push us-central1-docker.pkg.dev/vestra-486607/relayer/os-relayer:latest
```

**Option B – Cloud Build (no local Docker):**  
Enable Cloud Build API and ensure your user has **Cloud Build Editor** (or **Owner**) on the project, then:
```bash
cd /Users/ay/core/pagoda-relayer-rs
gcloud builds submit --tag us-central1-docker.pkg.dev/vestra-486607/relayer/os-relayer:latest --timeout=30m .
```

---

## Deploy

One-time: authenticate Terraform with GCP:

```bash
gcloud auth application-default login
```

Deploy:

```bash
cd /Users/ay/core/relayer-deploy
terraform plan
terraform apply -auto-approve
```

Get the relayer URL:

```bash
gcloud run services describe testnet-relayer-vestra --region=us-central1 --format='value(status.url)'
```

Set that URL in `vestra-app/.env` as `VITE_RELAYER_URL=<url>` (no trailing slash).

---

## API reference and examples

- **Swagger UI** (your deployed relayer): `https://<relayer-url>/swagger-ui/#/`  
  Example: [testnet-relayer-vestra (Swagger)](https://testnet-relayer-vestra-3hf6lf4xha-uc.a.run.app/swagger-ui/#/)
- **OpenAPI JSON**: `https://<relayer-url>/api-docs/openapi.json`
- **NEAR docs**: [Building a Meta Transaction Relayer](https://docs.near.org/chain-abstraction/meta-transactions-relayer)
- **Pagoda relayer (Rust)**: [near/pagoda-relayer-rs](https://github.com/near/pagoda-relayer-rs) — README has example payloads; `/examples` has configs for whitelist, Redis, etc.

**Sending a meta transaction**

- **`POST /relay`** — Body: **JSON array of bytes** (borsh-serialized `SignedDelegateAction`), e.g. `[1,2,3,...]`.  
  The OpenAPI may show `application/octet-stream`; in practice the server expects `Content-Type: application/json` with a JSON array of numbers (see [pagoda-relayer-rs README](https://github.com/near/pagoda-relayer-rs#api-spec)).
- **`POST /send_meta_tx`** and **`POST /send_meta_tx_async`** — Body: JSON object `SignedDelegateAction` (see example in the OpenAPI description / Swagger).

---

## Testing the relayer

Use a **sender account different from the relayer** (so the sender’s nonce isn’t advanced by other relayer traffic). Put the sender key in `account_keys/` (e.g. `vitalant2170-key.json`). Format: JSON array of `{ "account_id", "public_key", "secret_key" }`. Key files in `account_keys/` are gitignored.

From `vestra-app`:

```bash
npm run test:relayer
```

Uses `../relayer-deploy/account_keys/vitalant2170-key.json` (or `RELAYER_TEST_KEY_PATH`). Optional: `RELAYER_URL` (default: testnet relayer). Builds a minimal `SignedDelegateAction`, POSTs to `/relay`, prints `txHash` on success.

Gasless send (wNEAR or USDC to any address): `npm run test:relayer:send`. Optional env: `RECEIVER_ID`, `TOKEN`, `AMOUNT`, `USDC_CONTRACT` (if `TOKEN=USDC`).
