// src/contexts/cart/useCart.ts
import { useContext } from '@builder.io/qwik';
import { CartContext } from './CartContext';
import type { CartContextType } from './types';

/**
 * Custom Hook: useCart
 * Purpose: Makes it super easy to use the cart anywhere in the app.
 * Instead of importing useContext and CartContext every time, just import useCart().
 * 
 * @example
 * ```tsx
 * export default component$(() => {
 *   const cart = useCart(); // <--- Easy access!
 *   
 *   return (
 *     <div>
 *       <p>Items: {cart.state.totalItems}</p>
 *       <button onClick$={() => cart.actions.addItem(product)}>
 *         Add to Cart
 *       </button>
 *     </div>
 *   );
 * });
 * ```
 */
export const useCart = (): CartContextType => {
  // Grab the context value from the nearest provider
  const cart = useContext(CartContext);
  
  // Safety check: Junior developers might forget to wrap the app in <CartProvider>.
  // This error will tell them exactly what's wrong.
  if (!cart) {
    throw new Error('useCart must be used within a CartProvider. Did you forget to wrap your app in layout.tsx?');
  }
  
  return cart;
};
