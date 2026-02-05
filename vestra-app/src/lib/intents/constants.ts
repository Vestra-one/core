/**
 * Defaults for intent-based transfer (NEAR → destination chain).
 * Same values for mainnet and testnet: wrap.near is the canonical wNEAR contract on both.
 */

/** Fallback origin asset when no "pay with" token is chosen (e.g. wNEAR). App default is USDC on NEAR from token list. */
export const DEFAULT_ORIGIN_ASSET = "nep141:wrap.near";

/** Slippage tolerance in basis points (100 = 1%). */
export const SLIPPAGE_BASIS_POINTS = 100;

/** Gas for ft_transfer on wrap.near (30 Tgas). */
export const FT_TRANSFER_GAS = "30000000000000";

/** Minimum deposit for ft_transfer storage (1 yoctoNEAR). */
export const FT_TRANSFER_STORAGE_DEPOSIT = "1";

/** Deposit for storage_deposit to register a receiver with the FT contract (0.00125 NEAR). NEP-145 typical minimum. */
export const STORAGE_DEPOSIT_REGISTRATION = "1250000000000000000000";

/** Gas for storage_deposit call. */
export const STORAGE_DEPOSIT_GAS = "30000000000000";

/** wrap.near contract ID for sending wNEAR (mainnet and testnet). */
export const WRAP_NEAR_CONTRACT_ID = "wrap.near";
