export function createEnumGuard<T extends Record<string, string>>(enumObj: T) {
  const values = Object.values(enumObj);

  return function isEnumValue(value: unknown): value is T[keyof T] {
    return typeof value === "string" && values.includes(value as T[keyof T]);
  };
}
