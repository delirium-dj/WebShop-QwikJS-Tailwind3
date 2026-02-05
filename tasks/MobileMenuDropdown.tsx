// src/components/header/MobileMenuDropdown.tsx
// ALTERNATIVE VERSION: Dropdown from top instead of slide from right
import { component$, useSignal, $ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

type NavLink = {
  label: string;
  href: string;
};

type MobileMenuDropdownProps = {
  links: NavLink[];
};

/**
 * Mobile Dropdown Menu Component
 * Drops down from the top on mobile devices
 */
export const MobileMenuDropdown = component$<MobileMenuDropdownProps>(({ links }) => {
  const isOpen = useSignal(false);

  const toggleMenu = $(() => {
    isOpen.value = !isOpen.value;
  });

  const closeMenu = $(() => {
    isOpen.value = false;
  });

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick$={toggleMenu}
        class="lg:hidden p-2 text-gray-700 hover:text-black transition-colors"
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

      {/* Dropdown Menu */}
      <div
        class={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen.value ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav class="container mx-auto px-4 py-4">
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

          {/* Mobile Cart Button */}
          <div class="mt-4 pt-4 border-t border-gray-200">
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
        </nav>
      </div>

      {/* Overlay for dropdown */}
      {isOpen.value && (
        <div
          onClick$={closeMenu}
          class="lg:hidden fixed inset-0 bg-black bg-opacity-30 z-30"
          style="top: 4rem" // Start below header
          aria-hidden="true"
        />
      )}
    </>
  );
});
