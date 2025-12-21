export function Search({ query }: { query?: string }) {
  return (
    <form className="mt-6 flex gap-2" action="/products" method="get">
      <input
        type="text"
        name="q"
        defaultValue={query}
        placeholder="Search products..."
        className="border rounded px-3 py-2 w-full max-w-sm"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>
    </form>
  );
}

export default Search;
