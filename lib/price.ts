export function formatCentsToDollars(cents: number): string {
  if (!Number.isFinite(cents)) {
    throw new Error("Invalid cents value");
  }

  if (!Number.isInteger(cents)) {
    throw new Error("Cents must be an integer");
  }

  return (cents / 100).toFixed(2);
}
