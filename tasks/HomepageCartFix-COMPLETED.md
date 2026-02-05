# Bug Fix: Homepage Add to Cart Navigation

## 🐛 The Bug

On the homepage, clicking the "Add to Cart" button was causing two actions:

1.  Adding the item to cart (correct).
2.  **Navigating to the product details page** (incorrect).

Because the navigation happened immediately, the user never saw the success toast on the homepage. Interestingly, when using the browser "Back" button, the toast would appear because the state change had effectively queued the toast.

## 🛠️ The Fix

The issue was caused by invalid HTML nesting. The entire `ProductCard` was wrapped in a `<Link>` (which renders as an `<a>` tag), and the "Add to Cart" `<button>` was inside it. Even with `stopPropagation()`, this structure is problematic.

I refactored `src/components/product/ProductCard.tsx` to:

1.  **Remove the outer `<Link>` wrapper.**
2.  **Add individual `<Link>` wrappers** around:
    - The Product Image.
    - The Product Title.
3.  **Keep the `AddToCartButton` independent** of any links.

## ✅ Result

Clicking "Add to Cart" now only triggers the cart action and displays the toast notification on the current page, without navigating away. Clicking the image or title still correctly navigates to the product page.
