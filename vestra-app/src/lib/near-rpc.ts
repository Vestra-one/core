/**
 * NEAR RPC helpers used by deployed NEAR apps to show balance.
 * Uses CORS-enabled public RPC (official rpc.*.near.org blocks browser CORS).
 * @see https://docs.near.org/api/rpc/providers
 */

import { NEAR_NETWORK } from "./near";

const DEFAULT_RPC: Record<"mainnet" | "testnet", string> = {
  mainnet: "https://free.rpc.fastnear.com",
  testnet: "https://rpc.testnet.fastnear.com",
};

function getRpcUrl(network: "mainnet" | "testnet"): string {
  const env = import.meta.env.VITE_NEAR_RPC_URL;
  if (typeof env === "string" && env.trim() !== "") return env.trim().replace(/\/$/, "");
  return DEFAULT_RPC[network];
}

const YOTTO_NEAR = 1e24;

type ViewAccountResult = {
  amount: string;
  locked: string;
  code_hash: string;
  storage_usage: number;
  storage_paid_at: number;
  block_height: number;
  block_hash: string;
};

type RpcQueryResponse = {
  jsonrpc: string;
  id: number;
  result?: ViewAccountResult;
  error?: { code: number; message: string };
};

/**
 * Fetch account balance from NEAR RPC (view_account).
 * Same approach used by NEAR Explorer and wallet UIs.
 */
export async function getAccountBalance(
  accountId: string,
  network: "mainnet" | "testnet" = NEAR_NETWORK,
): Promise<{ total: string; available: string; inNear: number }> {
  const url = getRpcUrl(network);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "query",
      params: {
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      },
    }),
  });
  const data = (await res.json()) as RpcQueryResponse;
  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? `RPC error: ${res.statusText}`);
  }
  const result = data.result;
  if (!result) {
    throw new Error("No result from view_account");
  }
  const totalYocto = BigInt(result.amount);
  const lockedYocto = BigInt(result.locked);
  const availableYocto = totalYocto - lockedYocto;
  const inNear = Number(availableYocto) / YOTTO_NEAR;
  return {
    total: result.amount,
    available: availableYocto.toString(),
    inNear,
  };
}
