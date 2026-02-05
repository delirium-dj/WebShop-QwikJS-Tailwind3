// src/contexts/cart/CartContext.tsx
import {
  component$,
  createContextId,
  useContextProvider,
  useStore,
  useVisibleTask$,
  Slot,
  $,
} from '@builder.io/qwik';
import type { CartContextType, CartItem, CartState } from './types';
import {
  calculateCartTotals,
  loadCartFromStorage,
  saveCartToStorage,
  clearCartFromStorage,
  findCartItemIndex,
} from './utils';

// Create a Context ID. This is like a unique key that allows any component
// in the app to find this specific data store.
export const CartContext = createContextId<CartContextType>('cart-context');

/**
 * Cart Provider Component
 * Purpose: This acts as the "brain" for the shopping cart.
 * It wraps the application and holds the state (items, totals).
 * Any component inside this provider can ask for cart data.
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

  // Action: Add an item to the cart
  // We use $(...) to make this function serializable (Qwik requirement).
  const addItem = $((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
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

  // Action: Remove an item completely
  const removeItem = $((id: number) => {
    // Filter creates a NEW array excluding the item with the given ID.
    cartState.items = cartState.items.filter((item) => item.id !== id);

    const totals = calculateCartTotals(cartState.items);
    Object.assign(cartState, totals);
    saveCartToStorage(cartState.items);
  });

  // Action: Update quantity (e.g., user types '5' in the box)
  const updateQuantity = $((id: number, quantity: number) => {
    // If user tries to set 0 or negative, we remove the item instead.
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    // Find the item and update its specific quantity property.
    const itemIndex = cartState.items.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
      cartState.items[itemIndex].quantity = quantity;

      const totals = calculateCartTotals(cartState.items);
      Object.assign(cartState, totals);
      saveCartToStorage(cartState.items);
    }
  });

  // Action: Empty the whole cart
  const clearCart = $(() => {
    // Reset state to initial empty values
    cartState.items = [];
    cartState.totalItems = 0;
    cartState.subtotal = 0;
    cartState.discount = 0;
    cartState.total = 0;

    clearCartFromStorage();
  });

  // Helper: Get quantity for a specific ID (useful for UI badges)
  const getItemQuantity = $((id: number): number => {
    const item = cartState.items.find((item) => item.id === id);
    return item ? item.quantity : 0;
  });

  // Helper: Check if item is already in cart
  const isInCart = $((id: number): boolean => {
    return cartState.items.some((item) => item.id === id);
  });

  // Bundle state and actions into a single object to share via Context.
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
