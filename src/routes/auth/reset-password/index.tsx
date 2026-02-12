/**
 * Reset Password Page
 * 
 * @route /auth/reset-password
 */

import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { ResetPasswordForm } from '~/components/auth/ResetPasswordForm';

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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Create new password
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Please enter your new password below.
          </p>
        </div>

        <ResetPasswordForm />

        <div class="text-center text-xs text-gray-500">
          <p>
            Secure your account with a strong password.
          </p>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Set New Password - ReconShop',
  meta: [
    {
      name: 'description',
      content: 'Set a new password for your ReconShop account.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
};
