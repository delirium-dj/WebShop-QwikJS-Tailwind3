// src/components/cart/CartCountBadge.tsx
import { component$ } from '@builder.io/qwik';

/**
 * Cart Count Badge
 * A reusable red circle that displays the number of items in the cart.
 */
interface CartCountBadgeProps {
  count: number;
  class?: string;
}

export const CartCountBadge = component$<CartCountBadgeProps>(({ count, class: className }) => {
  if (count <= 0) return null;

  return (
    <span class={`flex items-center justify-center font-bold text-white bg-red-600 rounded-full ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
});
