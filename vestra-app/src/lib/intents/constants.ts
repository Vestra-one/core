/**
 * Defaults for intent-based transfer (NEAR → destination chain).
 */

/** Default source token: wNEAR on NEAR (asset ID for 1Click quote). */
export const DEFAULT_ORIGIN_ASSET = "nep141:wrap.near";

/** Slippage tolerance in basis points (100 = 1%). */
export const SLIPPAGE_BASIS_POINTS = 100;

/** Gas for ft_transfer on wrap.near (30 Tgas). */
export const FT_TRANSFER_GAS = "30000000000000";

/** Minimum deposit for ft_transfer storage (1 yoctoNEAR). */
export const FT_TRANSFER_STORAGE_DEPOSIT = "1";

/** wrap.near contract ID for sending wNEAR. */
export const WRAP_NEAR_CONTRACT_ID = "wrap.near";
