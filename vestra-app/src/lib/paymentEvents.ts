/**
 * Payment status reporting: single integration point for notifying the backend
 * when a payment reaches a terminal or intermediate status. The backend can then
 * send email, SMS, and/or fire webhooks.
 *
 * When VITE_API_URL is set, POSTs to POST /api/payments/events (or the base URL
 * you configure). If no backend is configured, the call is a no-op.
 *
 * @see docs/PAYMENT_NOTIFICATIONS.md for backend contract and mail/SMS/webhook integration.
 */

import { apiBaseUrl } from "./api";

/** Execution status from 1Click getExecutionStatus. */
export type PaymentExecutionStatus =
  | "SUCCESS"
  | "PROCESSING"
  | "KNOWN_DEPOSIT_TX"
  | "PENDING_DEPOSIT"
  | string;

export type PaymentStatusPayload = {
  /** NEAR account that initiated the transfer (sender). */
  senderAccountId: string;
  /** Destination chain recipient address (EVM 0x..., NEAR, etc.). */
  recipient: string;
  /** Human-readable amount (e.g. "100.50"). */
  amount: string;
  /** 1Click destination asset ID (e.g. for chain/token). */
  destinationAssetId: string;
  /** NEAR transaction hash (deposit tx). */
  txHash: string;
  /** 1Click deposit address (NEAR account). */
  depositAddress: string;
  /** 1Click deposit memo for status polling. */
  depositMemo: string;
  /** Status from getExecutionStatus. */
  status: PaymentExecutionStatus;
  /** ISO timestamp when the status was determined. */
  occurredAt: string;
  /** Optional: origin asset symbol for display (e.g. "USDC", "wNEAR"). */
  originSymbol?: string;
  /** Optional: destination chain id for display. */
  chainId?: string;
};

const PAYMENT_EVENTS_PATH = "/api/payments/events";

/**
 * Reports a payment status event to the backend. The backend should:
 * - Persist the event for history and idempotency (e.g. by txHash + depositMemo).
 * - Send email/SMS to the sender (and optionally recipient) if configured.
 * - Call configured webhooks (e.g. Slack, internal CRM) with the payload.
 *
 * Fire-and-forget: does not block the UI. If apiBaseUrl is unset or the request
 * fails, errors are logged in dev only.
 */
export async function reportPaymentStatus(
  payload: PaymentStatusPayload,
): Promise<void> {
  const base = apiBaseUrl?.replace(/\/$/, "") ?? "";
  if (!base) return;

  const url = `${base}${PAYMENT_EVENTS_PATH}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    if (!res.ok && import.meta.env.DEV) {
      console.warn("[paymentEvents] Backend returned", res.status, await res.text());
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[paymentEvents] Failed to report payment status", err);
    }
  }
}
