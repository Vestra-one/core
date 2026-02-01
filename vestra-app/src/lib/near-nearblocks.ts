/**
 * NearBlocks API for account transaction history.
 * Same data source used by NEAR Explorer and many deployed NEAR apps.
 * @see https://docs.near.org/tools/ecosystem-apis/nearblocks
 */

import { NEAR_NETWORK } from "./near";

const NEARBLOCKS_BASE: Record<"mainnet" | "testnet", string> = {
  mainnet: "https://api.nearblocks.io",
  testnet: "https://api-testnet.nearblocks.io",
};

const YOTTO_NEAR = 1e24;

export type NearBlocksTxn = {
  id: string;
  predecessor_account_id: string;
  receiver_account_id: string;
  transaction_hash: string;
  block_timestamp: string;
  receipt_outcome?: { status?: boolean };
  actions?: Array<{ action: string; method?: string; deposit?: string }>;
  actions_agg?: { deposit?: number };
};

export type NearBlocksTxnsResponse = {
  cursor?: string;
  txns: NearBlocksTxn[];
};

/**
 * Fetch recent transactions for an account from NearBlocks.
 * GET only; no API key required for basic use.
 */
export async function getAccountTransactions(
  accountId: string,
  network: "mainnet" | "testnet" = NEAR_NETWORK,
  limit = 20,
): Promise<NearBlocksTxnsResponse> {
  const base = NEARBLOCKS_BASE[network];
  const url = `${base}/v1/account/${encodeURIComponent(accountId)}/txns?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`NearBlocks error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<NearBlocksTxnsResponse>;
}

/**
 * Map a NearBlocks txn to a display-friendly activity.
 */
export function mapTxnToActivity(
  txn: NearBlocksTxn,
  currentAccountId: string,
): {
  id: string;
  type: string;
  title: string;
  recipient?: string;
  amount: string;
  usdEquivalent: string;
  status: string;
  date: string;
} {
  const isOutgoing =
    txn.predecessor_account_id.toLowerCase() === currentAccountId.toLowerCase();
  const other =
    isOutgoing ? txn.receiver_account_id : txn.predecessor_account_id;
  const depositYocto = txn.actions_agg?.deposit ?? 0;
  const amountNear = depositYocto / YOTTO_NEAR;
  const amountStr =
    amountNear > 0
      ? `${amountNear.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} NEAR`
      : "—";
  const tsNs = txn.block_timestamp;
  const dateIso =
    tsNs && /^\d+$/.test(tsNs)
      ? new Date(Number(BigInt(tsNs) / BigInt(1e6))).toISOString()
      : new Date().toISOString();
  const status = txn.receipt_outcome?.status === true ? "completed" : "failed";
  const method =
    txn.actions?.[0]?.method ?? txn.actions?.[0]?.action ?? "transaction";
  const title =
    amountNear > 0
      ? `${isOutgoing ? "Transfer to" : "Received from"} ${other}`
      : `${method} ${isOutgoing ? "→" : "←"} ${other}`;

  return {
    id: txn.id ?? txn.transaction_hash ?? "",
    type: isOutgoing ? "transfer" : "transfer",
    title,
    recipient: other,
    amount: amountStr,
    usdEquivalent: "—",
    status,
    date: dateIso,
  };
}
