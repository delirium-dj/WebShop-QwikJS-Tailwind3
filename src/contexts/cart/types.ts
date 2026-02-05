// src/contexts/cart/types.ts

/**
 * CartItem Interface
 * Represents a single product inside the cart.
 */
export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  discount?: number;
}

/**
 * CartState Interface
 * The shape of our global cart state object.
 */
export interface CartState {
  items: CartItem[]; // List of all items
  totalItems: number; // Sum of all quantities
  subtotal: number;   // Price before tax/shipping
  discount: number;   // Money saved
  total: number;      // Final checkout price
}

import type { QRL } from '@builder.io/qwik';

/**
 * CartActions Interface
 * Functions that components can call to change the cart.
 * note: We use QRL<...> type wrapper to tell Qwik these functions are serializable.
 */
export interface CartActions {
  addItem: QRL<(item: Omit<CartItem, 'quantity'>, quantity?: number) => void>;
  removeItem: QRL<(id: number) => void>;
  updateQuantity: QRL<(id: number, quantity: number) => void>;
  clearCart: QRL<() => void>;
  // Getters might return Promises because they cross the serialization boundary
  getItemQuantity: QRL<(id: number) => number>;
  isInCart: QRL<(id: number) => boolean>;
}

/**
 * CartContextType Interface
 * What actually gets exposed via useCart().
 */
export type CartContextType = {
  state: CartState;
  actions: CartActions;
};
