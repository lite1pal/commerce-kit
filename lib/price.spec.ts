import { describe, it, expect } from "vitest";
import { formatCentsToDollars } from "./price";

describe("formatCentsToDollars", () => {
  it.each([
    [12345, "123.45"],
    [0, "0.00"],
    [-150, "-1.50"],
    [1, "0.01"],
    [10, "0.10"],
    [100, "1.00"],
  ])("formats %i cents as %s", (input, expected) => {
    expect(formatCentsToDollars(input)).toBe(expected);
  });

  it("throws on non-integer values", () => {
    expect(() => formatCentsToDollars(1.5)).toThrow();
  });

  it("throws on non-finite values", () => {
    expect(() => formatCentsToDollars(NaN)).toThrow();
    expect(() => formatCentsToDollars(Infinity)).toThrow();
  });
});
