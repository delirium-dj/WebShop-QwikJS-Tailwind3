/**
 * Login Page Route
 * 
 * This is the main login page that users visit at /auth/login
 * 
 * For Junior Developers:
 * - In Qwik City, files named `index.tsx` in a folder become the route for that folder
 * - So `src/routes/auth/login/index.tsx` → accessible at `/auth/login`
 * - We import and use the LoginForm component we created earlier
 * - We wrap it in a nice layout with branding and design
 * 
 * Route Structure:
 * /auth/login           ← This file
 * /auth/register        ← Register page (we'll create next)
 * /auth/callback        ← OAuth callback handler
 * /auth/forgot-password ← Password reset request (Phase 5)
 * 
 * @route /auth/login
 */

import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { LoginForm } from '~/components/auth/LoginForm';

/**
 * Login Page Component
 * 
 * This is the main page component that Qwik City will render when users visit /auth/login
 */
export default component$(() => {
  return (
    <>
      {/* 
        Main Container
        - min-h-screen: Make the page at least as tall as the viewport
        - flex: Use flexbox for centering
        - bg-gray-50: Light gray background (professional look)
      */}
      <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        
        {/* 
          Content Card
          - max-w-md: Limit width for better readability
          - w-full: Take full width up to max-w-md
          - space-y-8: Add vertical spacing between children
        */}
        <div class="max-w-md w-full space-y-8">
          
          {/* 
            Header Section
            - Logo and welcome message
          */}
          <div class="text-center">
            {/* 
              Logo/Brand Icon
              You can replace this with your actual logo
            */}
            <div class="flex justify-center">
              <svg
                class="h-12 w-12 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            
            {/* 
              Page Title
            */}
            <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            
            {/* 
              Subtitle
            */}
            <p class="mt-2 text-sm text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* 
            Login Form Component
            This renders our LoginForm with email/password fields and social login buttons
          */}
          <LoginForm />

          {/* 
            Additional Links (Optional)
            You can add links to help center, contact support, etc.
          */}
          <div class="text-center text-xs text-gray-500">
            <p>
              Need help?{' '}
              <a href="/contact" class="text-indigo-600 hover:text-indigo-500">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
});

/**
 * Document Head Export
 * 
 * This configures the <head> section of the HTML document for this page.
 * It's used for SEO and browser tab display.
 * 
 * For Junior Developers:
 * - title: What shows in the browser tab
 * - meta: SEO metadata for search engines and social media
 * - links: Can add canonical URLs, stylesheets, etc.
 */
export const head: DocumentHead = {
  title: 'Sign In - ReconShop',
  meta: [
    {
      name: 'description',
      content: 'Sign in to your ReconShop account to access your orders, wishlist, and personalized shopping experience.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow', // Don't index auth pages in search engines
    },
  ],
};
