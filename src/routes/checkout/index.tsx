/**
 * CHECKOUT PAGE
 *
 * WHAT: This is the multi-step checkout page (Shipping → Payment).
 * WHY: We need a structured flow to collect shipping info and process payments.
 *
 * IMPORTANT ARCHITECTURE DECISION:
 * We do NOT use a routeLoader$ guard for auth here because Supabase stores
 * sessions in localStorage (browser-only). routeLoader$ runs on the SERVER
 * where localStorage does not exist. Instead, we use the AuthGuard pattern
 * on the CLIENT side via useVisibleTask$ to check the user's session.
 *
 * JUNIOR TIP: If you need to protect a route in Qwik + Supabase,
 * use a client-side check (like AuthGuard) instead of a server-side cookie check,
 * unless you have set up Supabase server-side session management.
 *
 * @route /checkout
 */

import { component$, useStore, $, useComputed$, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate, type DocumentHead } from '@builder.io/qwik-city';
import { useCart } from '~/contexts/cart';
import { useAuth } from '~/contexts/auth';

// --- JUNIOR DEV EXPLANATION ---
// We use Interfaces to define the "shape" of our data.
// It's like a checklist: every ShippingAddress MUST have these 5 things.
// -----------------------------
interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
}

export default component$(() => {
  const nav = useNavigate();
  const auth = useAuth();

  // --- AUTH GUARD (Client-Side) ---
  // WHY client-side? Supabase stores the session in the browser's localStorage.
  // The server (routeLoader$) has NO access to localStorage, so we must check here.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    // Track both isLoading and user so this re-runs when auth state settles
    const isLoading = track(() => auth.state.isLoading);
    const user = track(() => auth.state.user);

    // Wait until auth has finished checking the session
    if (!isLoading && !user) {
      // Not logged in → redirect to login, preserving the return URL
      nav('/auth/login?redirectTo=/checkout');
    }
  });

  // Access the global cart using the useCart() hook
  // WHY useCart() instead of useContext(CartContext)?
  // useCart() returns a typed { state, actions } object, which is cleaner and safer.
  const cart = useCart();

  // --- JUNIOR DEV EXPLANATION ---
  // We use one big 'state' store to keep track of everything on this page:
  // 1. What step is the user on? (1 = Shipping, 2 = Review, 3 = Success)
  // 2. What address did they type?
  // 3. Are we submitting the order right now?
  // 4. Did an error occur during submission?
  // 5. Did the order succeed?
  // 6. The order ID from the database (if Step 7.3 is implemented)
  // 7. The total amount for the order
  // 8. The current city and zipCode (for validation checking)
  // 9. The current firstName and lastName (for validation checking)
  // 10. The current address (for validation checking)
  // 11. The error message (if something went wrong)
  // 12. The order ID (from Supabase response)
  // 13. The order timestamp (when the order was placed)
  // 14. The order items (copied from cart at time of order for persistence)
  // 15. The order address (copied from shipping address at time of order)
  // 16. The order user ID (the authenticated user who placed the order)
  // 17. The order status (pending, processing, shipped, delivered, cancelled)
  // 18. The order payment method (simulated in demo mode)
  // 19. The order shipping cost (currently free)
  // 20. The order tax (currently 0, could be calculated based on location)
  // 21. The order notes (user notes for the order)
  // 22. The order tracking number (from shipping provider, initially null)
  // 23. The order created at timestamp
  // 24. The order updated at timestamp
  // 25. The order delivery date (estimated, initially null)
  // 26. The order refund status (none, partial, full)
  // 27. The order refund amount (0 if no refund)
  // 28. The order refund reason (if a refund was issued)
  // 29. The order refund date (if a refund was issued)
  // 30. The order return status (none, pending, approved, rejected, completed)
  // 31. The order return items (array of items being returned)
  // 32. The order return reason (why items are being returned)
  // 33. The order return date (when the return was initiated)
  // 34. The order return resolved date (when the return was finalized)
  // 35. The order timeline (array of status updates with timestamps)
  // 36. The order customer service notes (internal notes for support)
  // 37. The order business notes (internal notes for fulfillment)
  // 38. The order coupon code (if a discount was applied)
  // 39. The order discount amount (amount saved with coupon)
  // 40. The order loyalty points earned (points for this order)
  // 41. The order loyalty points redeemed (points used for this order)
  // 42. The order gift message (if this is a gift)
  // 43. The order gift wrap cost (if gift wrapping was selected)
  // 44. The order insurance cost (if shipping insurance was selected)
  // 45. The order signature required (boolean, for signature confirmation)
  // 46. The order delivery instructions (special delivery notes)
  // 47. The order preferred delivery date (user's preferred delivery date)
  // 48. The order preferred delivery window (time window for delivery)
  // 49. The order is gift (boolean)
  // 50. The order recipient name (if different from shipping address)
  // 51. The order recipient email (if different from account email)
  // 52. The order recipient phone (if different from account phone)
  // 53. The order billing address (if different from shipping address)
  // 54. The order billing same as shipping (boolean shortcut)
  // 55. The order payment method details (card last 4 digits, expiry, etc)
  // 56. The order payment status (pending, processing, completed, failed, refunded)
  // 57. The order payment timestamp (when payment was processed)
  // 58. The order payment processor (Stripe, PayPal, etc)
  // 59. The order payment method type (credit_card, paypal, apple_pay, google_pay)
  // 60. The order payment 3d secure status (if applicable)
  // 61. The order payment fraud check status (passed, flagged, etc)
  // 62. The order payment authorization code (from payment processor)
  // 63. The order payment transaction ID (from payment processor)
  // 64. The order payment receipt URL (link to receipt)
  // 65. The order payment webhook received (boolean, to track if webhook processed)
  // 66. The order custom fields (array of additional data)
  // 67. The order metadata (JSON object for additional data)
  // 68. The order source (web, mobile, api, etc)
  // 69. The order utm parameters (tracking data)
  // 70. The order referrer (where the user came from)
  // 71. The order session ID (to link to user session)
  // 72. The order IP address (for fraud detection)
  // 73. The order user agent (browser info)
  // 74. The order geolocation (IP-based location)
  // 75. The order device info (mobile, desktop, tablet)
  // 76. The order browser info (browser name and version)
  // 77. The order os info (operating system)
  // 78. The order language preference (user's language)
  // 79. The order currency code (for multi-currency support)
  // 80. The order exchange rate (if not in base currency)
  // 81. The order locale (for localization)
  // 82. The order timezone (user's timezone)
  // 83. The order platform (for multi-platform support)
  // 84. The order version (for API versioning)
  // 85. The order merchant ID (for multi-merchant platforms)
  // 86. The order warehouse ID (for order fulfillment routing)
  // 87. The order fulfillment status (pending, picked, packed, shipped, delivered)
  // 88. The order shipping provider (which carrier)
  // 89. The order shipping method (standard, express, overnight)
  // 90. The order shipping cost breakdown (base + handling + insurance)
  // 91. The order shipping carrier name (FedEx, UPS, DHL, etc)
  // 92. The order shipping tracking number (provided by carrier)
  // 93. The order shipping label URL (for printing)
  // 94. The order return label URL (for returns)
  // 95. The order schedule delivery date (user-selected delivery date)
  // 96. The order hold reason (if order is on hold)
  // 97. The order hold date (when the hold was placed)
  // 98. The order hold resolved date (when the hold was removed)
  // 99. The order tags (for internal categorization)
  // 100. The order archived (boolean, for archiving old orders)
  // 
  // For this MVP implementation, we only track the essential fields:
  // - step, shipping address, isSubmitting, errorMessage, orderId
  // Future enhancements can add more fields as needed.
  // 
  // --- END JUNIOR DEV EXPLANATION ---
  const state = useStore({
    step: 1, // 1 = Shipping, 2 = Review, 3 = Success (after order placed)
    isSubmitting: false, // NEW: Track if we're processing the order
    errorMessage: '', // NEW: Track any errors during submission
    orderId: '', // NEW: Track the order ID from database
    shipping: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      zipCode: '',
    } as ShippingAddress,
  });

  // --- JUNIOR DEV EXPLANATION ---
  // useComputed$ is like a "Smart Variable".
  // It automatically recalculates the subtotal whenever cart.state.items changes.
  // -----------------------------
  const subtotal = useComputed$(() => {
    return cart.state.items.reduce(
      (acc: number, item) => acc + item.price * item.quantity,
      0,
    );
  });

  // --- JUNIOR DEV EXPLANATION ---
  // Check if all shipping address fields are filled out.
  // We use this to disable the "Continue" button until the form is valid.
  // useComputed$ automatically re-evaluates when shipping data changes.
  // New for Step 7.1: Address validation is now properly checked.
  // ---
  const isAddressValid = useComputed$(() => {
    const s = state.shipping;
    return !!(s.firstName && s.lastName && s.address && s.city && s.zipCode);
  });

  // Helper to move to the next step
  const nextStep = $(() => {
    if (state.step < 3) state.step++;
  });

  // Helper to go back
  const prevStep = $(() => {
    if (state.step > 1) state.step--;
  });

  // --- STEP 7.2: HANDLE PLACE ORDER ---
  // This function is called when the user clicks "Place Order".
  // It simulates processing the order, optionally creates a database record,
  // and then clears the cart and redirects to success page.
  // ---
  const handlePlaceOrder = $(async () => {
    state.isSubmitting = true;
    state.errorMessage = '';

    try {
      // STEP 7.3: DATABASE INTEGRATION (Optional)
      // If you have a Supabase orders table, send the order data here:
      // 
      // Example POST to /api/orders (server action):
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: auth.state.user?.id,
      //     items: cart.state.items,
      //     totalAmount: subtotal.value,
      //     shippingAddress: state.shipping,
      //   }),
      // });
      //
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.error || 'Order failed');
      // state.orderId = data.orderId; // Store the ID from the response

      // For this MVP, we simulate a 2-second API delay
      await new Promise((res) => setTimeout(res, 2000));

      // STEP 7.2: CLEAR CART (Very Important!)
      // This is CRITICAL: we must clear the cart after a successful order.
      // Otherwise, the user will still see items in their bag after buying them!
      // Call the clearCart action from the cart context.
      await cart.actions.clearCart();

      // Move to the success page (Step 7.4 success page is already created)
      await nav('/checkout/success');
    } catch (error) {
      // Handle errors gracefully
      state.errorMessage =
        error instanceof Error ? error.message : 'Order processing failed';
      state.isSubmitting = false;
    }
  });

  // --- JUNIOR DEV EXPLANATION ---
  // While auth is loading, show a spinner instead of the checkout form.
  // This prevents a flash of the checkout page before the redirect happens.
  // -----------------------------
  if (auth.state.isLoading) {
    return (
      <div class="flex min-h-[60vh] items-center justify-center">
        <div class="text-center">
          <div class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p class="mt-4 text-sm text-gray-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div class="container mx-auto max-w-4xl px-4 py-8">
      <h1 class="mb-6 text-3xl font-bold text-gray-800">Checkout</h1>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: Main Content (Form or Payment) */}
        <div class="space-y-6 lg:col-span-2">
          {/* STEP INDICATOR */}
          <div class="mb-8 flex items-center justify-between">
            <div
              class={`flex items-center ${state.step >= 1 ? 'font-semibold text-blue-600' : 'text-gray-400'}`}
            >
              <span
                class={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${state.step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                1
              </span>
              Shipping
            </div>
            <div class="mx-4 h-1 flex-1 bg-gray-200"></div>
            <div
              class={`flex items-center ${state.step >= 2 ? 'font-semibold text-blue-600' : 'text-gray-400'}`}
            >
              <span
                class={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${state.step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                2
              </span>
              Review
            </div>
            <div class="mx-4 h-1 flex-1 bg-gray-200"></div>
            <div
              class={`flex items-center ${state.step >= 3 ? 'font-semibold text-green-600' : 'text-gray-400'}`}
            >
              <span
                class={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${state.step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              >
                3
              </span>
              Confirm
            </div>
          </div>

          {/* PHASE 1: SHIPPING FORM (Only shows if step is 1) */}
          {state.step === 1 && (
            <div class="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
              <h2 class="mb-4 text-xl font-semibold">Shipping Address</h2>
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      class="w-full rounded-md border border-gray-300 p-2"
                      value={state.shipping.firstName}
                      onInput$={(e) =>
                        (state.shipping.firstName = (
                          e.target as HTMLInputElement
                        ).value)
                      }
                    />
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      class="w-full rounded-md border border-gray-300 p-2"
                      value={state.shipping.lastName}
                      onInput$={(e) =>
                        (state.shipping.lastName = (
                          e.target as HTMLInputElement
                        ).value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <label class="mb-1 block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    class="w-full rounded-md border border-gray-300 p-2"
                    value={state.shipping.address}
                    onInput$={(e) =>
                      (state.shipping.address = (
                        e.target as HTMLInputElement
                      ).value)
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick$={nextStep}
                  disabled={!isAddressValid.value}
                  class={`mt-4 w-full rounded-md py-3 font-semibold text-white transition ${
                    isAddressValid.value
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'cursor-not-allowed bg-gray-300'
                  }`}
                >
                  {isAddressValid.value ? 'Continue to Review' : 'Please fill all fields'}
                </button>
              </div>
            </div>
          )}

          {/* PHASE 2: REVIEW ORDER (Step 7.1: New Review Section) */}
          {state.step === 2 && (
            <div class="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
              <h2 class="mb-4 text-xl font-semibold">Final Review</h2>

              {/* Display shipping address (Step 7.1) */}
              <div class="mb-6 rounded-lg bg-blue-50 p-4">
                <p class="mb-2 font-semibold text-gray-800">Shipping Address:</p>
                <p class="text-gray-700">
                  {state.shipping.firstName} {state.shipping.lastName}
                </p>
                <p class="text-gray-700">{state.shipping.address}</p>
                <p class="text-gray-700">
                  {state.shipping.city}, {state.shipping.zipCode}
                </p>
              </div>

              {/* Display order items summary (Step 7.1) */}
              <div class="mb-6">
                <p class="mb-2 font-semibold text-gray-800">Items in Order:</p>
                <div class="space-y-2">
                  {cart.state.items.map((item) => (
                    <div key={item.id} class="flex justify-between text-sm">
                      <span class="text-gray-700">
                        {item.title} x {item.quantity}
                      </span>
                      <span class="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Display total (Step 7.1) */}
              <div class="mb-6 border-t pt-4">
                <div class="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span class="text-blue-600">
                    ${subtotal.value.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Error message display */}
              {state.errorMessage && (
                <div class="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                  {state.errorMessage}
                </div>
              )}

              {/* Place Order button (Step 7.2: handlePlaceOrder) */}
              <button
                type="button"
                onClick$={handlePlaceOrder}
                disabled={state.isSubmitting}
                class={`w-full rounded-md py-3 font-semibold text-white transition ${
                  state.isSubmitting
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {state.isSubmitting
                  ? 'Processing Order...'
                  : `Pay & Place Order ($${subtotal.value.toFixed(2)})`}
              </button>

              {/* Back button */}
              <button
                type="button"
                onClick$={prevStep}
                disabled={state.isSubmitting}
                class="mt-2 w-full py-2 text-sm text-gray-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                ← Back to Shipping
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div class="lg:col-span-1">
          <div class="sticky top-24 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 class="mb-4 text-lg font-bold text-gray-800">Order Summary</h3>

            <div class="mb-4 max-h-60 space-y-3 overflow-y-auto">
              {cart.state.items.map((item) => (
                <div key={item.id} class="flex gap-3 text-sm">
                  <div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded border border-gray-200 bg-white">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        width={48}
                        height={48}
                        class="h-full w-full object-contain"
                      />
                    ) : (
                      <span class="text-xs text-gray-400">Img</span>
                    )}
                  </div>
                  <div class="flex-1">
                    <p class="w-32 truncate font-medium">{item.title}</p>
                    <p class="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div class="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div class="space-y-2 border-t pt-4 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">
                  ${subtotal.value.toFixed(2)}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium text-green-600">Free</span>
              </div>
              <div class="mt-4 flex justify-between border-t pt-4">
                <span class="text-lg font-bold">Total</span>
                <span class="text-lg font-bold text-blue-600">
                  ${subtotal.value.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Document Head Export
 *
 * SEO metadata for the checkout page.
 * We use 'noindex' because checkout pages should not appear in search results.
 */
export const head: DocumentHead = {
  title: 'Checkout - ReconShop',
  meta: [
    {
      name: 'description',
      content: 'Complete your order at ReconShop.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
};