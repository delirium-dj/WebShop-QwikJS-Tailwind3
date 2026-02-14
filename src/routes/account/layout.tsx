/**
 * Account Section Layout
 * 
 * This layout wraps ALL pages under the /account/* route.
 * It provides authentication protection using the AuthGuard component.
 * 
 * For Junior Developers:
 * - Layouts in Qwik City work like "wrappers" around pages
 * - Any page in the /account/ folder gets wrapped by this layout
 * - Think of it like Russian nesting dolls:
 *   Root Layout → Account Layout → Page Content
 * 
 * File Location: src/routes/account/layout.tsx
 * 
 * Protected Routes:
 * - /account → User profile/dashboard
 * - /account/orders → Order history (future)
 * - /account/wishlist → User wishlist (future)
 * - /account/addresses → Saved addresses (future)
 * 
 * How Qwik City Routing Works:
 * ```
 * src/routes/
 * ├── layout.tsx              ← Root layout (wraps everything)
 * └── account/
 *     ├── layout.tsx           ← This file (wraps /account/* pages)
 *     ├── index.tsx            ← /account page
 *     ├── orders/
 *     │   └── index.tsx        ← /account/orders page
 *     └── wishlist/
 *         └── index.tsx        ← /account/wishlist page
 * ```
 */

import { component$, Slot } from '@builder.io/qwik';
import { Link, type RequestHandler } from '@builder.io/qwik-city';
import { AuthGuard } from '~/components/auth/AuthGuard';
import { useAuth } from '~/contexts/auth';

/**
 * Server-Side Request Handler
 * 
 * This runs on the SERVER before the page loads.
 * We can use it for:
 * - Server-side authentication checks
 * - Setting HTTP headers
 * - Logging
 * - Rate limiting
 * 
 * For now, we keep it simple and let the client-side AuthGuard handle auth.
 * But in production, you might want to add server-side checks here too.
 */
export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching
  // Don't cache authenticated pages to prevent showing stale user data
  cacheControl({
    staleWhileRevalidate: 0,
    maxAge: 0,
    sMaxAge: 0,
    public: false,
  });
};

/**
 * Account Layout Component
 * 
 * Provides the structure and navigation for the account section.
 */
export default component$(() => {
  // Get auth context to access user info
  const auth = useAuth();

  return (
    // Account Section Container
    <div class="min-h-screen bg-gray-50">
      {/* Account Header/Navigation */}
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            {/* Welcome Message */}
            <div class="md:flex md:items-center md:justify-between">
              <div class="flex-1 min-w-0">
                <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
                  My Account
                </h1>
                {auth.state.user && (
                  <p class="mt-1 text-sm text-gray-500">
                    Welcome back, {auth.state.user.displayName || auth.state.user.email}!
                  </p>
                )}
              </div>
              
              {/* Quick Actions (future: could add buttons here) */}
              <div class="mt-4 flex md:mt-0 md:ml-4">
                {/* Example: Quick access buttons could go here */}
              </div>
            </div>
          </div>

          {/* Account Navigation Tabs */}
          <nav class="-mb-px flex space-x-8" aria-label="Account sections">
            {/* Profile Tab */}
            <Link
              href="/account"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              aria-current="page"
            >
              <div class="flex items-center">
                <svg
                  class="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </div>
            </Link>

            {/* Orders Tab (Future) */}
            <Link
              href="/account/orders"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              <div class="flex items-center">
                <svg
                  class="mr-2 h-5 w-5"
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
                Orders
                {/* Badge for pending orders (future) */}
                {/* <span class="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">3</span> */}
              </div>
            </Link>

            {/* Wishlist Tab (Future) */}
            <Link
              href="/account/wishlist"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              <div class="flex items-center">
                <svg
                  class="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Wishlist
              </div>
            </Link>

            {/* Addresses Tab (Future) */}
            <Link
              href="/account/addresses"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              <div class="flex items-center">
                <svg
                  class="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Addresses
              </div>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/**
         * <Slot /> renders the actual page content
         * 
         * Whatever page is being viewed gets rendered here:
         * - /account → renders account/index.tsx
         * - /account/orders → renders account/orders/index.tsx
         * - etc.
         */}
        <AuthGuard redirectTo="/auth/login">
            <Slot />
        </AuthGuard>
      </main>

      {/* Optional: Account Section Footer */}
      <footer class="bg-white border-t mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>Need help? <a href="/contact" class="text-blue-600 hover:text-blue-500">Contact Support</a></p>
            <p class="mt-2 sm:mt-0">
              <button
                onClick$={auth.actions.logout}
                class="text-red-600 hover:text-red-500 font-medium"
              >
                Logout
              </button>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
});
