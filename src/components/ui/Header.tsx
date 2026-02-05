// src/components/header/Header.tsx
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { MobileMenu } from './MobileMenu';
import { CartBadge } from '../cart/CartBadge';

/**
 * Main Header Component
 * Includes logo, desktop navigation, and mobile menu
 */
export const Header = component$(() => {
  // Define navigation links
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header class="sticky top-0 z-40 w-full bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" class="flex items-center space-x-2">
            <span class="text-2xl font-bold text-gray-900">ReconShop</span>
          </Link>

          {/* 
              Grouped Actions & Navigation on the right:
              - We move the desktop links here to follow the 'links on far right' layout.
              - Cart remains slightly to the left of the links.
          */}
          <div class="flex items-center space-x-6">
            {/* Search Icon - Optional */}
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

            {/* Functional Cart Badge (restored to use global state) */}
            <div class="hidden lg:block">
               <CartBadge />
            </div>

            {/* Desktop Navigation - Moved to the far right */}
            <nav class="hidden lg:flex items-center space-x-6">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  class="text-sm font-bold text-gray-600 hover:text-black uppercase tracking-widest transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Component (Hamburger) */}
            <MobileMenu links={navLinks} />
          </div>
        </div>
      </div>
    </header>
  );
});
