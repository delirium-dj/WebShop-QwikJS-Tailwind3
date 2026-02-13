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
  // 1. What step is the user on? (1 = Shipping, 2 = Payment)
  // 2. What address did they type?
  // -----------------------------
  const state = useStore({
    step: 1,
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

  // Helper to move to the next step
  const nextStep = $(() => {
    if (state.step < 3) state.step++;
  });

  // Helper to go back
  const prevStep = $(() => {
    if (state.step > 1) state.step--;
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
              Payment
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
                  class="mt-4 w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* PHASE 2: MOCK PAYMENT (Only shows if step is 2) */}
          {state.step === 2 && (
            <div class="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
              <h2 class="mb-4 text-xl font-semibold">Payment Method</h2>
              <div class="mb-6 rounded-md border-2 border-blue-100 bg-blue-50 p-4">
                <p class="text-sm font-medium text-blue-800">
                  🚀 Demo Mode: No real credit card needed!
                </p>
                <p class="mt-1 text-xs text-blue-600">
                  We will simulate a secure transaction for this portfolio
                  project.
                </p>
              </div>

              <div class="space-y-4">
                <button
                  type="button"
                  onClick$={() => alert('Order Placed Successfully!')}
                  class="w-full rounded-md bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Place Order (${subtotal.value.toFixed(2)})
                </button>
                <button
                  type="button"
                  onClick$={prevStep}
                  class="w-full py-2 text-sm text-gray-500 hover:underline"
                >
                  ← Back to Shipping
                </button>
              </div>
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