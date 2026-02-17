/**
 * ============================================================
 * WISHLIST CONTEXT — BARREL EXPORTS
 * File: src/contexts/wishlist/index.ts
 * ============================================================
 *
 * Re-exports everything from one place so imports stay clean.
 * Mirrors src/contexts/cart/index.ts.
 *
 * ── USAGE ─────────────────────────────────────────────────────
 *
 * In layout.tsx (the provider):
 * ```tsx
 * import { WishlistProvider } from '~/contexts/wishlist';
 * ```
 *
 * In any component (the hook):
 * ```tsx
 * import { useWishlist } from '~/contexts/wishlist';
 * ```
 *
 * For TypeScript types (use `import type` to keep bundles lean):
 * ```tsx
 * import type { WishlistItem } from '~/contexts/wishlist';
 * ```
 * ──────────────────────────────────────────────────────────────
 */

// The provider component — add this to src/routes/layout.tsx
export { WishlistProvider, WishlistContext } from "./WishlistContext";

// The hook — call this inside any component nested under WishlistProvider
export { useWishlist } from "./useWishlist";

// Types — always use `import type` for interfaces and type aliases
export type {
  WishlistItem,
  WishlistState,
  WishlistActions,
  WishlistContextType,
} from "./types";
