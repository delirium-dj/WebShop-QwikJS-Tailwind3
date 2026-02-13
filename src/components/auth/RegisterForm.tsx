/**
 * RegisterForm Component
 *
 * WHAT: This is the registration screen where new users sign up.
 * HOW: It uses "signals" to remember what the user types in each box,
 * and calls the `auth.actions.register` function when the button is clicked.
 *
 * JUNIOR TIP:
 * We check passwords for strength (length, numbers, etc.) BEFORE sending them
 * to the server to give the user instant feedback.
 */

import { component$, useSignal, $ } from "@builder.io/qwik";
import { useAuth } from "~/contexts/auth";
import { SocialLoginButtons } from "./SocialLoginButtons";

export const RegisterForm = component$(() => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * FORM FIELDS (Signals)
   * WHAT: `useSignal` creates a piece of data that the UI "watches".
   * WHY: When the user types, the signal updates. When the signal updates,
   * Qwik knows exactly which input box to refresh.
   */
  const fullName = useSignal("");
  const email = useSignal("");
  const password = useSignal("");
  const confirmPassword = useSignal("");

  /**
   * UI REFRESH FLAGS
   * isLoading: Shows a spinner on the button so the user knows to wait.
   * error: Shows a red box if something goes wrong (e.g. email already exists).
   */
  const isLoading = useSignal(false);
  const error = useSignal("");
  const validationErrors = useSignal<string[]>([]);

  // ============================================
  // HOOKS & ACTIONS
  // ============================================
  // Auth context provides both state and actions (register, login, etc.)
  // Navigation after registration is handled by AuthContext.register, not by this component
  const auth = useAuth();

  // ============================================
  // VALIDATION HELPERS
  // ============================================

  /**
   * Validate password strength
   */
  const validatePassword = $((pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8)
      errors.push("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(pwd))
      errors.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(pwd))
      errors.push("Password must contain at least one lowercase letter");
    if (!/[0-9]/.test(pwd))
      errors.push("Password must contain at least one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd))
      errors.push("Password must contain at least one special character");
    return errors;
  });

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Handle form submission
   */
  const handleSubmit$ = $(async (event: Event) => {
    // 1. Double protection: preventdefault:submit on form + event.preventDefault() here
    // This ENSURES no page reload happens, resolving the "clears fields" issue.
    event.preventDefault();

    error.value = "";
    validationErrors.value = [];

    // Client-side validation
    if (fullName.value.trim().length < 2) {
      validationErrors.value = [
        ...validationErrors.value,
        "Full name must be at least 2 characters",
      ];
    }

    const pwdErrors = await validatePassword(password.value);
    if (pwdErrors.length > 0) {
      validationErrors.value = [...validationErrors.value, ...pwdErrors];
    }

    if (password.value !== confirmPassword.value) {
      validationErrors.value = [
        ...validationErrors.value,
        "Passwords do not match",
      ];
    }

    if (validationErrors.value.length > 0) return;

    isLoading.value = true;

    try {
      /**
       * Call the register action from our Auth Context.
       * The AuthContext.register function handles:
       * 1. Calling Supabase signUp
       * 2. Creating profile in our DB (non-critical)
       * 3. Navigating to '/' (if auto-confirmed) or '/auth/verify-email' (if confirmation needed)
       *
       * If it throws, we catch the error below and display it.
       */
      await auth.actions.register({
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        displayName: fullName.value,
      });

      // If we reach here without an error, the AuthContext already navigated
      // No additional navigation needed from the form
    } catch (err) {
      console.error("Registration error:", err);
      // Display the error from Auth Context (set by register action) or use a local fallback
      error.value =
        auth.state.error ||
        (err instanceof Error
          ? err.message
          : "Registration failed. Please try again.");
    } finally {
      isLoading.value = false;
    }
  });

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div class="w-full max-w-md">
      {/* Error Alert Box */}
      {error.value && (
        <div
          class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4"
          role="alert"
        >
          <div class="flex items-start">
            <svg
              class="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="flex-1">
              <p class="font-semibold text-red-800">{error.value}</p>
              {error.value.includes("already registered") && (
                <p class="mt-1 text-xs text-red-700">
                  <a
                    href="/auth/login"
                    class="font-semibold underline hover:no-underline"
                  >
                    Sign in with this email
                  </a>{" "}
                  or{" "}
                  <a
                    href="/auth/forgot-password"
                    class="font-semibold underline hover:no-underline"
                  >
                    reset your password
                  </a>
                </p>
              )}
              {error.value.includes("Network error") && (
                <p class="mt-1 text-xs text-red-700">
                  Please check your internet connection and try again.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Validation Errors List */}
      {validationErrors.value.length > 0 && (
        <div
          class="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4"
          role="alert"
        >
          <div class="flex items-start">
            <svg
              class="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="flex-1">
              <p class="mb-2 font-semibold text-yellow-800">
                Please fix the following:
              </p>
              <ul class="list-inside list-disc space-y-1">
                {validationErrors.value.map((err, index) => (
                  <li key={index} class="text-xs text-yellow-700">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form */}
      {/* 
        CRITICAL: 'preventdefault:submit' is Qwik's way to prevent native form submission.
        In Qwik, event.preventDefault() inside a $() handler is UNRELIABLE because
        the handler is lazy-loaded — the browser may fire native submit before it runs.
        This attribute tells Qwik to prevent the default at the framework level FIRST.
      */}
      <form
        id="register-form"
        preventdefault:submit
        onSubmit$={handleSubmit$}
        class="space-y-6"
      >
        {/* Full Name Input */}
        <div>
          <label
            for="fullName"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="register-fullname-input"
            type="text"
            required
            autoComplete="name"
            bind:value={fullName}
            class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="John Doe"
            disabled={isLoading.value}
          />
          <p class="mt-1 text-xs text-gray-500">
            This is how your name will appear on your profile
          </p>
        </div>

        {/* Email Input */}
        <div>
          <label
            for="email"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            bind:value={email}
            class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="you@example.com"
            disabled={isLoading.value}
          />
          <p class="mt-1 text-xs text-gray-500">
            We'll send a verification email to this address
          </p>
        </div>

        {/* Password Input */}
        <div>
          <label
            for="password"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            bind:value={password}
            class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
            disabled={isLoading.value}
          />
          <p class="mt-1 text-xs text-gray-500">
            Must be at least 8 characters with uppercase, lowercase, number, and
            special character
          </p>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label
            for="confirmPassword"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            bind:value={confirmPassword}
            class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
            disabled={isLoading.value}
          />
        </div>

        {/* Terms of Service Checkbox */}
        <div class="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            class="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            disabled={isLoading.value}
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            I agree to the{" "}
            <a href="/terms" class="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" class="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading.value}
          class="flex w-full items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading.value ? (
            <>
              <svg
                class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Divider */}
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div class="mt-6">
        <SocialLoginButtons mode="register" />
      </div>

      {/* Sign In Link */}
      <p class="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a
          href="/auth/login"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </a>
      </p>
    </div>
  );
});
