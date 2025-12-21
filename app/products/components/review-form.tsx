import { addProductReview } from "../review-actions";

function ReviewForm({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  return (
    <form className="space-y-4" action={addProductReview}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="userId" value={userId} />
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
          Rating
        </label>
        <select
          name="rating"
          defaultValue={5}
          className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white rounded px-3 py-2 w-24 transition-colors"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
          Comment
        </label>
        <textarea
          name="comment"
          className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white rounded px-3 py-2 transition-colors"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded transition-colors hover:opacity-90"
      >
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;
