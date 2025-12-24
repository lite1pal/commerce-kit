// Pluralize a word (basic English rules)
export function pluralize(word: string): string {
  if (!/^[a-z]+$/.test(word)) {
    throw new Error("pluralize() expects a lowercase word");
  }

  if (word.endsWith("y") && !/[aeiou]y$/.test(word)) {
    return word.slice(0, -1) + "ies";
  }
  if (
    word.endsWith("s") ||
    word.endsWith("x") ||
    word.endsWith("z") ||
    word.endsWith("ch") ||
    word.endsWith("sh")
  ) {
    return word + "es";
  }
  return word + "s";
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
