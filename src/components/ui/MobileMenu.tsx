// src/components/header/MobileMenu.tsx
import { component$, useSignal, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useCart } from "~/contexts/cart"; // To show item count in the menu
import { useAuth } from "~/contexts/auth"; // Access auth context
import { CartIcon } from "./icons/CartIcon";
import { CartCountBadge } from "../cart/CartCountBadge";

// We define what a single link looks like so TypeScript knows what to expect.
type NavLink = {
  label: string;
  href: string;
};

// These are the "Props" we expect to receive from the parent Header component.
type MobileMenuProps = {
  links: NavLink[];
  /**
   * Whether to show authentication buttons/menu in the mobile menu
   * This allows the Header to control whether auth is displayed
   */
  showAuth?: boolean;
};

/**
 * Mobile Hamburger Menu Component
 * This is the magic drawer that slides in from the right when you tap the hamburger icon on a phone.
 */
export const MobileMenu = component$<MobileMenuProps>(
  ({ links, showAuth = false }) => {
    // Access the cart state to show the number of items
    const cart = useCart();

    // Access auth state for displaying login/register buttons or user menu
    const auth = useAuth();

    // 'useSignal' is Qwik's way of creating a reactive variable.
    // 'isOpen' tracks whether our menu drawer is currently visible or hidden.
    const isOpen = useSignal(false);

    // This function toggles the menu open/closed when the hamburger button is clicked.
    const toggleMenu = $(() => {
      isOpen.value = !isOpen.value;

      // Prevent body scroll when menu is open:
      // If the menu is open, we set 'overflow: hidden' on the body so the background doesn't move
      // when the user scrolls inside the menu. This creates a much smoother experience.
      if (typeof document !== "undefined") {
        if (isOpen.value) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      }
    });

    // A simple function to force the menu to close.
    // We call this when a user clicks a link or the background overlay.
    const closeMenu = $(() => {
      isOpen.value = false;
      // Always remember to restore scrolling when the menu goes away!
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    });

    return (
      <>
        {/* 
          Hamburger Toggle Button
          - 'relative z-50': Keeps the button above the drawer so you can always tap it.
          - 'lg:hidden': This button only shows up on mobile/tablet screens. 
            On large desktop screens, the standard navigation is shown instead.
      */}
        <button
          onClick$={toggleMenu}
          class="relative z-50 p-2 text-gray-700 transition-colors hover:text-black lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen.value}
        >
          {/* 
            Animated Hamburger Icon:
            We use three <span> elements and rotate/fade them based on 'isOpen.value' 
            to create the transition from 3 lines to an "X".
        */}
          <div class="flex h-5 w-6 flex-col justify-between">
            <span
              class={`h-0.5 w-full origin-center bg-current transition-all duration-300 ${
                isOpen.value ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              class={`h-0.5 w-full bg-current transition-all duration-300 ${
                isOpen.value ? "scale-0 opacity-0" : "scale-100 opacity-100"
              }`}
            />
            <span
              class={`h-0.5 w-full origin-center bg-current transition-all duration-300 ${
                isOpen.value ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>

        {/* 
          Overlay (Backdrop):
          - This is the dark, semi-transparent layer that appears behind the drawer.
          - BUG FIX NOTE: We use 'w-[100vw]' and 'ml-[calc(50%-50vw)]' to ensure this overlay 
            covers the ENTIRE screen, even if the browser has reserved space for a scrollbar 
            (scrollbar-gutter: stable). This prevents a tiny "white gap" on the left side.
      */}
        {isOpen.value && (
          <div
            onClick$={closeMenu}
            class="fixed bottom-0 left-0 right-0 top-0 z-40 h-[100vh] w-[100vw] bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden"
            style="margin-left: calc(50% - 50vw);"
            aria-hidden="true"
          />
        )}

        {/* 
          Mobile Menu Drawer:
          - 'fixed top-0 right-0': Pins the drawer to the right edge of the screen.
          - 'transform transition-transform': Makes the drawer slide smoothly.
          - 'translate-x-full' / 'translate-x-0': Controls whether the drawer is hidden off-screen 
            or fully visible based on our 'isOpen' state.
      */}
        <div
          class={`fixed right-0 top-0 z-50 h-full w-80 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
            isOpen.value ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Menu Header with Title and Close Button */}
          <div class="flex items-center justify-between border-b border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900">Menu</h2>
            <button
              onClick$={closeMenu}
              class="p-2 text-gray-500 transition-colors hover:text-gray-900"
              aria-label="Close menu"
            >
              <svg
                class="h-6 w-6"
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

          {/* Navigation Links list */}
          <nav class="p-6">
            <ul class="space-y-1">
              {links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    onClick$={closeMenu} // Close the menu immediately when a link is clicked
                    class="block rounded-md px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Menu Footer: Quick shortcut to the cart and auth buttons */}
          <div class="absolute bottom-0 left-0 right-0 space-y-3 border-t border-gray-200 p-6">
            {/* 
            Cart Link (always shown)
          */}
            <Link
              href="/cart"
              onClick$={closeMenu}
              class="flex w-full items-center justify-center rounded-md bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800"
            >
              <div class="relative mr-2">
                <CartIcon class="h-5 w-5" />
                <CartCountBadge
                  count={cart.state.totalItems}
                  class="absolute -right-2 -top-2 h-[16px] min-w-[16px] text-[10px]"
                />
              </div>
              View Cart
            </Link>

            {/* 
            Authentication Section (shown only if showAuth is true)
          */}
            {showAuth && (
              <>
                {/* If user is NOT logged in, show Sign In and Sign Up buttons */}
                {!auth.state.user && !auth.state.isLoading && (
                  <div class="space-y-2 pt-2">
                    <a
                      href="/auth/login/"
                      class="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
                    >
                      Sign In
                    </a>
                    <a
                      href="/auth/register/"
                      class="flex w-full items-center justify-center rounded-md border border-indigo-600 px-4 py-3 font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
                    >
                      Sign Up
                    </a>
                  </div>
                )}

                {/* If user IS logged in, show user menu items */}
                {auth.state.user && !auth.state.isLoading && (
                  <div class="space-y-2 border-t border-gray-200 pt-2">
                    {/* User Info */}
                    <div class="text-xs text-gray-600">
                      <p class="font-semibold text-gray-900">
                        {auth.state.user.user_metadata?.full_name ||
                          auth.state.user.email?.split("@")[0] ||
                          "User"}
                      </p>
                      <p class="truncate text-gray-600">{auth.state.user.email}</p>
                    </div>

                    {/* Account Links */}
                    <Link
                      href="/account"
                      onClick$={closeMenu}
                      class="flex w-full items-center rounded-md px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <svg
                        class="mr-2 h-4 w-4"
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
                      My Account
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick$={closeMenu}
                      class="flex w-full items-center rounded-md px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <svg
                        class="mr-2 h-4 w-4"
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
                      My Orders
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick$={async () => {
                        await auth.actions.logout();
                        closeMenu();
                      }}
                      class="flex w-full items-center justify-center rounded-md border border-red-200 px-4 py-3 font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <svg
                        class="mr-2 h-4 w-4"
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
                      Logout
                    </button>
                  </div>
                )}

                {/* Loading state */}
                {auth.state.isLoading && (
                  <div class="flex items-center justify-center py-3">
                    <div class="h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  },
);
