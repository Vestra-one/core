/**
 * NEAR Intents 1Click API client.
 * Configures the SDK and re-exports types and service for intent-based cross-chain transfers.
 */

import {
  OpenAPI,
  OneClickService,
  QuoteRequest,
  type QuoteResponse,
  type TokenResponse,
  type GetExecutionStatusResponse,
  type SubmitDepositTxRequest,
  type SubmitDepositTxResponse,
} from "@defuse-protocol/one-click-sdk-typescript";

const ONE_CLICK_BASE = "https://1click.chaindefuser.com";
const JWT = import.meta.env.VITE_ONE_CLICK_JWT as string | undefined;

OpenAPI.BASE = ONE_CLICK_BASE;
if (JWT) {
  OpenAPI.TOKEN = JWT;
}

export { OneClickService, QuoteRequest };
export type {
  QuoteResponse,
  TokenResponse,
  GetExecutionStatusResponse,
  SubmitDepositTxRequest,
  SubmitDepositTxResponse,
};
