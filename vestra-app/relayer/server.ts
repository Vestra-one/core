/**
 * NEP-366 meta transaction relayer server.
 * POST /relay body: JSON array of bytes (SignedDelegateAction borsh serialized).
 * Relayer wraps in a transaction and submits; relayer pays gas.
 *
 * Env: RELAYER_ACCOUNT_ID, RELAYER_PRIVATE_KEY, NEAR_NETWORK (mainnet|testnet), PORT (default 3031)
 */

import express, { type Request, type Response } from "express";
import cors from "cors";
import { deserialize } from "borsh";
import { Account } from "@near-js/accounts";
import { Connection } from "@near-js/providers";
import { InMemorySigner } from "@near-js/signers";
import { actionCreators, SCHEMA } from "@near-js/transactions";
import type { SignedDelegate } from "@near-js/transactions";

const PORT = Number(process.env.PORT) || 3031;
const NEAR_NETWORK = process.env.NEAR_NETWORK === "mainnet" ? "mainnet" : "testnet";
const RPC_URL =
  NEAR_NETWORK === "mainnet"
    ? process.env.NEAR_RPC_URL || "https://rpc.mainnet.near.org"
    : process.env.NEAR_RPC_URL || "https://rpc.testnet.near.org";
const RELAYER_ACCOUNT_ID = process.env.RELAYER_ACCOUNT_ID;
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;

if (!RELAYER_ACCOUNT_ID || !RELAYER_PRIVATE_KEY) {
  console.error("Set RELAYER_ACCOUNT_ID and RELAYER_PRIVATE_KEY");
  process.exit(1);
}

const connection = new Connection(RPC_URL);
const signer = new InMemorySigner(RELAYER_PRIVATE_KEY);
const relayerAccount = new Account(connection, RELAYER_ACCOUNT_ID, { signer });

const app = express();
app.use(cors());
app.use(express.json());

app.post("/relay", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const serialized: number[] = Array.isArray(body) ? body : body?.signed_delegate_action
      ? Array.from(Buffer.from(body.signed_delegate_action, "base64"))
      : null;
    if (!serialized || serialized.length === 0) {
      res.status(400).json({ error: "Body must be JSON array of bytes or { signed_delegate_action: base64 }" });
      return;
    }
    const bytes = new Uint8Array(Buffer.from(serialized));
    const signedDelegate = deserialize(
      SCHEMA.SignedDelegate as Parameters<typeof deserialize>[0],
      bytes,
    ) as SignedDelegate;
    const outcome = await relayerAccount.signAndSendTransaction({
      actions: [actionCreators.signedDelegate(signedDelegate)],
      receiverId: signedDelegate.delegateAction.senderId,
    });
    const outcomeObj = outcome as {
      transaction_outcome?: { id?: string };
      receipts_outcome?: Array<{ outcome?: { block_hash?: string } }>;
    };
    const txHash =
      outcomeObj.transaction_outcome?.id ??
      outcomeObj.receipts_outcome?.[0]?.outcome?.block_hash ??
      "";
    res.json({ txHash, data: outcome });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Relay error:", message);
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Vestra relayer listening on http://0.0.0.0:${PORT} (${NEAR_NETWORK})`);
});
