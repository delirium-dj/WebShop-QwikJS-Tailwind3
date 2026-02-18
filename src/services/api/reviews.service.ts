/**
 * ============================================================
 * REVIEWS SERVICE
 * File: src/services/reviews.service.ts
 * ============================================================
 *
 * All functions that read from and write to the Supabase `reviews` table.
 * Components never call Supabase directly — they always go through here.
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * Think of this file as the "receptionist" between your UI and the
 * database. The UI says "I need reviews for product 5", the service
 * fetches them, converts the raw database format to clean TypeScript
 * objects, and hands them back.
 *
 * Why a service file?
 *   1. All Supabase code lives in ONE place — easier to maintain.
 *   2. Type conversion (snake_case → camelCase) happens once here,
 *      not scattered across components.
 *   3. Error handling is consistent — every function returns null/[]
 *      on failure rather than crashing the UI.
 *   4. Easy to replace Supabase with another backend later.
 *
 * Functions:
 *   getReviewsForProduct() — fetch all reviews for a product
 *   submitReview()         — create or update a review (upsert)
 *   deleteReview()         — delete own review
 *   getUserReviewForProduct() — get the current user's review if any
 * ──────────────────────────────────────────────────────────────
 */

import { supabase } from "~/lib/supabase";
import type { ReviewRow, ReviewFormData } from "~/types/review";

// ─────────────────────────────────────────────────────────────────────────────
// FETCH ALL REVIEWS FOR A PRODUCT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getReviewsForProduct
 *
 * Fetches every review for a given product, sorted newest-first.
 * Returns the raw ReviewRow[] — the calling component converts to Review[]
 * using rowToReview() from types/review.ts (because the component knows
 * the current userId, which the service doesn't).
 *
 * @param productId — FakeStore API numeric product ID
 * @returns ReviewRow[] — all reviews, or [] on error
 *
 * Example usage in a component:
 * ```ts
 * const rows = await getReviewsForProduct(product.id);
 * const reviews = rows.map(r => rowToReview(r, auth.state.user?.id ?? null));
 * ```
 */
export async function getReviewsForProduct(productId: number): Promise<ReviewRow[]> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false }); // newest first

    if (error) {
      console.error("[ReviewsService] getReviewsForProduct error:", error.message);
      return [];
    }

    return (data ?? []) as ReviewRow[];
  } catch (err) {
    console.error("[ReviewsService] Unexpected error in getReviewsForProduct:", err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT (INSERT or UPDATE via upsert)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * submitReview
 *
 * Creates a NEW review, or UPDATES an existing one if the user
 * has already reviewed this product.
 *
 * How does "update if exists" work?
 *   Supabase's upsert() + onConflict means:
 *   "If a row with the same product_id AND user_id already exists,
 *    update it instead of inserting a duplicate."
 *   The database also enforces this with a UNIQUE constraint — see DATABASE_SETUP.sql.
 *
 * Security: Supabase RLS policies ensure a user can only upsert rows
 *   where user_id matches auth.uid(). If somehow a different userId
 *   were passed, Supabase would reject the request.
 *
 * @param productId    — Which product is being reviewed
 * @param userId       — auth.state.user.id from AuthContext
 * @param authorName   — Display name from auth.state.user.displayName
 * @param authorAvatar — Avatar URL (nullable)
 * @param formData     — { rating, title, body } from ReviewForm
 * @returns The saved ReviewRow, or null on error
 *
 * Example usage in a component:
 * ```ts
 * const saved = await submitReview(
 *   product.id,
 *   auth.state.user.id,
 *   auth.state.user.displayName ?? 'Anonymous',
 *   auth.state.user.avatarUrl ?? null,
 *   { rating: 5, title: 'Great!', body: 'Loved it.' }
 * );
 * if (saved) { /* refresh review list *\/ }
 * ```
 */
export async function submitReview(
  productId: number,
  userId: string,
  authorName: string,
  authorAvatar: string | null,
  formData: ReviewFormData,
): Promise<ReviewRow | null> {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("reviews")
      .upsert(
        {
          product_id: productId,
          user_id: userId,
          author_name: authorName,
          author_avatar: authorAvatar,
          rating: formData.rating,
          title: formData.title.trim(),
          body: formData.body.trim(),
          updated_at: now,
          // created_at uses the DEFAULT in the DB schema on first insert
        },
        {
          // If a row with this (product_id, user_id) pair already exists → UPDATE it
          onConflict: "product_id,user_id",
        },
      )
      .select()  // return the upserted row
      .single(); // we expect exactly one row back

    if (error) {
      console.error("[ReviewsService] submitReview error:", error.message);
      return null;
    }

    return data as ReviewRow;
  } catch (err) {
    console.error("[ReviewsService] Unexpected error in submitReview:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE OWN REVIEW
// ─────────────────────────────────────────────────────────────────────────────

/**
 * deleteReview
 *
 * Deletes a review by its UUID.
 * The Supabase RLS policy (see DATABASE_SETUP.sql) ensures the user can only
 * delete their OWN rows — so even if a wrong ID were passed, Supabase
 * would simply return 0 rows affected instead of deleting someone else's review.
 *
 * @param reviewId — UUID of the review to delete
 * @returns true if deleted, false on error
 *
 * Example usage:
 * ```ts
 * const ok = await deleteReview(review.id);
 * if (ok) {
 *   // Remove from local reviews array
 *   reviews.value = reviews.value.filter(r => r.id !== review.id);
 * }
 * ```
 */
export async function deleteReview(reviewId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      console.error("[ReviewsService] deleteReview error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[ReviewsService] Unexpected error in deleteReview:", err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET A SPECIFIC USER'S REVIEW FOR A PRODUCT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getUserReviewForProduct
 *
 * Fetches the currently logged-in user's review for a specific product (if any).
 * Used when opening the edit form — we pre-fill it with the existing values.
 *
 * Returns null if:
 *   - The user has not reviewed this product yet
 *   - There is a database error
 *
 * @param productId — The product to check
 * @param userId    — The logged-in user's Supabase UUID
 * @returns ReviewRow (existing review) or null (not reviewed yet)
 *
 * Example usage:
 * ```ts
 * const existing = await getUserReviewForProduct(product.id, auth.state.user.id);
 * if (existing) {
 *   form.rating = existing.rating;
 *   form.title  = existing.title;
 *   form.body   = existing.body;
 * }
 * ```
 */
export async function getUserReviewForProduct(
  productId: number,
  userId: string,
): Promise<ReviewRow | null> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .maybeSingle(); // returns null (not an error) if no row found

    if (error) {
      console.error("[ReviewsService] getUserReviewForProduct error:", error.message);
      return null;
    }

    return data as ReviewRow | null;
  } catch (err) {
    console.error("[ReviewsService] Unexpected error in getUserReviewForProduct:", err);
    return null;
  }
}
