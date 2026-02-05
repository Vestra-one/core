/**
 * Dev-only meta tx signer using a private key from env (VITE_DEV_META_TX_SIGNER_KEY).
 * In production, use a wallet that supports sign-only or FastAuth.
 */

import { Account } from "@near-js/accounts";
import { KeyPair } from "@near-js/crypto";
import { InMemoryKeyStore } from "@near-js/keystores";
import { JsonRpcProvider } from "@near-js/providers";
import { InMemorySigner } from "@near-js/signers";
import { encodeSignedDelegate } from "@near-js/transactions";
import type { KeyPairString } from "@near-js/crypto";
import { NEAR_NETWORK } from "../near";
import type { SignDelegateAction } from "./metaTx";

type MetaTxAction = Parameters<SignDelegateAction>[0]["actions"][number];

const BLOCK_HEIGHT_TTL = 120;

/**
 * Create a SignDelegateAction that signs with the key from VITE_DEV_META_TX_SIGNER_KEY.
 * Only available in dev when the env var is set. The key format is ed25519:... and the
 * account id is set via VITE_DEV_META_TX_SIGNER_ACCOUNT.
 */
export function createDevMetaTxSigner(): SignDelegateAction | null {
  const key = import.meta.env.VITE_DEV_META_TX_SIGNER_KEY;
  if (typeof key !== "string" || key.trim() === "") return null;
  const accountId =
    (import.meta.env.VITE_DEV_META_TX_SIGNER_ACCOUNT as string)?.trim() || "";
  if (!accountId) return null;

  const networkId = NEAR_NETWORK;
  const rpcUrl =
    NEAR_NETWORK === "mainnet"
      ? "https://rpc.mainnet.near.org"
      : "https://rpc.testnet.near.org";
  const provider = new JsonRpcProvider({ url: rpcUrl });

  return async (params: {
    senderId: string;
    receiverId: string;
    actions: MetaTxAction[];
  }): Promise<Uint8Array> => {
    if (params.senderId !== accountId) {
      throw new Error(
        `Dev meta tx signer account ${accountId} does not match sender ${params.senderId}`,
      );
    }
    const keyPair = KeyPair.fromString(key.trim() as KeyPairString);
    const keyStore = new InMemoryKeyStore();
    await keyStore.setKey(networkId, accountId, keyPair);
    const signer = new InMemorySigner(keyStore);
    // InMemorySigner implements signing; Account accepts it at runtime (types may vary by @near-js version)
    const account = new Account(accountId, provider, signer as never);
    const signedDelegate = await account.signedDelegate({
      actions: params.actions,
      blockHeightTtl: BLOCK_HEIGHT_TTL,
      receiverId: params.receiverId,
    });
    return new Uint8Array(encodeSignedDelegate(signedDelegate));
  };
}
