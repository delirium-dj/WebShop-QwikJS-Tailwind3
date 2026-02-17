/**
 * ============================================================
 * WISHLIST CONTEXT — CUSTOM HOOK
 * File: src/contexts/wishlist/useWishlist.ts
 * ============================================================
 *
 * The single hook that components call to access the wishlist.
 * Mirrors useCart.ts from src/contexts/cart/useCart.ts.
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * This hook wraps useContext(WishlistContext) and adds a clear
 * error message if you forget to add <WishlistProvider> to layout.tsx.
 *
 * Always import from the barrel (index.ts), not this file directly:
 *
 * ✅ import { useWishlist } from '~/contexts/wishlist';
 * ❌ import { useWishlist } from '~/contexts/wishlist/useWishlist';
 *
 * Usage in any component that is a descendant of <WishlistProvider>:
 *
 * ```tsx
 * import { useWishlist } from '~/contexts/wishlist';
 *
 * export const MyComponent = component$(() => {
 *   const wishlist = useWishlist();
 *
 *   return (
 *     <div>
 *       <p>You have {wishlist.state.totalItems} saved items</p>
 *       <button onClick$={() => wishlist.actions.clearWishlist()}>
 *         Clear all
 *       </button>
 *     </div>
 *   );
 * });
 * ```
 * ──────────────────────────────────────────────────────────────
 */

import { useContext } from "@builder.io/qwik";
import { WishlistContext } from "./WishlistContext";
import type { WishlistContextType } from "./types";

/**
 * useWishlist
 *
 * Returns { state, actions } for the wishlist.
 *
 * Throws a clear error if called outside <WishlistProvider>,
 * so you know exactly what to fix instead of getting a cryptic
 * "Cannot read property of undefined" message.
 */
export const useWishlist = (): WishlistContextType => {
  const ctx = useContext(WishlistContext);

  if (!ctx) {
    throw new Error(
      "[useWishlist] Context not found.\n" +
        "Make sure <WishlistProvider> wraps this component in src/routes/layout.tsx.\n" +
        "It should be placed inside <CartProvider>.",
    );
  }

  return ctx;
};
