// src/components/header/HeaderWithDropdown.tsx
// ALTERNATIVE VERSION: Uses dropdown menu instead of slide-in drawer
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { MobileMenuDropdown } from './MobileMenuDropdown';

/**
 * Header Component with Dropdown Mobile Menu
 * Alternative to slide-in drawer
 */
export const HeaderWithDropdown = component$(() => {
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header class="sticky top-0 z-40 w-full bg-white shadow-sm">
      <div class="relative">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" class="flex items-center space-x-2">
              <span class="text-2xl font-bold text-gray-900">ReconShop</span>
            </Link>

            {/* Desktop Navigation */}
            <nav class="hidden lg:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  class="text-gray-700 hover:text-black font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div class="flex items-center space-x-4">
              {/* Search Icon */}
              <button
                class="hidden md:block p-2 text-gray-700 hover:text-black transition-colors"
                aria-label="Search"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Cart Icon - Desktop */}
              <Link
                href="/cart"
                class="hidden lg:block p-2 text-gray-700 hover:text-black transition-colors relative"
                aria-label="Shopping cart"
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </Link>

              {/* Mobile Menu Dropdown */}
              <MobileMenuDropdown links={navLinks} />
            </div>
          </div>
        </div>

        {/* Mobile Menu renders here (absolute positioned) */}
      </div>
    </header>
  );
});
