// src/routes/cart/index.tsx
import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';
import { useCart } from '~/contexts/cart';
import { CartItemCard } from '~/components/cart/CartItemCard';

/**
 * Shopping Cart Page
 * Displays all items in cart with order summary
 */
export default component$(() => {
  const cart = useCart();

  // Empty cart state
  if (cart.state.items.length === 0) {
    return (
      <div class="container mx-auto px-4 py-16">
        <div class="max-w-md mx-auto text-center">
          {/* Empty Cart Icon */}
          <div class="mb-6">
            <svg
              class="w-24 h-24 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>

          <h1 class="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p class="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            href="/shop"
            class="inline-block bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div class="bg-gray-50 min-h-screen py-8">
      <div class="container mx-auto px-4">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p class="text-gray-600">
            {cart.state.totalItems} {cart.state.totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
              {cart.state.items.map((item) => (
                <CartItemCard
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  item={item}
                  onUpdateQuantity$={cart.actions.updateQuantity}
                  onRemove$={cart.actions.removeItem}
                />
              ))}
            </div>

            {/* Continue Shopping Button */}
            <div class="mt-6">
              <Link
                href="/shop"
                class="inline-flex items-center text-gray-700 hover:text-black font-medium transition"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Section */}
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 class="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Summary Details */}
              <div class="space-y-4 mb-6">
                <div class="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span class="font-semibold">
                    ${cart.state.subtotal.toFixed(2)}
                  </span>
                </div>

                {cart.state.discount > 0 && (
                  <div class="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span class="font-semibold">
                      -${cart.state.discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div class="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span class="text-sm text-gray-500">
                    Calculated at checkout
                  </span>
                </div>

                <div class="border-t pt-4">
                  <div class="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${cart.state.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick$={() => {
                  // TODO: Implement checkout in Step 7
                  alert('Checkout functionality coming in Step 7!');
                }}
                class="w-full bg-black text-white py-4 rounded-md font-semibold hover:bg-gray-800 transition mb-4"
              >
                Proceed to Checkout
              </button>

              {/* Clear Cart Button */}
              <button
                onClick$={() => {
                  if (confirm('Are you sure you want to clear your cart?')) {
                    cart.actions.clearCart();
                  }
                }}
                class="w-full border border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50 transition"
              >
                Clear Cart
              </button>

              {/* Trust Badges */}
              <div class="mt-6 pt-6 border-t space-y-3">
                <div class="flex items-center text-sm text-gray-600">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Secure Checkout
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Free Shipping Over $100
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  30-Day Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// SEO metadata
export const head: DocumentHead = {
  title: 'Shopping Cart - ReconShop',
  meta: [
    {
      name: 'description',
      content: 'Review and manage your shopping cart items',
    },
  ],
};
