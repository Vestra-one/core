/**
 * Intent-based transfer: get quote, send deposit from NEAR, submit tx, check status.
 */

import { OneClickService, QuoteRequest, type QuoteResponse, type GetExecutionStatusResponse } from "./oneClick";
import {
  DEFAULT_ORIGIN_ASSET,
  SLIPPAGE_BASIS_POINTS,
  FT_TRANSFER_GAS,
  FT_TRANSFER_STORAGE_DEPOSIT,
  WRAP_NEAR_CONTRACT_ID,
} from "./constants";

/** Callback to sign and send a NEAR transaction (from useWallet().signAndSendTransaction). */
export type SignAndSendTransaction = (params: {
  receiverId: string;
  actions: Array<
    | { type: "Transfer"; deposit: string }
    | { type: "FunctionCall"; methodName: string; args: object; gas: string; deposit: string }
  >;
}) => Promise<unknown>;

/** Params for a single intent transfer (one row in manual payments). */
export type IntentTransferParams = {
  /** Recipient address on the destination chain (e.g. 0x... for EVM). */
  recipient: string;
  /** 1Click destination asset ID (e.g. nep141:arb-0x...omft.near). */
  destinationAssetId: string;
  /** Amount in smallest units (e.g. for wNEAR, 24 decimals). */
  amountSmallestUnit: string;
};

/** Result of executing an intent transfer. */
export type IntentTransferResult = {
  depositAddress: string;
  txHash: string;
  status: GetExecutionStatusResponse["status"];
  statusResponse?: GetExecutionStatusResponse;
};

/**
 * Request a live quote (dry: false) to get a deposit address for the given transfer.
 */
export async function requestQuote(
  params: IntentTransferParams,
  refundToAccountId: string,
): Promise<QuoteResponse> {
  const deadline = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
  const request: QuoteRequest = {
    dry: false,
    swapType: QuoteRequest.swapType.EXACT_INPUT,
    slippageTolerance: SLIPPAGE_BASIS_POINTS,
    originAsset: DEFAULT_ORIGIN_ASSET,
    depositType: QuoteRequest.depositType.ORIGIN_CHAIN,
    destinationAsset: params.destinationAssetId,
    amount: params.amountSmallestUnit,
    refundTo: refundToAccountId,
    refundType: QuoteRequest.refundType.ORIGIN_CHAIN,
    recipient: params.recipient,
    recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
    deadline,
    quoteWaitingTimeMs: 0,
  };
  return OneClickService.getQuote(request);
}

/**
 * Send wNEAR to the quote's deposit address via the connected wallet, then submit the tx to 1Click.
 */
export async function executeIntentTransfer(
  quoteResponse: QuoteResponse,
  accountId: string,
  signAndSendTransaction: SignAndSendTransaction,
): Promise<IntentTransferResult> {
  const quote = quoteResponse.quote;
  const depositAddress = quote.depositAddress;
  if (!depositAddress) {
    throw new Error("Quote has no deposit address (did you use dry: true?)");
  }
  const amountIn = quote.amountIn;

  const outcome = await signAndSendTransaction({
    receiverId: WRAP_NEAR_CONTRACT_ID,
    actions: [
      {
        type: "FunctionCall",
        methodName: "ft_transfer",
        args: {
          receiver_id: depositAddress,
          amount: amountIn,
        },
        gas: FT_TRANSFER_GAS,
        deposit: FT_TRANSFER_STORAGE_DEPOSIT,
      },
    ],
  });

  const outcomeObj = outcome as {
    transaction_outcome?: { id?: string };
    receipts_outcome?: Array<{ outcome?: { block_hash?: string } }>;
  };
  const txHash =
    outcomeObj.transaction_outcome?.id ??
    outcomeObj.receipts_outcome?.[0]?.outcome?.block_hash ??
    "";
  if (!txHash) {
    throw new Error("Could not get transaction hash from outcome");
  }

  await OneClickService.submitDepositTx({
    txHash,
    depositAddress,
    nearSenderAccount: accountId,
  });

  const statusResponse = await OneClickService.getExecutionStatus(
    depositAddress,
    quote.depositMemo,
  );

  return {
    depositAddress,
    txHash,
    status: statusResponse.status,
    statusResponse,
  };
}
