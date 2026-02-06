// src/components/header/MobileMenu.tsx
import { component$, useSignal, $ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { useCart } from '~/contexts/cart'; // To show item count in the menu
import { CartIcon } from './icons/CartIcon';
import { CartCountBadge } from '../cart/CartCountBadge';

// We define what a single link looks like so TypeScript knows what to expect.
type NavLink = {
  label: string;
  href: string;
};

// These are the "Props" we expect to receive from the parent Header component.
type MobileMenuProps = {
  links: NavLink[];
};

/**
 * Mobile Hamburger Menu Component
 * This is the magic drawer that slides in from the right when you tap the hamburger icon on a phone.
 */
export const MobileMenu = component$<MobileMenuProps>(({ links }) => {
  // Access the cart state to show the number of items
  const cart = useCart();

  // 'useSignal' is Qwik's way of creating a reactive variable. 
  // 'isOpen' tracks whether our menu drawer is currently visible or hidden.
  const isOpen = useSignal(false);

  // This function toggles the menu open/closed when the hamburger button is clicked.
  const toggleMenu = $(() => {
    isOpen.value = !isOpen.value;
    
    // Prevent body scroll when menu is open:
    // If the menu is open, we set 'overflow: hidden' on the body so the background doesn't move 
    // when the user scrolls inside the menu. This creates a much smoother experience.
    if (typeof document !== 'undefined') {
      if (isOpen.value) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  });

  // A simple function to force the menu to close. 
  // We call this when a user clicks a link or the background overlay.
  const closeMenu = $(() => {
    isOpen.value = false;
    // Always remember to restore scrolling when the menu goes away!
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
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
        class="lg:hidden p-2 text-gray-700 hover:text-black transition-colors relative z-50"
        aria-label="Toggle menu"
        aria-expanded={isOpen.value}
      >
        {/* 
            Animated Hamburger Icon:
            We use three <span> elements and rotate/fade them based on 'isOpen.value' 
            to create the transition from 3 lines to an "X".
        */}
        <div class="w-6 h-5 flex flex-col justify-between">
          <span
            class={`w-full h-0.5 bg-current transition-all duration-300 origin-center ${
              isOpen.value ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            class={`w-full h-0.5 bg-current transition-all duration-300 ${
              isOpen.value ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
            }`}
          />
          <span
            class={`w-full h-0.5 bg-current transition-all duration-300 origin-center ${
              isOpen.value ? '-rotate-45 -translate-y-2' : ''
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
          class="fixed top-0 left-0 right-0 bottom-0 w-[100vw] h-[100vh] bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
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
        class={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen.value ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Menu Header with Title and Close Button */}
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Menu</h2>
          <button
            onClick$={closeMenu}
            class="p-2 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Close menu"
          >
            <svg
              class="w-6 h-6"
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
                  class="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-black rounded-md transition-colors font-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Menu Footer: Quick shortcut to the cart */}
        <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div class="space-y-3">
            <Link
              href="/cart"
              onClick$={closeMenu}
              class="flex items-center justify-center w-full px-4 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              <div class="relative mr-2">
                <CartIcon class="w-5 h-5" />
                <CartCountBadge 
                  count={cart.state.totalItems} 
                  class="absolute -top-2 -right-2 min-w-[16px] h-[16px] text-[10px]" 
                />
              </div>
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
});
