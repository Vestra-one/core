/**
 * NEP-366 meta transaction helpers for the deposit (payment send) flow.
 * Builds the same storage_deposit + ft_transfer actions as executeIntentTransfer,
 * for signing as a DelegateAction and sending to a relayer.
 */

import { actionCreators } from "@near-js/transactions";
import {
  FT_TRANSFER_GAS,
  FT_TRANSFER_STORAGE_DEPOSIT,
  STORAGE_DEPOSIT_GAS,
  STORAGE_DEPOSIT_REGISTRATION,
} from "./constants";
import { originAssetIdToNearContractId } from "./transfer";
import type { QuoteResponse } from "./oneClick";

/** Action type from actionCreators (avoids namespace type from declare module). */
type NearAction = ReturnType<typeof actionCreators.functionCall>;

/** Parameters for creating a DelegateAction (receiver + actions). */
export type DelegateActionParams = {
  receiverId: string;
  actions: NearAction[];
};

/**
 * Build DelegateAction params for the 1Click deposit: storage_deposit + ft_transfer to quote.depositAddress.
 * Same logic as executeIntentTransfer; used so the user can sign this as a meta tx and send to relayer.
 */
export function buildTransferDelegateParams(
  quoteResponse: QuoteResponse,
  originAssetId: string,
): DelegateActionParams {
  const quote = quoteResponse.quote;
  const depositAddress = quote.depositAddress;
  if (!depositAddress) {
    throw new Error("Quote has no deposit address (did you use dry: true?)");
  }
  const amountIn = quote.amountIn;
  const receiverId = originAssetIdToNearContractId(originAssetId);

  const actions: NearAction[] = [
    actionCreators.functionCall(
      "storage_deposit",
      {
        account_id: depositAddress,
        registration_only: true,
      },
      BigInt(STORAGE_DEPOSIT_GAS),
      BigInt(STORAGE_DEPOSIT_REGISTRATION),
    ),
    actionCreators.functionCall(
      "ft_transfer",
      {
        receiver_id: depositAddress,
        amount: amountIn,
      },
      BigInt(FT_TRANSFER_GAS),
      BigInt(FT_TRANSFER_STORAGE_DEPOSIT),
    ),
  ];

  return { receiverId, actions };
}

/**
 * Signer for meta transactions: given delegate params, returns serialized SignedDelegateAction.
 * The signer is responsible for fetching nonce/blockHash and signing (e.g. via Account.signedDelegate).
 * Important: each call must use a fresh nonce (current access key nonce + 1). Do not reuse
 * Account.getAccessKey result across calls—@near-js/accounts caches it, so clear
 * account.accessKeyByPublicKeyCache before each sign or use provider.viewAccessKey(..., { finality: "final" }) directly.
 */
export type SignDelegateAction = (params: {
  senderId: string;
  receiverId: string;
  actions: NearAction[];
}) => Promise<Uint8Array>;
