/**
 * UserMenu Component
 *
 * This component displays a dropdown menu for authenticated users.
 * It shows the user's avatar and a menu with options like:
 * - My Account
 * - My Orders
 * - Wishlist
 * - Logout
 *
 * For Junior Developers:
 * - This component uses useSignal to track whether the dropdown is open
 * - The dropdown is triggered by clicking on the user's avatar
 * - Clicking outside the dropdown (on the overlay) closes it
 * - The logout button uses inline onClick$ to handle logout
 */

import { component$, useSignal, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useAuth } from "~/contexts/auth";

/**
 * UserMenu Component
 *
 * Displays user avatar and dropdown menu with account options
 */
export const UserMenu = component$(() => {
  // ============================================================================
  // STATE & HOOKS
  // ============================================================================

  const auth = useAuth();
  const isDropdownOpen = useSignal(false);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Toggle the dropdown open/closed
   */
  const toggleDropdown = $(() => {
    isDropdownOpen.value = !isDropdownOpen.value;
  });

  /**
   * Close the dropdown
   */
  const closeDropdown = $(() => {
    isDropdownOpen.value = false;
  });

  // ============================================================================
  // RENDER
  // ============================================================================

  // Don't render anything if no user is logged in
  if (!auth.user) {
    return null;
  }

  // Get user's display name or email
  const displayName =
    auth.user.user_metadata?.full_name ||
    auth.user.email?.split("@")[0] ||
    "User";

  // Get initials for avatar fallback
  const initials = displayName
    .split(" ")
    .map((name: string) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div class="relative">
      {/* 
        User Avatar Button
        - Clicking this opens/closes the dropdown menu
        - Shows either an avatar image or initials fallback
      */}
      <button
        onClick$={toggleDropdown}
        class="flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
        aria-label="User menu"
        aria-expanded={isDropdownOpen.value}
      >
        {/* 
          Avatar Circle
          - Shows initials as fallback (covers 99% of cases where no avatar_url)
          - 'w-8 h-8': 32x32px avatar
        */}
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
          {initials}
        </div>

        {/* 
          Display Name (hidden on mobile)
          - Shows the user's name or email
          - 'hidden md:block': Only show on medium screens and up
        */}
        <span class="hidden text-sm font-medium text-gray-700 md:inline">
          {displayName}
        </span>

        {/* 
          Chevron Icon (indicates dropdown)
          - Rotates when dropdown is open
        */}
        <svg
          class={`h-4 w-4 text-gray-600 transition-transform ${
            isDropdownOpen.value ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* 
        Dropdown Menu
        - Only visible when isDropdownOpen is true
        - Positioned absolutely below the avatar button
        - Has a nice shadow for depth
      */}
      {isDropdownOpen.value && (
        <>
          {/* 
            Overlay (click outside to close)
            - Semi-transparent background that covers the entire screen
            - Clicking it closes the dropdown
          */}
          <div class="fixed inset-0 z-30" onClick$={closeDropdown} />

          {/* 
            Dropdown Menu Items
            - Positioned above the overlay
            - 'right-0': Aligns to the right of the button
            - 'mt-1': Small gap between button and menu
          */}
          <div class="absolute right-0 z-40 mt-1 w-48 rounded-lg bg-white py-1 shadow-lg">
            {/* 
              User Info Header
              - Shows full name and email
              - Helps user confirm they're logged in with correct account
            */}
            <div class="border-b border-gray-200 px-4 py-2">
              <p class="text-sm font-semibold text-gray-900">{displayName}</p>
              <p class="text-xs text-gray-600">{auth.user.email}</p>
            </div>

            {/* 
              Menu Links
              - Each link has hover state for better UX
              - Icons and labels for clarity
            */}
            <div class="py-1">
              {/* My Account */}
              <Link
                href="/account"
                onClick$={closeDropdown}
                class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>My Account</span>
              </Link>

              {/* My Orders */}
              <Link
                href="/account/orders"
                onClick$={closeDropdown}
                class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>My Orders</span>
              </Link>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                onClick$={closeDropdown}
                class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>Wishlist</span>
              </Link>

              {/* Divider */}
              <div class="my-1 border-t border-gray-200" />

              {/* Logout Button - As a form to avoid serialization issues */}
              <form method="post" action="/api/auth/logout" class="w-full">
                <button
                  type="submit"
                  class="flex w-full items-center space-x-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <svg
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
});
