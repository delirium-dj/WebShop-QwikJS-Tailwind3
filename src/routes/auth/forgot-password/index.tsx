/**
 * Forgot Password Page
 * 
 * @route /auth/forgot-password
 */

import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { ForgotPasswordForm } from '~/components/auth/ForgotPasswordForm';

export default component$(() => {
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Don't worry, even the best of us forget things sometimes.
          </p>
        </div>

        <ForgotPasswordForm />

        <div class="text-center text-xs text-gray-500">
          <p>
            Need more help?{' '}
            <a href="/contact" class="text-indigo-600 hover:text-indigo-500 font-medium">
              Contact our support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Forgot Password - ReconShop',
  meta: [
    {
      name: 'description',
      content: 'Request a password reset link for your ReconShop account.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
};
