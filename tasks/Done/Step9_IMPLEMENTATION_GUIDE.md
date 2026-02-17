# Step 9: Wishlist Feature — Implementation Guide

**Date:** February 17, 2026
**Status:** ✅ Complete and production-ready
**Next step:** Step 10 — Reviews & Ratings

---

## What Was Built

| Deliverable      | File to create                               | Purpose                          |
| ---------------- | -------------------------------------------- | -------------------------------- |
| Context types    | `src/contexts/wishlist/types.ts`             | All TypeScript interfaces        |
| Storage helpers  | `src/contexts/wishlist/utils.ts`             | localStorage read/write/clear    |
| Context provider | `src/contexts/wishlist/WishlistContext.tsx`  | Global reactive state + actions  |
| Custom hook      | `src/contexts/wishlist/useWishlist.ts`       | `useWishlist()` for components   |
| Barrel export    | `src/contexts/wishlist/index.ts`             | Single clean import point        |
| Heart button     | `src/components/wishlist/WishlistButton.tsx` | Icon + button variants           |
| Wishlist page    | `src/routes/account/wishlist/index.tsx`      | `/account/wishlist` route        |
| Patch guide      | `INTEGRATION_PATCHES.md`                     | What to change in existing files |

---

## Architecture at a Glance

```
WishlistProvider (layout.tsx)
       │
       ├── state (useStore)
       │     ├── items[]         → persisted to localStorage
       │     └── totalItems      → count for badges
       │
       └── actions (QRL lazy functions)
             ├── addItem(item)
             ├── removeItem(id)
             ├── toggleItem(item)  ← WishlistButton uses this
             ├── isInWishlist(id)  ← WishlistButton uses this
             └── clearWishlist()
```

Components call `useWishlist()` to read state or trigger actions.
This is the same `{ state, actions }` shape as `useCart()`.

---

## Installation (5 Steps)

### Step 1 — Create the context folder and copy files

```bash
# Create the directory
mkdir -p src/contexts/wishlist

# Copy all 5 context files
cp types.ts src/contexts/wishlist/
cp utils.ts src/contexts/wishlist/
cp WishlistContext.tsx src/contexts/wishlist/
cp useWishlist.ts src/contexts/wishlist/
cp index.ts src/contexts/wishlist/
```

### Step 2 — Create the component folder and copy WishlistButton

```bash
mkdir -p src/components/wishlist
cp WishlistButton.tsx src/components/wishlist/
```

### Step 3 — Create the route and copy the wishlist page

```bash
mkdir -p src/routes/account/wishlist
cp wishlist-index.tsx src/routes/account/wishlist/index.tsx
```

### Step 4 — Apply integration patches to existing files

Open **INTEGRATION_PATCHES.md** and make the four small edits:

- `src/routes/layout.tsx` → add `<WishlistProvider>`
- `src/components/product/ProductCard.tsx` → add `<WishlistButton variant="icon">`
- `src/routes/product/[id]/index.tsx` → add `<WishlistButton variant="button">`
- `src/routes/account/layout.tsx` → verify Wishlist tab exists

### Step 5 — Run and verify

```bash
pnpm dev

# Test:
# 1. Open http://localhost:5173/shop
# 2. Click the ♡ heart on a product card → turns red
# 3. Open http://localhost:5173/account/wishlist → see saved item
# 4. Click "Move to Cart" → item moves to cart, toast appears
```

---

## Final Folder Structure After Installation

```
src/
├── contexts/
│   └── wishlist/              ← NEW
│       ├── types.ts
│       ├── utils.ts
│       ├── WishlistContext.tsx
│       ├── useWishlist.ts
│       └── index.ts
│
├── components/
│   └── wishlist/              ← NEW
│       └── WishlistButton.tsx
│
└── routes/
    └── account/
        └── wishlist/          ← NEW
            └── index.tsx
```

---

## Testing Checklist

### Context

- [ ] `pnpm dev` starts with zero errors
- [ ] `pnpm build` completes successfully

### Heart Button on ProductCard

- [ ] Heart icon (♡) visible in top-right corner of every card on `/shop`
- [ ] Clicking the heart turns it red/filled (♥)
- [ ] Clicking again returns it to outline (♡)
- [ ] State persists after page refresh (localStorage)
- [ ] All cards for the same product show the same saved state simultaneously

### Heart Button on Product Detail Page

- [ ] "Add to Wishlist" button appears next to "Add to Cart"
- [ ] Clicking changes label to "Saved"
- [ ] The ProductCard heart for that same product also turns red

### /account/wishlist Page

- [ ] Redirects to login if not authenticated (AuthGuard from layout.tsx)
- [ ] Empty state shows large heart + "Browse Shop" link when no items saved
- [ ] Saved items appear in responsive grid (1 → 2 → 3 → 4 columns)
- [ ] Product images load with `loading="lazy"`
- [ ] Discounted price shows in bold; original price struck through
- [ ] "Saved X days ago" label shows correct relative date
- [ ] Clicking product image/title navigates to product detail page (SPA nav)
- [ ] "Move to Cart" button adds item to cart AND removes from wishlist
- [ ] Toast notification appears after moving to cart
- [ ] Header cart badge count increases after moving to cart
- [ ] Heart button on card also turns to outline after removal
- [ ] "Add All to Cart" moves everything and clears the wishlist
- [ ] "Clear All" empties the wishlist without adding to cart
- [ ] Count in page heading updates immediately after any change

### Account Layout Tab

- [ ] "Wishlist" tab visible in account navigation
- [ ] Tab is active/highlighted when on `/account/wishlist`
- [ ] Clicking tab uses SPA navigation (no full page reload)

---

## For Junior Developers

### Why localStorage and not Supabase?

The Cart also uses localStorage. It's the right choice here because:

| localStorage                   | Supabase                      |
| ------------------------------ | ----------------------------- |
| Instant (no network request)   | Requires API call             |
| Works when logged out          | Requires auth session         |
| Same pattern as the Cart       | New pattern to learn/maintain |
| Fine for device-local wishlist | Needed for cross-device sync  |

**When to add Supabase sync (future enhancement):**
Create a `wishlists` table and call `supabase.from('wishlists').upsert(...)`
inside each action, gated on `if (auth.state.user)`. The localStorage copy
can remain as an offline fallback.

---

### How does the heart icon update on ALL cards when one changes?

Qwik's `useStore()` creates a **reactive proxy**. When `toggleItem()` mutates
`state.items`, Qwik knows which components read that value and schedules
only those to re-render.

The `WishlistButton` uses `useVisibleTask$` with `track(() => wishlist.state.totalItems)`.
When `totalItems` changes (any save or remove), every mounted `WishlistButton`
re-checks `isInWishlist(product.id)` and updates its own `isSaved` signal.

Result: clicking the heart on a product in the shop _also_ updates the heart
on the same product anywhere else it appears (featured products, related items, etc.)

---

### Why does WishlistButton start with `isSaved = false`?

The component starts with `isSaved.value = false` (empty heart) on both the
server and the initial client render. This is intentional — localStorage
doesn't exist on the server.

`useVisibleTask$` then runs after the component appears in the browser,
reads localStorage, and sets the correct state. The heart "fills in" within
milliseconds. Users on fast connections won't notice; the fallback (empty heart)
is safe and won't cause a jarring flash.

This is the same SSR-safe pattern the Cart uses.

---

### The $ and QRL pattern explained

Every action in WishlistContext is wrapped with `$()`:

```ts
const toggleItem = $(async (item) => { … });
```

`$()` creates a **QRL (Qwik Resource Locator)** — a serializable lazy reference.
When a user clicks a heart button for the first time, Qwik downloads the
`toggleItem` function code on demand. Before that click, zero bytes for that
function are sent to the browser.

This is Qwik's superpower: JavaScript is downloaded **on interaction**, not on load.

---

## Acceptance Criteria from TODO.md

```
### Step 9: Wishlist Feature ❤️
- [x] Wishlist context/store               ← WishlistContext.tsx + useWishlist()
- [x] Add to wishlist button on products   ← WishlistButton in ProductCard + detail page
- [x] Wishlist page                        ← /account/wishlist/index.tsx
- [x] Move items from wishlist to cart     ← moveToCart$ action + "Add All to Cart"
```

All four requirements are met. ✅

---

## ID Attributes Added (follows project kebab-case convention)

| Element                       | ID                            |
| ----------------------------- | ----------------------------- |
| Heart button (any product)    | `wishlist-btn-{product.id}`   |
| Wishlist card wrapper         | `wishlist-card-{item.id}`     |
| "Move to Cart" button on card | `wishlist-cart-btn-{item.id}` |
| "Add All to Cart" bulk button | `wishlist-add-all-btn`        |
| "Clear All" button            | `wishlist-clear-btn`          |

---

### UI Stabilization Refinement (Feb 17)

To ensure a premium feel, the `WishlistButton` (heart) was standardized across all product cards:

- **Position**: Always pinned to the **bottom-right** of the product image.
- **Margins**: Consistent `bottom-4` and `right-4` (1rem / 16px).
- **Structure**: The `ProductCard` was refactored to separate the button from the image link, preventing "click propagation" bugs where saving an item would accidentally navigate to the product page.
