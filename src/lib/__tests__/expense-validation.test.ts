import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatStellarCurrency, formatXlm, formatUsdc } from "../utils/currency";
import { expenseFormSchema } from "../validations/expense";

describe("Currency formatting helpers", () => {
  it("formats XLM and USDC with proper decimal limits and asset suffix", () => {
    assert.equal(formatXlm("10.5"), "10.50 XLM");
    assert.equal(formatUsdc(100), "100.00 USDC");
    assert.equal(formatStellarCurrency("12.3456789", "XLM"), "12.3456789 XLM");
  });

  it("handles invalid or non-numeric inputs gracefully", () => {
    assert.equal(formatXlm("invalid"), "0.0000000 XLM");
    assert.equal(formatUsdc(NaN), "0.0000000 USDC");
  });
});

describe("Expense creation Zod validation schema edge cases", () => {
  it("rejects negative amounts", () => {
    const res = expenseFormSchema.safeParse({
      title: "Lunch",
      amount: "-15.00",
      assetCode: "XLM",
      splitType: "equal",
      shares: [{ userId: "u1" }],
      payerUserId: "u1",
    });
    assert.equal(res.success, false);
  });

  it("rejects excessive decimal precision beyond 7 places", () => {
    const res = expenseFormSchema.safeParse({
      title: "Coffee",
      amount: "10.12345678",
      assetCode: "USDC",
      splitType: "equal",
      shares: [{ userId: "u1" }],
      payerUserId: "u1",
    });
    assert.equal(res.success, false);
  });

  it("rejects empty or non-numeric amount strings", () => {
    const resEmpty = expenseFormSchema.safeParse({
      title: "Snacks",
      amount: "",
      assetCode: "XLM",
      splitType: "equal",
      shares: [{ userId: "u1" }],
      payerUserId: "u1",
    });
    assert.equal(resEmpty.success, false);

    const resText = expenseFormSchema.safeParse({
      title: "Snacks",
      amount: "abc",
      assetCode: "XLM",
      splitType: "equal",
      shares: [{ userId: "u1" }],
      payerUserId: "u1",
    });
    assert.equal(resText.success, false);
  });
});
