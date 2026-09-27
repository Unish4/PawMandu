import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/react";
import { useNavigate } from "react-router";
import { StarRating } from "./StarRating";
import { StarRatingInput } from "./StarRatingInput";
import {
  useProductReviews,
  useMyReviewStatus,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "../../hooks/useReviews";
import { ConfirmDialog } from "../ConfirmDialog";

interface ReviewsSectionProps {
  productId: string;
  averageRating: number;
  reviewCount: number;
}

export function ReviewsSection({
  productId,
  averageRating,
  reviewCount,
}: ReviewsSectionProps) {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { data: reviews, isLoading } = useProductReviews(productId);
  const { data: myStatus } = useMyReviewStatus(productId, !!isSignedIn);
  const createReview = useCreateReview(productId);
  const updateReview = useUpdateReview(productId);
  const deleteReview = useDeleteReview(productId);

  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const startEditing = () => {
    setRating(myStatus?.existingReview?.rating ?? 0);
    setComment(myStatus?.existingReview?.comment ?? "");
    setEditing(true);
  };

  const handleSubmit = () => {
    if (rating < 1) {
      toast.error("Select a rating");
      return;
    }

    const onSettled = { onError: (err: Error) => toast.error(err.message) };
    if (myStatus?.existingReview) {
      updateReview.mutate(
        {
          id: myStatus.existingReview._id,
          data: { rating, comment: comment || undefined },
        },
        {
          onSuccess: () => {
            toast.success("Review updated");
            setEditing(false);
          },
          ...onSettled,
        },
      );
    } else {
      createReview.mutate(
        { rating, comment: comment || undefined },
        {
          onSuccess: () => {
            toast.success("Review posted");
            setEditing(false);
          },
          ...onSettled,
        },
      );
    }
  };

  const handleDelete = () => {
    if (!myStatus?.existingReview) return;
    deleteReview.mutate(myStatus.existingReview._id, {
      onSuccess: () => toast.success("Review removed"),
      onError: (err) => toast.error(err.message),
    });
    setConfirmDeleteOpen(false);
  };

  return (
    <div className="mt-16 border-t border-[var(--color-border)] pt-10">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Reviews
        </h2>
        {reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={averageRating} size={16} />
            <span className="text-sm text-[var(--color-text-secondary)]">
              {averageRating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        )}
      </div>

      {!isSignedIn ? (
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          <button
            onClick={() => navigate("/sign-in")}
            className="text-[var(--color-primary)] font-medium"
          >
            Sign in
          </button>{" "}
          to write a review.
        </p>
      ) : myStatus?.existingReview && !editing ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 mb-6">
          <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">
            Your review
          </p>
          <StarRating rating={myStatus.existingReview.rating} size={16} />
          {myStatus.existingReview.comment && (
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              {myStatus.existingReview.comment}
            </p>
          )}
          <div className="flex gap-3 mt-3">
            <button
              onClick={startEditing}
              className="text-xs font-medium text-[var(--color-primary)]"
            >
              Edit
            </button>
            <button
              onClick={() => setConfirmDeleteOpen(true)}
              className="text-xs font-medium text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ) : editing || myStatus?.canReview ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 mb-6">
          <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">
            {myStatus?.existingReview ? "Edit your review" : "Write a review"}
          </p>
          <StarRatingInput value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience (optional)"
            rows={3}
            className="w-full mt-3 px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSubmit}
              disabled={createReview.isPending || updateReview.isPending}
              className="text-sm font-semibold px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white disabled:opacity-50"
            >
              {createReview.isPending || updateReview.isPending
                ? "Saving..."
                : "Submit review"}
            </button>
            {editing && (
              <button
                onClick={() => setEditing(false)}
                className="text-sm font-medium px-4 py-2 text-[var(--color-text-secondary)]"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          Loading reviews...
        </p>
      ) : !reviews || reviews.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)]">
          No reviews yet.
        </p>
      ) : (
        <div className="space-y-5">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="border-b border-[var(--color-border)] pb-5 last:border-0"
            >
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={r.rating} size={13} />
                <span className="text-xs font-medium text-[var(--color-text-primary)]">
                  {r.reviewerName}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {new Date(r.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {r.comment && (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {r.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete your review?"
        description="This can't be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </div>
  );
}
