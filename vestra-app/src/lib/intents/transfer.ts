/**
 * Intent-based transfer: get quote, send deposit from NEAR, submit tx, check status.
 */

import { OneClickService, QuoteRequest, type QuoteResponse, type GetExecutionStatusResponse } from "./oneClick";
import {
  DEFAULT_ORIGIN_ASSET,
  SLIPPAGE_BASIS_POINTS,
  FT_TRANSFER_GAS,
  FT_TRANSFER_STORAGE_DEPOSIT,
  STORAGE_DEPOSIT_REGISTRATION,
  STORAGE_DEPOSIT_GAS,
} from "./constants";
import { relaySignedDelegateAction } from "./relayer";

/** NEP-141 asset ID (e.g. nep141:wrap.near) → NEAR contract ID for ft_transfer (e.g. wrap.near). */
export function originAssetIdToNearContractId(assetId: string): string {
  if (assetId.startsWith("nep141:")) return assetId.slice(7);
  return assetId;
}

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
  /** Amount in smallest units of the origin token (e.g. USDC = 6 decimals). */
  amountSmallestUnit: string;
  /** 1Click origin asset ID (e.g. nep141:usdc.tether-token.near). If omitted, uses default (wNEAR). */
  originAssetId?: string;
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
 * Uses originAssetId (e.g. USDC on NEAR) when provided; otherwise default origin (wNEAR).
 */
export async function requestQuote(
  params: IntentTransferParams,
  refundToAccountId: string,
): Promise<QuoteResponse> {
  const deadline = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
  const originAsset = params.originAssetId ?? DEFAULT_ORIGIN_ASSET;
  const request: QuoteRequest = {
    dry: false,
    swapType: QuoteRequest.swapType.EXACT_INPUT,
    slippageTolerance: SLIPPAGE_BASIS_POINTS,
    originAsset,
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
 * Send the origin token (e.g. USDC on NEAR) to the quote's deposit address via the connected wallet, then submit the tx to 1Click.
 * originAssetId must match the quote's origin (e.g. nep141:usdc.tether-token.near).
 */
export async function executeIntentTransfer(
  quoteResponse: QuoteResponse,
  accountId: string,
  signAndSendTransaction: SignAndSendTransaction,
  originAssetId: string,
): Promise<IntentTransferResult> {
  const quote = quoteResponse.quote;
  const depositAddress = quote.depositAddress;
  if (!depositAddress) {
    throw new Error("Quote has no deposit address (did you use dry: true?)");
  }
  const amountIn = quote.amountIn;
  const receiverId = originAssetIdToNearContractId(originAssetId);

  const actions: Array<{ type: "FunctionCall"; methodName: string; args: object; gas: string; deposit: string }> = [
    {
      type: "FunctionCall",
      methodName: "storage_deposit",
      args: {
        account_id: depositAddress,
        registration_only: true,
      },
      gas: STORAGE_DEPOSIT_GAS,
      deposit: STORAGE_DEPOSIT_REGISTRATION,
    },
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
  ];

  const outcome = await signAndSendTransaction({
    receiverId,
    actions,
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

/**
 * Execute the deposit step via NEP-366 meta transaction: send serialized SignedDelegateAction to
 * Pagoda relayer, then submit tx hash to 1Click and return status. Relayer pays gas; user must
 * have signed the delegate off-chain (e.g. via FastAuth or wallet that supports sign-only).
 */
export async function executeIntentTransferViaRelayer(
  quoteResponse: QuoteResponse,
  accountId: string,
  serializedSignedDelegate: Uint8Array,
  relayerUrl: string,
): Promise<IntentTransferResult> {
  const quote = quoteResponse.quote;
  const depositAddress = quote.depositAddress;
  if (!depositAddress) {
    throw new Error("Quote has no deposit address (did you use dry: true?)");
  }

  const { txHash } = await relaySignedDelegateAction(serializedSignedDelegate, relayerUrl);

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
