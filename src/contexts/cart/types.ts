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

/**
 * CartActions Interface
 * Functions that components can call to change the cart.
 */
export interface CartActions {
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  // Getters might return Promises because they cross the serialization boundary
  getItemQuantity: (id: number) => number | Promise<number>;
  isInCart: (id: number) => boolean | Promise<boolean>;
}

/**
 * CartContextType Interface
 * What actually gets exposed via useCart().
 */
export type CartContextType = {
  state: CartState;
  actions: CartActions;
};
