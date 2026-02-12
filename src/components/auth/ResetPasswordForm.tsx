/**
 * ResetPasswordForm Component
 * 
 * This component allows users to set a new password after clicking a recovery link.
 * 
 * For Junior Developers:
 * - This form is accessed after the user clicks the link in their email
 * - Supabase creates a recovery session automatically when the link is clicked
 * - We check if the user is authenticated (recovery session) before showing the form
 * - On success, we redirect them to the login page
 */

import { component$, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { useAuth } from '~/contexts/auth';

export const ResetPasswordForm = component$(() => {
  // ============================================
  // STATE
  // ============================================
  
  const password = useSignal('');
  const confirmPassword = useSignal('');
  const isLoading = useSignal(false);
  const error = useSignal('');
  const success = useSignal(false);

  // ============================================
  // HOOKS
  // ============================================
  
  const auth = useAuth();
  const nav = useNavigate();

  /**
   * Security Check:
   * On mount, check if we actually have a session.
   * If someone tries to access /auth/reset-password directly, they shouldn't see the form.
   */
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    // Small delay to let AuthContext initialize if it's still loading
    const timeout = setTimeout(() => {
      if (!auth.isLoading && !auth.user) {
        error.value = 'Invalid or expired reset link. Please request a new one.';
      }
    }, 1000);
    cleanup(() => clearTimeout(timeout));
  });

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleSubmit$ = $(async (event: Event) => {
    event.preventDefault();
    error.value = '';
    
    // Basic validation
    if (password.value.length < 8) {
      error.value = 'Password must be at least 8 characters long.';
      return;
    }

    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match.';
      return;
    }

    isLoading.value = true;

    try {
      /**
       * Call auth.actions.updatePassword()
       * This uses Supabase's auth.updateUser({ password: '...' }) internally
       */
      await auth.actions.updatePassword(password.value);
      success.value = true;
      
      // Logout the user after password change for security
      // and to force them to log in with the new password
      await auth.actions.logout();
      
      // Small delay before redirecting to login
      setTimeout(() => {
        nav('/auth/login?reset=success');
      }, 3000);
      
    } catch (err) {
      console.error('Reset password error:', err);
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Failed to update password. Please try again.';
      }
    } finally {
      isLoading.value = false;
    }
  });

  // ============================================
  // RENDER
  // ============================================
  
  if (success.value) {
    return (
      <div class="text-center p-6 bg-indigo-50 rounded-lg border border-indigo-200">
        <svg
          class="mx-auto h-12 w-12 text-indigo-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="text-lg font-medium text-indigo-900 mb-2">Password Updated!</h3>
        <p class="text-sm text-indigo-700">
          Your password has been successfully updated. You will be redirected to the login page in a few seconds...
        </p>
        <div class="mt-6">
          <a
            href="/auth/login"
            class="text-sm font-semibold text-indigo-600 hover:text-indigo-500 underline"
          >
            Go to login now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="w-full max-w-md">
      {error.value && (
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600 font-medium">{error.value}</p>
          {error.value.includes('link') && (
            <div class="mt-2">
              <a href="/auth/forgot-password" class="text-xs text-red-700 underline font-semibold">
                Request a new link
              </a>
            </div>
          )}
        </div>
      )}

      {/* Only show form if there's no fatal error (like invalid link) */}
      {!error.value.includes('link') && (
        <form onSubmit$={handleSubmit$} class="space-y-6">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              bind:value={password}
              disabled={isLoading.value}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              bind:value={confirmPassword}
              disabled={isLoading.value}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
            />
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
                Updating...
              </>
            ) : (
              'Set new password'
            )}
          </button>
        </form>
      )}
    </div>
  );
});
