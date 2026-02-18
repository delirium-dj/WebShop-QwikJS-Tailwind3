/**
 * ============================================================
 * REVIEW STATS COMPONENT
 * File: src/components/reviews/ReviewStats.tsx
 * ============================================================
 *
 * Displays the aggregate rating summary at the top of the reviews section.
 *
 * Visual layout:
 *
 *   ┌──────────────────────────────────────────────────────┐
 *   │  4.3          ★★★★☆  48 reviews                     │
 *   │  out of 5     ▐█████████░░░░┐  5★ Excellent  35     │
 *   │               ▐████░░░░░░░░┐  4★ Good         9     │
 *   │               ▐██░░░░░░░░░┐   3★ Average      3     │
 *   │               ▐░░░░░░░░░░┐    2★ Poor          1     │
 *   │               ▐░░░░░░░░░░┐    1★ Terrible      0     │
 *   └──────────────────────────────────────────────────────┘
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * This is a purely "display" component — it takes a ReviewStats object
 * as a prop and renders it. No data fetching, no actions.
 *
 * The bar widths are calculated as percentages of the total reviews.
 * For example: 35 reviews at 5★ out of 48 total = 72.9% width bar.
 *
 * The component also accepts an onFilterByRating$ callback so clicking
 * a bar row filters the review list to that star level.
 * ──────────────────────────────────────────────────────────────
 */

import { component$ } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";
import type { ReviewStats, StarRating } from "~/types/review";
import { STAR_LABELS } from "~/types/review";
import { StarRating as StarRatingComponent } from "./StarRating";

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface ReviewStatsProps {
  /** The aggregated stats object to display */
  stats: ReviewStats;

  /**
   * Optional: called when the user clicks a rating row to filter by it.
   * Passed in from ProductReviews.tsx and forwarded to the ReviewList.
   */
  onFilterByRating$?: QRL<(rating: StarRating | null) => void>;

  /**
   * The currently active filter, so the active bar row is highlighted.
   * null = no filter (show all).
   */
  activeFilter?: StarRating | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const ReviewStats = component$<ReviewStatsProps>((props) => {
  const { stats, onFilterByRating$, activeFilter } = props;
  const { averageRating, totalReviews, distribution } = stats;

  // ── Empty state ─────────────────────────────────────────────────────────
  if (totalReviews === 0) {
    return (
      <div class="text-center py-6 text-gray-400">
        <p class="text-sm">No reviews yet — be the first!</p>
      </div>
    );
  }

  return (
    <div
      id="review-stats-section"
      class="flex flex-col sm:flex-row gap-6 items-start sm:items-center"
    >
      {/* ── LEFT: Big average number ── */}
      <div class="flex-shrink-0 text-center sm:text-left">
        <p class="text-5xl font-bold text-gray-900 leading-none">
          {averageRating.toFixed(1)}
        </p>
        <p class="text-sm text-gray-400 mt-1">out of 5</p>

        {/* Star bar showing the average */}
        <div class="mt-2 flex justify-center sm:justify-start">
          <StarRatingComponent value={averageRating} mode="display" size="md" />
        </div>

        <p class="text-sm text-gray-500 mt-1">
          {totalReviews} review{totalReviews !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── RIGHT: Distribution bars (5★ down to 1★) ── */}
      <div class="flex-1 w-full space-y-1.5">
        {([5, 4, 3, 2, 1] as StarRating[]).map((star) => {
          const count = distribution[star];
          // Width as a percentage of total reviews (avoids division-by-zero)
          const widthPct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          const isActive = activeFilter === star;

          return (
            <button
              key={star}
              id={`review-filter-star-${star}`}
              type="button"
              onClick$={() => {
                if (onFilterByRating$) {
                  // Clicking the same star again clears the filter
                  onFilterByRating$(isActive ? null : star);
                }
              }}
              class={[
                "w-full flex items-center gap-2 group rounded-lg px-2 py-1",
                "transition-colors duration-150",
                onFilterByRating$ ? "hover:bg-gray-50 cursor-pointer" : "cursor-default",
                isActive ? "bg-amber-50 ring-1 ring-amber-200" : "",
              ].join(" ")}
              aria-label={`Filter by ${star} star reviews (${count})`}
              aria-pressed={isActive}
            >
              {/* Star level label: "5★" */}
              <span class="text-xs text-gray-500 w-5 text-right flex-shrink-0 font-medium">
                {star}★
              </span>

              {/* Progress bar track */}
              <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  class="h-2 rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${widthPct}%` }}
                  aria-hidden="true"
                />
              </div>

              {/* Count */}
              <span class="text-xs text-gray-500 w-6 text-right flex-shrink-0">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
