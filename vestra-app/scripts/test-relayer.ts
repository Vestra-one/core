/**
 * E2E test: build a SignedDelegateAction, POST to the relayer, assert txHash.
 * Run from vestra-app: npx tsx scripts/test-relayer.ts
 * Requires: RELAYER_URL env and key file at ../relayer-deploy/account_keys/vitalant2170-key.json (or RELAYER_TEST_KEY_PATH)
 *
 * Sends once only (no retry). We use delegate_nonce = access_key.nonce + 1. If you see
 * DelegateActionInvalidNonce with both nonces equal, either (1) the key is used elsewhere and
 * the nonce advanced before our tx landed, or (2) the same payload was submitted twice—use a
 * key with no other traffic and run the script once.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { actionCreators, buildDelegateAction, encodeSignedDelegate } from "@near-js/transactions";
import { relaySignedDelegateAction } from "../src/lib/intents/relayer";

const FT_TRANSFER_GAS = "30000000000000";
const FT_TRANSFER_STORAGE_DEPOSIT = "1";

async function main() {
  const relayerUrl = process.env.RELAYER_URL || "https://testnet-relayer-vestra-3hf6lf4xha-uc.a.run.app";
  const keyPath =
    process.env.RELAYER_TEST_KEY_PATH ||
    resolve(process.cwd(), "..", "relayer-deploy", "account_keys", "vitalant2170-key.json");

  let keyContent: string;
  try {
    keyContent = readFileSync(keyPath, "utf-8");
  } catch {
    console.error("Key file not found at", keyPath);
    console.error("Set RELAYER_TEST_KEY_PATH or run from vestra-app with relayer-deploy at ../relayer-deploy");
    process.exit(1);
  }

  const keys = JSON.parse(keyContent) as Array<{ account_id: string; public_key: string; secret_key: string }>;
  const key = keys[0];
  if (!key?.secret_key) {
    console.error("Key file must be JSON array with { account_id, public_key, secret_key }");
    process.exit(1);
  }

  const provider = new JsonRpcProvider({ url: "https://rpc.testnet.near.org" });
  const signer = KeyPairSigner.fromSecretKey(key.secret_key as `ed25519:${string}`);
  const accountId = key.account_id;

  // Minimal action: ft_transfer 1 yocto wNEAR to self (relayer pays gas)
  const actions = [
    actionCreators.functionCall(
      "ft_transfer",
      { receiver_id: accountId, amount: "1" },
      BigInt(FT_TRANSFER_GAS),
      BigInt(FT_TRANSFER_STORAGE_DEPOSIT),
    ),
  ];

  // Runtime requires delegate_nonce > access_key.nonce; RPC returns current (last used), so we send current + 1.
  // Use "optimistic" for nonce so we get latest state and don't send a delegate that's already behind.
  const publicKey = await signer.getPublicKey();
  const accessKey = await provider.viewAccessKey(accountId, publicKey, { finality: "optimistic" });
  const currentNonceFromChain = BigInt(accessKey.nonce);
  const delegateNonce = currentNonceFromChain + 1n;
  if (delegateNonce <= currentNonceFromChain) {
    throw new Error("Delegate nonce must be > access key nonce (bug: did not advance nonce)");
  }
  const block = await provider.viewBlock({ finality: "optimistic" });
  const maxBlockHeight = BigInt(block.header.height) + 200n;
  console.log(
    "Access key nonce:",
    currentNonceFromChain.toString(),
    "-> delegate nonce:",
    delegateNonce.toString()
  );
  const delegateAction = buildDelegateAction({
    senderId: accountId,
    receiverId: "wrap.near",
    actions,
    publicKey,
    nonce: delegateNonce,
    maxBlockHeight,
  });
  const [, signedDelegate] = await signer.signDelegateAction(delegateAction);
  const serialized = encodeSignedDelegate(signedDelegate);

  console.log("Relayer URL:", relayerUrl);
  console.log("Sending SignedDelegateAction (%d bytes)...", serialized.length);
  const result = await relaySignedDelegateAction(serialized, relayerUrl);
  console.log("Relayer responded with txHash:", result.txHash);
  console.log("OK – relayer is working.");
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
