# Vestra

Intent-based payroll on NEAR. Cross-chain payouts, full audit trail, and optional gasless execution—built for teams that need payments to be reliable and observable.

---

## Overview

Vestra is a web application and supporting infrastructure for sending stable, cross-chain payments from NEAR to multiple destinations (e.g. Arbitrum, Ethereum). It uses **intent-based flows** and the **1Click** integration so that each transfer is quoted, executed, and traceable end-to-end. Single payments, bulk CSV uploads, and scheduled flows are supported; you can add email, SMS, and webhooks via a simple backend contract.

---

## Capabilities

| Capability | Description |
|------------|-------------|
| **Cross-chain payouts** | Send from NEAR to EVM and other chains. One quote, one deposit, one status—no manual bridging. |
| **Single & bulk** | Manual entry per payment or CSV upload for batches. Same intent pipeline and tracking for every transfer. |
| **Gasless (optional)** | NEP-366 meta transactions and relayer support so recipients don’t need gas upfront. |
| **Observable** | Per-transfer status (Completed, Processing, Pending), transaction hash, and deposit address. Explorer links and copy for every payment. |

---

## Observability & integration

- **Audit trail:** Every payment exposes a NEAR transaction hash and 1Click deposit address. Use them in your own tools or export for compliance.
- **Payment events:** When a payment reaches a known status, the app can POST an event to your backend. Your service can then send email, SMS, or call webhooks. Contract and payload are documented: [Payment notifications](vestra-app/docs/PAYMENT_NOTIFICATIONS.md).

---

## Design

- **Single source of truth:** Payment status is determined once (after deposit + 1Click status) and drives both the UI and the optional event to your backend.
- **Fire-and-forget reporting:** Notification payloads are sent asynchronously; the UI never blocks on your backend.
- **Explicit env:** No hidden defaults in production. API base URL, 1Click JWT, relayer URL, and network are configured via environment variables.

---

## Development

To run the app locally, contribute, or extend integrations, see the [Developer guide](vestra-app/docs/README.md) (setup, env, scripts, and doc index).
