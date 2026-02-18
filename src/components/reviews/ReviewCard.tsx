/**
 * ============================================================
 * REVIEW CARD COMPONENT
 * File: src/components/reviews/ReviewCard.tsx
 * ============================================================
 *
 * Displays one customer review in the reviews list.
 *
 * Layout:
 *   [Avatar / Initials]  [Author Name]  [Date]
 *   [★★★★☆]
 *   [Review Title in bold]
 *   [Review body text]
 *   [Edit] [Delete]   ← only shown for the user's OWN review
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * This component receives a Review object as a prop and renders it.
 * It doesn't fetch any data or modify the database — it just displays.
 *
 * The Edit / Delete buttons are shown based on `review.isOwnReview`,
 * which is a flag set by the service layer when it knows the current
 * user ID. This is much safer than checking in the UI:
 *   ✅ Flag set by server-aware service layer
 *   ❌ "if (review.userId === someUiVariable)"
 *
 * The onEdit$ and onDelete$ callbacks are passed in from the parent
 * (ReviewList / ProductReviews). This keeps ReviewCard "dumb" —
 * it just signals "the user clicked edit/delete" and the parent
 * decides what to do.
 * ──────────────────────────────────────────────────────────────
 */

import { component$ } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";
import type { Review } from "~/types/review";
import { StarRating } from "./StarRating";

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface ReviewCardProps {
  /** The review data to display */
  review: Review;

  /**
   * Called when the user clicks "Edit" on their own review.
   * The parent opens the review form pre-filled with this review's data.
   */
  onEdit$?: QRL<(review: Review) => void>;

  /**
   * Called when the user clicks "Delete" on their own review.
   * The parent shows a confirmation and calls the service to delete.
   */
  onDelete$?: QRL<(reviewId: string) => void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * formatDate — converts an ISO 8601 string to a readable date.
 *
 * "2026-02-17T10:30:00.000Z" → "Feb 17, 2026"
 *
 * Why not use toLocaleDateString()?
 * On the server (SSR), locale may differ from the user's locale.
 * This manual format is consistent across environments.
 */
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * getInitials — extracts up to 2 initials from a display name.
 *
 * "Jane Smith"  → "JS"
 * "Alice"       → "A"
 * ""            → "?"
 */
function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const ReviewCard = component$<ReviewCardProps>((props) => {
  const { review, onEdit$, onDelete$ } = props;

  const initials = getInitials(review.authorName);
  const dateLabel = formatDate(review.createdAt);

  // Show an "(edited)" note if updatedAt is meaningfully different from createdAt
  const wasEdited =
    review.updatedAt &&
    review.createdAt &&
    new Date(review.updatedAt).getTime() - new Date(review.createdAt).getTime() > 5000;

  return (
    <article
      id={`review-card-${review.id}`}
      class="bg-white rounded-2xl border border-gray-200 p-5 space-y-3"
    >
      {/* ── HEADER ROW: Avatar + Name + Date ── */}
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          {/* Avatar: use the stored image URL, fall back to coloured initials */}
          {review.authorAvatar ? (
            <img
              src={review.authorAvatar}
              alt={`${review.authorName}'s avatar`}
              width={40}
              height={40}
              class="w-10 h-10 rounded-full object-cover flex-shrink-0"
              loading="lazy"
            />
          ) : (
            // Initials avatar — deterministic colour from name length
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white select-none"
              style={{
                // Cycle through a few pleasant background colours based on name
                backgroundColor: [
                  "#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B",
                ][review.authorName.length % 5],
              }}
              aria-hidden="true"
            >
              {initials}
            </div>
          )}

          <div class="min-w-0">
            {/* Author name */}
            <p class="font-semibold text-gray-900 text-sm leading-tight truncate">
              {review.authorName}
            </p>

            {/* Date — and "(edited)" if the review was updated */}
            <p class="text-xs text-gray-400 mt-0.5">
              {dateLabel}
              {wasEdited && (
                <span class="ml-1 text-gray-400 italic">(edited)</span>
              )}
            </p>
          </div>
        </div>

        {/* Star rating badge — compact, top-right */}
        <div class="flex-shrink-0">
          <StarRating value={review.rating} mode="display" size="sm" />
        </div>
      </div>

      {/* ── REVIEW CONTENT ── */}
      <div class="space-y-1">
        {/* Title */}
        <h4 class="font-semibold text-gray-900 text-sm leading-snug">
          {review.title}
        </h4>

        {/* Body — preserves newlines the user typed */}
        <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
          {review.body}
        </p>
      </div>

      {/* ── OWNER ACTIONS (Edit / Delete) — only for the author ── */}
      {review.isOwnReview && (
        <div class="flex items-center gap-3 pt-1 border-t border-gray-100">
          {/* "Your review" label */}
          <span class="text-xs text-blue-600 font-medium flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
            Your review
          </span>

          <div class="ml-auto flex items-center gap-2">
            {/* Edit button */}
            {onEdit$ && (
              <button
                id={`review-edit-btn-${review.id}`}
                type="button"
                onClick$={() => onEdit$(review)}
                class="text-xs text-gray-500 hover:text-blue-600 font-medium px-2 py-1 rounded transition-colors"
              >
                Edit
              </button>
            )}

            {/* Delete button */}
            {onDelete$ && (
              <button
                id={`review-delete-btn-${review.id}`}
                type="button"
                onClick$={() => onDelete$(review.id)}
                class="text-xs text-gray-500 hover:text-red-500 font-medium px-2 py-1 rounded transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
});
