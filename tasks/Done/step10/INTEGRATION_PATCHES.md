# Step 10 — Integration Patches
# Exact changes needed in your existing project files

All **new** files come from the ZIP.
This document only describes what to **modify** in files you already have.

---

## PATCH 1 — src/routes/product/[id]/index.tsx
### Add the ProductReviews section at the bottom of the product page

This is the main integration point. You add ONE import and ONE component.

#### CHANGE 1 — Add import at the top of the file:
```tsx
// Option A — import from the barrel (cleanest):
import { ProductReviews } from "~/components/reviews";

// Option B — import directly from the file:
import { ProductReviews } from "~/components/reviews/ProductReviews";
```

#### CHANGE 2 — Add <ProductReviews> at the bottom of the product page JSX.

Find the return statement in the component and add the reviews section
AFTER RelatedProducts (or after whatever is currently last):

```tsx
export default component$(() => {
  const productData = useProductData();
  const product = productData.value;

  return (
    <div>
      {/* ... existing product layout (ImageGallery, ProductInfo, RelatedProducts …) */}

      {/* ── REVIEWS SECTION — Step 10 ── */}
      <div class="container mx-auto px-4">
        <ProductReviews
          productId={product.id}
          productTitle={product.title}
        />
      </div>
    </div>
  );
});
```

That's it for the product page. Two lines of change.

---

## PATCH 2 — src/components/product/ProductCard.tsx (OPTIONAL)
### Show the average rating from FakeStore API on product cards

The FakeStore API returns a `rating` object like: `{ rate: 4.2, count: 150 }`.
The product-mapper converts this to `product.rating` (a number).

If ProductCard already renders `product.rating`, it already works —
StarRating in display mode handles fractional numbers natively.

If you want to add the StarRating display to ProductCard, add:

```tsx
import { StarRating } from "~/components/reviews/StarRating";

// Inside ProductCard's JSX, below the price:
{product.rating && product.rating > 0 && (
  <div class="flex items-center gap-1.5 mt-1">
    <StarRating value={product.rating} mode="display" size="xs" />
    <span class="text-xs text-gray-400">({product.rating.toFixed(1)})</span>
  </div>
)}
```

---

## PATCH 3 — src/routes/product/[id]/index.tsx (OPTIONAL)
### Show rating in the ProductInfo area (above the price)

If ProductInfo or the detail page already shows a rating, replace it
with the StarRating component for visual consistency:

```tsx
import { StarRating } from "~/components/reviews/StarRating";

// In the product info area:
{product.rating && product.rating > 0 && (
  <div class="flex items-center gap-2 mb-4">
    <StarRating value={product.rating} mode="display" size="sm" />
    <span class="text-sm text-gray-500">{product.rating.toFixed(1)} / 5</span>
  </div>
)}
```

---

## SUMMARY TABLE

| File | Change | Lines |
|------|--------|-------|
| `src/routes/product/[id]/index.tsx` | Import + add `<ProductReviews>` | 2 lines |
| `src/components/product/ProductCard.tsx` | Optional: add `<StarRating>` display | ~5 lines |
| `src/routes/product/[id]/index.tsx` | Optional: add `<StarRating>` near price | ~5 lines |

**Required patch: just Patch 1. The other two are optional improvements.**
