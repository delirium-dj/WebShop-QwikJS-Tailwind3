// src/components/cart/CartBadge.tsx
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { useCart } from '~/contexts/cart'; // This is our hook to access the global cart state

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
          - 'w-6 h-6': Standard size for navigation icons.
      */}
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      {/* 
          Item Count Badge:
          - We only show the red badge if there is at least 1 item in the cart.
          - 'animate-pulse': This adds a subtle "breathing" animation to draw the user's eye 
             when they have something in their cart.
          - We cap the display at '99+' so it doesn't break the small circle UI if someone 
            buys hundreds of items.
      */}
      {cart.state.totalItems > 0 && (
        <span class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full animate-pulse">
          {cart.state.totalItems > 99 ? '99+' : cart.state.totalItems}
        </span>
      )}
    </Link>
  );
});
