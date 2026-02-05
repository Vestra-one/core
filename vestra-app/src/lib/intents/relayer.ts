/**
 * NEP-366 meta transaction relayer client.
 * Sends a serialized SignedDelegateAction to a relayer; the relayer wraps it in a tx and submits (relayer pays gas).
 */

export type RelayResult = {
  txHash: string;
  /** Full outcome from relayer if returned. */
  outcome?: unknown;
};

/**
 * POST serialized SignedDelegateAction to relayer and return tx hash from outcome.
 * Relayer endpoint must accept body: JSON array of bytes (Uint8Array as number[]), or base64 string depending on relayer.
 * Pagoda relayer /send_meta_tx accepts JSON { delegate_action, signature }; our own relayer accepts borsh bytes as number[].
 */
export async function relaySignedDelegateAction(
  serializedSignedDelegate: Uint8Array,
  relayerUrl: string,
  options?: { contentType?: "json-array" | "base64" }
): Promise<RelayResult> {
  const base = relayerUrl.replace(/\/$/, "");
  const endpoint = `${base}/relay`;
  const contentType = options?.contentType ?? "json-array";

  function toBase64(bytes: Uint8Array): string {
    let binary = "";
    const chunk = 8192;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }

  const body =
    contentType === "base64"
      ? JSON.stringify({ signed_delegate_action: toBase64(serializedSignedDelegate) })
      : JSON.stringify(Array.from(serializedSignedDelegate));

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
