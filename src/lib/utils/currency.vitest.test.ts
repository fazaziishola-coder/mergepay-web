import { describe, it, expect } from "vitest";
import { formatCurrencyAmount, formatStroops } from "./currency";

describe("Currency formatting utilities", () => {
  it("formats numeric amounts for XLM and USDC with up to 7 decimal places", () => {
    expect(formatCurrencyAmount(10, "XLM")).toBe("10 XLM");
    expect(formatCurrencyAmount("10.123456789", "USDC")).toBe("10.1234567 USDC");
    expect(formatCurrencyAmount(0, "XLM")).toBe("0 XLM");
    expect(formatCurrencyAmount("invalid", "USDC")).toBe("0 USDC");
  });

  it("formats raw stroops correctly into asset strings", () => {
    expect(formatStroops(10000000n, "XLM")).toBe("1 XLM");
    expect(formatStroops(-10000000n, "USDC")).toBe("-1 USDC");
    expect(formatStroops(1n, "XLM")).toBe("0.0000001 XLM");
  });
});
