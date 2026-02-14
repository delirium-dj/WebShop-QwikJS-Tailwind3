/**
 * Wishlist Page
 * 
 * Displays all products that the user has saved to their wishlist.
 * 
 * For Junior Developers:
 * - This page is at /account/wishlist
 * - Protected by AuthGuard
 * - Users can move items to cart or remove them
 */

import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">My Wishlist</h2>
        <p class="mt-1 text-sm text-gray-600">
          Products you've saved for later
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
        <p class="text-gray-600 mb-6">
          Start adding products you love to your wishlist!
        </p>
        <a
          href="/shop"
          class="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Explore Products
        </a>
      </div>
    </div>
  );
});
