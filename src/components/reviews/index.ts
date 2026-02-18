/**
 * ============================================================
 * REVIEWS COMPONENTS — BARREL EXPORTS
 * File: src/components/reviews/index.ts
 * ============================================================
 *
 * Re-exports every component from the reviews folder in one place
 * so imports in other files stay clean and consistent.
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * Instead of:
 *   import { StarRating } from '~/components/reviews/StarRating';
 *   import { ReviewCard } from '~/components/reviews/ReviewCard';
 *   import { ProductReviews } from '~/components/reviews/ProductReviews';
 *
 * You can write:
 *   import { StarRating, ReviewCard, ProductReviews } from '~/components/reviews';
 *
 * This is called a "barrel export" — one file re-exports everything
 * from its sibling files. Same pattern used in src/contexts/cart/index.ts.
 * ──────────────────────────────────────────────────────────────
 *
 * Component responsibilities at a glance:
 *
 *   StarRating       — Displays stars (display mode) or lets user pick stars (input mode)
 *   ReviewCard       — Renders one review with author info, stars, text, Edit/Delete buttons
 *   ReviewStats      — Summary header: average number + distribution bars (5★, 4★, 3★…)
 *   ReviewForm       — The write/edit form with star picker, title, and body fields
 *   ProductReviews   — The main container: fetches data, wires up all of the above
 */

export { StarRating } from "./StarRating";
export { ReviewCard } from "./ReviewCard";
export { ReviewStats } from "./ReviewStats";
export { ReviewForm } from "./ReviewForm";
export { ProductReviews } from "./ProductReviews";
