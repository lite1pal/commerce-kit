export type FormDataObjectValue = string | File | Array<string | File>;

const unsafeKeys = ["__proto__", "prototype", "constructor"];

export function formDataToObject(
  formData: FormData
): Record<string, FormDataObjectValue> {
  const result: Record<string, FormDataObjectValue> = Object.create(null);

  for (const [key, value] of formData.entries()) {
    if (unsafeKeys.includes(key)) continue;

    if (key in result) {
      const existing = result[key];
      result[key] = Array.isArray(existing)
        ? [...existing, value]
        : [existing, value];
    } else {
      result[key] = value;
    }
  }

  return result;
}
