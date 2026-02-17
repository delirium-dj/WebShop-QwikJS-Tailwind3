# Step 9 — Integration Patches
# Exact changes needed in existing project files

These are the edits to make in your **existing** source files.
All new files come from the ZIP. This file only describes what to modify.

---

## PATCH 1 — src/routes/layout.tsx
### Add WishlistProvider inside CartProvider

#### WHAT TO DO:
1. Add the import at the top of the file
2. Wrap the existing content with <WishlistProvider>

#### CHANGE 1 — Add import (near the other context imports):
```tsx
// Add this line alongside the other context imports
import { WishlistProvider } from "~/contexts/wishlist";
```

#### CHANGE 2 — Wrap with WishlistProvider (inside CartProvider):
```tsx
// BEFORE:
export default component$(() => {
  return (
    <AuthProvider>
      <CartProvider>
        <div class="flex min-h-screen flex-col font-sans">
          <Header />
          <main class="flex-1 bg-white">
            <ToastProvider>
              <Slot />
            </ToastProvider>
          </main>
          <footer>…</footer>
        </div>
      </CartProvider>
    </AuthProvider>
  );
});

// AFTER:
export default component$(() => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>          {/* ← ADD */}
          <div class="flex min-h-screen flex-col font-sans">
            <Header />
            <main class="flex-1 bg-white">
              <ToastProvider>
                <Slot />
              </ToastProvider>
            </main>
            <footer>…</footer>
          </div>
        </WishlistProvider>         {/* ← ADD */}
      </CartProvider>
    </AuthProvider>
  );
});
```

WHY inside CartProvider?
The wishlist page calls both `wishlist.actions` AND `cart.actions.addItem()`
(for the "Move to Cart" feature). WishlistProvider must be inside CartProvider
so both contexts are available to its children.

---

## PATCH 2 — src/components/product/ProductCard.tsx
### Add the WishlistButton heart icon to each product card

#### WHAT TO DO:
1. Add the import at the top
2. Replace any existing heart placeholder with <WishlistButton>

#### CHANGE 1 — Add import:
```tsx
import { WishlistButton } from "~/components/wishlist/WishlistButton";
```

#### CHANGE 2 — Add heart button inside the image area.
Find the image section of ProductCard (the `<div>` that wraps the product image).
Add a positioned WishlistButton in the top-right corner:

```tsx
{/* Image container */}
<div class="relative overflow-hidden ...">

  {/* ← ADD THIS: Wishlist heart button, floating over the image */}
  <div class="absolute top-2 right-2 z-10">
    <WishlistButton
      product={{
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image ?? "",
        category: product.category ?? "",
        discount: product.discount,
        rating: typeof product.rating === "number"
          ? product.rating
          : (product.rating as any)?.rate,
      }}
      variant="icon"
    />
  </div>

  {/* existing image / link markup */}
  <a href={`/product/${product.id}`}>
    <img src={product.image} alt={product.title} … />
  </a>
</div>
```

NOTE: If ProductCard already has a heart button placeholder (e.g. an <svg>
wrapped in a <button>), replace that entire element with the <WishlistButton>
snippet above instead of adding a second one.

---

## PATCH 3 — src/routes/product/[id]/index.tsx (or ProductInfo.tsx)
### Add WishlistButton next to "Add to Cart" on the product detail page

#### WHAT TO DO:
1. Add the import
2. Add <WishlistButton variant="button"> in the action row

#### CHANGE 1 — Add import:
```tsx
import { WishlistButton } from "~/components/wishlist/WishlistButton";
```

#### CHANGE 2 — Add button in the action row (next to AddToCartButton):
Find the section that renders "Add to Cart" and add WishlistButton beside it:

```tsx
{/* Action buttons row */}
<div class="flex gap-3 flex-wrap">

  {/* Existing "Add to Cart" button — leave this unchanged */}
  <AddToCartButton product={product} />

  {/* ← ADD THIS: Wishlist button with text label */}
  <WishlistButton
    product={{
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image ?? "",
      category: product.category ?? "",
      discount: product.discount,
      rating: typeof product.rating === "number"
        ? product.rating
        : (product.rating as any)?.rate,
    }}
    variant="button"
  />

</div>
```

---

## PATCH 4 — src/routes/account/layout.tsx
### Activate the Wishlist nav tab (it likely already exists)

The account layout delivered in Phase 4 already includes a "Wishlist" tab
pointing to `/account/wishlist`. Open the file and confirm the tab is there.

If it IS already present — no change needed ✅

If it is MISSING — add this tab alongside the existing "Profile" and "Orders" tabs:

```tsx
<Link
  href="/account/wishlist"
  class="border-transparent text-gray-500 hover:text-gray-700
         whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
>
  Wishlist
</Link>
```

---

## SUMMARY TABLE

| File | Change | Lines affected |
|------|--------|---------------|
| `src/routes/layout.tsx` | Import + wrap with `<WishlistProvider>` | ~3 lines |
| `src/components/product/ProductCard.tsx` | Import + add `<WishlistButton variant="icon">` | ~5 lines |
| `src/routes/product/[id]/index.tsx` | Import + add `<WishlistButton variant="button">` | ~5 lines |
| `src/routes/account/layout.tsx` | Verify Wishlist tab exists | 0–5 lines |

Four files, ~13 lines of changes total.
