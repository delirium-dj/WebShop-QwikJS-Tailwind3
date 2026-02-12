// src/components/cart/CartDrawer.tsx

/**
 * CartDrawer Component
 * 
 * This is a slide-in shopping cart drawer that appears from the right side of the screen.
 * It provides a quick preview of cart items without leaving the current page.
 * 
 * Features:
 * - Slides in from right when opened
 * - Shows all cart items with thumbnails
 * - Displays order summary (subtotal, discounts, total)
 * - Allows removing items
 * - Links to full cart page
 * - Overlay that darkens the background
 * - Body scroll lock when open (prevents background scrolling)
 * 
 * Usage:
 * <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
 */

import { component$, $, useTask$, type PropFunction } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { useCart } from '~/contexts/cart';

// Define the props (properties) this component accepts
type CartDrawerProps = {
  isOpen: boolean;                      // Controls whether drawer is visible
  onClose: PropFunction<() => void>;    // Function to call when closing drawer
};

export const CartDrawer = component$<CartDrawerProps>(({ isOpen, onClose }) => {
  // Get cart data and actions from our cart context
  // This gives us access to all items, totals, and cart functions
  const cart = useCart();

  /**
   * Handle closing the drawer
   * This function is called when:
   * - User clicks the X button
   * - User clicks the overlay
   * - User clicks "View Cart" or "Checkout"
   */
  const handleClose = $(async () => {
    await onClose();
    
    // Re-enable body scrolling when drawer closes
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  });

  /**
   * Lock/unlock body scroll when drawer opens/closes
   * This prevents the page from scrolling in the background
   * when the drawer is open, improving UX
   */
  useTask$(({ track }) => {
    // Track changes to isOpen prop
    track(() => isOpen);
    
    // Only run on client-side (not during server-side rendering)
    if (typeof document !== 'undefined') {
      if (isOpen) {
        // Drawer is open - disable scrolling
        document.body.style.overflow = 'hidden';
      } else {
        // Drawer is closed - enable scrolling
        document.body.style.overflow = '';
      }
    }
  });

  /**
   * Handle removing an item from the cart
   * This is passed to each cart item's remove button
   */
  const handleRemoveItem = $((itemId: number, size?: string, color?: string) => {
    cart.actions.removeItem(itemId, size, color);
  });

  return (
    <>
      {/* 
        OVERLAY
        This is the semi-transparent dark background that appears behind the drawer
        Clicking it will close the drawer
      */}
      {/* 
        JUNIOR TIP: 
        We use a high z-index (z-[90]) for the overlay so it covers the 
        sticky header (z-40) and mobile menu components.
      */}
      {isOpen && (
        <div
          onClick$={handleClose}
          class="fixed inset-0 bg-black bg-opacity-50 z-[90] transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* 
        JUNIOR TIP: 
        The drawer container needs a z-index of 100 (z-[100]) to override 
        the mobile menu button and header. 
        
        We also add 'pointer-events-none' when it's closed to make 
        absolutely sure it doesn't "accidentally" catch any clicks 
        while it's hidden off-screen.
      */}
      <div
        class={`
          fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 z-[100]' : 'translate-x-full z-0 pointer-events-none'}
        `}
      >
        {/* 
          DRAWER HEADER
          Contains the title and close button
        */}
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">
            Shopping Cart ({cart.state.totalItems})
          </h2>
          
          {/* Close button - clicking this closes the drawer */}
          <button
            onClick$={handleClose}
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 
          CART CONTENT
          This is the scrollable area containing cart items
          Uses flex-1 to take up all available space between header and footer
        */}
        <div class="flex-1 overflow-y-auto p-6" style="max-height: calc(100vh - 250px)">
          {/* 
            EMPTY CART STATE
            Shows when there are no items in the cart
          */}
          {cart.state.items.length === 0 ? (
            <div class="flex flex-col items-center justify-center h-full text-center py-12">
              {/* Empty cart icon */}
              <svg
                class="w-24 h-24 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              
              <h3 class="text-xl font-semibold text-gray-700 mb-2">
                Your cart is empty
              </h3>
              
              <p class="text-gray-500 mb-6">
                Add some products to get started!
              </p>
              
              {/* Button to close drawer and continue shopping */}
              <button
                onClick$={handleClose}
                class="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            /* 
              CART ITEMS LIST
              Shows all items currently in the cart
              Each item is rendered in a loop
            */
            <div class="space-y-4">
              {cart.state.items.map((item) => {
                // Calculate the price for this item (considering discounts)
                const itemPrice = item.discount
                  ? item.price - (item.price * item.discount) / 100
                  : item.price;
                
                // Calculate the total for this item (price × quantity)
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div
                    key={`${item.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`}
                    class="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div class="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        class="w-20 h-20 object-cover rounded-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div class="flex-1 min-w-0">
                      {/* Product Title */}
                      <h3 class="font-semibold text-gray-900 truncate mb-1">
                        {item.title}
                      </h3>

                      {/* Product Variants (size, color) if they exist */}
                      {(item.selectedSize || item.selectedColor) && (
                        <div class="flex gap-3 text-sm text-gray-600 mb-2">
                          {item.selectedSize && (
                            <span>Size: {item.selectedSize}</span>
                          )}
                          {item.selectedColor && (
                            <span>Color: {item.selectedColor}</span>
                          )}
                        </div>
                      )}

                      {/* Price Information */}
                      <div class="flex items-center gap-2 mb-2">
                        {/* Show discounted price if discount exists */}
                        {item.discount && item.discount > 0 ? (
                          <>
                            <span class="font-bold text-red-600">
                              ${itemPrice.toFixed(2)}
                            </span>
                            <span class="text-sm text-gray-500 line-through">
                              ${item.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span class="font-bold text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Quantity and Remove Button */}
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        
                        {/* Remove Item Button */}
                        <button
                          onClick$={() => handleRemoveItem(item.id, item.selectedSize, item.selectedColor)}
                          class="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item Total (price × quantity) */}
                    <div class="flex-shrink-0 font-bold text-gray-900">
                      ${itemTotal.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 
          DRAWER FOOTER
          Contains order summary and action buttons
          Only shows if cart has items
        */}
        {cart.state.items.length > 0 && (
          <div class="border-t border-gray-200 p-6 bg-gray-50">
            {/* Order Summary */}
            <div class="space-y-3 mb-6">
              {/* Subtotal */}
              <div class="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span class="font-semibold">
                  ${cart.state.subtotal.toFixed(2)}
                </span>
              </div>

              {/* Discount (only show if there is a discount) */}
              {cart.state.discount > 0 && (
                <div class="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span class="font-semibold">
                    -${cart.state.discount.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Total */}
              <div class="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                <span>Total</span>
                <span>${cart.state.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div class="space-y-3">
              {/* View Full Cart Button */}
              <Link
                href="/cart"
                onClick$={handleClose}
                class="block w-full bg-gray-900 text-white text-center py-3 rounded-md font-semibold hover:bg-black transition-colors"
              >
                View Full Cart
              </Link>

              {/* Checkout Button */}
              <button
                onClick$={() => {
                  handleClose();
                  // TODO: Navigate to checkout page (Step 7)
                  alert('Checkout functionality coming in Step 7!');
                }}
                class="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
});
