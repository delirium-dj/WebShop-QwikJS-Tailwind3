// src/components/header/MobileMenu.tsx
import { component$, useSignal, $ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

type NavLink = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  links: NavLink[];
};

/**
 * Mobile Hamburger Menu Component
 * Slides in from the right on mobile devices
 */
export const MobileMenu = component$<MobileMenuProps>(({ links }) => {
  const isOpen = useSignal(false);

  const toggleMenu = $(() => {
    isOpen.value = !isOpen.value;
    
    // Prevent body scroll when menu is open
    if (typeof document !== 'undefined') {
      if (!isOpen.value) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  });

  const closeMenu = $(() => {
    isOpen.value = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  });

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick$={toggleMenu}
        class="lg:hidden p-2 text-gray-700 hover:text-black transition-colors relative z-50"
        aria-label="Toggle menu"
        aria-expanded={isOpen.value}
      >
        {/* Animated Hamburger Icon */}
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

      {/* Overlay - Darkens background when menu is open */}
      {isOpen.value && (
        <div
          onClick$={closeMenu}
          class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        class={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen.value ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Menu Header */}
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

        {/* Navigation Links */}
        <nav class="p-6">
          <ul class="space-y-1">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  onClick$={closeMenu}
                  class="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-black rounded-md transition-colors font-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Optional: Menu Footer with additional actions */}
        <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div class="space-y-3">
            <Link
              href="/cart"
              onClick$={closeMenu}
              class="flex items-center justify-center w-full px-4 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
});
