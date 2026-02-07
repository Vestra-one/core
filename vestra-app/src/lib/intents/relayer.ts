/**
 * NEP-366 meta transaction relayer client.
 * Sends a serialized SignedDelegateAction to Pagoda relayer (pagoda-relayer-rs); the relayer
 * wraps it in a transaction and submits (relayer pays gas).
 */

export type RelayResult = {
  txHash: string;
  /** Full outcome from relayer if returned. */
  outcome?: unknown;
};

/**
 * POST serialized SignedDelegateAction to Pagoda relayer /relay.
 * Body: JSON array of bytes (number[]), i.e. borsh-serialized SignedDelegateAction.
 */
export async function relaySignedDelegateAction(
  serializedSignedDelegate: Uint8Array,
  relayerUrl: string,
): Promise<RelayResult> {
  const base = relayerUrl.replace(/\/$/, "");
  const endpoint = `${base}/relay`;
  const body = JSON.stringify(Array.from(serializedSignedDelegate));

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    throw new Error(`Relayer error: ${res.status} ${res.statusText} - ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    const err = data as {
      message?: string;
      error?: string;
      status?: unknown;
      "Transaction Outcome"?: unknown;
      "Receipts Outcome"?: Array<{ outcome?: { status?: unknown; Failure?: unknown } }>;
      [k: string]: unknown;
    };
    const top = err?.message ?? err?.error ?? "";
    // Relayer returns on-chain failure in status / Receipts Outcome; surface first failure reason
    let detail = top;
    const receipts = err?.["Receipts Outcome"];
    if (Array.isArray(receipts)) {
      for (const r of receipts) {
        const o = r?.outcome;
        const fail = (o as { status?: { Failure?: unknown } })?.status?.Failure ?? (o as { Failure?: unknown })?.Failure;
        if (fail != null) {
          detail = `${top} | on-chain: ${JSON.stringify(fail).slice(0, 300)}`;
          break;
        }
      }
    }
    if (!detail && err?.status != null) detail = `${top} | status: ${JSON.stringify(err.status).slice(0, 200)}`;
    throw new Error(`Relayer error (${res.status}): ${detail || text?.slice(0, 300) || res.statusText}`);
  }

  // Relayer returns { message, status, "Transaction Outcome": { id }, "Receipts Outcome": [...] } (pagoda-relayer-rs)
  const obj = data as Record<string, unknown>;
  const outcome = obj.data ?? obj;
  const txOutcome =
    (outcome as Record<string, unknown>)?.["Transaction Outcome"] ??
    (outcome as Record<string, unknown>)?.transaction_outcome;
  const txOutcomeId = (txOutcome as { id?: string })?.id;
  const receipts = (outcome as Record<string, unknown>)?.["Receipts Outcome"] ?? (outcome as Record<string, unknown>)?.receipts_outcome;
  const firstReceiptHash = Array.isArray(receipts)
    ? (receipts[0] as { outcome?: { block_hash?: string } })?.outcome?.block_hash
    : undefined;
  const txHash =
    (obj.txHash as string) ??
    txOutcomeId ??
    firstReceiptHash ??
    "";

  if (!txHash) {
    throw new Error("Relayer did not return a transaction hash");
  }

  return { txHash, outcome };
}
