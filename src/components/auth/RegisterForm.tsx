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
import { useNavigate } from '@builder.io/qwik-city';
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
       * - If email confirmation is required, show a message and redirect to login
       * - If auto-confirmed, redirect to home or onboarding page
       * 
       * For now, we'll redirect to a success page with instructions
       */
      await nav('/auth/verify-email');
      
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
      
      if (err instanceof Error) {
        error.value = err.message;
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
        <div class="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200" role="alert">
          <strong class="font-semibold">Registration failed:</strong> {error.value}
        </div>
      )}

      {/* Validation Errors List */}
      {validationErrors.value.length > 0 && (
        <div class="mb-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 border border-yellow-200" role="alert">
          <strong class="font-semibold">Please fix the following:</strong>
          <ul class="list-disc list-inside mt-2 space-y-1">
            {validationErrors.value.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
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
