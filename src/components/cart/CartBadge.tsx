// src/components/cart/CartBadge.tsx
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { useCart } from '~/contexts/cart';

/**
 * Cart Badge Component
 * Displays shopping cart icon with item count
 * Usually placed in the header/navigation
 */
export const CartBadge = component$(() => {
  const cart = useCart();

  return (
    <Link
      href="/cart"
      class="relative inline-flex items-center p-2 text-gray-700 hover:text-black transition-colors"
      aria-label="Shopping cart"
    >
      {/* Shopping Cart Icon */}
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

      {/* Item Count Badge */}
      {cart.state.totalItems > 0 && (
        <span class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full animate-pulse">
          {cart.state.totalItems > 99 ? '99+' : cart.state.totalItems}
        </span>
      )}
    </Link>
  );
});
