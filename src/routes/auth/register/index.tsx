/**
 * Register Page Route
 * 
 * This is the registration/sign-up page that users visit at /auth/register
 * 
 * For Junior Developers:
 * - This page is very similar to the login page, but uses RegisterForm instead
 * - New users come here to create an account
 * - After successful registration, they may need to verify their email
 * - The flow is: Register → Email Verification → Login → Home
 * 
 * @route /auth/register
 */

import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { RegisterForm } from '~/components/auth/RegisterForm';

/**
 * Register Page Component
 * 
 * This is the main page component for user registration
 */
export default component$(() => {
  return (
    <>
      {/* Main Container - Same styling as login page for consistency */}
      <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Content Card */}
        <div class="max-w-md w-full space-y-8">
          
          {/* Header Section */}
          <div class="text-center">
            {/* Logo/Brand Icon */}
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
            
            {/* Page Title */}
            <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            
            {/* Subtitle with value proposition */}
            <p class="mt-2 text-sm text-gray-600">
              Join thousands of shoppers and start your journey today
            </p>
          </div>

          {/* 
            Benefits Banner (Optional)
            Show users what they get by creating an account
          */}
          <div class="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <h3 class="text-sm font-semibold text-indigo-900 mb-2">
              Why create an account?
            </h3>
            <ul class="text-xs text-indigo-700 space-y-1">
              <li class="flex items-start">
                <svg class="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Track your orders in real-time</span>
              </li>
              <li class="flex items-start">
                <svg class="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Save items to your wishlist</span>
              </li>
              <li class="flex items-start">
                <svg class="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Get personalized recommendations</span>
              </li>
              <li class="flex items-start">
                <svg class="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Faster checkout with saved addresses</span>
              </li>
            </ul>
          </div>

          {/* 
            Register Form Component
            This renders our RegisterForm with all the registration fields
          */}
          <RegisterForm />

          {/* 
            Privacy & Security Notice
          */}
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="flex items-start">
              <svg 
                class="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                />
              </svg>
              <p class="text-xs text-gray-600">
                <strong class="font-semibold">Your privacy matters.</strong> We use industry-standard encryption to protect your data. 
                Your password is hashed and never stored in plain text. We'll never sell your information.
              </p>
            </div>
          </div>

          {/* Additional Links */}
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
 * SEO and browser configuration for the registration page
 */
export const head: DocumentHead = {
  title: 'Create Account - ReconShop',
  meta: [
    {
      name: 'description',
      content: 'Create your free ReconShop account to start shopping, track orders, and get personalized recommendations.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow', // Don't index auth pages in search engines
    },
  ],
};
