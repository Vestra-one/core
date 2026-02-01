/**
 * NEAR wallet and network configuration.
 * Used by Wallet Selector for connection and sign-in.
 */

export const NEAR_NETWORK =
  (import.meta.env.VITE_NEAR_NETWORK as "mainnet" | "testnet") || "testnet";

/**
 * Contract ID used for sign-in and transaction signing.
 * - Set VITE_NEAR_CONTRACT_ID to your deployed contract (e.g. vestra.testnet once deployed).
 * - In dev, when unset, falls back to a known-existing testnet contract so the wallet doesn't
 *   show "Invalid contract ID". For production, deploy your contract and set this env var.
 */
export const NEAR_CONTRACT_ID =
  import.meta.env.VITE_NEAR_CONTRACT_ID ||
  (import.meta.env.DEV ? "hello.near-examples.testnet" : "vestra.testnet");
