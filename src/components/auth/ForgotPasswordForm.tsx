/**
 * ForgotPasswordForm Component
 * 
 * This component allows users to request a password reset email.
 * 
 * For Junior Developers:
 * - We collect the user's email address
 * - We call auth.actions.resetPassword(email) which tells Supabase to send the email
 * - We show a success message after the request is submitted
 */

import { component$, useSignal, $ } from '@builder.io/qwik';
import { useAuth } from '~/contexts/auth';

export const ForgotPasswordForm = component$(() => {
  // ============================================
  // STATE
  // ============================================
  
  const email = useSignal('');
  const isLoading = useSignal(false);
  const error = useSignal('');
  const isSubmitted = useSignal(false);

  // ============================================
  // HOOKS
  // ============================================
  
  const auth = useAuth();

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleSubmit$ = $(async (event: Event) => {
    event.preventDefault();
    error.value = '';
    isLoading.value = true;

    try {
      await auth.actions.resetPassword(email.value);
      isSubmitted.value = true;
    } catch (err) {
      console.error('Forgot password error:', err);
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Failed to request password reset. Please try again.';
      }
    } finally {
      isLoading.value = false;
    }
  });

  // ============================================
  // RENDER
  // ============================================
  
  if (isSubmitted.value) {
    return (
      <div class="text-center p-6 bg-green-50 rounded-lg border border-green-200">
        <svg
          class="mx-auto h-12 w-12 text-green-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h3 class="text-lg font-medium text-green-900 mb-2">Check your email</h3>
        <p class="text-sm text-green-700">
          We've sent a password reset link to <strong>{email.value}</strong>. 
          Please check your inbox and follow the instructions.
        </p>
        <div class="mt-6">
          <a
            href="/auth/login"
            class="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Back to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="w-full max-w-md">
      {error.value && (
        <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error.value}
        </div>
      )}

      <form preventdefault:submit onSubmit$={handleSubmit$} class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            bind:value={email}
            disabled={isLoading.value}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="you@example.com"
          />
          <p class="mt-1 text-xs text-gray-500">
            Enter the email associated with your account and we'll send you a link to reset your password.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading.value}
          class="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading.value ? (
            <>
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending link...
            </>
          ) : (
            'Send reset link'
          )}
        </button>

        <div class="text-center">
          <a
            href="/auth/login"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Suddenly remembered? Back to login
          </a>
        </div>
      </form>
    </div>
  );
});
