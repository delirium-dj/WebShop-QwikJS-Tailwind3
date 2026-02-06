// src/components/cart/CartBadge.tsx
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { useCart } from '~/contexts/cart'; // This is our hook to access the global cart state
import { CartIcon } from '../ui/icons/CartIcon'; // Reusing the shared cart icon component
import { CartCountBadge } from './CartCountBadge';

/**
 * Cart Badge Component
 * Displays a shopping cart icon with a real-time count of items.
 * It's reactive, meaning it "re-renders" automatically whenever the cart items change.
 */
export const CartBadge = component$(() => {
  // We grab the current cart state using our custom hook.
  const cart = useCart();

  return (
    <Link
      href="/cart"
      class="relative inline-flex items-center p-2 text-gray-700 hover:text-black transition-colors"
      aria-label="Shopping cart"
    >
      {/* 
          Shopping Cart SVG Icon:
          - We use the shared CartIcon component here to keep things DRY.
      */}
      <CartIcon class="w-6 h-6" />

      {/* 
          Item Count Badge:
          - We only show the red badge if there is at least 1 item in the cart.
          - 'animate-pulse': This adds a subtle "breathing" animation to draw the user's eye 
             when they have something in their cart.
          - We cap the display at '99+' so it doesn't break the small circle UI if someone 
            buys hundreds of items.
      */}
      <CartCountBadge 
        count={cart.state.totalItems} 
        class="absolute -top-1 -right-1 w-5 h-5 text-xs animate-pulse" 
      />
    </Link>
  );
});
