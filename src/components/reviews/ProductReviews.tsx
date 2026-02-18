/**
 * ============================================================
 * PRODUCT REVIEWS COMPONENT (Main Container)
 * File: src/components/reviews/ProductReviews.tsx
 * ============================================================
 *
 * The all-in-one reviews section for the product detail page.
 * Drop this at the bottom of src/routes/product/[id]/index.tsx.
 *
 * Manages:
 *   - Fetching reviews from Supabase on mount
 *   - Computing stats (average, distribution) from loaded reviews
 *   - Displaying ReviewStats summary
 *   - Filtering by star level and sorting the list
 *   - Displaying ReviewCard list
 *   - Gating ReviewForm behind auth (show login prompt to guests)
 *   - Handling submit / edit / delete actions
 *   - Toast notifications after actions
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * This is the "smart" component — it manages all data and passes
 * clean props down to the smaller components (ReviewStats, ReviewCard,
 * ReviewForm), which are "dumb" display components.
 *
 * Data flow:
 *   Supabase → getReviewsForProduct()
 *       ↓
 *   allReviews signal (all Review[] for this product)
 *       ↓
 *   calculateStats() → ReviewStats  →  <ReviewStats />
 *       ↓
 *   apply filters → filteredReviews  →  <ReviewCard /> × N
 *       ↓
 *   user submits form → submitReview() → refresh allReviews
 *
 * Auth flow:
 *   - Guest: see reviews, see "Sign in to review" prompt
 *   - Logged-in, no review: see form
 *   - Logged-in, has review: see their card with Edit/Delete + form (edit mode)
 * ──────────────────────────────────────────────────────────────
 */

import {
  component$,
  useSignal,
  useStore,
  useVisibleTask$,
  useComputed$,
  $,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useAuth } from "~/contexts/auth";
import { useToast } from "~/contexts/toast";
import {
  getReviewsForProduct,
  submitReview,
  deleteReview,
} from "~/services/api/reviews.service";
import {
  calculateStats,
  rowToReview,
} from "~/types/review";
import type { Review, ReviewFormData, ReviewFilters, StarRating } from "~/types/review";
import { ReviewStats } from "./ReviewStats";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface ProductReviewsProps {
  /**
   * The FakeStore API product ID.
   * Used to fetch reviews from Supabase: WHERE product_id = productId
   */
  productId: number;

  /** Product title — shown in the "Write a Review" section heading */
  productTitle?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SORT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SORT_OPTIONS — dropdown choices for the sort selector.
 * Value matches ReviewSortOption from types/review.ts.
 */
const SORT_OPTIONS = [
  { value: "newest",  label: "Most Recent" },
  { value: "oldest",  label: "Oldest First" },
  { value: "highest", label: "Highest Rated" },
  { value: "lowest",  label: "Lowest Rated" },
] as const;

/**
 * sortReviews — sorts a copy of the reviews array by the given option.
 * Returns a new array (does not mutate the original).
 */
function sortReviews(reviews: Review[], sort: ReviewFilters["sort"]): Review[] {
  const copy = [...reviews];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "oldest":
      return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case "highest":
      return copy.sort((a, b) => b.rating - a.rating);
    case "lowest":
      return copy.sort((a, b) => a.rating - b.rating);
    default:
      return copy;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const ProductReviews = component$<ProductReviewsProps>((props) => {
  const { productId, productTitle } = props;

  // ── Contexts ────────────────────────────────────────────────────────────
  const auth  = useAuth();
  const toast = useToast();

  // ── State ────────────────────────────────────────────────────────────────

  /** All reviews loaded from Supabase for this product */
  const allReviews = useSignal<Review[]>([]);

  /** True while the initial data load is happening */
  const isLoading = useSignal(true);

  /** True while a form submission is in flight */
  const isSubmitting = useSignal(false);

  /**
   * editingReview — when non-null, the ReviewForm is shown in edit mode
   * pre-filled with this review's data.
   */
  const editingReview = useSignal<Review | null>(null);

  /**
   * showForm — controls whether the "Write a Review" form is expanded.
   * Starts false; toggled by the "Write a Review" button.
   */
  const showForm = useSignal(false);

  /** Filter + sort state for the visible review list */
  const filters = useStore<ReviewFilters>({
    rating: null,
    sort: "newest",
  });

  // ── Computed: stats ──────────────────────────────────────────────────────

  /**
   * stats — derived from allReviews.
   * Recomputes automatically whenever allReviews.value changes.
   */
  const stats = useComputed$(() => calculateStats(productId, allReviews.value));

  // ── Computed: filtered + sorted reviews ─────────────────────────────────

  /**
   * visibleReviews — the subset of reviews shown in the list after
   * applying the current star filter and sort order.
   */
  const visibleReviews = useComputed$(() => {
    let filtered = allReviews.value;

    // Apply star filter
    if (filters.rating !== null) {
      filtered = filtered.filter((r) => r.rating === filters.rating);
    }

    // Apply sort
    return sortReviews(filtered, filters.sort);
  });

  // ── Computed: current user's own review ─────────────────────────────────

  /**
   * ownReview — the logged-in user's review (if any).
   * Used to decide whether to show "Write a Review" or "Edit your review".
   */
  const ownReview = useComputed$(() => {
    const userId = auth.state.user?.id;
    if (!userId) return null;
    return allReviews.value.find((r) => r.userId === userId) ?? null;
  });

  // ── Fetch reviews on mount ───────────────────────────────────────────────

  /**
   * useVisibleTask$ runs in the browser after the component is visible.
   * We fetch reviews here (client-side) because:
   *   1. Reviews are dynamic user content — not suitable for static SSR cache
   *   2. We need the auth state to flag isOwnReview, which is client-side
   *
   * track() makes this re-run if auth.state.user changes (login/logout).
   */
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    // Re-fetch when the user logs in or out
    track(() => auth.state.user?.id);

    isLoading.value = true;
    const rows = await getReviewsForProduct(productId);
    const userId = auth.state.user?.id ?? null;
    allReviews.value = rows.map((row) => rowToReview(row, userId));
    isLoading.value = false;
  });

  // ── ACTIONS ─────────────────────────────────────────────────────────────

  /**
   * handleSubmit$ — called when ReviewForm is submitted.
   * Calls the service, updates local state, shows toast.
   */
  const handleSubmit$ = $(async (formData: ReviewFormData) => {
    const user = auth.state.user;
    if (!user) return;

    isSubmitting.value = true;

    // Get the best display name available from the auth context.
    //
    // Why the chain of fallbacks?
    // Supabase Auth exposes the user's profile in different places depending
    // on how they signed up:
    //   - Google OAuth:      user.user_metadata.full_name
    //   - Email/Password:    user.user_metadata.full_name  OR  user.email prefix
    //   - Custom profiles:   user.user_metadata.display_name (if set in profiles table)
    //
    // We try each in order and fall back to "Anonymous" as a last resort.
    const metadata = (user as any).user_metadata ?? {};
    const authorName =
      metadata.full_name ||
      metadata.display_name ||
      metadata.name ||
      (user as any).email?.split("@")[0] ||
      "Anonymous";

    // Avatar URL — Google OAuth provides this in user_metadata.avatar_url
    const authorAvatar = metadata.avatar_url ?? null;

    const savedRow = await submitReview(
      productId,
      user.id,
      authorName,
      authorAvatar,
      formData,
    );

    isSubmitting.value = false;

    if (!savedRow) {
      toast.showToast("Failed to save your review. Please try again.", "error");
      return;
    }

    // Convert the saved row and update local state
    const savedReview = rowToReview(savedRow, user.id);

    if (editingReview.value) {
      // Replace the existing review in the array
      allReviews.value = allReviews.value.map((r) =>
        r.id === savedReview.id ? savedReview : r,
      );
      toast.showToast("Your review has been updated!", "success");
      editingReview.value = null;
    } else {
      // Prepend new review
      allReviews.value = [savedReview, ...allReviews.value];
      toast.showToast("Your review has been submitted — thank you!", "success");
      showForm.value = false;
    }
  });

  /**
   * handleEdit$ — called when the user clicks "Edit" on their ReviewCard.
   * Opens the form in edit mode.
   */
  const handleEdit$ = $(async (review: Review) => {
    editingReview.value = review;
    showForm.value = false;
    // Scroll the form into view
    document.getElementById("review-edit-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  /**
   * handleDelete$ — called when the user clicks "Delete" on their ReviewCard.
   * Asks for confirmation, then deletes.
   */
  const handleDelete$ = $(async (reviewId: string) => {
    // Native confirm dialog — simple and accessible
    const confirmed = window.confirm(
      "Are you sure you want to delete your review? This cannot be undone.",
    );
    if (!confirmed) return;

    const ok = await deleteReview(reviewId);
    if (ok) {
      allReviews.value = allReviews.value.filter((r) => r.id !== reviewId);
      toast.showToast("Your review has been deleted.", "info");
    } else {
      toast.showToast("Failed to delete review. Please try again.", "error");
    }
  });

  /**
   * handleFilterByRating$ — called when user clicks a distribution bar.
   * Updates the rating filter (null = clear filter).
   */
  const handleFilterByRating$ = $((rating: StarRating | null) => {
    filters.rating = rating;
  });

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  const isLoggedIn = !!auth.state.user;

  return (
    <section
      id="product-reviews-section"
      class="mt-12 pt-8 border-t border-gray-200 space-y-8"
      aria-labelledby="reviews-heading"
    >
      {/* ── SECTION HEADER ── */}
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2
            id="reviews-heading"
            class="text-xl font-bold text-gray-900"
          >
            Customer Reviews
          </h2>
          {productTitle && (
            <p class="text-sm text-gray-500 mt-0.5">for {productTitle}</p>
          )}
        </div>

        {/* "Write a Review" CTA — only if logged in and hasn't reviewed yet */}
        {isLoggedIn && !ownReview.value && !showForm.value && (
          <button
            id="write-review-btn"
            type="button"
            onClick$={() => {
              showForm.value = true;
              editingReview.value = null;
            }}
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {/* Pencil icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
              />
            </svg>
            Write a Review
          </button>
        )}
      </div>

      {/* ── LOADING STATE ── */}
      {isLoading.value && (
        <div class="flex items-center justify-center py-12">
          <div class="flex items-center gap-3 text-gray-400">
            <svg
              class="w-5 h-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span class="text-sm">Loading reviews…</span>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT (shown after load) ── */}
      {!isLoading.value && (
        <div class="space-y-6">

          {/* STATS SUMMARY */}
          {stats.value.totalReviews > 0 && (
            <ReviewStats
              stats={stats.value}
              activeFilter={filters.rating}
              onFilterByRating$={handleFilterByRating$}
            />
          )}

          {/* REVIEW FORM — "Write a Review" (new) */}
          {isLoggedIn && showForm.value && !editingReview.value && (
            <ReviewForm
              onSubmit$={handleSubmit$}
              onCancel$={$(() => { showForm.value = false; })}
              isSubmitting={isSubmitting.value}
            />
          )}

          {/* REVIEW FORM — "Edit" (existing review) */}
          {isLoggedIn && editingReview.value && (
            <ReviewForm
              existingReview={editingReview.value}
              onSubmit$={handleSubmit$}
              onCancel$={$(() => { editingReview.value = null; })}
              isSubmitting={isSubmitting.value}
            />
          )}

          {/* GUEST PROMPT — shown to non-logged-in users */}
          {!isLoggedIn && (
            <div class="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
              <p class="text-sm text-gray-600 mb-3">
                Have this product?{" "}
                <strong class="text-gray-900">Share your experience</strong> to
                help other shoppers.
              </p>
              <Link
                href="/auth/login"
                class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign in to write a review
              </Link>
            </div>
          )}

          {/* FILTER & SORT CONTROLS */}
          {allReviews.value.length > 0 && (
            <div class="flex items-center justify-between gap-3 flex-wrap">
              {/* Active filter chip */}
              {filters.rating !== null && (
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">
                    Showing {filters.rating}★ reviews
                  </span>
                  <button
                    id="review-clear-filter-btn"
                    type="button"
                    onClick$={() => { filters.rating = null; }}
                    class="text-xs text-blue-600 hover:underline"
                  >
                    Clear filter
                  </button>
                </div>
              )}

              {/* Sort dropdown */}
              <div class="ml-auto flex items-center gap-2">
                <label
                  for="review-sort-select"
                  class="text-sm text-gray-500 whitespace-nowrap"
                >
                  Sort by:
                </label>
                <select
                  id="review-sort-select"
                  value={filters.sort}
                  onChange$={(e) => {
                    filters.sort = (e.target as HTMLSelectElement).value as ReviewFilters["sort"];
                  }}
                  class="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* REVIEW LIST */}
          {visibleReviews.value.length > 0 ? (
            <div class="space-y-4">
              {visibleReviews.value.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onEdit$={handleEdit$}
                  onDelete$={handleDelete$}
                />
              ))}
            </div>
          ) : (
            /* Empty state — shown when no reviews yet OR filter returns nothing */
            <div class="text-center py-12 text-gray-400">
              {filters.rating !== null ? (
                <>
                  <p class="text-sm">No {filters.rating}★ reviews yet.</p>
                  <button
                    type="button"
                    onClick$={() => { filters.rating = null; }}
                    class="mt-2 text-sm text-blue-500 hover:underline"
                  >
                    Show all reviews
                  </button>
                </>
              ) : (
                <>
                  {/* Big star icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1"
                    stroke="currentColor"
                    class="w-14 h-14 text-gray-200 mx-auto mb-3"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                  <p class="text-sm font-medium text-gray-500">No reviews yet</p>
                  <p class="text-xs text-gray-400 mt-1">
                    Be the first to share your thoughts!
                  </p>
                </>
              )}
            </div>
          )}

          {/* VISIBLE REVIEW COUNT */}
          {visibleReviews.value.length > 0 && filters.rating !== null && (
            <p class="text-xs text-gray-400 text-center">
              Showing {visibleReviews.value.length} of {allReviews.value.length} review
              {allReviews.value.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </section>
  );
});
