// src/contexts/cart/index.ts

// Export context and provider
export { CartContext, CartProvider } from './CartContext';

// Export custom hook
export { useCart } from './useCart';

// Export types
export type { CartItem, CartState, CartActions, CartContextType } from './types';

// Export utilities (optional, for advanced usage)
export { calculateCartTotals, isSameCartItem, findCartItemIndex } from './utils';
