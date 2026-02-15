// src/components/header/Header.tsx
import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { MobileMenu } from "./MobileMenu"; // This is our custom slide-in menu for mobile devices
import { CartBadge } from "../cart/CartBadge"; // This displays the cart icon and the real-time item count
import { useAuth } from "~/contexts/auth"; // Access auth context to check login state
import { UserMenu } from "../auth/UserMenu"; // User avatar dropdown menu

/**
 * Main Header Component
 * This is the primary navigation bar shown at the top of every page.
 * It's "sticky", meaning it stays at the top as the user scrolls.
 */
export const Header = component$(() => {
  // ============================================================================
  // STATE & HOOKS
  // ============================================================================

  /**
   * Get auth state to check if user is logged in
   * The auth context is set up in src/routes/layout.tsx with <AuthProvider>
   */
  const auth = useAuth();

  // We define our navigation links in an array so we can easily add/remove them
  // in one place and have them update in both Desktop and Mobile views.
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    // 'sticky top-0': Keeps the header locked at the top of the browser window.
    // 'z-40': Ensures it stays above page content but below heavy overlays like the mobile drawer.
    <header
      id="main-header"
      class="sticky top-0 z-40 w-full bg-white shadow-sm"
    >
      <div class="container mx-auto px-4">
        {/* We use 'justify-between' to push the Logo to the left and everything else to the right. */}
        <div class="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link id="header-logo" href="/" class="flex items-center space-x-2">
            <span class="text-2xl font-bold text-gray-900">ReconShop</span>
          </Link>

          {/* 
              Right-Side Group (Actions & Navigation):
              - We group the Cart, Desktop Links, and Hamburger Menu together here.
              - 'space-x-6': Adds uniform horizontal spacing between these elements.
          */}
          <div class="flex items-center space-x-2 md:space-x-6">
            {/* 
                Search Icon:
                - 'hidden md:block': We hide this on very small screens to keep the header clean,
                  showing it only from 'medium' (tablet) sizes up.
            */}
            <button
              id="header-search-btn"
              class="hidden p-2 text-gray-700 transition-colors hover:text-black md:block"
              aria-label="Search"
            >
              <svg
                class="h-5 w-5"
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

            {/* 
                Functional Cart Badge:
                - This component is tied to our Qwik Cart Context. 
                - Whenever an item is added, this icon will update automatically.
                - We now show this on both mobile and desktop as per user request.
            */}
            <CartBadge />

            {/* 
                Desktop Navigation:
                - 'hidden lg:flex': This is the magic Tailwind class that hide this navigation 
                  on mobile/tablets and only shows it on 'Large' screens (Desktop).
            */}
            <nav class="hidden items-center space-x-6 lg:flex">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  // 'uppercase tracking-widest': Gives that clean, high-end e-commerce aesthetic.
                  class="text-sm font-bold uppercase tracking-widest text-gray-600 transition-colors hover:text-black"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* 
                Authentication Section (Desktop Only)
                - Show different content based on login state
                - 'hidden md:flex': Hide on mobile, show on medium screens and up
            */}
            <div class="hidden items-center space-x-4 md:flex">
              {/* 
                If user is NOT logged in, show Login/Register buttons
              */}
              {!auth.state.user && !auth.state.isLoading && (
                <>
                  <a
                    href="/auth/login/"
                    class="text-sm font-semibold text-gray-600 transition-colors hover:text-black"
                  >
                    Sign In
                  </a>
                  <a
                    href="/auth/register/"
                    class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    Sign Up
                  </a>
                </>
              )}

              {/* 
                If user IS logged in, show user menu dropdown
              */}
              {auth.state.user && !auth.state.isLoading && <UserMenu />}

              {/* 
                If auth is loading, show a loading placeholder
              */}
              {auth.state.isLoading && (
                <div class="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
              )}
            </div>

            {/* 
                Mobile Menu (Hamburger):
                - This component contains the logic for the drawer that slides in from the right.
                - It only appears when the Desktop Navigation (above) is hidden.
                - We pass auth state so it can also show auth buttons/menu on mobile
                - JUNIOR NOTE: We filter the links here to hide 'About' on mobile ONLY.
            */}
            <MobileMenu 
              links={navLinks.filter(link => link.label !== "About")} 
              showAuth={true} 
            />
          </div>
        </div>
      </div>
    </header>
  );
});
