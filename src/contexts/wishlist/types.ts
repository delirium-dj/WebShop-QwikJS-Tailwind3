/**
 * ============================================================
 * WISHLIST CONTEXT — TYPES
 * File: src/contexts/wishlist/types.ts
 * ============================================================
 *
 * Defines every TypeScript interface the wishlist system needs.
 * This file mirrors the exact same pattern as src/contexts/cart/types.ts
 * so the codebase stays consistent and easy to follow.
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * Think of this file as the "blueprint" for the wishlist.
 * It doesn't DO anything — it just DESCRIBES what the data looks like.
 *
 * Three main things are described here:
 *  1. WishlistItem   → What a single saved product looks like
 *  2. WishlistState  → The full state (list + count)
 *  3. WishlistActions → Every function you can call (add / remove / toggle…)
 *  4. WishlistContextType → What useWishlist() returns (state + actions combined)
 *
 * How is this different from the Cart?
 *  - No quantities — you either saved a product or you didn't
 *  - No size/color variants — wishlist is product-level, not variant-level
 *  - Has an `addedAt` timestamp so we can sort by "recently wishlisted"
 * ──────────────────────────────────────────────────────────────
 */

import type { QRL } from "@builder.io/qwik";

// ─────────────────────────────────────────────────────────────────────────────
// 1. WISHLIST ITEM — one saved product
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WishlistItem
 *
 * A snapshot of a product stored in the wishlist.
 *
 * Why a "snapshot" and not a reference?
 * If we only stored the product ID, we'd have to refetch the product
 * every time the wishlist page loads. By storing the fields we need
 * (title, price, image) the wishlist page works even if the API is slow.
 *
 * The fields match what ProductCard already renders, so no mapping needed.
 */
export interface WishlistItem {
  /** Product ID from FakeStore API — same number used in /product/[id] routes */
  id: number;

  /** Product title at the time it was saved */
  title: string;

  /** Price in USD at the time it was saved */
  price: number;

  /** Primary image URL */
  image: string;

  /** Category string, e.g. "electronics", "men's clothing" */
  category: string;

  /**
   * Optional discount percentage (e.g. 15 means 15% off).
   * Carried over from the product-mapper so the WishlistCard UI
   * can show the same discounted price as ProductCard does.
   */
  discount?: number;

  /**
   * Optional star rating (0–5).
   * Stored so the wishlist page can show the rating without an API call.
   */
  rating?: number;

  /**
   * ISO 8601 date string — when this product was added to the wishlist.
   * Example: "2026-02-17T10:30:00.000Z"
   * Used to:
   *  - Sort items by "recently added"
   *  - Show "Added 3 days ago" labels
   */
  addedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. WISHLIST STATE — the reactive data stored in the context
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WishlistState
 *
 * The data object that Qwik's useStore() will track reactively.
 * Any component that reads from this will automatically re-render when it changes.
 *
 * Mirrors the shape of CartState from src/contexts/cart/types.ts.
 */
export interface WishlistState {
  /**
   * The ordered list of saved products.
   * Most-recently-added item appears first (index 0).
   */
  items: WishlistItem[];

  /**
   * A pre-calculated count of saved items.
   * We keep this in sync manually (in each action) instead of calling
   * items.length every render, because it's simpler to track reactively.
   * The header badge uses this to show a count without iterating the array.
   */
  totalItems: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. WISHLIST ACTIONS — every function a component can call
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WishlistActions
 *
 * All mutating functions wrapped as QRL (Qwik Resource Locators).
 *
 * WHY QRL?
 * Qwik lazy-loads these functions. The code for addItem() is only downloaded
 * when someone actually clicks the heart button — not on page load.
 * This is how Qwik achieves near-zero JavaScript on first render.
 *
 * The pattern is identical to CartActions in src/contexts/cart/types.ts.
 */
export interface WishlistActions {
  /**
   * addItem — save a product to the wishlist.
   *
   * If the product is already saved, this is a no-op (safe to call twice).
   *
   * Usage:
   * ```tsx
   * wishlist.actions.addItem({
   *   id: product.id,
   *   title: product.title,
   *   price: product.price,
   *   image: product.image,
   *   category: product.category,
   * });
   * ```
   *
   * Note: `addedAt` is omitted because WishlistContext generates it automatically.
   */
  addItem: QRL<(item: Omit<WishlistItem, "addedAt">) => void>;

  /**
   * removeItem — unsave a product by its numeric ID.
   *
   * If the product is not in the wishlist, this is a no-op.
   *
   * Usage:
   * ```tsx
   * wishlist.actions.removeItem(product.id);
   * ```
   */
  removeItem: QRL<(id: number) => void>;

  /**
   * toggleItem — save if not saved, remove if already saved.
   *
   * This is the MAIN action used by the WishlistButton heart icon.
   * Calling it repeatedly alternates between saved ↔ unsaved.
   *
   * Usage:
   * ```tsx
   * // In WishlistButton onClick$:
   * wishlist.actions.toggleItem(product);
   * ```
   */
  toggleItem: QRL<(item: Omit<WishlistItem, "addedAt">) => void>;

  /**
   * isInWishlist — returns true if the product ID is currently saved.
   *
   * Used by WishlistButton to decide whether to render a filled (♥)
   * or outline (♡) heart icon.
   *
   * Usage:
   * ```tsx
   * const saved = await wishlist.actions.isInWishlist(product.id);
   * ```
   */
  isInWishlist: QRL<(id: number) => Promise<boolean>>;

  /**
   * clearWishlist — remove every item from the wishlist.
   *
   * Shows a "Clear All" button on the wishlist page.
   *
   * Usage:
   * ```tsx
   * wishlist.actions.clearWishlist();
   * ```
   */
  clearWishlist: QRL<() => void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CONTEXT TYPE — what useWishlist() returns
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WishlistContextType
 *
 * The combined object that every component receives from useWishlist().
 * Structured as { state, actions } — same as CartContextType.
 *
 * Usage anywhere in the app:
 * ```tsx
 * const wishlist = useWishlist();
 *
 * wishlist.state.totalItems          // read data
 * wishlist.state.items               // full list
 * wishlist.actions.toggleItem(prod)  // mutate
 * wishlist.actions.isInWishlist(42)  // query
 * ```
 */
export type WishlistContextType = {
  state: WishlistState;
  actions: WishlistActions;
};
