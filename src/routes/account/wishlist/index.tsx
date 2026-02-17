/**
 * ============================================================
 * WISHLIST PAGE
 * File: src/routes/account/wishlist/index.tsx
 * Route: /account/wishlist
 * ============================================================
 *
 * Shows all products the user has saved to their wishlist.
 * From here users can:
 *  - Move individual items to the cart
 *  - Move ALL items to the cart at once
 *  - Remove individual items (via the heart button on the card)
 *  - Clear the entire wishlist
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * This page is automatically protected by AuthGuard because it lives
 * inside the /account/ folder, which has its own layout.tsx that
 * wraps everything in <AuthGuard>. No extra guard needed here.
 *
 * The wishlist data comes from WishlistContext (localStorage-backed).
 * There is no server fetch here — it's all client-side reactive data.
 *
 * "Move to Cart" works by:
 *  1. Calling cart.actions.addItem(item)  — adds to cart
 *  2. Calling wishlist.actions.removeItem(item.id) — removes from wishlist
 *  3. Showing a toast notification — confirms the action to the user
 *
 * The DocumentHead export adds an SEO title for the page.
 * ──────────────────────────────────────────────────────────────
 */

import { component$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { useWishlist } from "~/contexts/wishlist";
import type { WishlistItem } from "~/contexts/wishlist";
import { useCart } from "~/contexts/cart";
import { useToast } from "~/contexts/toast";
import { WishlistButton } from "~/components/wishlist/WishlistButton";

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default component$(() => {
  const wishlist = useWishlist();
  const cart = useCart();
  const toast = useToast();

  // ─── ACTIONS ─────────────────────────────────────────────────────────────

  /**
   * moveToCart
   *
   * Adds ONE item to the cart and removes it from the wishlist.
   * Shows a toast so the user knows it worked.
   *
   * @param item — The WishlistItem to move
   */
  const moveToCart$ = $(async (item: WishlistItem) => {
    // 1. Add to cart — cart.actions.addItem expects everything except quantity
    cart.actions.addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      discount: item.discount,
    });

    // 2. Remove from wishlist
    await wishlist.actions.removeItem(item.id);

    // 3. Confirm with toast — truncate long product names
    const shortTitle =
      item.title.length > 35 ? item.title.slice(0, 35) + "…" : item.title;
    toast.showToast(`"${shortTitle}" added to your cart!`, "success");
  });

  /**
   * moveAllToCart
   *
   * Adds EVERY saved item to the cart and clears the wishlist.
   * Useful when the user decides to buy everything they saved.
   */
  const moveAllToCart$ = $(async () => {
    // Capture the array before we clear it
    const items = [...wishlist.state.items];

    // Add each item to cart
    items.forEach((item) => {
      cart.actions.addItem({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        discount: item.discount,
      });
    });

    // Clear the whole wishlist at once
    await wishlist.actions.clearWishlist();

    // Confirmation toast
    const count = items.length;
    toast.showToast(
      `${count} item${count !== 1 ? "s" : ""} added to your cart!`,
      "success",
    );
  });

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div class="space-y-6">
      {/* ── PAGE HEADER ── */}
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">My Wishlist</h2>
          <p class="mt-1 text-sm text-gray-500">
            {wishlist.state.totalItems === 0
              ? "You haven't saved anything yet."
              : `${wishlist.state.totalItems} saved item${wishlist.state.totalItems !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Bulk action buttons — only shown when wishlist has items */}
        {wishlist.state.totalItems > 0 && (
          <div class="flex items-center gap-3 flex-wrap">
            <button
              id="wishlist-add-all-btn"
              onClick$={moveAllToCart$}
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {/* Cart icon */}
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
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              Add All to Cart
            </button>

            <button
              id="wishlist-clear-btn"
              onClick$={wishlist.actions.clearWishlist}
              class="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-600 text-sm font-medium border border-red-300 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* ── EMPTY STATE ── */}
      {wishlist.state.totalItems === 0 && (
        <div class="bg-white border border-gray-200 rounded-2xl p-16 text-center">
          {/* Large outline heart illustration */}
          <div class="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="0.75"
              stroke="currentColor"
              class="w-24 h-24 text-gray-200"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </div>

          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p class="text-gray-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
            Browse the shop and tap the{" "}
            <span class="text-red-400">♡</span> heart on any product to save it
            here for later.
          </p>

          {/* CTA back to shop — uses Link for SPA navigation */}
          <Link
            href="/shop"
            class="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      )}

      {/* ── WISHLIST GRID ── */}
      {wishlist.state.totalItems > 0 && (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlist.state.items.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onMoveToCart$={$(async () => moveToCart$(item))}
            />
          ))}
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// WISHLIST CARD (sub-component — kept in same file for locality)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WishlistCard
 *
 * Displays one saved product in the wishlist grid.
 *
 * Layout from top to bottom:
 *  - Image area with discount badge and heart toggle button (removes from wishlist)
 *  - Category chip
 *  - Product title (links to product page)
 *  - Price (discounted if applicable) + original price struck through
 *  - "Added X days ago" label
 *  - "Move to Cart" button
 *
 * Extracted as a separate component$ so Qwik can independently
 * optimize and lazy-load each card.
 */
interface WishlistCardProps {
  item: WishlistItem;
  /** Called when user clicks "Move to Cart" on this card */
  onMoveToCart$: () => void;
}

const WishlistCard = component$<WishlistCardProps>((props) => {
  const { item } = props;

  // ── Derived display values ──────────────────────────────────────────────

  // Calculate the discounted price if a discount % is stored
  const displayPrice =
    item.discount && item.discount > 0
      ? item.price * (1 - item.discount / 100)
      : item.price;

  const hasDiscount = !!(item.discount && item.discount > 0);

  // Friendly relative date label ("Today", "Yesterday", "3d ago")
  const msAgo = Date.now() - new Date(item.addedAt).getTime();
  const daysAgo = Math.floor(msAgo / (1000 * 60 * 60 * 24));
  const dateLabel =
    daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;

  return (
    <div
      id={`wishlist-card-${item.id}`}
      class="group bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200"
    >
      {/* ── IMAGE AREA ── */}
      <div class="relative bg-gray-50 aspect-square overflow-hidden">
        {/* Clicking the image navigates to the product detail page */}
        <Link href={`/product/${item.id}`} class="block w-full h-full">
          <img
            src={item.image}
            alt={item.title}
            width={300}
            height={300}
            class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Discount badge — top-left */}
        {hasDiscount && (
          <span class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{item.discount}%
          </span>
        )}

        {/* Heart button — bottom-right corner with 1rem margins (standardized) */}
        <div class="absolute bottom-4 right-4 z-10">
          <WishlistButton product={item} variant="icon" />
        </div>
      </div>

      {/* ── PRODUCT INFO ── */}
      <div class="p-4 flex flex-col flex-1 gap-2">
        {/* Category chip */}
        <span class="text-xs font-semibold text-blue-600 uppercase tracking-wide">
          {item.category}
        </span>

        {/* Product title — links to product page, truncated to 2 lines */}
        <Link
          href={`/product/${item.id}`}
          class="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors flex-1"
        >
          {item.title}
        </Link>

        {/* Price row */}
        <div class="flex items-baseline gap-2">
          <span class="text-base font-bold text-gray-900">
            ${displayPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span class="text-sm text-gray-400 line-through">
              ${item.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* "Saved X days ago" */}
        <p class="text-xs text-gray-400">Saved {dateLabel}</p>

        {/* Move to Cart button */}
        <button
          id={`wishlist-cart-btn-${item.id}`}
          type="button"
          onClick$={props.onMoveToCart$}
          class="mt-1 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {/* Cart icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 flex-shrink-0"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          Move to Cart
        </button>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT HEAD — SEO title for this page
// ─────────────────────────────────────────────────────────────────────────────

/**
 * head export — sets the <title> and <meta> tags for this route.
 * Same pattern used in all other account pages.
 */
export const head: DocumentHead = {
  title: "My Wishlist | ReconShop",
  meta: [
    {
      name: "description",
      content: "Your saved products — view, manage, and move items to your cart.",
    },
  ],
};
