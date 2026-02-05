# Bug Fix: Cart Variant Removal

## 🐛 The Bug

When removing an item from the cart, **all** items with that Product ID were being removed, regardless of their selected size or color. This meant if you had "Product A (Red)" and "Product A (Blue)", clicking remove on one would remove both.

## 🛠️ The Fix

I updated the cart logic to treat `ID + Size + Color` as the unique identifier for a cart item, rather than just `ID`.

### Files Modified

1.  **`src/contexts/cart/types.ts`**
    - Updated `CartActions` interface to accept `size` and `color` parameters for:
      - `removeItem`
      - `updateQuantity`
      - `getItemQuantity`
      - `isInCart`

2.  **`src/contexts/cart/CartContext.tsx`**
    - **Refactored `removeItem`**: Now filters out items matching `ID && Size && Color`. Items with same ID but different variants are kept.
    - **Refactored `updateQuantity`**: Now finds the specific variant to update.
    - **Refactored `getItemQuantity`**: Can now return quantity for a specific variant.

3.  **`src/components/cart/CartItemCard.tsx`**
    - Updated properties definition to match new action signatures.
    - Updated `handleRemove` to pass `item.selectedSize` and `item.selectedColor`.
    - Updated `handleQuantityChange` to pass variants.

## 🧪 Interpretation of Fix

- **Before**: `removeItem(id)` -> deleted all rows with this ID.
- **After**: `removeItem(id, size, color)` -> deletes only the specific row matching all three.

## ✅ Verification

- Ran `pnpm run build.types`: **Success** (No type errors).
- This is a logical fix that ensures granular control over cart items.
