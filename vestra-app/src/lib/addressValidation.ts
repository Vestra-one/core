/**
 * Recipient address validation for payment forms.
 * Validates format by address type (EVM, NEAR, Solana) and optionally by destination chain.
 */

/** Result of validating a recipient address. */
export type AddressValidationResult =
  | { valid: true; format: "evm" | "near" | "solana" }
  | { valid: false; message: string };

/** EVM: 0x followed by exactly 40 hex characters. */
const EVM_REGEX = /^0x[a-fA-F0-9]{40}$/;

/** NEAR: named account (e.g. alice.near, bob.testnet) or 64-char hex implicit. */
const NEAR_NAMED_REGEX = /^[a-zA-Z0-9._-]{2,64}\.(near|testnet)$/;
const NEAR_IMPLICIT_REGEX = /^[a-fA-F0-9]{64}$/;

/** Solana: base58, usually 32–44 characters. */
const SOLANA_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/** Chain IDs that use EVM-style addresses. */
const EVM_CHAINS = new Set([
  "eth",
  "arb",
  "base",
  "pol",
  "op",
  "bsc",
  "avax",
  "gnosis",
  "xlayer",
  "monad",
  "bera",
  "bch",
]);

function isEvm(address: string): boolean {
  return EVM_REGEX.test(address);
}

function isNear(address: string): boolean {
  return NEAR_NAMED_REGEX.test(address) || NEAR_IMPLICIT_REGEX.test(address);
}

function isSolana(address: string): boolean {
  return SOLANA_REGEX.test(address);
}

/**
 * Validate a recipient address, optionally for a specific destination chain.
 * When chainId is provided, only that chain’s format is accepted.
 */
export function validateRecipientAddress(
  value: string,
  chainId?: string,
): AddressValidationResult {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: "Enter recipient address" };
  }

  if (chainId) {
    if (EVM_CHAINS.has(chainId)) {
      if (isEvm(trimmed)) return { valid: true, format: "evm" };
      return {
        valid: false,
        message: "Use a valid EVM address (0x followed by 40 hex characters)",
      };
    }
    if (chainId === "near") {
      if (isNear(trimmed)) return { valid: true, format: "near" };
      return {
        valid: false,
        message: "Use a valid NEAR account (e.g. name.near, name.testnet, or 64-char hex)",
      };
    }
    if (chainId === "sol") {
      if (isSolana(trimmed)) return { valid: true, format: "solana" };
      return {
        valid: false,
        message: "Use a valid Solana address (32–44 base58 characters)",
      };
    }
    // Other chains (TON, Bitcoin, etc.): accept common formats we can detect
    if (isEvm(trimmed)) return { valid: true, format: "evm" };
    if (isNear(trimmed)) return { valid: true, format: "near" };
    if (isSolana(trimmed)) return { valid: true, format: "solana" };
    return {
      valid: false,
      message: "Address format not recognized for this chain",
    };
  }

  // No chain selected: accept any supported format
  if (isEvm(trimmed)) return { valid: true, format: "evm" };
  if (isNear(trimmed)) return { valid: true, format: "near" };
  if (isSolana(trimmed)) return { valid: true, format: "solana" };

  return {
    valid: false,
    message: "Use EVM (0x...), NEAR (name.near / name.testnet), or Solana address",
  };
}
