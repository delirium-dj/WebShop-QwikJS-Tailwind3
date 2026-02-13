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

import { component$, $, useTask$, type PropFunction } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { useCart } from "~/contexts/cart";

// Define the props (properties) this component accepts
type CartDrawerProps = {
  isOpen: boolean; // Controls whether drawer is visible
  onClose: PropFunction<() => void>; // Function to call when closing drawer
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
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
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
    if (typeof document !== "undefined") {
      if (isOpen) {
        // Drawer is open - disable scrolling
        document.body.style.overflow = "hidden";
      } else {
        // Drawer is closed - enable scrolling
        document.body.style.overflow = "";
      }
    }
  });

  /**
   * Handle removing an item from the cart
   * This is passed to each cart item's remove button
   */
  const handleRemoveItem = $(
    (itemId: number, size?: string, color?: string) => {
      cart.actions.removeItem(itemId, size, color);
    },
  );

  // In Qwik City, we use useNavigate() to move between pages programmatically
  const nav = useNavigate();

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
          id="cart-drawer-overlay"
          onClick$={handleClose}
          class="fixed inset-0 z-[90] bg-black bg-opacity-50 transition-opacity duration-300"
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
        id="cart-drawer"
        class={`fixed right-0 top-0 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "z-[100] translate-x-0" : "pointer-events-none z-0 translate-x-full"} `}
      >
        {/* 
          DRAWER HEADER
          Contains the title and close button
        */}
        <div class="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 class="text-2xl font-bold text-gray-900">
            Shopping Cart ({cart.state.totalItems})
          </h2>

          {/* Close button - clicking this closes the drawer */}
          <button
            id="cart-drawer-close-btn"
            onClick$={handleClose}
            class="rounded-full p-2 transition-colors hover:bg-gray-100"
            aria-label="Close cart"
          >
            <svg
              class="h-6 w-6 text-gray-600"
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
        <div
          class="flex-1 overflow-y-auto p-6"
          style="max-height: calc(100vh - 250px)"
        >
          {/* 
            EMPTY CART STATE
            Shows when there are no items in the cart
          */}
          {cart.state.items.length === 0 ? (
            <div class="flex h-full flex-col items-center justify-center py-12 text-center">
              {/* Empty cart icon */}
              <svg
                class="mb-4 h-24 w-24 text-gray-300"
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

              <h3 class="mb-2 text-xl font-semibold text-gray-700">
                Your cart is empty
              </h3>

              <p class="mb-6 text-gray-500">
                Add some products to get started!
              </p>

              {/* Button to close drawer and continue shopping */}
              <button
                id="cart-drawer-continue-btn"
                onClick$={handleClose}
                class="rounded-md bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
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
                    key={`${item.id}-${item.selectedSize || ""}-${item.selectedColor || ""}`}
                    class="flex gap-4 rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                  >
                    {/* Product Image */}
                    <div class="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        class="h-20 w-20 rounded-md object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div class="min-w-0 flex-1">
                      {/* Product Title */}
                      <h3 class="mb-1 truncate font-semibold text-gray-900">
                        {item.title}
                      </h3>

                      {/* Product Variants (size, color) if they exist */}
                      {(item.selectedSize || item.selectedColor) && (
                        <div class="mb-2 flex gap-3 text-sm text-gray-600">
                          {item.selectedSize && (
                            <span>Size: {item.selectedSize}</span>
                          )}
                          {item.selectedColor && (
                            <span>Color: {item.selectedColor}</span>
                          )}
                        </div>
                      )}

                      {/* Price Information */}
                      <div class="mb-2 flex items-center gap-2">
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
                          onClick$={() =>
                            handleRemoveItem(
                              item.id,
                              item.selectedSize,
                              item.selectedColor,
                            )
                          }
                          class="text-sm font-medium text-red-600 transition-colors hover:text-red-800"
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
          <div class="border-t border-gray-200 bg-gray-50 p-6">
            {/* Order Summary */}
            <div class="mb-6 space-y-3">
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
              <div class="flex justify-between border-t pt-3 text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${cart.state.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div class="space-y-3">
              {/* View Full Cart Button */}
              <Link
                id="cart-drawer-view-btn"
                href="/cart"
                onClick$={handleClose}
                class="block w-full rounded-md bg-gray-900 py-3 text-center font-semibold text-white transition-colors hover:bg-black"
              >
                View Full Cart
              </Link>

              {/* Checkout Button */}
              <button
                id="cart-drawer-checkout-btn"
                onClick$={() => {
                  handleClose();
                  // Redirect to the checkout page
                  nav("/checkout");
                }}
                class="w-full rounded-md bg-black py-3 font-semibold text-white transition-colors hover:bg-gray-800"
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
