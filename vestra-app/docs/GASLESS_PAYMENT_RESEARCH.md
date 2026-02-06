# Gasless payment (deposit) flow – research summary

This doc compares ways to make the **payment send step** (sending tokens to the 1Click deposit address) gasless for the user on NEAR, and whether any approach is better than meta transactions.

---

## 1. Meta transactions (NEP-366) – NEAR’s native gasless mechanism

**What it is:** User builds a **DelegateAction** (receiver + actions), signs it **off-chain** → **SignedDelegateAction**. A **relayer** (your or third-party server) receives it, wraps it in a transaction signed by the relayer, and submits to NEAR. The relayer pays gas (and any attached balance, e.g. storage deposit); actions execute as if the user had sent the tx.

**Pros:**
- Only standard, protocol-level way to sponsor gas on NEAR (no contract changes required for FT contracts).
- User keeps custody; only signs intent, does not need NEAR for gas.
- Reference implementations exist: [pagoda-relayer-rs](https://github.com/near/pagoda-relayer-rs), [SurgeCode/near-relay-example](https://github.com/SurgeCode/near-relay-example), [@near-relay](https://github.com/near/near-relay).
- Relayer can whitelist contracts (e.g. only `usdc.tether-token.near` + `wrap.near`) and cap risk.

**Cons:**
- Relayer pays gas **and** attached balance (e.g. `storage_deposit` + 1 yocto for `ft_transfer`). If the inner tx fails, **balance refunds go to the user**, not the relayer – so relayer must validate (e.g. balance checks) or accept some trust/risk.
- **Wallet limitation:** NEAR Wallet Selector / external wallets (MyNearWallet, etc.) generally only support **sign and send**, not **sign only**. So to use meta tx with “connect wallet” users you need either:
  - Wallets to add “sign only” support (not standard yet), or
  - Another signing path (e.g. in-app key, or FastAuth) that can produce a SignedDelegateAction and send it to your relayer.

**Docs:** [Meta Transactions](https://docs.near.org/build/chain-abstraction/meta-transactions), [Building a Meta Transaction Relayer](https://docs.near.org/chain-abstraction/meta-transactions-relayer).

---

## 2. Other approaches (and why they’re not “better” for this use case)

### FastAuth

- **What:** MPC-based auth (email/social, passkeys); users get a NEAR account without seed phrase. Supports **gasless transactions** via a relayer.
- **Relation to meta tx:** FastAuth still uses **meta transactions under the hood** (relayer + SignedDelegateAction). The difference is **who signs**: FastAuth’s signer app / MPC recovery service signs the DelegateAction instead of the user’s wallet.
- **Verdict:** Same gasless mechanism; better if you want gasless **and** passwordless/social onboarding. Not a replacement for NEP-366; it’s one way to implement it for a specific key model.

### Chain signatures

- **What:** NEAR accounts (including contracts) can **sign for other chains** (Bitcoin, Ethereum, Solana, etc.) via MPC.
- **Verdict:** For **cross-chain** operations, not for making NEAR-native transfers gasless. Not an alternative to meta tx for your deposit step.

### Multichain gas station contract

- **What:** Pay in NEAR to get **gas on foreign chains** (e.g. EVM); contract + relayer sign and fund tx on the other chain.
- **Verdict:** For gas on **non-NEAR** chains. Does not provide gasless execution **on NEAR** for your payment step.

### Near-vouchers (offline payment)

- **What:** User locks funds in a contract; payment is claimed later via link/QR (offline-style flow).
- **Verdict:** Different product (voucher/claim flow), not gas sponsorship for an on-chain send to a 1Click deposit address.

### Aurora gas abstraction

- **What:** On Aurora (EVM on NEAR), virtual chains can offer custom gas rules (e.g. pay in a custom token or fully gasless).
- **Verdict:** EVM/Aurora stack, not native NEAR. Your flow is NEAR-native (NEP-141 FT transfer on NEAR), so not a direct alternative.

### EVM-style paymasters (ERC-4337)

- **What:** On EVM, paymasters sponsor gas via Account Abstraction; no relayer private key needed for the user’s tx.
- **Verdict:** NEAR has no equivalent on-chain paymaster standard. On NEAR, **relayer + DelegateAction is the native “sponsor gas” pattern**; there isn’t a second, “better” protocol for gasless that avoids meta tx.

---

## 3. Conclusion and recommendation

- For **gasless payment (deposit) on NEAR**, **meta transactions (NEP-366) with a relayer are the only native, standard approach.** The alternatives above either solve a different problem (cross-chain, vouchers, Aurora) or use the same meta-tx mechanism with different auth (FastAuth).
- **Recommendation:** Proceed with **meta transactions** for the deposit step. Next steps:
  1. **Relayer:** Run your own (e.g. pagoda-relayer-rs or a small Node service using near-api-js + `signedDelegate`) or use a third-party relayer if available. Configure whitelisting (e.g. only your quote’s FT contracts and 1Click deposit flows).
  2. **Client:** Build a path that produces a **SignedDelegateAction** for the same actions you use today (`storage_deposit` + `ft_transfer` to `quote.depositAddress`), then POST it to the relayer instead of calling `signAndSendTransaction`.
  3. **Wallet constraint:** If you keep “connect with Wallet Selector,” you are blocked until wallets support “sign only” (or you add a second, sign-only-capable path like FastAuth or in-app key). If you control the signing (e.g. FastAuth or in-app), you can implement the full gasless flow immediately.

---

## 4. Implementation in this repo

NEP-366 meta transactions are implemented as follows:

- **Relayer client** (`src/lib/intents/relayer.ts`): POST serialized `SignedDelegateAction` to Pagoda relayer `VITE_RELAYER_URL/relay` (body: `{ borsh_signed_delegate_action: number[] }`).
- **Meta tx params** (`src/lib/intents/metaTx.ts`): `buildTransferDelegateParams(quote, originAssetId)` builds the same `storage_deposit` + `ft_transfer` actions for signing.
- **Transfer via relayer** (`src/lib/intents/transfer.ts`): `executeIntentTransferViaRelayer(quote, accountId, serializedSignedDelegate, relayerUrl)` sends to relayer, then submits tx hash to 1Click.
- **Wallet context**: Exposes `relayerUrl` and `signDelegateActionForMetaTx`. The signer is provided via `WalletProvider` prop `signDelegateActionForMetaTx` (e.g. from FastAuth or a wallet that supports sign-only). When both relayer URL and signer are set, Single Payment and Batch Manual Entry use the gasless path.
- **Production relayer**: Use [pagoda-relayer-rs](https://github.com/near/pagoda-relayer-rs). Optional standalone Node relayer in `relayer/` has a different API and is not used by the app.

No other protocol or hosted service was found for gasless NEAR transfers; NEP-366 with your own relayer is the standard approach.

---

## 5. References

- [NEP-366 Meta Transactions](https://github.com/near/NEPs/pull/366)
- [NEAR Docs: Meta Transactions](https://docs.near.org/build/chain-abstraction/meta-transactions)
- [NEAR Docs: Building a Meta Transaction Relayer](https://docs.near.org/chain-abstraction/meta-transactions-relayer)
- [pagoda-relayer-rs](https://github.com/near/pagoda-relayer-rs) (Rust reference relayer, whitelisting, allowances)
- [SurgeCode/near-relay-example](https://github.com/SurgeCode/near-relay-example) (client + server TS example)
- [@near-relay](https://github.com/near/near-relay) (client/server libs that simplify DelegateAction signing and relaying)
