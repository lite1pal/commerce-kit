export function Search({ query }: { query?: string }) {
  return (
    <form className="mt-6 flex gap-2" action="/products" method="get">
      <input
        type="text"
        name="q"
        defaultValue={query}
        placeholder="Search products..."
        className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white rounded px-3 py-2 w-full max-w-sm transition-colors"
      />
      <button
        type="submit"
        className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded transition-colors"
      >
        Search
      </button>
    </form>
  );
}

export default Search;
