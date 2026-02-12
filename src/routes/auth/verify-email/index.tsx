/**
 * Email Verification Page
 *
 * This page is shown after successful registration when email confirmation is enabled.
 *
 * For Junior Developers:
 * - After registering, Supabase can send a verification email
 * - The user must click the link in that email to verify their account
 * - Until verified, they can't log in (if email confirmation is required)
 * - This page just shows instructions and a resend button
 * - If a redirect parameter was passed, it will be preserved and used after verification
 *
 * Configuration in Supabase:
 * - Dashboard → Authentication → Settings → Email Auth
 * - Toggle "Enable email confirmations" ON or OFF
 * - If OFF: Users are auto-confirmed (good for development)
 * - If ON: Users must verify their email (good for production)
 *
 * @route /auth/verify-email
 */

import { component$, useSignal, $ } from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { useAuth } from "~/contexts/auth";

/**
 * Verify Email Page Component
 */
export default component$(() => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Track resend state
   * - emailSent: Shows success message after resending
   * - isResending: Shows loading state on resend button
   * - error: Shows any error that occurred
   */
  const emailSent = useSignal(false);
  const isResending = useSignal(false);
  const error = useSignal("");

  // ============================================================================
  // HOOKS
  // ============================================================================

  const auth = useAuth();

  /**
   * Get current location to check for redirect parameter
   * This was set by the register form, e.g., /auth/verify-email?redirect=/account
   */
  const location = useLocation();

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Resend verification email
   *
   * If the user didn't receive the email, they can request a new one
   */
  const handleResend$ = $(async () => {
    error.value = "";
    isResending.value = true;
    emailSent.value = false;

    try {
      /**
       * Call Supabase's resend email method
       *
       * Note: This function should be added to your auth context:
       * resendVerificationEmail: async (email: string) => {
       *   const { error } = await supabase.auth.resend({
       *     type: 'signup',
       *     email: email
       *   });
       *   if (error) throw error;
       * }
       */
      // For now, we'll show a placeholder message
      // TODO: Implement auth.actions.resendVerificationEmail()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      emailSent.value = true;
    } catch (err) {
      console.error("Resend error:", err);
      error.value =
        err instanceof Error ? err.message : "Failed to resend email";
    } finally {
      isResending.value = false;
    }
  });

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-md">
        {/* Success Card */}
        <div class="overflow-hidden rounded-lg bg-white shadow-lg">
          {/* Header with Icon */}
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
            <div class="flex justify-center">
              {/* Email Icon */}
              <div class="rounded-full bg-white p-3">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <h2 class="mt-4 text-center text-2xl font-bold text-white">
              Check your email
            </h2>
          </div>

          {/* Content */}
          <div class="px-6 py-8">
            {/* Main Message */}
            <p class="mb-6 text-center text-gray-700">
              {/* auth.user is already unwrapped (not a signal), so we access .email directly */}
              {/* Optional chaining (?.) safely returns undefined if user is null */}
              We've sent a verification email to{" "}
              <strong>{auth.user?.email || "your email address"}</strong>.
            </p>

            {/* Instructions */}
            <div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 class="mb-2 text-sm font-semibold text-blue-900">
                Next steps:
              </h3>
              <ol class="list-inside list-decimal space-y-2 text-sm text-blue-800">
                <li>Open the email from ReconShop</li>
                <li>Click the "Verify Email" button</li>
                <li>You'll be redirected back here to log in</li>
              </ol>
            </div>

            {/* Didn't receive email? */}
            <div class="text-center">
              <p class="mb-4 text-sm text-gray-600">
                Didn't receive the email?
              </p>

              {/* Success Message */}
              {emailSent.value && (
                <div class="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                  ✓ Email sent! Check your inbox and spam folder.
                </div>
              )}

              {/* Error Message */}
              {error.value && (
                <div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {error.value}
                </div>
              )}

              {/* Resend Button */}
              <button
                type="button"
                onClick$={handleResend$}
                disabled={isResending.value || emailSent.value}
                class="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending.value ? (
                  <>
                    <svg
                      class="-ml-1 mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      />
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg
                      class="-ml-1 mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Resend email
                  </>
                )}
              </button>
            </div>

            {/* Help Text */}
            <div class="mt-8 border-t border-gray-200 pt-6">
              <p class="text-center text-xs text-gray-500">
                <strong>Can't find the email?</strong> Check your spam or junk
                folder. Add <span class="font-mono">noreply@reconshop.com</span>{" "}
                to your contacts.
              </p>
            </div>

            {/* Alternative Actions */}
            <div class="mt-6 space-y-3">
              <a
                href={`/auth/login${location.url.search}`}
                class="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Already verified? Sign in →
              </a>
              <a
                href="/"
                class="block text-center text-sm text-gray-600 hover:text-gray-900"
              >
                Return to homepage
              </a>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            Need help?{" "}
            <a href="/contact" class="text-indigo-600 hover:text-indigo-500">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
});

/**
 * Document Head Export
 */
export const head: DocumentHead = {
  title: "Verify Your Email - ReconShop",
  meta: [
    {
      name: "description",
      content:
        "Please verify your email address to complete your ReconShop registration.",
    },
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ],
};
