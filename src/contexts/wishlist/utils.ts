/**
 * ============================================================
 * WISHLIST CONTEXT — UTILITIES
 * File: src/contexts/wishlist/utils.ts
 * ============================================================
 *
 * Helper functions for reading and writing the wishlist to localStorage.
 * Mirrors the pattern in src/contexts/cart/utils.ts.
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * localStorage is a browser API that stores data as plain strings.
 * You can only put strings in it — so we use JSON.stringify() to
 * convert our array of objects into a string, and JSON.parse() to
 * convert it back.
 *
 * These functions wrap that conversion so the rest of the code
 * never has to think about it. You just call:
 *
 *   loadWishlistFromStorage()  → gives you WishlistItem[]
 *   saveWishlistToStorage(items) → saves WishlistItem[]
 *   clearWishlistFromStorage()  → deletes the saved data
 *
 * These are NOT called directly from components — they are called
 * inside WishlistContext.tsx so they stay invisible to the UI layer.
 * ──────────────────────────────────────────────────────────────
 */

import type { WishlistItem, WishlistState } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE KEY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The localStorage key under which we persist the wishlist.
 *
 * Prefixed with "reconshop_" so it doesn't clash with other apps
 * that might run on the same localhost port during development.
 *
 * You can open your browser's DevTools → Application → Local Storage
 * and see this key to verify the wishlist is being saved correctly.
 */
const STORAGE_KEY = "reconshop_wishlist";

// ─────────────────────────────────────────────────────────────────────────────
// LOAD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * loadWishlistFromStorage
 *
 * Reads the saved wishlist from localStorage and parses it from JSON.
 * Returns an empty array if:
 *  - Nothing has been saved yet (first visit)
 *  - The stored data is corrupted (rare but possible)
 *  - The browser is in private mode and blocks localStorage
 *
 * Why try/catch?
 * localStorage.getItem() can throw in some private-browsing contexts.
 * JSON.parse() throws if the stored string is not valid JSON.
 * We catch both and return [] so the app doesn't crash.
 *
 * @returns WishlistItem[] — the saved list, or [] if nothing is stored
 */
export function loadWishlistFromStorage(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    // getItem returns null if the key doesn't exist yet
    if (!raw) return [];

    // Parse the JSON string back into an array of WishlistItem objects
    return JSON.parse(raw) as WishlistItem[];
  } catch (error) {
    // Storage is unavailable or the data is corrupt — start fresh
    console.warn("[WishlistContext] Could not load wishlist from localStorage:", error);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SAVE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * saveWishlistToStorage
 *
 * Converts the wishlist array to a JSON string and writes it to localStorage.
 * Called after every mutation (add, remove, toggle, clear).
 *
 * Why try/catch?
 * localStorage.setItem() can throw a QuotaExceededError if the storage
 * is full (limit is ~5 MB per origin). We catch that and warn instead
 * of crashing the app — losing a wishlist save is annoying but not fatal.
 *
 * @param items — The current list of WishlistItem objects to persist
 */
export function saveWishlistToStorage(items: WishlistItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("[WishlistContext] Could not save wishlist to localStorage:", error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CLEAR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * clearWishlistFromStorage
 *
 * Removes the wishlist entry from localStorage entirely.
 * Called when the user clicks "Clear All" or logs out.
 *
 * removeItem(key) is safer than setItem(key, "[]") because it frees
 * the storage space and returns getItem to its initial null state.
 */
export function clearWishlistFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("[WishlistContext] Could not clear wishlist from localStorage:", error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * buildInitialState
 *
 * Builds the starting WishlistState by hydrating from localStorage.
 * Called once when WishlistProvider first mounts in the browser.
 *
 * Why is this a separate function (not inline in the provider)?
 * Keeping it here in utils.ts means it's easy to unit-test independently
 * without mounting a Qwik component. Same pattern as cart/utils.ts.
 *
 * @returns WishlistState with items loaded from storage (may be empty)
 */
export function buildInitialState(): WishlistState {
  const items = loadWishlistFromStorage();
  return {
    items,
    totalItems: items.length,
  };
}

/**
 * findItemIndex
 *
 * Searches the wishlist array for a product by its numeric ID.
 * Returns the array index if found, or -1 if not found.
 *
 * Used by addItem / removeItem / toggleItem / isInWishlist to avoid
 * calling Array.findIndex() in multiple places.
 *
 * Examples:
 *   findItemIndex([{id:1,…},{id:2,…}], 2) → 1   (found at index 1)
 *   findItemIndex([{id:1,…},{id:2,…}], 9) → -1  (not found)
 *
 * @param items — The current wishlist items array
 * @param id    — The product ID to search for
 * @returns     — Index ≥ 0 if found, -1 if not found
 */
export function findItemIndex(items: WishlistItem[], id: number): number {
  return items.findIndex((item) => item.id === id);
}
