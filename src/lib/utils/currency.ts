/**
 * Currency formatting helpers for Stellar assets (XLM and USDC).
 * Enforces max 7 decimal places and clean formatting for display.
 */

export function formatStellarCurrency(amount: string | number, assetCode: string = "XLM"): string {
  const num = typeof amount === "number" ? amount : parseFloat(amount);
  if (isNaN(num) || !isFinite(num)) {
    return `0.0000000 ${assetCode}`;
  }
  
  const fixed = num.toFixed(7);
  // Remove trailing zeros after decimal point, but keep at least 2 decimal places if needed or clean up
  const parts = fixed.split(".");
  const whole = parts[0];
  let frac = parts[1] || "";
  
  // Trim trailing zeros
  frac = frac.replace(/0+$/, "");
  if (frac.length < 2) {
    frac = frac.padEnd(2, "0");
  }

  const formattedFractional = frac ? `.${frac}` : "";
  return `${whole}${formattedFractional} ${assetCode.toUpperCase()}`;
}

export function formatXlm(amount: string | number): string {
  return formatStellarCurrency(amount, "XLM");
}

export function formatUsdc(amount: string | number): string {
  return formatStellarCurrency(amount, "USDC");
}
