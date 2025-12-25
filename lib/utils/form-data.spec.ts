import { describe, it, expect } from "vitest";
import { FormDataObjectValue, formDataToObject } from "./form-data";

describe("formDataToObject — deterministic tests", () => {
  it("converts simple form data to object", () => {
    const fd = new FormData();
    fd.append("name", "Denis");
    fd.append("age", "25");

    expect(formDataToObject(fd)).toEqual({
      name: "Denis",
      age: "25",
    });
  });

  it("aggregates duplicate keys into arrays", () => {
    const fd = new FormData();
    fd.append("tag", "a");
    fd.append("tag", "b");
    fd.append("tag", "c");

    expect(formDataToObject(fd)).toEqual({
      tag: ["a", "b", "c"],
    });
  });

  it("preserves File values", () => {
    const file = new File(["hello"], "test.txt", { type: "text/plain" });
    const fd = new FormData();
    fd.append("file", file);

    const result = formDataToObject(fd);
    expect(result.file).toBe(file);
  });

  it("aggregates mixed string and File values", () => {
    const file = new File(["x"], "a.txt");
    const fd = new FormData();
    fd.append("upload", "meta");
    fd.append("upload", file);

    expect(formDataToObject(fd)).toEqual({
      upload: ["meta", file],
    });
  });

  it("is safe against prototype pollution", () => {
    const fd = new FormData();
    fd.append("__proto__", "evil");

    const result = formDataToObject(fd);
    expect(result.__proto__).toBeUndefined();
    expect(({} as any).evil).toBeUndefined();
  });
});

import fc from "fast-check";

const safeKey = fc
  .string({ minLength: 1 })
  .filter((k) => !["__proto__", "prototype", "constructor"].includes(k));

const entry = fc.tuple(
  safeKey,
  fc.oneof(fc.string(), fc.constant(new File(["x"], "a.txt")))
);

it("aggregates entries correctly for any key/value", () => {
  fc.assert(
    fc.property(fc.array(entry), (entries) => {
      const fd = new FormData();
      const expected: Record<string, FormDataObjectValue> = Object.create(null);

      for (const [key, value] of entries) {
        fd.append(key, value);
        if (key in expected) {
          const existing = expected[key];
          expected[key] = Array.isArray(existing)
            ? [...existing, value]
            : [existing, value];
        } else {
          expected[key] = value;
        }
      }

      expect(formDataToObject(fd)).toEqual(expected);
    })
  );
});
