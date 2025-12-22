export function parseFilters(filters: string[] | undefined) {
  // Example: ['color-grey', 'size-large']
  const filterMap: Record<string, string[]> = {};
  if (!filters) return filterMap;
  for (const segment of filters) {
    const [key, value] = segment.split("-");
    if (key && value) {
      if (!filterMap[key]) filterMap[key] = [];
      filterMap[key].push(value);
    }
  }
  return filterMap;
}

export function buildFilterUrl(
  key: string,
  currentFilters: string[],
  value: string,
  selected: boolean
) {
  let next: string[];
  const filterStr = `${key}-${value}`;
  if (selected) {
    next = currentFilters.filter((seg) => seg !== filterStr);
  } else {
    next = [...currentFilters, filterStr];
  }
  return `/f/${next.join("/")}`;
}
