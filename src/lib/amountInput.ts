/**
 * Helpers for the text a user is editing in a Stellar amount field.
 *
 * `expenseValidation.ts` decides which keystrokes may enter the field
 * (`isTypableAmount`); this module decides what a *finished* entry should look
 * like once the field is committed. Half-typed states such as `"5."` and
 * `".5"` are legitimate while typing but are not plain decimals, so the
 * validators — correctly — reject them. Normalising on blur means the value the
 * user sees is the value that is validated and submitted, instead of a
 * "plain number" error on something that reads perfectly well.
 *
 * Pure and free of React imports so it is unit-testable and usable from route
 * handlers.
 */

import { AMOUNT_DECIMAL_PLACES } from "./expenseValidation";

/** Plain unsigned decimal, optionally half-typed (`"5."`, `".5"`). */
const COMMITTABLE_AMOUNT = /^(\d*)(?:\.(\d*))?$/;

/**
 * Normalise a committed amount entry.
 *
 * - surrounding whitespace is dropped
 * - a lone `"."` or an empty value becomes `""`
 * - `".5"` becomes `"0.5"` and `"5."` becomes `"5"`
 * - redundant leading zeros are dropped (`"007.50"` becomes `"7.50"`)
 *
 * Digits are never added, removed or rounded, so `"12.50"` stays `"12.50"` and
 * a value with too many decimals is returned unchanged for the validator to
 * report. Anything that is not a plain unsigned decimal (signs, exponents,
 * separators) is also returned as typed, rather than being silently repaired
 * into a different number.
 */
export function formatAmountInput(
  raw: string,
  decimalPlaces: number = AMOUNT_DECIMAL_PLACES
): string {
  const value = raw.trim();
  const match = COMMITTABLE_AMOUNT.exec(value);
  if (!match) return raw;

  const whole = match[1] ?? "";
  const fraction = match[2] ?? "";
  if (whole === "" && fraction === "") return "";
  if (fraction.length > decimalPlaces) return raw;

  const normalisedWhole = whole === "" ? "0" : whole.replace(/^0+(?=\d)/, "");
  return fraction === "" ? normalisedWhole : `${normalisedWhole}.${fraction}`;
}
