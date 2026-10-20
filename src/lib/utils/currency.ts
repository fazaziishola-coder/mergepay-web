/**
 * Currency formatting helpers for XLM and USDC asset representations.
 * Supports up to 7 decimal places for Stellar assets.
 */

import { STROOPS_PER_UNIT } from "../split";

/**
 * Format a numeric amount or string for XLM or USDC with up to 7 decimal places.
 * Strips trailing fractional zeros for clean representation.
 */
export function formatCurrencyAmount(amount: string | number, assetCode: string = "XLM"): string {
  const numStr = typeof amount === "number" ? amount.toString() : amount.trim();
  if (!numStr || isNaN(Number(numStr))) return "0";

  const [whole, fraction = ""] = numStr.split(".");
  const paddedFraction = fraction.slice(0, 7).replace(/0+$/, "");
  
  const formatted = paddedFraction ? `${whole}.${paddedFraction}` : whole;
  const symbol = assetCode.toUpperCase();
  return `${formatted} ${symbol}`;
}

/**
 * Format raw stroops into a human-readable asset amount string.
 */
export function formatStroops(stroops: bigint, assetCode: string = "XLM"): string {
  const sign = stroops < 0n ? "-" : "";
  const abs = stroops < 0n ? -stroops : stroops;
  const whole = abs / STROOPS_PER_UNIT;
  const frac = (abs % STROOPS_PER_UNIT).toString().padStart(7, "0").replace(/0+$/, "");
  
  const decimalStr = frac ? `${whole}.${frac}` : `${whole.toString()}`;
  return `${sign}${decimalStr} ${assetCode.toUpperCase()}`;
}
