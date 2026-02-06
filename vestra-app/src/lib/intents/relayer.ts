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
 * Body: { borsh_signed_delegate_action: number[] }.
 */
export async function relaySignedDelegateAction(
  serializedSignedDelegate: Uint8Array,
  relayerUrl: string,
): Promise<RelayResult> {
  const base = relayerUrl.replace(/\/$/, "");
  const endpoint = `${base}/relay`;
  const body = JSON.stringify({
    borsh_signed_delegate_action: Array.from(serializedSignedDelegate),
  });

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
    const err = data as { message?: string; error?: string };
    throw new Error(err?.message ?? err?.error ?? `Relayer error: ${res.status} ${text.slice(0, 200)}`);
  }

  // Expect { txHash?: string, transaction_outcome?: { id?: string }, receipts_outcome?: [...], data?: { transaction_outcome?: ... } }
  const obj = data as Record<string, unknown>;
  const outcome = obj.data ?? obj;
  const outcomeObj = outcome as {
    transaction_outcome?: { id?: string };
    receipts_outcome?: Array<{ outcome?: { block_hash?: string } }>;
  };
  const txHash =
    (obj.txHash as string) ??
    outcomeObj?.transaction_outcome?.id ??
    outcomeObj?.receipts_outcome?.[0]?.outcome?.block_hash ??
    "";

  if (!txHash) {
    throw new Error("Relayer did not return a transaction hash");
  }

  return { txHash, outcome };
}
