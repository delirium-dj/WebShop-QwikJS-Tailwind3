// src/components/cart/CartBadge.tsx

/**
 * CartBadge Component
 * 
 * This component displays a shopping cart icon with a badge showing the number of items.
 * It's typically placed in the header/navigation bar.
 * 
 * Features:
 * - Shows cart icon
 * - Displays item count in a red badge
 * - Badge pulses/animates when items are added
 * - Opens cart drawer on click (instead of navigating to cart page)
 * - Accessible with proper ARIA labels
 * 
 * The badge count comes from the cart context, so it automatically updates
 * whenever items are added or removed from the cart.
 */

import { component$, useSignal, $ } from '@builder.io/qwik';
import { useCart } from '~/contexts/cart';
import { CartDrawer } from './CartDrawer';
import { CartIcon } from '../ui/icons/CartIcon';
import { CartCountBadge } from './CartCountBadge';

export const CartBadge = component$(() => {
  // Get cart state from context
  // This gives us access to the total number of items in the cart
  const cart = useCart();
  
  // Create a signal to track whether the drawer is open or closed
  // Signals are Qwik's way of managing reactive state
  const isDrawerOpen = useSignal(false);

  return (
    <>
      {/* 
        CART BUTTON
        This button opens the cart drawer when clicked
        It shows the cart icon and the item count badge
      */}
      <button
        onClick$={() => {
          // Toggle the drawer open
          isDrawerOpen.value = true;
        }}
        class="relative inline-flex items-center p-2 text-gray-700 hover:text-black transition-colors"
        aria-label={`Shopping cart with ${cart.state.totalItems} items`}
      >
        <CartIcon class="w-6 h-6" />

        {/* 
          ITEM COUNT BADGE
          - We use the shared CartCountBadge for consistency
          - It handles the totalItems > 0 check internally
        */}
        <CartCountBadge 
          count={cart.state.totalItems} 
          class="absolute -top-1 -right-1 w-5 h-5 text-xs animate-pulse" 
        />
      </button>

      {/* 
        CART DRAWER
        The slide-in drawer that shows cart contents
        Only renders when isDrawerOpen is true
        
        Props explained:
        - isOpen: Controls visibility of the drawer
        - onClose: Function to call when drawer should close
      */}
      <CartDrawer
        isOpen={isDrawerOpen.value}
        onClose={$(() => {
          // Close the drawer by setting the signal to false
          isDrawerOpen.value = false;
        })}
      />
    </>
  );
});
