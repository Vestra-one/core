/**
 * Dev-only meta tx signer using a private key from env (VITE_DEV_META_TX_SIGNER_KEY).
 * In production, use a wallet that supports sign-only or FastAuth.
 */

import { Account } from "@near-js/accounts";
import { Connection } from "@near-js/providers";
import { InMemorySigner } from "@near-js/signers";
import { encodeSignedDelegate } from "@near-js/transactions";
import type { Action } from "@near-js/transactions";
import { NEAR_NETWORK } from "../near";
import type { SignDelegateAction } from "./metaTx";

const BLOCK_HEIGHT_TTL = 120;

/**
 * Create a SignDelegateAction that signs with the key from VITE_DEV_META_TX_SIGNER_KEY.
 * Only available in dev when the env var is set. The key format is ed25519:... and the
 * account id is derived from the key or set via VITE_DEV_META_TX_SIGNER_ACCOUNT.
 */
export function createDevMetaTxSigner(): SignDelegateAction | null {
  const key = import.meta.env.VITE_DEV_META_TX_SIGNER_KEY;
  if (typeof key !== "string" || key.trim() === "") return null;
  const accountId =
    (import.meta.env.VITE_DEV_META_TX_SIGNER_ACCOUNT as string)?.trim() || "";
  if (!accountId) return null;

  const rpcUrl =
    NEAR_NETWORK === "mainnet"
      ? "https://rpc.mainnet.near.org"
      : "https://rpc.testnet.near.org";
  const connection = new Connection(rpcUrl);
  const signer = new InMemorySigner(key.trim());
  const account = new Account(connection, accountId, { signer });

  return async (params: {
    senderId: string;
    receiverId: string;
    actions: Action[];
  }): Promise<Uint8Array> => {
    if (params.senderId !== accountId) {
      throw new Error(
        `Dev meta tx signer account ${accountId} does not match sender ${params.senderId}`,
      );
    }
    const signedDelegate = await account.signedDelegate({
      actions: params.actions,
      blockHeightTtl: BLOCK_HEIGHT_TTL,
      receiverId: params.receiverId,
    });
    return new Uint8Array(encodeSignedDelegate(signedDelegate));
  };
}
