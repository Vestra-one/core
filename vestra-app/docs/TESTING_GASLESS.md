# Gasless (NEP-366) payments

## Overview

Gasless is **optional**. The app uses two paths:

1. **Gasless (meta tx)** – when **both** are set:
   - `VITE_RELAYER_URL` (Pagoda relayer base URL)
   - `signDelegateActionForMetaTx` provided to `WalletProvider` (e.g. from FastAuth or a wallet that supports sign-only)

2. **Direct (user pays gas)** – in all other cases: no relayer URL, or no signer. The user signs and sends the transaction with their wallet and pays gas.

The app chooses the path automatically. When gasless is configured but the relay fails, the Single Payment form shows an error and a **“Pay with wallet instead (you pay gas)”** option so the user can retry with the direct method.

## Production setup

- **Relayer:** Use [pagoda-relayer-rs](https://github.com/near/pagoda-relayer-rs). Deploy and set `VITE_RELAYER_URL` to your relayer base URL.
- **Signer:** Provide `signDelegateActionForMetaTx` when rendering `WalletProvider` (e.g. from FastAuth SDK or a wallet integration that can sign a `DelegateAction` without sending). Without this, the app will not use the gasless path.

## Testing without gasless

- Do not set `VITE_RELAYER_URL` (or leave it empty).
- Run the app, connect a NEAR wallet, and send a payment. You will be prompted to sign and send; you pay gas (direct flow).

## Testing with gasless

You need a running Pagoda relayer and a signer that implements `SignDelegateAction` (e.g. FastAuth). Wire the signer into `WalletProvider` via the `signDelegateActionForMetaTx` prop. Set `VITE_RELAYER_URL` to your relayer base URL. Then the app will use the gasless path when both are available.
