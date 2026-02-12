/**
 * LoginForm Component
 *
 * This component renders a login form that allows users to sign in using:
 * 1. Email and password (traditional login)
 * 2. Social login providers (Google, etc.) via the SocialLoginButtons component
 *
 * For Junior Developers:
 * - This is a Qwik component, so we use `component$` to define it
 * - We use `useSignal()` to create reactive state variables (like React's useState)
 * - Event handlers use the `$` suffix (e.g., `handleSubmit$`) to tell Qwik to optimize them
 * - The form prevents default submission and handles it via our auth context
 *
 * @example
 * <LoginForm />
 */

import { component$, useSignal, $ } from "@builder.io/qwik";
import { useNavigate, useLocation, Link } from "@builder.io/qwik-city";
import { useAuth } from "~/contexts/auth";
import { SocialLoginButtons } from "./SocialLoginButtons";

export const LoginForm = component$(() => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Form field signals - these hold the current values of our input fields.
   * useSignal() creates a reactive variable that Qwik can track.
   * When these values change, the component re-renders automatically.
   */
  const email = useSignal("");
  const password = useSignal("");

  /**
   * UI state signals - these track the state of our form submission.
   * - isLoading: Shows a spinner while we're waiting for the login to complete
   * - error: Stores any error message to display to the user
   */
  const isLoading = useSignal(false);
  const error = useSignal("");

  // ============================================================================
  // HOOKS
  // ============================================================================

  /**
   * Access the authentication context.
   * This gives us access to auth.actions.login() which communicates with Supabase.
   */
  const auth = useAuth();

  /**
   * Navigation function - allows us to programmatically redirect users.
   * After successful login, we'll redirect them to the homepage or their previous page.
   */
  const nav = useNavigate();

  /**
   * Get current location to extract redirect URL from query parameters
   * Example: /auth/login?redirect=/account
   */
  const location = useLocation();

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle form submission
   *
   * This function:
   * 1. Prevents the default HTML form submission (which would refresh the page)
   * 2. Sets loading state to show a spinner
   * 3. Calls our auth context's login function
   * 4. Redirects on success or shows an error message on failure
   *
   * The `$` suffix tells Qwik to lazy-load this function only when needed.
   */
  const handleSubmit$ = $(async (event: Event) => {
    // Prevent the default form submission behavior (page reload)
    event.preventDefault();

    // Clear any previous error messages
    error.value = "";

    // Show loading spinner
    isLoading.value = true;

    try {
      // Attempt to log in using the auth context
      // This will call Supabase's signInWithPassword method
      await auth.actions.login({
        email: email.value,
        password: password.value,
      });

      /**
       * On successful login, redirect the user.
       *
       * Check for a 'redirect' query parameter in the URL so we can send users
       * back to the page they were trying to access.
       * Example: /auth/login?redirect=/account
       *
       * If no redirect is specified, default to the homepage.
       */
      const redirectUrl = location.url.searchParams.get("redirect") || "/";

      // Validate the redirect URL to prevent open redirect vulnerabilities
      // Only allow relative URLs (starting with /)
      const safeRedirectUrl = redirectUrl.startsWith("/") ? redirectUrl : "/";

      await nav(safeRedirectUrl);
    } catch (err) {
      /**
       * If login fails, Supabase will throw an error.
       * We catch it here and display a user-friendly message.
       *
       * Common errors:
       * - "Invalid login credentials" - Wrong email or password
       * - "Email not confirmed" - User hasn't verified their email yet
       */
      console.error("Login error:", err);

      // Type-safe error message extraction with user-friendly formatting
      if (err instanceof Error) {
        const errorMsg = err.message.toLowerCase();

        // Provide user-friendly error messages based on common Supabase errors
        if (errorMsg.includes("invalid") || errorMsg.includes("credentials")) {
          error.value = "Invalid email or password. Please try again.";
        } else if (
          errorMsg.includes("email") &&
          errorMsg.includes("not confirmed")
        ) {
          error.value =
            "Please verify your email address first. Check your inbox for the verification link.";
        } else if (errorMsg.includes("user not found")) {
          error.value =
            "No account found with this email address. Please sign up first.";
        } else if (errorMsg.includes("network") || errorMsg.includes("fetch")) {
          error.value =
            "Network error. Please check your connection and try again.";
        } else {
          error.value = err.message;
        }
      } else {
        error.value = "An unexpected error occurred. Please try again.";
      }
    } finally {
      // Always hide the loading spinner when done (success or failure)
      isLoading.value = false;
    }
  });

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div class="w-full max-w-md">
      {/* 
        Error Alert Box
        Only displays when error.value is not empty
        Shows icon, error message, and helpful context
      */}
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
              {(error.value.includes("Invalid email") ||
                error.value.includes("credentials")) && (
                <p class="mt-1 text-xs text-red-700">
                  Tip: Check that your email and password are correct.{" "}
                  <a
                    href="/auth/forgot-password"
                    class="font-semibold underline hover:no-underline"
                  >
                    Forgot your password?
                  </a>
                </p>
              )}
              {error.value.includes("verify your email") && (
                <p class="mt-1 text-xs text-red-700">
                  Didn't receive the email?{" "}
                  <a
                    href="/auth/verify-email"
                    class="font-semibold underline hover:no-underline"
                  >
                    Click here to resend it
                  </a>
                </p>
              )}
              {error.value.includes("No account found") && (
                <p class="mt-1 text-xs text-red-700">
                  <a
                    href="/auth/register"
                    class="font-semibold underline hover:no-underline"
                  >
                    Create a new account
                  </a>{" "}
                  to get started.
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

      {/* 
        Main Login Form
        - onSubmit$ triggers our handleSubmit$ function
        - The $ suffix tells Qwik to optimize this event handler
      */}
      <form onSubmit$={handleSubmit$} class="space-y-6">
        {/* Email Input Field */}
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
            /**
             * bind:value creates a two-way binding between the input and our signal.
             * When the user types, email.value updates automatically.
             * When email.value changes programmatically, the input updates too.
             */
            bind:value={email}
            class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="you@example.com"
            /**
             * Disable the input while loading to prevent users from
             * changing values mid-submission
             */
            disabled={isLoading.value}
          />
        </div>

        {/* Password Input Field */}
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
            autoComplete="current-password"
            bind:value={password}
            class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
            disabled={isLoading.value}
          />
        </div>

        {/* Forgot Password Link */}
        <div class="flex items-center justify-between">
          <Link
            href={
              location.url.searchParams.get("redirect")
                ? `/auth/forgot-password?redirect=${encodeURIComponent(location.url.searchParams.get("redirect")!)}`
                : "/auth/forgot-password"
            }
            class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading.value}
          class="flex w-full items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {/* 
            Conditional rendering based on loading state:
            - Show spinner + "Signing in..." when loading
            - Show "Sign In" when not loading
          */}
          {isLoading.value ? (
            <>
              {/* 
                Loading Spinner
                This is a simple CSS animation using Tailwind's animate-spin
              */}
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* 
        Divider with "Or continue with" text
        This separates email login from social login options
      */}
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

      {/* 
        Social Login Buttons Component
        This will render buttons for Google, GitHub, etc.
      */}
      <div class="mt-6">
        <SocialLoginButtons mode="login" />
      </div>

      {/* 
        Sign Up Link
        For users who don't have an account yet
      */}
      <p class="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <a
          href="/auth/register"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign up for free
        </a>
      </p>
    </div>
  );
});
