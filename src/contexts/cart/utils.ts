// src/contexts/cart/utils.ts

/**
 * CART UTILITY FUNCTIONS
 *
 * This file contains helper functions used by the CartContext.
 * They handle:
 * - Price calculations (subtotal, totals, discounts)
 * - Persistent storage (saving/loading from localStorage)
 * - Item comparison and searching
 *
 * For Junior Developers:
 * Think of these as "tools" that do specific jobs.
 * CartContext calls these functions to avoid cluttering itself with logic.
 * This makes CartContext cleaner and easier to understand.
 */

import type { CartItem, CartState } from "./types";

// ============================================================================
// PRICE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate all cart totals from a list of items
 *
 * This function does the math:
 * - Adds up all item prices with quantities
 * - Applies individual item discounts
 * - Counts total items in cart
 * - Calculates total money saved
 *
 * @param items - Array of items currently in the cart
 * @returns Object containing: totalItems, subtotal, discount, total
 *
 * For Junior Developers:
 * This is the "calculator" that figures out:
 * - How many items are in the cart?
 * - How much do they cost?
 * - How much is the customer saving?
 *
 * @example
 * ```tsx
 * const cartItems = [
 *   { id: 1, price: 100, quantity: 2, discount: 10 },  // 100 * 2 = 200, minus 10% = 180
 *   { id: 2, price: 50, quantity: 1, discount: 0 },    // 50 * 1 = 50
 * ];
 * const totals = calculateCartTotals(cartItems);
 * // Result: { totalItems: 3, subtotal: 230, discount: 20, total: 230 }
 * ```
 */
export const calculateCartTotals = (
  items: CartItem[],
): Omit<CartState, "items"> => {
  // Step 1: Calculate subtotal by going through each item
  const subtotal = items.reduce((sum, item) => {
    // If item has a discount, apply it
    // Example: $100 item with 10% discount = $100 - ($100 * 10 / 100) = $100 - $10 = $90
    const itemPrice = item.discount
      ? item.price - (item.price * item.discount) / 100
      : item.price;

    // Multiply by quantity and add to running total
    // Example: $90 per item * 2 items = $180
    return sum + itemPrice * item.quantity;
  }, 0); // Start at 0

  // Step 2: Count total items
  // This adds up all quantities (not number of product types)
  // Example: 2 shirts + 1 pants = 3 total items
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Step 3: Calculate total money saved from discounts
  const discount = items.reduce((sum, item) => {
    if (item.discount) {
      // Example: $100 item with 10% discount = $100 * 10 / 100 = $10 saved
      const discountAmount = (item.price * item.discount) / 100;
      // Multiply by quantity because discount applies to all of that item
      // Example: $10 savings * 2 items = $20 total saved
      return sum + discountAmount * item.quantity;
    }
    return sum;
  }, 0);

  // Return the calculated values
  return {
    totalItems,
    subtotal,
    discount,
    total: subtotal, // In this simple version, Total = Subtotal (after item discounts)
    // Note: In real apps, you'd add shipping and tax here: subtotal + shipping + tax - discount
  };
};

// ============================================================================
// PERSISTENT STORAGE FUNCTIONS (LocalStorage)
// ============================================================================

/**
 * Load cart from browser localStorage
 *
 * When the app starts, we check if the user previously saved a cart.
 * This way, if they refresh the page or close/reopen the browser,
 * their cart is still there!
 *
 * @returns Array of cart items, or empty array if nothing is saved
 *
 * For Junior Developers:
 * localStorage is like a small notebook the browser keeps on the user's computer.
 * We can write JSON data to it, and it stays even after closing the browser.
 * We check `typeof window` because localStorage only exists in browsers,
 * not on the server (during SSR).
 *
 * @example
 * ```tsx
 * // On app startup:
 * const savedCart = loadCartFromStorage();
 * // Returns: [{ id: 1, price: 100, quantity: 2, ... }, ...]
 * // Or empty [] if nothing was saved
 * ```
 */
export const loadCartFromStorage = (): CartItem[] => {
  // First check: Are we in a browser? (not on server)
  if (typeof window === "undefined") {
    return [];
  }

  try {
    // Try to get the cart data from localStorage
    const stored = localStorage.getItem("reconshop-cart");

    if (stored) {
      // Parse the JSON string back into objects
      const items = JSON.parse(stored) as CartItem[];

      // Safety check: make sure it's actually an array
      return Array.isArray(items) ? items : [];
    }
  } catch (error) {
    // If anything goes wrong (corrupted data, etc.), log it and return empty
    console.error("Error loading cart from localStorage:", error);
  }

  // If we get here, either nothing was saved or there was an error
  return [];
};

/**
 * Save cart to browser localStorage
 *
 * Every time the cart changes, we save it.
 * This is called automatically by CartContext after any action.
 *
 * @param items - The items to save
 *
 * For Junior Developers:
 * We convert the items array to JSON (a text format), then save it.
 * Later, loadCartFromStorage() converts it back to JavaScript objects.
 *
 * @example
 * ```tsx
 * // After user adds an item:
 * saveCartToStorage([{ id: 1, price: 100, quantity: 2, ... }]);
 * // Now it's saved and won't be lost if page reloads
 * ```
 */
export const saveCartToStorage = (items: CartItem[]): void => {
  // First check: Are we in a browser? (not on server)
  if (typeof window === "undefined") {
    return;
  }

  try {
    // Convert array to JSON and save to localStorage
    localStorage.setItem("reconshop-cart", JSON.stringify(items));
  } catch (error) {
    // If localStorage is full or locked, log the error
    console.error("Error saving cart to localStorage:", error);
  }
};

/**
 * Clear the entire cart from localStorage
 *
 * Called when user clicks "Clear Cart" or after successful checkout.
 * Removes all saved cart data from the browser.
 *
 * For Junior Developers:
 * removeItem() deletes a key-value pair from localStorage.
 * It's like erasing notes from the notebook!
 */
export const clearCartFromStorage = (): void => {
  // First check: Are we in a browser?
  if (typeof window === "undefined") {
    return;
  }

  try {
    // Delete the cart key from localStorage
    localStorage.removeItem("reconshop-cart");
  } catch (error) {
    // Log any errors
    console.error("Error clearing cart from localStorage:", error);
  }
};

// ============================================================================
// ITEM COMPARISON FUNCTIONS
// ============================================================================

/**
 * Check if two cart items are the same
 *
 * Two items are "the same" if they have:
 * - The same product ID
 * - The same size (if selected)
 * - The same color (if selected)
 *
 * For example:
 * - A red shirt size M = different from a red shirt size L (different sizes)
 * - A red shirt size M = different from a blue shirt size M (different colors)
 * - Same product, size, and color = same item (should increase quantity instead of adding new)
 *
 * @param item1 - First item to compare
 * @param item2 - Second item to compare
 * @returns true if items are identical, false otherwise
 *
 * For Junior Developers:
 * This is used to determine if we should add a new line item or increase
 * the quantity of an existing item.
 *
 * @example
 * ```tsx
 * const item1 = { id: 1, selectedSize: 'M', selectedColor: 'red', ... };
 * const item2 = { id: 1, selectedSize: 'M', selectedColor: 'red', ... };
 * isSameCartItem(item1, item2); // true - they're the same!
 *
 * const item3 = { id: 1, selectedSize: 'L', selectedColor: 'red', ... };
 * isSameCartItem(item1, item3); // false - different size!
 * ```
 */
export const isSameCartItem = (item1: CartItem, item2: CartItem): boolean => {
  return (
    item1.id === item2.id &&
    item1.selectedSize === item2.selectedSize &&
    item1.selectedColor === item2.selectedColor
  );
};

/**
 * Find the index of an item in the cart array
 *
 * Used internally to locate items so we can update or delete them.
 * Searches by ID and variant (size/color).
 *
 * @param items - The cart items array
 * @param itemToFind - The item to search for (can have partial data)
 * @returns Index of the item (-1 if not found)
 *
 * For Junior Developers:
 * When we need to update or remove an item, we first find its position in the array.
 * Array position is like saying "the 3rd item in the list".
 * We return -1 if not found, which is a common convention in JavaScript.
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: 1, selectedSize: 'M', ... },  // Index 0
 *   { id: 2, selectedSize: 'L', ... },  // Index 1
 *   { id: 3, selectedSize: 'M', ... },  // Index 2
 * ];
 *
 * findCartItemIndex(items, { id: 2, selectedSize: 'L' });
 * // Returns: 1 (found at index 1)
 *
 * findCartItemIndex(items, { id: 99 });
 * // Returns: -1 (not found)
 * ```
 */
export const findCartItemIndex = (
  items: CartItem[],
  itemToFind: Partial<CartItem>,
): number => {
  return items.findIndex((item) => {
    // First check: IDs must match
    if (item.id !== itemToFind.id) return false;

    // Second check: If size is specified, must match
    if (
      itemToFind.selectedSize &&
      item.selectedSize !== itemToFind.selectedSize
    )
      return false;

    // Third check: If color is specified, must match
    if (
      itemToFind.selectedColor &&
      item.selectedColor !== itemToFind.selectedColor
    )
      return false;

    // All checks passed - this is the item!
    return true;
  });
};
