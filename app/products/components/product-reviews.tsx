import { getProductReviews } from "../review-actions";
import ReviewForm from "./review-form";

export async function ProductReviews({
  productId,
  userId,
}: {
  productId: string;
  userId?: string;
}) {
  const reviews = await getProductReviews(productId);

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-slate-500">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold">{review.user.email}</span>
                <span className="text-yellow-500">
                  {"★".repeat(review.rating)}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && <div className="mt-1">{review.comment}</div>}
            </li>
          ))}
        </ul>
      )}
      {userId && <ReviewForm productId={productId} userId={userId} />}
    </section>
  );
}
