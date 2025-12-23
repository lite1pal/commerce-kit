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
    <section className="mt-10">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm p-6 max-w-2xl mx-auto transition-colors">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Reviews
        </h2>
        {reviews.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400">
            No reviews yet.
          </p>
        ) : (
          <ul className="space-y-6">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="border-b border-neutral-100 dark:border-neutral-800 pb-4 last:border-b-0"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {review.user.email}
                  </span>
                  <span className="text-yellow-500 text-lg">
                    {"★".repeat(review.rating)}
                  </span>
                  <span className="text-xs text-neutral-400 ml-auto">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <div className="mt-2 text-neutral-700 dark:text-neutral-300 text-base">
                    {review.comment}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {userId && (
          <div className="mt-8">
            <ReviewForm productId={productId} userId={userId} />
          </div>
        )}
      </div>
    </section>
  );
}
