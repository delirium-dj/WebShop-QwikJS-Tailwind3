// src/contexts/cart/utils.ts
import type { CartItem, CartState } from './types';

/**
 * Helper: Calculate Cart Totals
 * Purpose: Iterates through all items to calculate price, discounts, and item count.
 */
export const calculateCartTotals = (items: CartItem[]): Omit<CartState, 'items'> => {
  const subtotal = items.reduce((sum, item) => {
    // Determine price (discounted or regular) per item
    const itemPrice = item.discount 
      ? item.price - (item.price * item.discount) / 100 
      : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total money saved
  const discount = items.reduce((sum, item) => {
    if (item.discount) {
      const discountAmount = (item.price * item.discount) / 100;
      return sum + discountAmount * item.quantity;
    }
    return sum;
  }, 0);

  return {
    totalItems,
    subtotal,
    discount,
    total: subtotal, // In this simple version, Total = Subtotal (after item discounts)
  };
};

/**
 * Helper: Load from LocalStorage
 * Purpose: Retrieves persisted cart data from the browser's storage.
 * Note: We check `typeof window` to avoid errors during Server-Side Rendering (SSR).
 */
export const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem('reconshop-cart');
    if (stored) {
      const items = JSON.parse(stored) as CartItem[];
      return Array.isArray(items) ? items : [];
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }

  return [];
};

/**
 * Helper: Save to LocalStorage
 */
export const saveCartToStorage = (items: CartItem[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('reconshop-cart', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

/**
 * Helper: Clear LocalStorage
 */
export const clearCartFromStorage = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem('reconshop-cart');
  } catch (error) {
    console.error('Error clearing cart from localStorage:', error);
  }
};

/**
 * Helper: Compare Items
 * Purpose: Checks if two items are identical (ID + variants).
 * Example: A specific Red t-shirt !== A Blue t-shirt, even if they have the same ID.
 */
export const isSameCartItem = (item1: CartItem, item2: CartItem): boolean => {
  return (
    item1.id === item2.id &&
    item1.selectedSize === item2.selectedSize &&
    item1.selectedColor === item2.selectedColor
  );
};

/**
 * Helper: Find Item Index
 * Purpose: Locates an item in the array to update it.
 */
export const findCartItemIndex = (
  items: CartItem[],
  itemToFind: Partial<CartItem>
): number => {
  return items.findIndex((item) => {
    if (item.id !== itemToFind.id) return false;
    // Strict variant checking:
    if (itemToFind.selectedSize && item.selectedSize !== itemToFind.selectedSize) return false;
    if (itemToFind.selectedColor && item.selectedColor !== itemToFind.selectedColor) return false;
    return true;
  });
};
