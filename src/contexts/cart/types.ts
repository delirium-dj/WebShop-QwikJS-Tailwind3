// src/contexts/cart/types.ts

/**
 * CART TYPE DEFINITIONS
 *
 * This file defines all TypeScript interfaces for the shopping cart system.
 * Types ensure that:
 * - Cart data has the correct structure
 * - Functions receive the right data
 * - IDE autocomplete works properly
 * - Errors are caught before runtime
 *
 * For Junior Developers:
 * Think of types as "blueprints" or "templates" for data structures.
 * They say: "A CartItem must have these properties, and they must have these types."
 * If you try to create a CartItem without required properties, TypeScript yells at you!
 */

import type { QRL } from "@builder.io/qwik";

/**
 * CartItem Interface
 *
 * Represents a single product inside the shopping cart.
 * When user adds a product to cart, we create a CartItem with their product + choices.
 *
 * For Junior Developers:
 * This is the "recipe" for what data we store about each item in the cart.
 *
 * @property id - Unique product identifier
 * @property title - Product name (e.g., "Blue T-Shirt")
 * @property price - Unit price in dollars (e.g., 29.99)
 * @property image - URL to product image for the cart display
 * @property quantity - How many of this item user wants (e.g., 3)
 * @property selectedSize - Optional: Which size did they choose? (e.g., "M", "L")
 * @property selectedColor - Optional: Which color did they choose? (e.g., "red", "blue")
 * @property discount - Optional: Discount percentage (e.g., 10 for 10% off)
 *
 * @example
 * ```typescript
 * const shirtInCart: CartItem = {
 *   id: 42,
 *   title: "Cool Blue T-Shirt",
 *   price: 29.99,
 *   image: "/images/shirt.jpg",
 *   quantity: 2,           // User wants 2
 *   selectedSize: "L",     // Size Large
 *   selectedColor: "blue", // Blue color
 *   discount: 10,          // 10% off
 * };
 * ```
 */
export interface CartItem {
  // Required fields
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;

  // Optional fields (for variant support)
  selectedSize?: string;
  selectedColor?: string;
  discount?: number;
}

/**
 * CartState Interface
 *
 * Represents the complete state of the shopping cart.
 * This is "the big picture" - all items plus the calculated totals.
 *
 * For Junior Developers:
 * This is the data structure that useCart() hook returns.
 * It contains both the items list AND all the calculated values.
 *
 * @property items - Array of all CartItems currently in the cart
 * @property totalItems - Sum of all quantities (how many things user is buying)
 * @property subtotal - Total price of all items (before shipping/tax)
 * @property discount - Total money saved from discounts
 * @property total - Final price user pays
 *
 * @example
 * ```typescript
 * const cartState: CartState = {
 *   items: [
 *     { id: 1, title: "Shirt", price: 30, quantity: 2, ... },
 *     { id: 2, title: "Pants", price: 60, quantity: 1, ... },
 *   ],
 *   totalItems: 3,        // 2 + 1 = 3 items
 *   subtotal: 120,        // (30 * 2) + (60 * 1) = 120
 *   discount: 6,          // Maybe 5% off on shirt = 6 saved
 *   total: 120,           // User pays this amount
 * };
 * ```
 */
export interface CartState {
  // The items in the cart
  items: CartItem[];

  // Calculated values (updated automatically when items change)
  totalItems: number; // Total quantity of items
  subtotal: number; // Price before tax/shipping
  discount: number; // Total money saved
  total: number; // Final price
}

/**
 * CartActions Interface
 *
 * Defines all the functions/actions available to modify the cart.
 * When you call useCart(), you get access to these actions.
 *
 * For Junior Developers:
 * These are the "buttons" you can press to do things with the cart.
 * - Want to add something? Call addItem()
 * - Want to remove something? Call removeItem()
 * - Want to change quantity? Call updateQuantity()
 * etc.
 *
 * Note: We use QRL<...> type wrapper to tell Qwik these functions are serializable.
 * This is a Qwik-specific requirement - don't worry too much about it!
 *
 * @example
 * ```tsx
 * const { actions } = useCart();
 *
 * // Add a shirt to cart
 * await actions.addItem({
 *   id: 42,
 *   title: "Blue Shirt",
 *   price: 29.99,
 *   image: "/image.jpg",
 * }, 1); // quantity: 1
 *
 * // Remove it
 * await actions.removeItem(42);
 *
 * // Change quantity to 3
 * await actions.updateQuantity(42, 3);
 *
 * // Check how many of item 42 are in cart
 * const qty = await actions.getItemQuantity(42);
 *
 * // Check if in cart
 * const inCart = await actions.isInCart(42);
 *
 * // Empty entire cart
 * await actions.clearCart();
 * ```
 */
export interface CartActions {
  /**
   * Add an item to the cart (or increase quantity if already in cart)
   *
   * @param item - Product data without quantity (we set quantity in the second param)
   * @param quantity - How many to add (default: 1)
   */
  addItem: QRL<(item: Omit<CartItem, "quantity">, quantity?: number) => void>;

  /**
   * Remove an item completely from the cart
   *
   * @param id - Product ID to remove
   * @param size - Optional: only remove this specific size variant
   * @param color - Optional: only remove this specific color variant
   */
  removeItem: QRL<(id: number, size?: string, color?: string) => void>;

  /**
   * Update the quantity of an item in the cart
   * If quantity <= 0, the item is removed instead
   *
   * @param id - Product ID
   * @param quantity - New quantity (must be > 0, or item is removed)
   * @param size - Optional: variant size
   * @param color - Optional: variant color
   */
  updateQuantity: QRL<
    (id: number, quantity: number, size?: string, color?: string) => void
  >;

  /**
   * Clear the entire cart (remove everything)
   */
  clearCart: QRL<() => void>;

  /**
   * Get quantity of a specific item in the cart
   *
   * @param id - Product ID
   * @param size - Optional: specific variant size to check
   * @param color - Optional: specific variant color to check
   * @returns Number of this item (0 if not in cart)
   */
  getItemQuantity: QRL<(id: number, size?: string, color?: string) => number>;

  /**
   * Check if an item is in the cart
   *
   * @param id - Product ID
   * @param size - Optional: specific variant size to check
   * @param color - Optional: specific variant color to check
   * @returns true if item is in cart, false otherwise
   */
  isInCart: QRL<(id: number, size?: string, color?: string) => boolean>;
}

/**
 * CartContextType Interface
 *
 * This is what you get when you call useCart().
 * It bundles the state (data) and actions (functions) together.
 *
 * For Junior Developers:
 * When you do `const cart = useCart();` in a component:
 * - `cart.state` gives you access to items, totals, etc.
 * - `cart.actions` gives you functions to modify the cart
 *
 * @example
 * ```tsx
 * const cart = useCart();
 *
 * // Access state
 * console.log(cart.state.totalItems); // Number of items
 * console.log(cart.state.items);      // Array of items
 * console.log(cart.state.total);      // Total price
 *
 * // Use actions
 * await cart.actions.addItem(newProduct);
 * await cart.actions.removeItem(productId);
 * ```
 */
export type CartContextType = {
  state: CartState;
  actions: CartActions;
};
