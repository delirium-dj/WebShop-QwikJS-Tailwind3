// src/contexts/cart/CartContext.tsx

/**
 * SHOPPING CART CONTEXT
 *
 * This file implements the entire shopping cart system using Qwik's context API.
 * It manages:
 * - Cart state (items, totals, pricing)
 * - Cart actions (add, remove, update quantities)
 * - Persistent storage (saves to browser localStorage)
 *
 * For Junior Developers:
 * Think of this as the "brain" of the shopping cart. Any component can ask the cart
 * "How many items are in it?" or "Add this product please!" and it will handle it.
 * The cart automatically saves everything so customers don't lose their cart on refresh.
 *
 * How it works:
 * 1. CartProvider wraps your entire app
 * 2. Components call useCart() to access cart data and functions
 * 3. When cart changes, all components using it automatically update
 * 4. Cart data is saved to localStorage every time it changes
 */

import {
  component$,
  createContextId,
  useContextProvider,
  useStore,
  useVisibleTask$,
  Slot,
  $,
} from "@builder.io/qwik";
import type { CartContextType, CartItem, CartState } from "./types";
import {
  calculateCartTotals,
  loadCartFromStorage,
  saveCartToStorage,
  clearCartFromStorage,
  findCartItemIndex,
} from "./utils";

// Create a Context ID. This is like a unique key that allows any component
// in the app to find this specific data store.
export const CartContext = createContextId<CartContextType>("cart-context");

/**
 * Cart Provider Component
 *
 * Purpose: This is the central "brain" for the shopping cart.
 * It wraps the entire application and provides cart functionality to all child components.
 *
 * Setup: Place this around your app content in layout.tsx:
 * ```tsx
 * <CartProvider>
 *   <Header />
 *   <main><Slot /></main>
 * </CartProvider>
 * ```
 *
 * For Junior Developers:
 * Every time a user adds something to their cart, all components using the cart
 * will automatically know about it without you passing props through 10 layers of components.
 * That's the magic of context!
 */
export const CartProvider = component$(() => {
  // Initialize the global cart state using useStore (Qwik's reactive storage).
  // When this data changes, any component using it will automatically update.
  const cartState = useStore<CartState>({
    items: [],
    totalItems: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  // Load cart from localStorage when the app starts.
  // We use useVisibleTask$ because localStorage is only available in the browser (not on the server).
  // This runs once when the component initially loads in the browser.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const savedItems = loadCartFromStorage();
    if (savedItems.length > 0) {
      cartState.items = savedItems;
      const totals = calculateCartTotals(savedItems);
      // Object.assign efficiently updates multiple properties of the store at once.
      Object.assign(cartState, totals);
    }
  });

  /**
   * ACTION: Add an item to the cart
   *
   * When user clicks "Add to Cart", this function is called with the product data.
   * If the item already exists (same ID + variant), we just increase quantity.
   * If it's new, we add it to the cart.
   *
   * @param item - Product data (without quantity yet)
   * @param quantity - How many to add (default: 1)
   *
   * We use $(...) to make this function serializable (Qwik requirement).
   */
  const addItem = $((item: Omit<CartItem, "quantity">, quantity = 1) => {
    // Check if item already exists (matching ID, Size, and Color)
    const existingIndex = findCartItemIndex(cartState.items, item);

    if (existingIndex !== -1) {
      // It exists! Just increase the quantity.
      cartState.items[existingIndex].quantity += quantity;
    } else {
      // It's new! push it to the array.
      cartState.items.push({ ...item, quantity });
    }

    // Always recalculate totals after modifying items.
    const totals = calculateCartTotals(cartState.items);
    Object.assign(cartState, totals);

    // Save to browser storage so user doesn't lose cart on refresh.
    saveCartToStorage(cartState.items);
  });

  /**
   * ACTION: Remove an item completely from the cart
   *
   * Deletes all of this product from the cart (removes all quantities).
   * For variant support: if size/color is provided, only removes that variant.
   *
   * @param id - Product ID to remove
   * @param size - Optional: only remove items with this size variant
   * @param color - Optional: only remove items with this color variant
   */
  const removeItem = $((id: number, size?: string, color?: string) => {
    cartState.items = cartState.items.filter((item) => {
      // Keep items with different IDs
      if (item.id !== id) return true;

      // For items with same ID, check if variants match
      // Treat null/undefined/empty string as equivalent for comparison
      const itemSize = item.selectedSize || undefined;
      const targetSize = size || undefined;
      const itemColor = item.selectedColor || undefined;
      const targetColor = color || undefined;

      const sizeMatch = itemSize === targetSize;
      const colorMatch = itemColor === targetColor;

      // If ID matches AND size matches AND color matches, we want to REMOVE it (return false)
      // Otherwise, keep it (return true)
      return !(sizeMatch && colorMatch);
    });

    const totals = calculateCartTotals(cartState.items);
    Object.assign(cartState, totals);
    saveCartToStorage(cartState.items);
  });

  /**
   * ACTION: Update quantity for an item
   *
   * When user changes the quantity in their cart (e.g., "5" in a quantity box).
   * If quantity is 0 or negative, removes the item instead.
   *
   * @param id - Product ID
   * @param quantity - New quantity (e.g., 5)
   * @param size - Optional: variant size to update
   * @param color - Optional: variant color to update
   */
  const updateQuantity = $(
    (id: number, quantity: number, size?: string, color?: string) => {
      // If user tries to set 0 or negative, we remove the item instead.
      if (quantity <= 0) {
        removeItem(id, size, color);
        return;
      }

      // Find the item and update its specific quantity property.
      // Must match ID, Size, and Color
      const itemIndex = cartState.items.findIndex((item) => {
        if (item.id !== id) return false;
        const itemSize = item.selectedSize || undefined;
        const targetSize = size || undefined;
        const itemColor = item.selectedColor || undefined;
        const targetColor = color || undefined;
        return itemSize === targetSize && itemColor === targetColor;
      });

      if (itemIndex !== -1) {
        cartState.items[itemIndex].quantity = quantity;

        const totals = calculateCartTotals(cartState.items);
        Object.assign(cartState, totals);
        saveCartToStorage(cartState.items);
      }
    },
  );

  /**
   * ACTION: Clear the entire cart
   *
   * Removes everything from the cart at once.
   * Used when user clicks "Empty Cart" or after successful checkout.
   */
  const clearCart = $(() => {
    // Reset state to initial empty values
    cartState.items = [];
    cartState.totalItems = 0;
    cartState.subtotal = 0;
    cartState.discount = 0;
    cartState.total = 0;

    clearCartFromStorage();
  });

  /**
   * HELPER: Get quantity for a specific item
   *
   * Useful for UI badges (e.g., showing "3" on the cart icon).
   * If size/color provided, gets specific variant quantity.
   * Otherwise returns total quantity for that product ID across all variants.
   *
   * @param id - Product ID
   * @param size - Optional: variant size to check
   * @param color - Optional: variant color to check
   * @returns Quantity of this item in cart
   */
  const getItemQuantity = $(
    (id: number, size?: string, color?: string): number => {
      if (size || color) {
        const item = cartState.items.find((item) => {
          if (item.id !== id) return false;
          const itemSize = item.selectedSize || undefined;
          const targetSize = size || undefined;
          const itemColor = item.selectedColor || undefined;
          const targetColor = color || undefined;
          return itemSize === targetSize && itemColor === targetColor;
        });
        return item ? item.quantity : 0;
      }

      // Sum all variants if no specific variant requested
      return cartState.items
        .filter((item) => item.id === id)
        .reduce((sum, item) => sum + item.quantity, 0);
    },
  );

  /**
   * HELPER: Check if item is already in cart
   *
   * Useful for showing "In Cart" badges or disabling "Add to Cart" buttons.
   * Returns true if product is already in cart (with matching variant if provided).
   *
   * @param id - Product ID
   * @param size - Optional: variant size to check
   * @param color - Optional: variant color to check
   * @returns true if item is in cart, false otherwise
   */
  const isInCart = $((id: number, size?: string, color?: string): boolean => {
    if (size || color) {
      return cartState.items.some((item) => {
        if (item.id !== id) return false;
        const itemSize = item.selectedSize || undefined;
        const targetSize = size || undefined;
        const itemColor = item.selectedColor || undefined;
        const targetColor = color || undefined;
        return itemSize === targetSize && itemColor === targetColor;
      });
    }
    return cartState.items.some((item) => item.id === id);
  });

  // Bundle state and actions into a single object to share via Context.
  // This is what components get when they call useCart()
  const contextValue: CartContextType = {
    state: cartState,
    actions: {
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemQuantity,
      isInCart,
    },
  };

  // Actually provide the data to the rest of the application.
  useContextProvider(CartContext, contextValue);

  // Render whatever children are wrapped by this provider.
  return <Slot />;
});
