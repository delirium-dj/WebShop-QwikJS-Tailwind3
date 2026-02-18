/**
 * ============================================================
 * REVIEWS & RATINGS — TYPE DEFINITIONS
 * File: src/types/review.ts
 * ============================================================
 *
 * All TypeScript interfaces and helper types for the review system.
 * This file describes the SHAPE of the data — it does not fetch or
 * modify anything on its own.
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * Think of this file as a "contract". Every other file (service,
 * components, routes) must honour these shapes. If a Supabase row
 * comes back as ReviewRow, the service converts it to Review before
 * handing it to a component.
 *
 * Why two types (Review vs ReviewRow)?
 *   - ReviewRow = what the database returns (snake_case columns)
 *   - Review    = what components use (camelCase, extra UI flags)
 *   The service layer converts between them in one place so
 *   components never need to think about database column names.
 * ──────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────────
// STAR RATING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * StarRating — valid star values.
 * Using a union type means TypeScript will catch typos like "6" or "0".
 */
export type StarRating = 1 | 2 | 3 | 4 | 5;

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW (camelCase — what components consume)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Review — one customer review, ready for use in components.
 *
 * This is produced by the service layer by converting a ReviewRow.
 * Components only ever see this type, never the raw database row.
 */
export interface Review {
  /** UUID assigned by Supabase automatically on INSERT */
  id: string;

  /** FakeStore API product ID that this review belongs to */
  productId: number;

  /** Supabase auth UUID of the person who wrote this review */
  userId: string;

  /**
   * Display name captured at submission time (from profiles table).
   * Stored in the review row so the name still shows even if the user
   * later deletes their account or changes their display name.
   */
  authorName: string;

  /**
   * Avatar URL captured at submission time. Can be null if the user
   * has no avatar — the UI falls back to a generated initials avatar.
   */
  authorAvatar: string | null;

  /** Star rating the reviewer chose (1–5) */
  rating: StarRating;

  /**
   * Short headline for the review.
   * Example: "Fantastic quality — worth every penny"
   */
  title: string;

  /**
   * The full review text.
   * Example: "I bought this for hiking and it held up perfectly…"
   */
  body: string;

  /** ISO 8601 timestamp when the review was first submitted */
  createdAt: string;

  /** ISO 8601 timestamp of the most recent edit (equals createdAt if never edited) */
  updatedAt: string;

  /**
   * Client-side flag: true if this review was written by the currently
   * logged-in user. Set by the service layer — NOT stored in Supabase.
   * Controls whether Edit / Delete buttons are shown on a ReviewCard.
   */
  isOwnReview: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW STATS (aggregated numbers for the summary section)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ReviewStats — the summary data shown above the review list.
 *
 * Displayed as:
 *   4.3 ★★★★☆  (48 reviews)
 *   5★ ██████████  35
 *   4★ ████░░░░░░   9
 *   …
 *
 * Calculated client-side from the Review[] array by calculateStats().
 */
export interface ReviewStats {
  /** Which product these stats belong to */
  productId: number;

  /**
   * Average rating rounded to 1 decimal place.
   * e.g. 4.3 — shown in the big number and used to fill the star bar.
   * 0 when there are no reviews yet.
   */
  averageRating: number;

  /** Total count of reviews for this product */
  totalReviews: number;

  /**
   * How many reviews exist at each star level.
   * Used to render the distribution bar chart.
   * Example: { 1: 2, 2: 1, 3: 4, 4: 9, 5: 35 }
   */
  distribution: Record<StarRating, number>;
}

// ─────────────────────────────────────────────────────────────────────────────
// FORM DATA (what the submission form sends)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ReviewFormData — the three fields the user fills in.
 *
 * userId and authorName are NOT here — they come from the auth context.
 * The form component builds ReviewFormData and passes it to the service.
 */
export interface ReviewFormData {
  /** Star rating chosen by clicking stars in the form (1–5) */
  rating: StarRating;

  /** Short title headline (max ~80 chars, validated before submit) */
  title: string;

  /** Full review body text (max ~2000 chars, validated before submit) */
  body: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SORT & FILTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ReviewSortOption — how the review list is ordered.
 * Handled entirely client-side using Array.sort() on the loaded reviews.
 */
export type ReviewSortOption =
  | "newest"   // Most recently submitted first (default)
  | "oldest"   // Oldest first
  | "highest"  // 5★ reviews first
  | "lowest";  // 1★ reviews first

/**
 * ReviewFilters — the current filter + sort state for the review list.
 * Stored in a useStore() inside ReviewList.tsx.
 */
export interface ReviewFilters {
  /**
   * Only show reviews at this star level.
   * null = show all ratings (default).
   */
  rating: StarRating | null;

  /** Current sort order */
  sort: ReviewSortOption;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATABASE ROW (matches the Supabase `reviews` table columns)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ReviewRow — the raw row returned by Supabase.
 *
 * Column names use snake_case to match PostgreSQL convention.
 * The service converts these → Review (camelCase) before returning to components.
 * You'll see these column names in the DATABASE_SETUP.sql file.
 */
export interface ReviewRow {
  id: string;
  product_id: number;
  user_id: string;
  author_name: string;
  author_avatar: string | null;
  rating: StarRating;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC HELPERS (no imports needed — safe to use anywhere)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * STAR_LABELS — readable label for each star level.
 * Shown in the rating distribution breakdown.
 *
 * Example:
 *   STAR_LABELS[5] → "Excellent"
 *   STAR_LABELS[1] → "Terrible"
 */
export const STAR_LABELS: Record<StarRating, string> = {
  5: "Excellent",
  4: "Good",
  3: "Average",
  2: "Poor",
  1: "Terrible",
};

/**
 * buildEmptyStats — a zeroed ReviewStats object.
 * Used as the initial value before any reviews have been fetched.
 *
 * @param productId — Which product to create empty stats for
 */
export function buildEmptyStats(productId: number): ReviewStats {
  return {
    productId,
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };
}

/**
 * calculateStats — derives ReviewStats from the loaded reviews array.
 *
 * Called inside the ReviewList component after reviews are fetched.
 * This way we don't need a separate database aggregation query.
 *
 * @param productId — Which product these reviews belong to
 * @param reviews   — Full list of Review objects for that product
 * @returns         — Computed ReviewStats ready for the summary section
 *
 * Example:
 *   calculateStats(1, [{ rating: 5 }, { rating: 4 }, { rating: 5 }])
 *   → { averageRating: 4.7, totalReviews: 3, distribution: { 5: 2, 4: 1, … } }
 */
export function calculateStats(productId: number, reviews: Review[]): ReviewStats {
  if (reviews.length === 0) {
    return buildEmptyStats(productId);
  }

  const distribution: Record<StarRating, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let ratingSum = 0;

  for (const review of reviews) {
    distribution[review.rating] += 1;
    ratingSum += review.rating;
  }

  return {
    productId,
    averageRating: parseFloat((ratingSum / reviews.length).toFixed(1)),
    totalReviews: reviews.length,
    distribution,
  };
}

/**
 * rowToReview — converts one ReviewRow (from Supabase) to a Review (for UI).
 *
 * @param row         — Raw database row
 * @param currentUserId — The logged-in user's UUID (or null if logged out)
 * @returns           — Review object ready for component use
 */
export function rowToReview(row: ReviewRow, currentUserId: string | null): Review {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    authorName: row.author_name,
    authorAvatar: row.author_avatar,
    rating: row.rating,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isOwnReview: currentUserId !== null && row.user_id === currentUserId,
  };
}
