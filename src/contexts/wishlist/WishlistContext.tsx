/**
 * ============================================================
 * WISHLIST CONTEXT — PROVIDER
 * File: src/contexts/wishlist/WishlistContext.tsx
 * ============================================================
 *
 * Provides global wishlist state and actions to the entire app.
 * Mirrors CartContext.tsx so the patterns are consistent.
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * This file does three things:
 *
 *  1. Creates the Context ID
 *     Think of it as a "channel name" — components subscribe to this
 *     channel to receive the wishlist state.
 *
 *  2. Defines the WishlistProvider component
 *     This is a wrapper component. You put it around your app (in
 *     layout.tsx) and every component inside it can use useWishlist().
 *
 *  3. Defines all the actions (add, remove, toggle, clear, isInWishlist)
 *     Each action is wrapped in $() so Qwik can lazy-load it —
 *     the code only downloads when the user actually clicks something.
 *
 * ── WIRING IT INTO layout.tsx ─────────────────────────────────
 * Add <WishlistProvider> inside <CartProvider> in src/routes/layout.tsx:
 *
 * ```tsx
 * import { WishlistProvider } from '~/contexts/wishlist';
 *
 * export default component$(() => (
 *   <AuthProvider>
 *     <CartProvider>
 *       <WishlistProvider>        ← ADD THIS
 *         <Header />
 *         <ToastProvider>
 *           <Slot />
 *         </ToastProvider>
 *       </WishlistProvider>       ← AND THIS
 *     </CartProvider>
 *   </AuthProvider>
 * ));
 * ```
 *
 * ── HOW TO USE IN COMPONENTS ──────────────────────────────────
 * ```tsx
 * import { useWishlist } from '~/contexts/wishlist';
 *
 * const wishlist = useWishlist();
 * wishlist.state.totalItems           // how many items are saved
 * wishlist.actions.toggleItem(prod)   // save or unsave a product
 * ```
 * ──────────────────────────────────────────────────────────────
 */

import {
  component$,
  createContextId,
  useContextProvider,
  useStore,
  useVisibleTask$,
  $,
  Slot,
} from "@builder.io/qwik";

import type { WishlistContextType, WishlistItem } from "./types";
import {
  buildInitialState,
  findItemIndex,
  saveWishlistToStorage,
  clearWishlistFromStorage,
} from "./utils";

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT ID
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WishlistContext
 *
 * The unique "channel" identifier for this context.
 * This is what Qwik uses to link useContextProvider() with useContext().
 *
 * Components don't use this directly — they call useWishlist() instead,
 * which wraps useContext(WishlistContext) with a helpful error message.
 *
 * Same pattern as CartContext in src/contexts/cart/CartContext.tsx.
 */
export const WishlistContext =
  createContextId<WishlistContextType>("reconshop.wishlist.context");

// ─────────────────────────────────────────────────────────────────────────────
// WISHLIST PROVIDER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WishlistProvider
 *
 * Wrap this around your layout to make wishlist state available everywhere.
 * State is persisted to localStorage so wishlists survive page refreshes.
 *
 * Placement in layout.tsx:
 *   AuthProvider → CartProvider → WishlistProvider → Header → ToastProvider → Slot
 */
export const WishlistProvider = component$(() => {
  // ─── Reactive State ─────────────────────────────────────────────────────
  //
  // useStore() creates a deeply reactive proxy object.
  // Qwik tracks every property read inside components. When a property
  // changes here, only the components that read it will re-render.
  //
  // We start with empty state. The useVisibleTask$ below will hydrate
  // from localStorage once the component is visible in the browser.
  // Starting empty is correct: SSR renders the shell; the browser fills it in.
  //
  const state = useStore<{
    items: WishlistItem[];
    totalItems: number;
  }>({
    items: [],
    totalItems: 0,
  });

  // ─── Hydrate from localStorage ──────────────────────────────────────────
  //
  // useVisibleTask$ runs ONCE in the browser after the component mounts.
  // We cannot read localStorage on the server (it doesn't exist there).
  // This is the correct Qwik pattern for browser-only side effects.
  //
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const saved = buildInitialState();
    // Assign both properties to update the reactive store
    state.items = saved.items;
    state.totalItems = saved.totalItems;
  });

  // ─── ACTIONS ────────────────────────────────────────────────────────────
  //
  // Each action is wrapped with $() so Qwik can serialize and lazy-load it.
  // After mutating state, we also call saveWishlistToStorage() to persist.
  //
  // Pattern: same as cart actions in src/contexts/cart/CartContext.tsx
  // ────────────────────────────────────────────────────────────────────────

  /**
   * addItem
   * Save a product to the wishlist. Silently ignores duplicate product IDs.
   */
  const addItem = $(async (item: Omit<WishlistItem, "addedAt">) => {
    // Guard: don't add duplicates
    if (findItemIndex(state.items, item.id) !== -1) return;

    // Stamp with current date/time as ISO string
    const newItem: WishlistItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };

    // Prepend so newest items appear first in the list
    state.items = [newItem, ...state.items];
    state.totalItems = state.items.length;
    saveWishlistToStorage(state.items);
  });

  /**
   * removeItem
   * Unsave a product by its numeric ID. No-op if not found.
   */
  const removeItem = $(async (id: number) => {
    const idx = findItemIndex(state.items, id);
    if (idx === -1) return; // not in wishlist, nothing to do

    // Remove one item by index — create a new array without that element
    state.items = [
      ...state.items.slice(0, idx),
      ...state.items.slice(idx + 1),
    ];
    state.totalItems = state.items.length;
    saveWishlistToStorage(state.items);
  });

  /**
   * toggleItem
   * If saved → remove. If not saved → add.
   * This is the primary action used by the WishlistButton heart icon.
   */
  const toggleItem = $(async (item: Omit<WishlistItem, "addedAt">) => {
    const idx = findItemIndex(state.items, item.id);

    if (idx !== -1) {
      // ── Already saved: remove it ──
      state.items = [
        ...state.items.slice(0, idx),
        ...state.items.slice(idx + 1),
      ];
    } else {
      // ── Not saved yet: add it at the front ──
      state.items = [
        { ...item, addedAt: new Date().toISOString() },
        ...state.items,
      ];
    }

    state.totalItems = state.items.length;
    saveWishlistToStorage(state.items);
  });

  /**
   * isInWishlist
   * Returns true if a product ID is currently saved. Used by WishlistButton
   * to decide whether to render a filled (♥) or outline (♡) heart icon.
   */
  const isInWishlist = $(async (id: number) => {
    return findItemIndex(state.items, id) !== -1;
  });

  /**
   * clearWishlist
   * Removes every item. Called by the "Clear All" button on the wishlist page.
   */
  const clearWishlist = $(async () => {
    state.items = [];
    state.totalItems = 0;
    clearWishlistFromStorage();
  });

  // ─── Provide Context ─────────────────────────────────────────────────────
  //
  // useContextProvider makes the wishlist available to every child component.
  // Any component wrapped by <WishlistProvider> can call useWishlist().
  //
  useContextProvider(WishlistContext, {
    state,
    actions: {
      addItem,
      removeItem,
      toggleItem,
      isInWishlist,
      clearWishlist,
    },
  });

  // <Slot /> renders all child components (equivalent to {children} in React)
  return <Slot />;
});
