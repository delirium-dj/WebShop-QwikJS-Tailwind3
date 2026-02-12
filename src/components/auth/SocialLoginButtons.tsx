/**
 * SocialLoginButtons Component
 * 
 * This component renders buttons for third-party authentication providers like Google, GitHub, etc.
 * 
 * For Junior Developers:
 * - OAuth (Open Authorization) lets users log in using their existing accounts from other services
 * - When a user clicks "Sign in with Google", they're redirected to Google's login page
 * - After authenticating with Google, they're redirected back to our app
 * - Supabase handles all the complexity of OAuth tokens and session management
 * - We just need to call supabase.auth.signInWithOAuth()
 * 
 * How OAuth Flow Works:
 * 1. User clicks "Sign in with Google" on our site
 * 2. We call supabase.auth.signInWithOAuth({ provider: 'google' })
 * 3. Supabase redirects user to Google's login page
 * 4. User logs in with their Google account
 * 5. Google redirects back to our /auth/callback page with a code
 * 6. Our callback page exchanges the code for a session token
 * 7. User is now logged in!
 * 
 * @example
 * <SocialLoginButtons mode="login" />
 * <SocialLoginButtons mode="register" />
 */

import { component$, useSignal, $, type PropFunction } from '@builder.io/qwik';
import { useAuth } from '~/contexts/auth';

/**
 * Component Props Interface
 * 
 * @property mode - Determines the button text:
 *   - "login" → "Sign in with Google"
 *   - "register" → "Sign up with Google"
 */
interface SocialLoginButtonsProps {
  mode: 'login' | 'register';
  onError$?: PropFunction<(error: string) => void>;
}

export const SocialLoginButtons = component$<SocialLoginButtonsProps>(({ mode, onError$ }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /**
   * Loading state for each provider
   * We use an object to track which button is loading
   */
  const loadingProvider = useSignal<string | null>(null);

  // ============================================================================
  // HOOKS
  // ============================================================================
  
  const auth = useAuth();

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle social login/register
   * 
   * @param provider - The OAuth provider name (e.g., 'google', 'github')
   * 
   * This function:
   * 1. Sets loading state for the clicked provider
   * 2. Calls Supabase's OAuth sign-in method
   * 3. Supabase automatically redirects to the provider's login page
   * 4. After successful auth, user is redirected to /auth/callback
   */
  const handleSocialAuth$ = $(async (provider: string) => {
    loadingProvider.value = provider;
    
    try {
      /**
       * Call the OAuth sign-in method from our auth context
       * 
       * Under the hood, this calls:
       * supabase.auth.signInWithOAuth({
       *   provider: provider,
       *   options: {
       *     redirectTo: `${window.location.origin}/auth/callback`
       *   }
       * })
       * 
       * The redirectTo URL is where users will land after authenticating with the provider.
       * That page needs to handle the OAuth callback (we'll create it next).
       */
      await auth.actions.signInWithProvider(provider as 'google' | 'github' | 'microsoft');
      
      /**
       * Note: If this succeeds, the user will be redirected away from this page,
       * so we won't reach the code below. However, if there's an error (e.g., popup blocked),
       * we'll handle it in the catch block.
       */
      
    } catch (err) {
      console.error(`${provider} auth error:`, err);
      
      /**
       * Extract error message and display it
       * Common errors:
       * - "Popup blocked" - Browser blocked the OAuth popup
       * - "Provider not configured" - OAuth provider not set up in Supabase dashboard
       * - "Network error" - User is offline
       */
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Failed to sign in with ${provider}. Please try again.`;
      
      // Call the optional error callback if provided
      if (onError$) {
        await onError$(errorMessage);
      }
      
      loadingProvider.value = null;
    }
  });

  // ============================================================================
  // HELPER TEXT
  // ============================================================================
  
  /**
   * Get the appropriate button text based on mode
   */
  const getButtonText = (provider: string) => {
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
    return mode === 'login' 
      ? `Sign in with ${providerName}` 
      : `Sign up with ${providerName}`;
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div class="space-y-3">
      {/* 
        Google Sign In Button
        
        This is our primary social login option (as specified in requirements).
        The button uses Google's brand colors (white background with blue text).
      */}
      <button
        type="button"
        onClick$={() => handleSocialAuth$('google')}
        disabled={loadingProvider.value !== null}
        class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* 
          Conditional rendering:
          - Show loading spinner if this button is loading
          - Otherwise show Google logo
        */}
        {loadingProvider.value === 'google' ? (
          <svg 
            class="animate-spin h-5 w-5 text-gray-700" 
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
        ) : (
          // Google Logo SVG
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span>{getButtonText('google')}</span>
      </button>

      {/* 
        GitHub Sign In Button (Optional)
        
        Uncomment this section if you want to enable GitHub OAuth.
        Make sure to configure GitHub as a provider in your Supabase dashboard first.
      */}
      {/* <button
        type="button"
        onClick$={() => handleSocialAuth$('github')}
        disabled={loadingProvider.value !== null}
        class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loadingProvider.value === 'github' ? (
          <svg 
            class="animate-spin h-5 w-5 text-white" 
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
        ) : (
          // GitHub Logo SVG
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <span>{getButtonText('github')}</span>
      </button> */}

      {/* 
        Microsoft Sign In Button (Optional)
        
        Uncomment this section if you want to enable Microsoft/Azure AD OAuth.
        Configure Microsoft as a provider in Supabase dashboard first.
      */}
      {/* <button
        type="button"
        onClick$={() => handleSocialAuth$('microsoft')}
        disabled={loadingProvider.value !== null}
        class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loadingProvider.value === 'microsoft' ? (
          <svg 
            class="animate-spin h-5 w-5 text-gray-700" 
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
        ) : (
          // Microsoft Logo SVG
          <svg class="w-5 h-5 mr-2" viewBox="0 0 21 21">
            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
          </svg>
        )}
        <span>{getButtonText('microsoft')}</span>
      </button> */}

      {/* 
        Privacy Notice
        
        It's good UX to remind users what data will be accessed
      */}
      <p class="text-xs text-center text-gray-500 mt-4">
        By continuing, you agree to our Terms of Service and Privacy Policy.
        {mode === 'register' && ' Your account will be created automatically.'}
      </p>
    </div>
  );
});
