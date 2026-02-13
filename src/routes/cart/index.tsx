// src/routes/cart/index.tsx

/**
 * CART PAGE
 * 
 * This is the full shopping cart page that users see when they visit /cart
 * 
 * Features:
 * - Full-page cart view with all items
 * - Ability to update quantities inline
 * - Remove items from cart
 * - Empty cart button
 * - Order summary sidebar
 * - Continue shopping link
 * - Proceed to checkout button
 * - Empty cart state with helpful message
 * - Responsive design (mobile-friendly)
 * 
 * This page uses the cart context to display and manage cart items.
 * All changes (quantity updates, removals) are automatically saved to localStorage
 * via the cart context.
 */

import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Link, useNavigate } from '@builder.io/qwik-city';
import { useCart } from '~/contexts/cart';

export default component$(() => {
  // Get cart state and actions from context
  // This gives us access to all cart items and functions to modify them
  const cart = useCart();

  /* 
    NAVIGATION HOOK
    In Qwik City, we use useNavigate() to move between pages programmatically
  */
  const nav = useNavigate();

  /* 
    EMPTY CART STATE
    If the cart is empty, show a helpful message and a button to go shopping
    This prevents showing an empty table or confusing the user
  */
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

          {/* Link back to shop */}
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

  /* 
    CART WITH ITEMS
    If cart has items, show the full cart interface
  */
  return (
    <div class="bg-gray-50 min-h-screen py-8">
      <div class="container mx-auto px-4">
        
        {/* PAGE HEADER */}
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p class="text-gray-600">
            {/* Show singular or plural based on item count */}
            {cart.state.totalItems} {cart.state.totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {/* 
          MAIN GRID LAYOUT
          Uses CSS Grid to create a 2-column layout:
          - Left column (2/3 width): Cart items
          - Right column (1/3 width): Order summary
          On mobile, stacks vertically
        */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 
            LEFT COLUMN: CART ITEMS
            This section shows all the items in the cart
          */}
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Loop through each item in the cart */}
              {cart.state.items.map((item) => {
                // Calculate price considering discount
                const itemPrice = item.discount
                   ? item.price - (item.price * item.discount) / 100
                   : item.price;
                
                // Calculate total for this item (price × quantity)
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div
                    key={`${item.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`}
                    class="flex gap-4 p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    {/* PRODUCT IMAGE */}
                    <div class="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        width={96}
                        height={96}
                        class="w-24 h-24 object-cover rounded-md"
                      />
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div class="flex-1 flex flex-col justify-between">
                      {/* Product Title */}
                      <div>
                        <h3 class="font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>

                        {/* Product Variants (size/color) if they exist */}
                        {(item.selectedSize || item.selectedColor) && (
                          <div class="flex gap-4 text-sm text-gray-600 mb-2">
                            {item.selectedSize && (
                              <span>
                                Size: <strong>{item.selectedSize}</strong>
                              </span>
                            )}
                            {item.selectedColor && (
                              <span>
                                Color: <strong>{item.selectedColor}</strong>
                              </span>
                            )}
                          </div>
                        )}

                        {/* PRICE DISPLAY */}
                        <div class="flex items-center gap-2">
                          {/* Show discount pricing if applicable */}
                          {item.discount && item.discount > 0 ? (
                            <>
                              <span class="text-lg font-bold text-red-600">
                                ${itemPrice.toFixed(2)}
                              </span>
                              <span class="text-sm text-gray-500 line-through">
                                ${item.price.toFixed(2)}
                              </span>
                              <span class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                -{item.discount}%
                              </span>
                            </>
                          ) : (
                            <span class="text-lg font-bold text-gray-900">
                              ${item.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 
                        QUANTITY CONTROLS
                        These buttons allow users to increase/decrease quantity
                        or remove the item entirely
                      */}
                      <div class="flex items-center justify-between mt-4">
                        {/* Quantity Selector */}
                        <div class="flex items-center border border-gray-300 rounded-md">
                          {/* Decrease Quantity Button */}
                          <button
                            onClick$={() => {
                              // Decrease quantity by 1
                              // If quantity becomes 0, the item is automatically removed
                              cart.actions.updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor);
                            }}
                            class="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          
                          {/* Current Quantity Display */}
                          <input
                            type="number"
                            value={item.quantity}
                            onInput$={(e) => {
                              // Allow direct input of quantity
                              const value = parseInt((e.target as HTMLInputElement).value);
                              // Ensure value is at least 1
                              cart.actions.updateQuantity(item.id, value || 1, item.selectedSize, item.selectedColor);
                            }}
                            min="1"
                            max="99"
                            class="w-12 text-center border-x border-gray-300 py-1 focus:outline-none"
                          />
                          
                          {/* Increase Quantity Button */}
                          <button
                            onClick$={() => {
                              // Increase quantity by 1
                              cart.actions.updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor);
                            }}
                            class="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Item Button */}
                        <button
                          onClick$={() => {
                            // Remove this item from cart completely
                            cart.actions.removeItem(item.id, item.selectedSize, item.selectedColor);
                          }}
                          class="text-red-600 hover:text-red-800 text-sm font-medium transition"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* ITEM TOTAL (right side) */}
                    <div class="flex-shrink-0 text-right">
                      <p class="text-lg font-bold text-gray-900">
                        ${itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 
              CONTINUE SHOPPING LINK
              Placed below the cart items
            */}
            <div class="mt-6">
              <Link
                href="/shop"
                class="inline-flex items-center text-gray-700 hover:text-black font-medium transition"
              >
                {/* Left Arrow Icon */}
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

          {/* 
            RIGHT COLUMN: ORDER SUMMARY
            This sticky sidebar shows the order total and checkout button
          */}
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 class="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* SUMMARY DETAILS */}
              <div class="space-y-4 mb-6">
                {/* Subtotal */}
                <div class="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span class="font-semibold">
                    ${cart.state.subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Discount (only show if there's a discount) */}
                {cart.state.discount > 0 && (
                  <div class="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span class="font-semibold">
                      -${cart.state.discount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Shipping (placeholder) */}
                <div class="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span class="text-sm text-gray-500">
                    Calculated at checkout
                  </span>
                </div>

                {/* Total */}
                <div class="border-t pt-4">
                  <div class="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${cart.state.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* CHECKOUT BUTTON */}
              <button
                onClick$={() => {
                  // Redirect to the checkout page
                  nav('/checkout');
                }}
                class="w-full bg-black text-white py-4 rounded-md font-semibold hover:bg-gray-800 transition mb-4"
              >
                Proceed to Checkout
              </button>

              {/* CLEAR CART BUTTON */}
              <button
                onClick$={() => {
                  // Ask for confirmation before clearing cart
                  if (confirm('Are you sure you want to clear your cart?')) {
                    cart.actions.clearCart();
                  }
                }}
                class="w-full border border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50 transition"
              >
                Clear Cart
              </button>

              {/* TRUST BADGES */}
              <div class="mt-6 pt-6 border-t space-y-3">
                {/* Secure Checkout Badge */}
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

                {/* Free Shipping Badge */}
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

                {/* Returns Badge */}
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

/**
 * SEO METADATA
 * 
 * This function provides metadata for the page
 * It's used by search engines and when sharing the page on social media
 */
export const head: DocumentHead = {
  title: 'Shopping Cart - ReconShop',
  meta: [
    {
      name: 'description',
      content: 'Review and manage your shopping cart items',
    },
  ],
};
