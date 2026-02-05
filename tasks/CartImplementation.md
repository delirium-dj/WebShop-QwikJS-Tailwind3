# Step 2: Cart Context Store - Implementation Guide

## 🎯 Overview

This implementation provides a complete, production-ready cart management system using Qwik's Context API with localStorage persistence, proper TypeScript typing, and full state management.

---

## 📦 Files Structure

```
src/
├── contexts/
│   └── cart/
│       ├── index.ts                 # Main export file
│       ├── types.ts                 # TypeScript interfaces
│       ├── utils.ts                 # Helper functions
│       ├── CartContext.tsx          # Context provider
│       └── useCart.ts               # Custom hook
├── components/
│   ├── cart/
│   │   ├── CartBadge.tsx            # Header cart icon with count
│   │   └── CartItemCard.tsx         # Individual cart item display
│   └── product/
│       ├── ProductCard.tsx          # Updated with cart integration
│       └── ProductInfo.tsx          # Updated with cart integration
└── routes/
    ├── layout.tsx                   # Root layout with CartProvider
    └── cart/
        └── index.tsx                # Shopping cart page
```

---

## 🚀 Installation Steps

### Step 1: Create Cart Context Files

Create the following directory structure:

```bash
mkdir -p src/contexts/cart
mkdir -p src/components/cart
```

Copy these files to their locations:

1. **src/contexts/cart/types.ts** - Type definitions
2. **src/contexts/cart/utils.ts** - Helper functions
3. **src/contexts/cart/CartContext.tsx** - Main context provider
4. **src/contexts/cart/useCart.ts** - Custom hook
5. **src/contexts/cart/index.ts** - Export barrel file

### Step 2: Add CartProvider to Root Layout

Update your **src/routes/layout.tsx**:

```tsx
import { component$, Slot } from '@builder.io/qwik';
import { CartProvider } from '~/contexts/cart';

export default component$(() => {
  return (
    <CartProvider>
      {/* Your existing header/layout */}
      <Slot />
      {/* Your existing footer */}
    </CartProvider>
  );
});
```

### Step 3: Add Cart Components

Create these component files:

1. **src/components/cart/CartBadge.tsx** - Cart icon with item count
2. **src/components/cart/CartItemCard.tsx** - Cart item display

### Step 4: Update Existing Components

Replace or update:

1. **src/components/product/ProductCard.tsx** - Add cart integration
2. **src/components/product/ProductInfo.tsx** - Add cart integration

### Step 5: Create Cart Page

Create **src/routes/cart/index.tsx** - Full shopping cart page

### Step 6: Add CartBadge to Header

In your header/navigation component, add:

```tsx
import { CartBadge } from '~/components/cart/CartBadge';

// Inside your header component
<CartBadge />
```

---

## 🎨 Features Implemented

### Cart Context Features
✅ Global state management with Qwik Context API  
✅ Add items to cart with quantity  
✅ Remove items from cart  
✅ Update item quantities  
✅ Clear entire cart  
✅ Calculate totals (subtotal, discount, total)  
✅ Track total item count  
✅ Check if item is in cart  
✅ Get item quantity  

### Persistence Features
✅ Auto-save to localStorage on every change  
✅ Auto-load from localStorage on app start  
✅ Survive page refreshes  
✅ Client-side only (no SSR issues)  

### UI Features
✅ Cart badge with animated count  
✅ Empty cart state  
✅ Cart item cards with images  
✅ Quantity controls (increment/decrement)  
✅ Remove item buttons  
✅ Order summary sidebar  
✅ Price calculations with discounts  
✅ Checkout button (placeholder)  
✅ Clear cart button  
✅ Trust badges  

### Product Integration
✅ Add to cart from product cards  
✅ Add to cart from product details  
✅ Support for size/color variants  
✅ Stock validation  
✅ Loading states  

---

## 📖 Usage Examples

### Using Cart in Any Component

```tsx
import { component$ } from '@builder.io/qwik';
import { useCart } from '~/contexts/cart';

export default component$(() => {
  const cart = useCart();

  return (
    <div>
      {/* Display cart count */}
      <p>Items in cart: {cart.state.totalItems}</p>

      {/* Display cart total */}
      <p>Total: ${cart.state.total.toFixed(2)}</p>

      {/* Add item to cart */}
      <button
        onClick$={() => {
          cart.actions.addItem({
            id: 1,
            title: 'Product',
            price: 29.99,
            image: '/image.jpg',
          }, 1);
        }}
      >
        Add to Cart
      </button>

      {/* Check if item is in cart */}
      {cart.state.items.map((item) => (
        <div key={item.id}>
          <span>{item.title} x {item.quantity}</span>
          <button onClick$={() => cart.actions.removeItem(item.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
});
```

### Adding Item with Variants

```tsx
cart.actions.addItem({
  id: 1,
  title: 'T-Shirt',
  price: 24.99,
  image: '/tshirt.jpg',
  selectedSize: 'M',
  selectedColor: 'Blue',
  discount: 10,
}, 2); // Add 2 items
```

### Cart State Structure

```typescript
{
  items: [
    {
      id: 1,
      title: 'Product Name',
      price: 99.99,
      image: '/image.jpg',
      quantity: 2,
      selectedSize: 'L',
      selectedColor: 'Red',
      discount: 15
    }
  ],
  totalItems: 2,        // Total quantity of all items
  subtotal: 199.98,     // Price before discounts
  discount: 29.99,      // Total discount amount
  total: 169.99         // Final price after discounts
}
```

---

## 🔄 Cart Actions API

### addItem(item, quantity)
Adds an item to the cart or increases quantity if already exists.

```tsx
cart.actions.addItem({
  id: 1,
  title: 'Product',
  price: 29.99,
  image: '/image.jpg',
  discount: 10,           // Optional
  selectedSize: 'M',      // Optional
  selectedColor: 'Blue',  // Optional
}, 2); // Quantity (default: 1)
```

### removeItem(id)
Removes an item completely from the cart.

```tsx
cart.actions.removeItem(1);
```

### updateQuantity(id, quantity)
Updates the quantity of an item. If quantity is 0, removes the item.

```tsx
cart.actions.updateQuantity(1, 5);
```

### clearCart()
Removes all items from the cart.

```tsx
cart.actions.clearCart();
```

### getItemQuantity(id)
Returns the quantity of a specific item (0 if not in cart).

```tsx
const qty = await cart.actions.getItemQuantity(1);
console.log(qty); // 2
```

### isInCart(id)
Checks if an item exists in the cart.

```tsx
const inCart = await cart.actions.isInCart(1);
console.log(inCart); // true or false
```

---

## 💾 LocalStorage Key

Cart data is stored under the key: **`reconshop-cart`**

You can change this in `src/contexts/cart/utils.ts`:

```typescript
localStorage.getItem('your-custom-key');
```

---

## 🎯 Integration Points

### 1. Header Navigation
Add `<CartBadge />` to show cart icon with count.

### 2. Product Cards
Products can be added to cart directly from listing pages.

### 3. Product Details
Full "Add to Cart" with quantity, size, and color selection.

### 4. Cart Page
Complete cart management at `/cart`.

---

## 🔧 Customization Options

### Change Cart Storage Key
In `src/contexts/cart/utils.ts`:
```typescript
localStorage.setItem('my-shop-cart', JSON.stringify(items));
```

### Add Shipping Calculation
In `src/contexts/cart/utils.ts`, update `calculateCartTotals`:
```typescript
const shipping = subtotal > 100 ? 0 : 9.99;
return {
  totalItems,
  subtotal,
  discount,
  shipping,
  total: subtotal + shipping,
};
```

### Add Tax Calculation
```typescript
const tax = subtotal * 0.08; // 8% tax
return {
  totalItems,
  subtotal,
  discount,
  tax,
  total: subtotal + tax,
};
```

### Customize Empty Cart Message
In `src/routes/cart/index.tsx`, update the empty state section.

---

## 🐛 Troubleshooting

### Issue: Cart not persisting
- Check browser console for localStorage errors
- Verify localStorage is enabled in browser
- Check for quota exceeded errors

### Issue: Cart state not updating
- Ensure `CartProvider` wraps your entire app in `layout.tsx`
- Check that you're using `useCart()` hook, not importing context directly

### Issue: TypeScript errors
- Ensure all type files are in place
- Run `npm run typecheck` or `pnpm typecheck`
- Verify import paths match your project structure

### Issue: Cart badge not showing
- Verify `CartBadge` is inside the `CartProvider` wrapper
- Check that header component is rendered
- Verify cart actually has items

---

## 🧪 Testing Checklist

Before moving to Step 3, test:

- [ ] Add item to cart from product card
- [ ] Add item to cart from product details page
- [ ] Cart badge shows correct count
- [ ] Cart badge updates when items added
- [ ] Navigate to `/cart` page
- [ ] View all cart items correctly
- [ ] Update item quantity with +/- buttons
- [ ] Update item quantity with direct input
- [ ] Remove individual items
- [ ] Clear entire cart
- [ ] Cart persists after page refresh
- [ ] Cart survives browser restart
- [ ] Empty cart state displays correctly
- [ ] Price calculations are accurate
- [ ] Discounts calculate correctly
- [ ] Size/color variants work properly

---

## 📝 Code Quality Notes

### Type Safety
All cart operations are fully typed with TypeScript interfaces.

### Error Handling
LocalStorage operations wrapped in try-catch blocks to handle:
- Quota exceeded
- Browser restrictions
- Parse errors

### Performance
- Uses Qwik's reactive store for efficient updates
- Only saves to localStorage when state changes
- Client-side only loading (no SSR overhead)

### Accessibility
- Proper ARIA labels on buttons
- Semantic HTML structure
- Keyboard navigation support

---

## 🚀 What's Next: Step 3

With the cart context complete, **Step 3** will implement:
- Toast notifications for cart actions
- Mini cart drawer (slide-in cart preview)
- Enhanced "Add to Cart" animations
- Product quick view modal
- Cart persistence across sessions

---

## 📚 Related Documentation

- [Qwik Context Documentation](https://qwik.builder.io/docs/components/context/)
- [Qwik State Management](https://qwik.builder.io/docs/components/state/)
- [Qwik useVisibleTask$](https://qwik.builder.io/docs/components/tasks/#usevisibletask)

---

**✅ Step 2 Complete!**

You now have a fully functional cart system with:
- Global state management
- LocalStorage persistence
- Complete UI components
- Type-safe operations
- Production-ready code

Ready for **Step 3: Enhanced Add to Cart with onClick$** 🎉
