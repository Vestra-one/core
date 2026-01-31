/**
 * NEAR wallet and network configuration.
 * Used by Wallet Selector for connection and sign-in.
 */

export const NEAR_NETWORK =
  (import.meta.env.VITE_NEAR_NETWORK as "mainnet" | "testnet") || "testnet";

/** Contract ID used for sign-in and transaction signing. Set via VITE_NEAR_CONTRACT_ID. */
export const NEAR_CONTRACT_ID =
  import.meta.env.VITE_NEAR_CONTRACT_ID || "vestra.testnet";
