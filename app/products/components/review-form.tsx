"use client";

import { useState } from "react";
import { addProductReview } from "../review-actions";

function ReviewForm({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await addProductReview({ productId, userId, rating, comment });
      setComment("");
      // Optionally refresh reviews
    } catch (err) {
      setError("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-4 space-y-2" onSubmit={handleSubmit}>
      <label className="block">
        <span>Rating:</span>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="ml-2"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span>Comment:</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-2"
          rows={3}
        />
      </label>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export default ReviewForm;
