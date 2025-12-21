import { addProductReview } from "../review-actions";

function ReviewForm({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  return (
    <form className="mt-4 space-y-2" action={addProductReview}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="userId" value={userId} />
      <label className="block">
        <span>Rating:</span>
        <select name="rating" defaultValue={5} className="ml-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span>Comment:</span>
        <textarea name="comment" className="w-full border p-2" rows={3} />
      </label>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;
