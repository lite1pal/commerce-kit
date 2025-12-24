import { describe, it, expect } from "vitest";
import { pluralize } from "./string";

describe("pluralize (naive)", () => {
  it.each([
    ["cat", "cats"],
    ["dog", "dogs"],
    ["city", "cities"],
    ["toy", "toys"],
    ["box", "boxes"],
    ["bus", "buses"],
    ["church", "churches"],
    ["brush", "brushes"],
  ])("pluralizes %s → %s", (input, expected) => {
    expect(pluralize(input)).toBe(expected);
  });
  it("throws on uppercase words", () => {
    expect(() => pluralize("City")).toThrow();
  });

  it("throws on non-letter characters", () => {
    expect(() => pluralize("cat1")).toThrow();
    expect(() => pluralize("ice-cream")).toThrow();
  });

  it("does not support irregular plurals", () => {
    expect(pluralize("child")).toBe("childs");
  });
});
