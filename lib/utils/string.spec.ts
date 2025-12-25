import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { pluralize } from "./string";

describe("pluralize — property-based", () => {
  it("always returns a lowercase plural for valid lowercase words", () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[a-z]+$/), (word) => {
        const result = pluralize(word);

        expect(result).toMatch(/^[a-z]+$/);
        expect(result.length).toBeGreaterThan(word.length);

        if (word.endsWith("y") && !/[aeiou]y$/.test(word)) {
          expect(result).toBe(word.slice(0, -1) + "ies");
        } else if (
          word.endsWith("s") ||
          word.endsWith("x") ||
          word.endsWith("z") ||
          word.endsWith("ch") ||
          word.endsWith("sh")
        ) {
          expect(result).toBe(word + "es");
        } else {
          expect(result).toBe(word + "s");
        }
      })
    );
  });
  it("throws for invalid inputs", () => {
    fc.assert(
      fc.property(fc.string(), (word) => {
        if (!/^[a-z]+$/.test(word)) {
          expect(() => pluralize(word)).toThrow();
        }
      })
    );
  });
  it("throws on empty string", () => {
    expect(() => pluralize("")).toThrow();
  });
  it("rejects corrupted valid words", () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[a-z]+$/), (word) => {
        const corrupted = word.slice(0, 1).toUpperCase() + word.slice(1);

        expect(() => pluralize(corrupted)).toThrow();
      })
    );
  });
  it("preserves word stem", () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[a-z]{2,}$/), (word) => {
        const result = pluralize(word);

        if (word.endsWith("y") && !/[aeiou]y$/.test(word)) {
          expect(result.startsWith(word.slice(0, -1))).toBe(true);
        } else {
          expect(result.startsWith(word)).toBe(true);
        }
      })
    );
  });
});
