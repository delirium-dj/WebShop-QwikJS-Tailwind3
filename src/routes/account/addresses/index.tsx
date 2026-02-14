/**
 * Addresses Page
 * 
 * Displays user's saved shipping/billing addresses.
 * 
 * For Junior Developers:
 * - This page is at /account/addresses
 * - Protected by AuthGuard (via layout)
 */

import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">My Addresses</h2>
        <p class="mt-1 text-sm text-gray-600">
          Manage your shipping and billing addresses
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
        <p class="text-gray-600 mb-6">
          You haven't added any addresses yet.
        </p>
        <button
          id="add-address-btn"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Address
        </button>
      </div>
    </div>
  );
});
