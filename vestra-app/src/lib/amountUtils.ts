/**
 * Amount formatting utilities for payment flows.
 */

/**
 * Converts a human-readable amount string to smallest units (e.g. 6 decimals for USDC).
 * Handles comma-separated numbers and fractional parts.
 */
export function toSmallestUnit(amountHuman: string, decimals: number): string {
  const n = Number(amountHuman.replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 0) return "0";
  const [whole, frac = ""] = amountHuman.replace(/,/g, "").split(".");
  const fracPadded = frac.slice(0, decimals).padEnd(decimals, "0");
  return (whole === "" ? "0" : whole) + fracPadded;
}
