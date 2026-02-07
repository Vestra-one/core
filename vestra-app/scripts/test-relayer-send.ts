/**
 * E2E test: gasless send (wNEAR or USDC) to a receiver via the relayer.
 * Run from vestra-app: npx tsx scripts/test-relayer-send.ts
 *
 * Requires:
 *   - RELAYER_URL (optional; default: testnet relayer)
 *   - Key file at ../relayer-deploy/account_keys/vitalant2170-key.json or RELAYER_TEST_KEY_PATH
 *
 * Env (optional):
 *   - RECEIVER_ID    – NEAR account to receive (default: sender/self)
 *   - TOKEN          – "wNEAR" | "USDC" (default: wNEAR)
 *   - AMOUNT         – for wNEAR: amount in yocto (default: 1); for USDC: human amount (default: 0.000001)
 *   - USDC_CONTRACT  – FT contract for USDC on testnet (e.g. usdc.faucet.orderbook.testnet); required if TOKEN=USDC
 *
 * Example – send 1 yocto wNEAR to self (smoke test):
 *   npm run test:relayer
 *
 * Example – send 0.01 wNEAR to another account (account must have wNEAR; wrap first if needed):
 *   RECEIVER_ID=bob.testnet AMOUNT=10000000000000000000000 npx tsx scripts/test-relayer-send.ts
 *
 * Example – send 0.000001 USDC to another account (account must have USDC on testnet):
 *   TOKEN=USDC RECEIVER_ID=bob.testnet USDC_CONTRACT=usdc.faucet.orderbook.testnet npx tsx scripts/test-relayer-send.ts
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { actionCreators, buildDelegateAction, encodeSignedDelegate } from "@near-js/transactions";
import { relaySignedDelegateAction } from "../src/lib/intents/relayer";

const FT_TRANSFER_GAS = "30000000000000";
const FT_TRANSFER_STORAGE_DEPOSIT = "1";
const USDC_DECIMALS = 6;

function parseEnv(): {
  relayerUrl: string;
  keyPath: string;
  receiverId: string | null;
  token: "wNEAR" | "USDC";
  amount: string;
  usdcContract: string | null;
} {
  const relayerUrl =
    process.env.RELAYER_URL || "https://testnet-relayer-vestra-3hf6lf4xha-uc.a.run.app";
  const keyPath =
    process.env.RELAYER_TEST_KEY_PATH ||
    resolve(process.cwd(), "..", "relayer-deploy", "account_keys", "vitalant2170-key.json");
  const receiverId = process.env.RECEIVER_ID || null;
  const token = (process.env.TOKEN || "wNEAR").toUpperCase() === "USDC" ? "USDC" : "wNEAR";
  const amount = process.env.AMOUNT ?? (token === "wNEAR" ? "1" : "0.000001");
  const usdcContract = process.env.USDC_CONTRACT || null;
  return { relayerUrl, keyPath, receiverId, token, amount, usdcContract };
}

async function main() {
  const { relayerUrl, keyPath, receiverId, token, amount, usdcContract } = parseEnv();

  let keyContent: string;
  try {
    keyContent = readFileSync(keyPath, "utf-8");
  } catch (e) {
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

  const senderId = key.account_id;
  const toAddress = receiverId ?? senderId;

  if (token === "USDC" && !usdcContract) {
    console.error("TOKEN=USDC requires USDC_CONTRACT (e.g. usdc.faucet.orderbook.testnet)");
    process.exit(1);
  }

  const contractId = token === "wNEAR" ? "wrap.near" : usdcContract!;
  let amountSmallest: string;
  if (token === "wNEAR") {
    amountSmallest = amount;
  } else {
    const human = parseFloat(amount);
    if (Number.isNaN(human) || human <= 0) {
      console.error("For USDC, AMOUNT must be a positive number (e.g. 0.000001 or 1)");
      process.exit(1);
    }
    amountSmallest = Math.floor(human * 10 ** USDC_DECIMALS).toString();
  }

  const provider = new JsonRpcProvider({ url: "https://rpc.testnet.near.org" });
  const signer = KeyPairSigner.fromSecretKey(key.secret_key as `ed25519:${string}`);

  const actions = [
    actionCreators.functionCall(
      "ft_transfer",
      { receiver_id: toAddress, amount: amountSmallest },
      BigInt(FT_TRANSFER_GAS),
      BigInt(FT_TRANSFER_STORAGE_DEPOSIT),
    ),
  ];

  // Runtime requires delegate_nonce > access_key.nonce; RPC returns current (last used), so we send current + 1
  const publicKey = await signer.getPublicKey();
  const accessKey = await provider.viewAccessKey(senderId, publicKey, { finality: "final" });
  const currentNonceFromChain = BigInt(accessKey.nonce);
  const delegateNonce = currentNonceFromChain + 1n;
  if (delegateNonce <= currentNonceFromChain) {
    throw new Error("Delegate nonce must be > access key nonce (bug: did not advance nonce)");
  }
  const block = await provider.viewBlock({ finality: "final" });
  const maxBlockHeight = BigInt(block.header.height) + 200n;
  const delegateAction = buildDelegateAction({
    senderId,
    receiverId: contractId,
    actions,
    publicKey,
    nonce: delegateNonce,
    maxBlockHeight,
  });
  const [, signedDelegate] = await signer.signDelegateAction(delegateAction);
  const serialized = encodeSignedDelegate(signedDelegate);

  console.log("Relayer URL:", relayerUrl);
  console.log("Sender:", senderId);
  console.log("Receiver:", toAddress);
  console.log("Token:", token, "Contract:", contractId);
  console.log("Amount (smallest unit):", amountSmallest);
  console.log("Access key nonce:", currentNonceFromChain.toString(), "-> delegate nonce:", delegateNonce.toString());
  console.log("Sending SignedDelegateAction (%d bytes)...", serialized.length);

  const result = await relaySignedDelegateAction(serialized, relayerUrl);
  console.log("Relayer responded with txHash:", result.txHash);
  console.log("OK – gasless send succeeded.");
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
