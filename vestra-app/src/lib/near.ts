/**
 * NEAR wallet and network configuration.
 * Used by Wallet Selector for connection and sign-in.
 *
 * Default is mainnet so the wallet connects to mainnet for real transfers.
 * Set VITE_NEAR_NETWORK=testnet for testnet.
 */

export const NEAR_NETWORK: "mainnet" | "testnet" =
  (import.meta.env.VITE_NEAR_NETWORK as "mainnet" | "testnet") || "mainnet";

/**
 * Contract ID used for sign-in and transaction signing.
 * - Mainnet: set VITE_NEAR_CONTRACT_ID to your app contract or use wrap.near for transfer-only flows.
 * - Testnet: when unset in dev, falls back to hello.near-examples.testnet so the wallet doesn't show "Invalid contract ID".
 */
export const NEAR_CONTRACT_ID =
  import.meta.env.VITE_NEAR_CONTRACT_ID ||
  (NEAR_NETWORK === "mainnet" ? "wrap.near" : "hello.near-examples.testnet");
