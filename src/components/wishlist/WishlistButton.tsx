/**
 * ============================================================
 * WISHLIST BUTTON COMPONENT
 * File: src/components/wishlist/WishlistButton.tsx
 * ============================================================
 *
 * A heart-shaped toggle button that saves or unsaves a product.
 * Drops into two places in the existing UI:
 *
 *  1. ProductCard — small icon button in the top-right corner of the card
 *  2. Product detail page — full button with text, next to "Add to Cart"
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * This component is "stateful" — it reads from WishlistContext to
 * know whether the current product is already saved or not.
 *
 * Here is what happens when a user clicks the heart:
 *
 *  Click → handleToggle$() runs
 *       → wishlist.actions.toggleItem(product) updates the store
 *       → store mutation triggers a re-render
 *       → useVisibleTask$ re-reads isInWishlist → updates isSaved signal
 *       → icon switches between filled ♥ and outline ♡
 *
 * The heart updates instantly because of Qwik's fine-grained reactivity.
 * No full page re-render — only this button re-renders.
 *
 * ── VARIANTS ──────────────────────────────────────────────────
 *
 * "icon"   → Round icon-only button (for ProductCard corners)
 *            <WishlistButton product={product} variant="icon" />
 *
 * "button" → Full button with label text (for product detail page)
 *            <WishlistButton product={product} variant="button" />
 *
 * ── ID CONVENTION ─────────────────────────────────────────────
 * Follows the project's kebab-case ID convention:
 *   id="wishlist-btn-{product.id}"
 * ──────────────────────────────────────────────────────────────
 */

import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { useWishlist } from "~/contexts/wishlist";
import type { WishlistItem } from "~/contexts/wishlist";

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Props accepted by WishlistButton.
 *
 * `product` contains the data to store if the user saves the item.
 * We accept `Omit<WishlistItem, "addedAt">` because we generate `addedAt`
 * automatically in the context action — callers don't need to provide it.
 */
interface WishlistButtonProps {
  /**
   * The product to save/unsave.
   * Pass id, title, price, image, and category at minimum.
   */
  product: Omit<WishlistItem, "addedAt">;

  /**
   * Visual style variant.
   *
   * "icon"   → Small circular button (for ProductCard corners)
   * "button" → Full-width button with label (for product detail page)
   *
   * Defaults to "icon".
   */
  variant?: "icon" | "button";

  /**
   * Extra CSS classes from the parent.
   * Useful for positioning (e.g. class="absolute top-2 right-2 z-10").
   */
  class?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const WishlistButton = component$<WishlistButtonProps>((props) => {
  const { product, variant = "icon" } = props;

  // Access the global wishlist state and actions
  const wishlist = useWishlist();

  /**
   * isSaved — local signal tracking whether THIS product is in the wishlist.
   *
   * Starts as false (safe SSR default — shows an empty heart on first render).
   * Gets hydrated from localStorage once the browser runs useVisibleTask$.
   *
   * Why a local signal and not reading wishlist.state directly?
   * Reading `isInWishlist(id)` is an async QRL call. We need a simple
   * boolean signal to toggle the heart icon. The signal bridges that gap.
   */
  const isSaved = useSignal(false);

  /**
   * Hydrate isSaved from the wishlist store.
   *
   * useVisibleTask$ runs in the browser after the component is visible.
   * track(() => wishlist.state.totalItems) means this re-runs whenever
   * the wishlist changes anywhere in the app — so if a different
   * WishlistButton removes this product, this heart updates too.
   */
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    // Re-run this task whenever the wishlist item count changes
    track(() => wishlist.state.totalItems);
    // Update the local signal with the fresh saved-state
    isSaved.value = await wishlist.actions.isInWishlist(product.id);
  });

  /**
   * handleToggle$ — called on button click.
   *
   * Calls toggleItem which updates the global store and localStorage.
   * We also flip isSaved optimistically so the UI feels instant
   * (the useVisibleTask$ above will confirm the real state shortly after).
   */
  const handleToggle$ = $(async () => {
    await wishlist.actions.toggleItem(product);
    isSaved.value = !isSaved.value; // optimistic update for instant feedback
  });

  // ─────────────────────────────────────────────────────────────────────────
  // SHARED SVG ICONS
  // ─────────────────────────────────────────────────────────────────────────

  // Filled heart — shown when product is saved (♥)
  const FilledHeart = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );

  // Outline heart — shown when product is NOT saved (♡)
  const OutlineHeart = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-5 h-5"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // VARIANT: ICON (for ProductCard corners)
  // ─────────────────────────────────────────────────────────────────────────

  if (variant === "icon") {
    return (
      <button
        id={`wishlist-btn-${product.id}`}
        type="button"
        aria-label={isSaved.value ? "Remove from wishlist" : "Add to wishlist"}
        onClick$={handleToggle$}
        class={[
          // Base — round, fixed size, shadow so it floats above the image
          "flex items-center justify-center w-9 h-9 rounded-full border shadow-sm",
          "transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400",
          // Color: red when saved, white when not
          isSaved.value
            ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
            : "bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50",
          props.class ?? "",
        ].join(" ")}
      >
        {isSaved.value ? FilledHeart : OutlineHeart}
      </button>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // VARIANT: BUTTON (for product detail page — sits next to "Add to Cart")
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <button
      id={`wishlist-btn-${product.id}`}
      type="button"
      aria-label={isSaved.value ? "Remove from wishlist" : "Add to wishlist"}
      onClick$={handleToggle$}
      class={[
        // Base — full button with icon + text
        "flex items-center justify-center gap-2 px-5 py-3 rounded-lg border",
        "font-medium text-sm transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400",
        // Color: red-tinted when saved, neutral when not
        isSaved.value
          ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
          : "bg-white border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-500 hover:bg-red-50",
        props.class ?? "",
      ].join(" ")}
    >
      {isSaved.value ? FilledHeart : OutlineHeart}
      <span>{isSaved.value ? "Saved" : "Add to Wishlist"}</span>
    </button>
  );
});
