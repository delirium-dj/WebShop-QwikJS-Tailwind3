/**
 * RegisterForm Component
 * 
 * This component renders a registration form that allows new users to create an account using:
 * 1. Email, password, and full name (traditional registration)
 * 2. Social registration providers (Google, etc.) via the SocialLoginButtons component
 * 
 * For Junior Developers:
 * - Registration creates a new user account in Supabase Auth
 * - After successful registration, Supabase typically sends a confirmation email
 * - We can configure Supabase to auto-confirm emails for development
 * - Password validation happens on both client (for UX) and server (for security)
 * 
 * @example
 * <RegisterForm />
 */

import { component$, useSignal, $ } from '@builder.io/qwik';
import { useNavigate, useLocation } from '@builder.io/qwik-city';
import { useAuth } from '~/contexts/auth';
import { SocialLoginButtons } from './SocialLoginButtons';

export const RegisterForm = component$(() => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /**
   * Form field signals
   * For registration, we collect more information than login:
   * - fullName: User's display name (stored in our database, not in Supabase Auth)
   * - email: Used for login and verification
   * - password: Must meet strength requirements
   * - confirmPassword: Must match password (prevents typos)
   */
  const fullName = useSignal('');
  const email = useSignal('');
  const password = useSignal('');
  const confirmPassword = useSignal('');
  
  /**
   * UI state signals
   */
  const isLoading = useSignal(false);
  const error = useSignal('');
  const validationErrors = useSignal<string[]>([]);

  // ============================================================================
  // HOOKS
  // ============================================================================
  
  const auth = useAuth();
  const nav = useNavigate();

  /**
   * Get current location to extract redirect URL from query parameters
   * Example: /auth/register?redirect=/account
   */
  const location = useLocation();

  // ============================================================================
  // VALIDATION HELPERS
  // ============================================================================
  
  /**
   * Validate password strength
   * 
   * Requirements:
   * - At least 8 characters
   * - Contains uppercase letter
   * - Contains lowercase letter
   * - Contains number
   * - Contains special character
   * 
   * Returns an array of error messages (empty if valid)
   */
  const validatePassword = $((pwd: string): string[] => {
    const errors: string[] = [];
    
    if (pwd.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(pwd)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(pwd)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(pwd)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      errors.push('Password must contain at least one special character');
    }
    
    return errors;
  });

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle form submission
   * 
   * This function:
   * 1. Validates all form fields
   * 2. Checks password strength and confirmation match
   * 3. Calls Supabase's signUp method
   * 4. Optionally creates a user profile in our database
   * 5. Redirects on success or shows errors
   */
  const handleSubmit$ = $(async (event: Event) => {
    event.preventDefault();
    
    // Clear previous errors
    error.value = '';
    validationErrors.value = [];
    
    // ============================================================================
    // CLIENT-SIDE VALIDATION
    // ============================================================================
    
    /**
     * Validate full name
     * Must be at least 2 characters
     */
    if (fullName.value.trim().length < 2) {
      validationErrors.value = [...validationErrors.value, 'Full name must be at least 2 characters'];
    }
    
    /**
     * Validate password strength
     */
    const pwdErrors = await validatePassword(password.value);
    if (pwdErrors.length > 0) {
      validationErrors.value = [...validationErrors.value, ...pwdErrors];
    }
    
    /**
     * Validate password confirmation
     */
    if (password.value !== confirmPassword.value) {
      validationErrors.value = [...validationErrors.value, 'Passwords do not match'];
    }
    
    /**
     * If there are validation errors, stop here and display them
     */
    if (validationErrors.value.length > 0) {
      return;
    }
    
    // ============================================================================
    // REGISTRATION PROCESS
    // ============================================================================
    
    isLoading.value = true;

    try {
      /**
       * Call the register function from our auth context
       * This will:
       * 1. Create a new user in Supabase Auth
       * 2. Send a confirmation email (if email confirmation is enabled)
       * 3. Optionally create a profile record in our database
       */
      await auth.actions.register(email.value, password.value, fullName.value);
      
      /**
       * On successful registration:
       * - If email confirmation is required, show a message and redirect to email verification
       * - If auto-confirmed, redirect to home or back to the requested page
       * 
       * For now, we'll redirect to a success page with instructions.
       * The redirect parameter is preserved in the URL so after email confirmation,
       * the user can be directed to the page they originally wanted to access.
       */
      const redirectUrl = location.url.searchParams.get('redirect');
      const verifyEmailUrl = redirectUrl ? `/auth/verify-email?redirect=${encodeURIComponent(redirectUrl)}` : '/auth/verify-email';
      
      await nav(verifyEmailUrl);
      
    } catch (err) {
      /**
       * Handle registration errors
       * 
       * Common errors:
       * - "User already registered" - Email is already in use
       * - "Invalid email" - Email format is wrong
       * - "Password too weak" - Server-side validation failed
       */
      console.error('Registration error:', err);
      
      // Type-safe error message extraction with user-friendly formatting
      if (err instanceof Error) {
        const errorMsg = err.message.toLowerCase();
        
        // Provide user-friendly error messages based on common Supabase errors
        if (errorMsg.includes('already registered') || errorMsg.includes('duplicate') || errorMsg.includes('exist')) {
          error.value = 'This email is already registered. Please sign in or use a different email.';
        } else if (errorMsg.includes('invalid') && errorMsg.includes('email')) {
          error.value = 'Please enter a valid email address.';
        } else if (errorMsg.includes('password') && errorMsg.includes('weak')) {
          error.value = 'Password does not meet security requirements. Please use a stronger password.';
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          error.value = 'Network error. Please check your connection and try again.';
        } else {
          error.value = err.message;
        }
      } else {
        error.value = 'Registration failed. Please try again.';
      }
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
        <div class="mb-4 rounded-lg bg-red-50 p-4 border border-red-200" role="alert">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <div class="flex-1">
              <p class="font-semibold text-red-800">{error.value}</p>
              {error.value.includes('already registered') && (
                <p class="mt-1 text-xs text-red-700">
                  <a href="/auth/login" class="font-semibold underline hover:no-underline">
                    Sign in with this email
                  </a>{' '}
                  or{' '}
                  <a href="/auth/forgot-password" class="font-semibold underline hover:no-underline">
                    reset your password
                  </a>
                </p>
              )}
              {error.value.includes('Network error') && (
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
        <div class="mb-4 rounded-lg bg-yellow-50 p-4 border border-yellow-200" role="alert">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div class="flex-1">
              <p class="font-semibold text-yellow-800 mb-2">Please fix the following:</p>
              <ul class="list-disc list-inside space-y-1">
                {validationErrors.value.map((err, index) => (
                  <li key={index} class="text-xs text-yellow-700">{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit$={handleSubmit$} class="space-y-6">
        
        {/* Full Name Input */}
        <div>
          <label 
            for="fullName" 
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            required
            autoComplete="name"
            bind:value={fullName}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            bind:value={email}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            bind:value={password}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="••••••••"
            disabled={isLoading.value}
          />
          <p class="mt-1 text-xs text-gray-500">
            Must be at least 8 characters with uppercase, lowercase, number, and special character
          </p>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label 
            for="confirmPassword" 
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            bind:value={confirmPassword}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
            class="h-4 w-4 mt-1 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            disabled={isLoading.value}
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <a href="/terms" class="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="/privacy" class="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading.value}
          class="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading.value ? (
            <>
              <svg 
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
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
            'Create Account'
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
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div class="mt-6">
        <SocialLoginButtons mode="register" />
      </div>

      {/* Sign In Link */}
      <p class="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
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
