/**
 * OAuth Callback Handler Route
 * 
 * This page handles the OAuth redirect after a user authenticates with a provider like Google.
 * 
 * For Junior Developers - The OAuth Flow:
 * 
 * 1. User clicks "Sign in with Google" on /auth/login
 * 2. Our app calls supabase.auth.signInWithOAuth({ provider: 'google' })
 * 3. User is redirected to Google's login page (they leave our site temporarily)
 * 4. User logs in with their Google account
 * 5. Google redirects back to THIS PAGE (/auth/callback) with a special code
 * 6. This page exchanges that code for a session token using Supabase
 * 7. User is now logged in and redirected to the home page
 * 
 * Why do we need this page?
 * - OAuth providers need a "callback URL" to redirect users back to
 * - This URL must be registered in your OAuth provider's settings
 * - Supabase needs to exchange the OAuth code for a session
 * - We handle any errors that might occur during this process
 * 
 * @route /auth/callback
 */

import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate, type DocumentHead } from '@builder.io/qwik-city';

/**
 * Callback Page Component
 * 
 * This page doesn't show much UI - it just processes the OAuth callback
 * and redirects the user. We show a loading state while processing.
 */
export default component$(() => {
  const nav = useNavigate();

  /**
   * useVisibleTask$ runs client-side code when the component becomes visible
   * 
   * For Junior Developers:
   * - In Qwik, most code runs on the server (SSR)
   * - useVisibleTask$ tells Qwik "run this code in the browser"
   * - We need browser APIs like window.location to read URL parameters
   * - This is similar to useEffect in React, but optimized for Qwik
   * 
   * The 'eager' strategy means this runs immediately when the page loads
   */
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    async () => {
      /**
       * Get the current URL parameters
       * After OAuth redirect, the URL looks like:
       * /auth/callback#access_token=xxx&refresh_token=yyy
       * or
       * /auth/callback?code=xxx&state=yyy
       */
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);

      /**
       * Check if there's an OAuth error
       * If the user cancels the OAuth login, providers send an error parameter
       */
      const error = hashParams.get('error') || queryParams.get('error');
      const errorDescription =
        hashParams.get('error_description') || queryParams.get('error_description');

      if (error) {
        console.error('OAuth error:', error, errorDescription);
        await nav(
          `/auth/login?error=${encodeURIComponent(errorDescription || 'Authentication failed')}`
        );
        return;
      }

      /**
       * IMPORTANT FIX: Instead of a single 500ms timeout, we poll Supabase
       * directly using supabase.auth.getSession() in a loop.
       *
       * WHY? The old code waited 500ms and then checked auth.state.user.
       * But Google OAuth often takes longer than 500ms for Supabase to:
       *   1. Exchange the OAuth code for tokens
       *   2. Create or find the user record
       *   3. Fire onAuthStateChange (which updates our AuthContext)
       *
       * If the 500ms expired before step 3 finished, auth.state.user was
       * still null, and the user got a false "Authentication failed" error.
       *
       * JUNIOR TIP: Think of this like checking your mailbox every 30 seconds
       * instead of checking once after 30 seconds and giving up.
       */
      const { supabase } = await import('~/lib/supabase');

      // Poll up to 10 times (every 500ms = max 5 seconds total)
      const MAX_ATTEMPTS = 10;
      let session = null;

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          session = data.session;
          console.log('OAuth session confirmed on attempt', attempt + 1);
          break;
        }
        // Wait 500ms before next check
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (session) {
        console.log('User logged in via OAuth:', session.user.email);

        /**
         * Check for a redirect URL stored before OAuth redirect
         * Example: User tries to access /account → redirected to login →
         *          login with Google → return to /account
         */
        const redirectTo = sessionStorage.getItem('auth_redirect') || '/';
        sessionStorage.removeItem('auth_redirect');

        await nav(redirectTo);
      } else {
        /**
         * If we still don't have a session after all attempts, something
         * genuinely went wrong (network issue, revoked tokens, etc.)
         */
        console.error('OAuth callback: no session found after polling');
        await nav('/auth/login?error=' + encodeURIComponent('Authentication failed. Please try again.'));
      }
    },
    { strategy: 'document-ready' }
  );

  // ============================================================================
  // RENDER
  // ============================================================================
  
  /**
   * Loading UI
   * Show a spinner and message while processing the OAuth callback
   * Users will only see this for a brief moment
   */
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        {/* Loading Spinner */}
        <div class="inline-block">
          <svg
            class="animate-spin h-12 w-12 text-indigo-600"
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
        </div>

        {/* Loading Message */}
        <h2 class="mt-4 text-xl font-semibold text-gray-900">
          Completing sign in...
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Please wait while we set up your account
        </p>

        {/* 
          Progress Indicator (Optional)
          You could animate this or show actual progress steps
        */}
        <div class="mt-6 max-w-xs mx-auto">
          <div class="overflow-hidden h-2 text-xs flex rounded bg-indigo-200">
            <div 
              class="animate-pulse bg-indigo-600 transition-all duration-300"
              style="width: 100%"
            />
          </div>
        </div>

        {/* Debug Info (Remove in production) */}
        {/* <p class="mt-4 text-xs text-gray-500">
          If you're stuck here, check the browser console for errors
        </p> */}
      </div>
    </div>
  );
});

/**
 * Document Head Export
 */
export const head: DocumentHead = {
  title: 'Completing Sign In - ReconShop',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
};
